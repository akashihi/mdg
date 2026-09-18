#!/bin/sh
# Reset the development database, then run schemathesis against the local backend.
#
# Any arguments replace the default phase list, e.g.
#   docs/openapi/schemathesis.sh --phases stateful --report har
# Set SKIP_RESET=1 to run against the database as it stands.

set -eu

root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
: "${PG_CONTAINER:=postgres}"
: "${MDG_URL:=http://localhost:8080}"

if [ "${SKIP_RESET:-0}" != "1" ]; then
    docker exec -i "$PG_CONTAINER" psql -U postgres -d mdg -q -v ON_ERROR_STOP=1 -f - \
        < "$root/docs/openapi/reset.sql"
fi

if [ "$#" -eq 0 ]; then
    set -- --phases examples,stateful,coverage
fi

# schemathesis.toml is discovered by walking up from the working directory.
cd "$root"
exec uvx schemathesis run docs/openapi/openapi.yaml --url "$MDG_URL" "$@"
