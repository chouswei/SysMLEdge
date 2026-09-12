# LIVE M1 checklist — fail-fast **then** Path A (Memnetor 2026-09-12)

`proof_pass_claimed: false`. No H2H. No P1 claim.

Parser gold: `fixtures/foam-gold/gold.json` @ `76459224e6afbe74612cca9b37ffe0b3503bda85`.

## BEFORE (fail-fast)

Session `mn_b05a9869`. CON **0** session-wide. `backgroundSetIndicator` **ABSENT**. `pin_map` TSK ego = TSK only. `read_list` PRT 1390 POR 385. orphans **2008**.

## AFTER Path A (owns + CON mutate)

| Meter | Result |
|-------|--------|
| TSK ego CON | **29** |
| PRT | **≈21** |
| POR | **≥3** |
| Truncation | **false** |
| `backgroundSetIndicator` | in TSK ego via panel **owns** (`contains` / `HAS_PART`) |
| Path-B CON map | **still required** (ops mutate ≠ durable ingest) |
| near_cap | **~4294/5000** |

Parser gold remains 200 CON. TSK ego 29 ≠ session-wide parity.
