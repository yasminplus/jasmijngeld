from .models import ExpenseCategory
from settings.models import Settings

def parse_expense_with_llm(text: str):
    cats = ExpenseCategory.objects.values_list('name', flat=True).order_by('name')
    cats_str = ', '.join(cats)
    print(cats_str)

    currencies = Settings.objects\
                    .filter(user=self.request.user, key='currency_enabled')\
                    .values_list('value', flat=True)\
                    .first()
    curr_str = ''
    if not currencies:
        # create settings, use IDR only
        curr_str = 'IDR'
    curr_str = currencies[0]
    print(curr_str)
    
    prompt = f'''Parse this description of expense and return a JSON with the following keys:
    date (format yyyy-MM-dd), amount (float with 2 decimal points), currency (3 letter string), 
    description (string), category (string), merchant (string).
    Pick the categories from {cats_str} and the currency from {curr_str}
    '''

    # TODO send request, process data, return dict