#!/usr/bin/env bash

python manage.py collectstatic --noinput
python manage.py migrate --noinput
python -m gunicorn --bind 0.0.0.0:8007 --workers 3 expensetracker.wsgi:application