import json

from datetime import date
from django.db.models.functions import Lower
from openai import OpenAI
from rapidfuzz import process, fuzz

from .models import ExpenseCategory, Store
from settings.models import Settings
from sources.models import PaymentSource
from users.models import User

def parse_expense_with_llm(text: str, user: User):
    cats = ExpenseCategory.objects.values_list('name', flat=True).order_by('name')
    cats_str = ', '.join(cats)

    curr_str = Settings.objects\
                    .filter(user=user, key='currency_enabled')\
                    .values_list('value', flat=True)\
                    .first()
    if not curr_str:
        curr_str = 'IDR'

    sources = PaymentSource.objects\
                    .filter(user=user)\
                    .values_list('name', flat=True)\
                    .order_by('name')
    sources_str = ', '.join(sources)

    today = date.today().isoformat()

    prompt = f'''
    Parse this text that describe an expense:
    ---
    {text}
    ---
    Return only a valid JSON object. Do not wrap it in markdown code blocks. 
    Do not include any explanation.
    The JSON keys:
    date (format YYYY-MM-DD), amount (number), currency (3 letter string), 
    description (string), category (string), merchant (string), source (i.e. payment source, string).
    Pick the categories from {cats_str} and the currency from {curr_str}.
    If the text mentions a date or description of a date, parse it and use it for the "date" field 
    and remove this part and any connector word from the field "description".

    Today's date is {today}.

    DATE PARSING:
    Look for any date or date-like phrase in the text (e.g. "kemarin", "tanggal 20",
    "20 Jan", "2 Februari"). If found:
    1. Use it to fill the "date" field.
    2. Remove that date phrase from the "description" field, so the description
    contains only what was bought — not when.

    Resolving the date (expenses are always in the past. Never resolve to a future date):
    - No date mentioned at all -> use today's date.
    - Day, month, and year all given -> use them as-is.
    - Only day and month given -> use the year that makes it the most recent past
    occurrence:
        - On or before today's month/day this year -> current year.
        - Later in the year than today -> previous year.
    - Only day given -> use the month/year that makes it the most recent past
    occurrence:
        - Day <= today's day -> current month and year.
        - Day > today's day -> previous month (roll year back if that month is December).

    Examples (assuming today is 5 January 2026):
    - "beli kopi" (no date) -> 5 January 2026
    - "beli kopi tanggal 2" -> 2 January 2026 (day already passed this month)
    - "beli kopi tanggal 20" -> 20 December 2025 (day hasn't come yet -> last month, previous year)
    - "beli kopi 15 Feb" -> 15 February 2026 (day + month given, use current year)

    If a resolved date would be invalid (e.g. "tanggal 31" in a month with only
    30 days), leave the "date" field empty rather than guessing or adjusting it.

    (PAYMENT) SOURCE PARSING:
    The payment source is an account or method the USER pays FROM.
    E.g. a bank account, digital wallet, or credit card belonging to the user.
    It answers "what did the money come out of?"
    
    Look for phrases indicating the user's own payment method, e.g.
    "bayar pake BCA", "pake Gopay", "transfer dari rekening BRI".

    Do NOT treat the following as a payment source;
    - A person's name that money was sent TO (e.g. "transfer Nisa",
      "transfer ke Ibu", "bayar Adit"). This is a recipient, not a source.
      The word "transfer" alone does not indicate a source,
      only "transfer dari [account]" does.
    - A merchant or store name

    The user's payment sources are: {sources_str}.
    If the text explicitly mentions one of these, or a clear reference to it,
    return the exact matching name.
    If the payment source mentioned is not in this list, or none is mentioned, 
    return null.

    STORE/MERCHANT PARSING:
    Prefer the actual place of purchase (restaurant, shop, online platform) as
    the store. If the text mentions transferring money to a person who is not a
    business (e.g. "transfer Tiara"), that person is NOT the store. Keep them in
    the description if relevant, and use the point-of-purchase (e.g. "Sushi Tei")
    as the store instead.

    EXAMPLES

    For the following, assume today is 1 July 2026.
    Input: "Transfer Tiara 200rb dari BCA makan di Sushi Tei tgl 9 bulan lalu"
    Output:
        "date": "2026-06-09",
        "amount": 200000.00,
        "currency": "IDR",
        "description": "makan di Sushi Tei (transfer Tiara)",
        "category": "Eat Out",
        "store": "Sushi Tei",
        "source": "BCA"

    For the following, assume today is Jan 5 2026.
    Input: "beli kopi di Tuku tanggal 20 bayar pake Gopay"
    Output:
        "date": "2025-12-20",
        "amount": null,
        "currency": "IDR",
        "description": "beli kopi",
        "category": "Eat Out",
        "store": "Tuku",
        "source": "GoPay"
    '''
    client = OpenAI()

    response = client.responses.create(
        model="gpt-5.4-mini",
        input=[{
            "role": "user",
            "content": prompt
        }]
    )

    output = response.output_text
    parsed = json.loads(output)

    merchant_name = parsed['merchant']
    store_name = find_merchant(merchant_name) if merchant_name else None

    if store_name:
        parsed['store'] = store_name
    else:
        parsed['store'] = None
    del parsed['merchant']

    print(parsed)

    return parsed


def find_merchant(merchant_name):
    norm_merchant = merchant_name.strip().lower()

    exact = Store.objects.annotate(lname=Lower('name')).filter(lname=norm_merchant).first()
    if exact:
        return exact.name

    # fuzzy-search the merchant against the list of stores before returning
    store_names = list(Store.objects.values_list('name', flat=True))
    _, score, idx = process.extractOne(
        merchant_name,
        store_names,
        scorer=fuzz.WRatio
    )
    if score >= 85:
        matched_store = store_names[idx]
    else:
        matched_store = None

    return matched_store
