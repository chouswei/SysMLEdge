#!/usr/bin/env bash
# SysMLEdge rev bind smoke (FAKE on CI/cloud; LIVE TCP on Pi when reachable).
# Path-B mn_0d4f6178 CON 124+nested is published M1 narrow — not this bind.
# Path A CON=29 ≠ bind. #21 FAKE ego ≠ LIVE bind. proof_pass_claimed=false.
# LIVE: SCHEMA --map-file (0.19.9 rejects leftover --map TAG wire).
# Map MUST keep qname on PRT/POR/CON; do not paste narrow id name kind role status.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FOAM_DIR="${FOAM_DIR:-/tmp/foam-soi}"
PROJECT="${SYSMLEDGE_PROJECT:-/tmp/foam-desk}"
LIVE="${BIND_SMOKE_LIVE:-0}"
cd "$ROOT"

if [[ "$LIVE" == "1" ]]; then
  export MEMNET_BACKEND=tcp
  export MEMNET_MCP_TRANSPORT="${MEMNET_MCP_TRANSPORT:-tcp}"
  export MEMNET_SERVE_HOST="${MEMNET_SERVE_HOST:-127.0.0.1}"
  export MEMNET_SERVE_PORT="${MEMNET_SERVE_PORT:-18765}"
  export MEMNET_MCP_PORT="${MEMNET_MCP_PORT:-18766}"
  export MEMNET_LLM_VERSION="${MEMNET_LLM_VERSION:-0.19.9}"
  export MEMNET_MAP_FILE="${MEMNET_MAP_FILE:-$ROOT/fixtures/memnet-session.map}"
  npx tsx src/cli.ts memnet-check
else
  export MEMNET_BACKEND=fake
fi

if [[ -d "$FOAM_DIR/sysml-models" ]]; then
  SOURCE="$FOAM_DIR"
  echo "desk=Foam FOAM_DIR=$FOAM_DIR" >&2
else
  echo "FOAM_DIR=$FOAM_DIR missing; documented desk=fixtures/p1-tiny" >&2
  SOURCE="$ROOT/fixtures/p1-tiny"
fi

echo "memnet_mode=$MEMNET_BACKEND proof_pass_claimed=false path_a_con29_not_bind path_b_mn_0d4f6178_narrow_not_bind cited_session=mn_b05a9869_not_bind map-file=${MEMNET_MAP_FILE:-n/a}" >&2
npx tsx src/cli.ts import "$SOURCE" --project "$PROJECT"
npx tsx src/cli.ts status --project "$PROJECT"
npx tsx src/cli.ts smoke-bind --project "$PROJECT" --mcp
echo "proof_pass_claimed=false scaffold_not_p1=true memnet_backend=$MEMNET_BACKEND"
