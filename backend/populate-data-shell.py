"""
Add & remove expense categories
"""
EXPENSE_CATEGORIES = [
    'Bills',
    'Charity & Gift',
    'Cash Withdrawal',
    'Eat Out',
    'Groceries',
    'Entertainment',
    'Education',
    'Electronics',
    'Health',
    'Household Stuffs',
    'Personal Care',
    'Shopping',
    'Top Up e-Wallet and Cards',
    'Transportation',
    'Traveling',
    'Transfer',
]

from expenses.models import ExpenseCategory

# inserting
for cat in EXPENSE_CATEGORIES:
    obj = ExpenseCategory(name=cat)
    obj.save()

# undoing
for cat in EXPENSE_CATEGORIES:
    obj = ExpenseCategory.objects.filter(name=cat)
    obj.delete()


#############################################

"""
Add payment source of type "Cash" for each user
"""

from users.models import User
from sources.models import PaymentSource

all_users = User.objects.all()
for u in all_users:
    qs = PaymentSource.objects.filter(user=u).filter(source_type='CA')
    if not qs.exists():
        s = PaymentSource(source_type='CA', user=u, name='Cash')
        s.save()