#!/usr/bin/env bash
# Clone Foam SoI (SysML tree only) and bind with SysMLEdge P1 runtime.
# Does not claim M1–M5 pass. Does not touch Foam VI product trees beyond sysml-models/.
set -euo pipefail
FOAM_URL="${FOAM_REPO_URL:-https://github.com/chouswei/modelbasedPrj-itri-vedan-foam-detection.git}"
FOAM_DIR="${FOAM_DIR:-/tmp/foam-soi}"
PROJECT="${SYSMLEDGE_PROJECT:-/tmp/foam-desk}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -d "$FOAM_DIR/sysml-models" ]]; then
  git clone --recurse-submodules "$FOAM_URL" "$FOAM_DIR" || {
    echo "git clone failed (private repo / token). Place Foam sysml-models/ at $FOAM_DIR or use scripts/m1-smoke.sh with FOAM_DIR." >&2
    exit 1
  }
fi
if [[ -d "$FOAM_DIR/.git" ]]; then
  git -C "$FOAM_DIR" submodule update --init --recursive || true
  echo "FOAM_SOURCE_SHA=$(git -C "$FOAM_DIR" rev-parse HEAD)"
else
  echo "FOAM_SOURCE_SHA=${FOAM_SOURCE_SHA:-UNKNOWN} (tree present, not a git clone)"
fi

export MEMNET_BACKEND="${MEMNET_BACKEND:-fake}"
cd "$ROOT"
npx tsx src/cli.ts import-foam "$FOAM_DIR" --project "$PROJECT"
npx tsx src/cli.ts status --project "$PROJECT"
npx tsx src/cli.ts smoke-bind --project "$PROJECT"
echo "proof_pass_claimed=false memnet_backend=$MEMNET_BACKEND"
