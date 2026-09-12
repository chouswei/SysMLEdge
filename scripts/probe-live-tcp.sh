#!/usr/bin/env bash
# Reachability only. Not bind. Not pin_map. proof_pass_claimed=false.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npx tsx src/cli.ts live-probe
