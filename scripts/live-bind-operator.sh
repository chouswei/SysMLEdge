#!/usr/bin/env bash
# Memnetor / Devicor: LIVE SysMLEdge rev bind on Pi (localhost memnet serve).
# MUST NOT ingest into mn_0d4f6178, mn_b05a9869, or dirty archive mn_27ce8714. Opens a NEW session.
# Lock (f) clean = mn_be03c1a9 @ f6768b1108b20c15212f0895f41fb7a27b6a408d. Refuse same-sid attach. (r) deferred.
# 0.19.9 session open uses SCHEMA --map-file (fixtures/memnet-session.map).
# proof_pass_claimed=false until H2H + cold. H2H scores narrow 124+nested, not gold-200.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ "${MEMNET_ATTACH_SESSION:-}" == "mn_0d4f6178" || "${MEMNET_ATTACH_SESSION:-}" == "mn_b05a9869" || "${MEMNET_ATTACH_SESSION:-}" == "mn_27ce8714" ]]; then
  echo "refuse: do not attach LIVE bind to cited Path-B/Path-A or dirty archive mn_27ce8714. Lock (f) = new sid (mn_be03c1a9 is the clean bind)." >&2
  exit 2
fi

export MEMNET_BACKEND=tcp
export MEMNET_MCP_TRANSPORT="${MEMNET_MCP_TRANSPORT:-tcp}"
export MEMNET_SERVE_HOST="${MEMNET_SERVE_HOST:-127.0.0.1}"
export MEMNET_SERVE_PORT="${MEMNET_SERVE_PORT:-18765}"
export MEMNET_MCP_PORT="${MEMNET_MCP_PORT:-18766}"
export MEMNET_LLM_VERSION="${MEMNET_LLM_VERSION:-0.19.9}"
export MEMNET_MAP_FILE="${MEMNET_MAP_FILE:-$ROOT/fixtures/memnet-session.map}"
export BIND_SMOKE_LIVE=1

echo "operator LIVE bind: host=$MEMNET_SERVE_HOST version=$MEMNET_LLM_VERSION map-file=$MEMNET_MAP_FILE proof_pass_claimed=false lock_g=graph_working_ssot" >&2
echo "cited Path-B mn_0d4f6178 = published M1 narrow (124+nested) — not this bind session" >&2
echo "#21 FAKE ego ≠ LIVE bind. pin_map ≠ project@rev. H2H not this script. leftover --map not sent." >&2

npx tsx src/cli.ts live-probe
npx tsx src/cli.ts memnet-check
BIND_SMOKE_LIVE=1 bash "$ROOT/scripts/bind-smoke.sh"

echo "proof_pass_claimed=false LIVE_bind_smoke_done=true h2h=not_run cold=not_run m1_pass=not_claimed" >&2
