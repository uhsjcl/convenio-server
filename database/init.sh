#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "No environment (dev|prod) supplied"
  exit 1
fi

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --file functions.sql
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --file infile.$1.sql

if [ $1 = "dev" ]; then
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --file dummy_data.sql
fi
