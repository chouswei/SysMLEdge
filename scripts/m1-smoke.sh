#!/usr/bin/env bash
# One command: import Foam (or fixture) → rev_status bound + stale=false → mutate → propose refused.
# FAKE MemNet only. LIVE MemNet M1 is blocked until Memnetor restores Foam mission + version pin.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FOAM_DIR="${FOAM_DIR:-/tmp/foam-soi}"
PROJECT="${SYSMLEDGE_PROJECT:-/tmp/foam-desk}"
# Force fake: do not follow MEMNET_BACKEND=tcp until live mission + memnet-llm pin exist.
export MEMNET_BACKEND=fake
cd "$ROOT"

if [[ -d "$FOAM_DIR/sysml-models" ]]; then
  SOURCE="$FOAM_DIR"
else
  echo "FOAM_DIR=$FOAM_DIR missing; using fixtures/p1-tiny for bind smoke" >&2
  SOURCE="$ROOT/fixtures/p1-tiny"
fi

echo "LIVE=blocked FAKE=ok proof_pass_claimed=false memnet_backend=fake" >&2
npx tsx src/cli.ts import "$SOURCE" --project "$PROJECT"
npx tsx src/cli.ts status --project "$PROJECT"
npx tsx src/cli.ts smoke-bind --project "$PROJECT"
echo "LIVE=blocked FAKE=ok proof_pass_claimed=false memnet_backend=fake"
