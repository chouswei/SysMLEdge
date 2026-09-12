# RUNLOG 2026-09-12 — product cold (mn_0d395e61)

## Lock
Core/Jon cold pin: ask **bound model@rev** only (no FOAM_DIR grep / open-files arm).
Keep-using must_win = **no ghost + no stuffing** (+ no silent drop); wall/speed = **log-only**.
- `must_win_passed=false` (honesty — System seed stuffing)
- `proof_pass_claimed=false` — **no soft-pass**
- A1 green @ mn_0d395e61 untouched; Tip/InvenTree untouched; 0.19.10 held

## Desk
- memnetSession **`mn_0d395e61`**
- revSha `c69a051e1352e745381eeb8a1ea490655551b151`
- memnet-llm **0.19.9**

## Table

| seed | ghost | stuffing | nodrop | warm ms/B/hits | cold ms/B/hits |
|------|-------|----------|--------|----------------|----------------|
| CoreVideoMonitorToolbar::backgroundSetIndicator | P | P | P | 527.044/5849/25 | 569.909/5849/25 |
| CoreMonitorConfigPanel::backgroundSetIndicator | P | P | P | 501.855/4877/21 | 606.137/4877/21 |
| FoamDetectionLiteVer2::FoamDetectionLiteVer2System | P | **F** (trunc+omit_n=310) | P | 525.792/8397/51 | 615.851/8397/51 |

## Artifact
`docs/proof/artifacts/RUNLOG-product-cold-mn_0d395e61.json`
