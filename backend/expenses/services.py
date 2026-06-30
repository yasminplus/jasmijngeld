from openai import OpenAI

from .models import ExpenseCategory
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
    date (format yyyy-MM-dd), amount (float with 2 decimal points), currency (3 letter string), 
    description (string), category (string), merchant (string).
    Pick the categories from {cats_str} and the currency from {curr_str}.
    If the text mentions a date or description of a date, parse it and use it for the "date" field
    and remove this part from the field "description".
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
    return output

    # TODO fuzzy-search the merchant against the list of stores before returning