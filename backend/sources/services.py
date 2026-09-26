from .models import PaymentSource

import logging

logger = logging.getLogger(__name__)


def create_cash_source(user):
    """
    Give a newly verified user their default Cash source.
    """
    try:
        PaymentSource.objects.create(name="Cash", source_type="CA", user=user)
    except Exception as e:
        logger.error(e)
