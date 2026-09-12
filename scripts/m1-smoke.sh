#!/usr/bin/env bash
# One command: import Foam (or fixture) → rev_status bound + stale=false → mutate → propose refused.
# Default MEMNET_BACKEND=fake. Does NOT claim M1–M5 pass.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FOAM_DIR="${FOAM_DIR:-/tmp/foam-soi}"
PROJECT="${SYSMLEDGE_PROJECT:-/tmp/foam-desk}"
export MEMNET_BACKEND="${MEMNET_BACKEND:-fake}"
cd "$ROOT"

if [[ -d "$FOAM_DIR/sysml-models" ]]; then
  SOURCE="$FOAM_DIR"
else
  echo "FOAM_DIR=$FOAM_DIR missing; using fixtures/p1-tiny for bind smoke" >&2
  SOURCE="$ROOT/fixtures/p1-tiny"
fi

npx tsx src/cli.ts import "$SOURCE" --project "$PROJECT"
npx tsx src/cli.ts status --project "$PROJECT"
npx tsx src/cli.ts smoke-bind --project "$PROJECT"
echo "proof_pass_claimed=false memnet_backend=$MEMNET_BACKEND"
