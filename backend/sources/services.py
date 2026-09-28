from django.db import transaction
from .models import PaymentSource

import logging

logger = logging.getLogger(__name__)


def create_cash_source(user):
    """
    Give a newly verified user their default Cash source.
    """
    try:
        # Savepoint: when called inside another transaction, a database error
        # here only undoes this insert instead of aborting the caller's
        # transaction (which we'd otherwise swallow below).
        with transaction.atomic():
            PaymentSource.objects.create(name="Cash", source_type="CA", user=user)
    except Exception as e:
        logger.error(e)
