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
| Path-B CON map | **0.19.9 shipped** (MemNet #158); **pending Pi roll**. Ops mutate ≠ bind |
| near_cap | **~4294/5000** |

Parser gold remains 200 CON. TSK ego 29 ≠ session-wide parity and **≠ SysMLEdge bind**. Path-B CON = memnet-llm **0.19.9** (#158) pending Pi.

## LIVE 0.19.9 attach (after Pi roll) — measure, do not claim

Follow [LIVE-0199-ATTACH.md](LIVE-0199-ATTACH.md). Fill only from TCP ingest (no TSK mutate):

| Meter | Gold | LIVE ingest (fill) |
|-------|------:|---------------------|
| Engine | ≥0.19.9+TCP | |
| SysMLEdge `rev.sha` | 40 hex | |
| CON session-wide | 200 | |
| `backgroundSetIndicator` in **SysML** ego | AUTO / contains | |
| `pin_map` cue | SysML qname | (fail if TSK_model) |
| `proof_pass_claimed` | false | **false** until meters match |
