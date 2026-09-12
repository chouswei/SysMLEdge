#!/usr/bin/env bash
# Compat alias: FAKE bind smoke. Prefer npm run bind:smoke.
# Path A CON=29 ≠ bind. Path-B mn_0d4f6178 CON 124 = published narrow, not bind.
exec "$(cd "$(dirname "$0")" && pwd)/bind-smoke.sh"
