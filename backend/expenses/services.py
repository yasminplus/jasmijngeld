import json

from django.db.models.functions import Lower
from openai import OpenAI
from rapidfuzz import process, fuzz

from .models import ExpenseCategory, Store
from settings.models import Settings
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

    prompt = f'''
    Parse this text that describe an expense:
    ---
    {text} 
    ---
    Return only a valid JSON object. Do not wrap it in markdown code blocks. Do not include any explanation.
    The JSON keys:
    date (format YYYY-MM-DD), amount (float with 2 decimal points), currency (3 letter string), 
    description (string), category (string), merchant (string).
    Pick the categories from {cats_str} and the currency from {curr_str}.
    If the text mentions a date or description of a date, parse it and use it for the "date" field and remove this part from the field "description".
    If no date is mentioned, assume it is today's date.
    If only date and month is mentioned, use today's year.
    If only date is mentioned, use today's month and year.
    '''
    print(prompt)

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
    store_name = find_merchant(merchant_name)

    if store_name:
        parsed['store'] = store_name
    else:
        parsed['store'] = None
    del parsed['merchant']

    parsed['source'] = None
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
