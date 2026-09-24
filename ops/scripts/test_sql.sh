#!/usr/bin/env bash
# Apply ops migrations and run SQL invariant tests against Postgres 16.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ADMIN_URL="${ADMIN_DATABASE_URL:-${DATABASE_URL:-dbname=postgres}}"
DB_NAME="${EVV_SQL_TEST_DB:-evv_sql_test}"

psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS \"${DB_NAME}\" WITH (FORCE);"
psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -c "CREATE DATABASE \"${DB_NAME}\";"

# Connect to the new database on the same server as ADMIN_URL.
if [[ "$ADMIN_URL" == *"://"* ]]; then
  TEST_URL="$(python3 - "$ADMIN_URL" "$DB_NAME" <<'PY'
import sys
from urllib.parse import urlparse, urlunparse
url, name = sys.argv[1], sys.argv[2]
parts = urlparse(url)
print(urlunparse(parts._replace(path="/" + name)))
PY
)"
else
  TEST_URL="dbname=${DB_NAME}"
fi

shopt -s nullglob
for f in "$ROOT"/supabase/migrations/*.sql; do
  psql "$TEST_URL" -v ON_ERROR_STOP=1 -f "$f"
done
psql "$TEST_URL" -v ON_ERROR_STOP=1 -f "$ROOT/supabase/tests/00_helpers.sql"

shopt -s nullglob
for f in "$ROOT"/supabase/tests/*.sql; do
  base="$(basename "$f")"
  if [[ "$base" == 00_* ]]; then
    continue
  fi
  echo "== SQL $base"
  psql "$TEST_URL" -v ON_ERROR_STOP=1 -f "$f"
done

echo "SQL tests passed"
