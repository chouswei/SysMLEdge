#!/usr/bin/env bash
# Compat alias: FAKE bind smoke. Prefer npm run bind:smoke.
# Path A CON=29 ≠ bind. Path-B CON 0.19.9 (#158) pending Pi — this script does not wait on it.
exec "$(cd "$(dirname "$0")" && pwd)/bind-smoke.sh"
