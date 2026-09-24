# eevolvv ops. Run from this directory: make test
ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

.PHONY: test sql py ts demo e2e

test: sql py ts

sql:
	bash $(ROOT)/scripts/test_sql.sh

py:
	cd $(ROOT)/workers && uv sync --all-groups && uv run ruff check src tests && uv run mypy --strict src && uv run pytest

ts:
	cd $(ROOT)/apps/app && pnpm install --frozen-lockfile && pnpm exec eslint . && pnpm exec tsc --noEmit && pnpm exec vitest run

demo:
	cd $(ROOT)/workers && uv run python -m evv_workers.demo

e2e:
	cd $(ROOT)/workers && uv run python -m evv_workers.e2e
