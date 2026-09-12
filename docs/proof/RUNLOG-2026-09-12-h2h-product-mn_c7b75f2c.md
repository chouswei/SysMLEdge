# RUNLOG — 2026-09-12 — product H2H + cold (`mn_c7b75f2c`)

**Cite:** Product **bind (F)** desk H2H + cold. Session **`mn_c7b75f2c`** @ rev **`f4679d848ccab5b26875eb9d2812171bb759ebf1`**. Engine **memnet-llm 0.19.9 TCP**. Desk **`/tmp/foam-desk-gof/sysml-models`**. `proof_pass_claimed: false`. `must_win_passed: false`. **Tip `mn_0d4f6178` ≠ this meter.**

Artifact: [artifacts/RUNLOG-h2h-mn_c7b75f2c.json](artifacts/RUNLOG-h2h-mn_c7b75f2c.json).

**Must-win:** **context + no silent_drop**. Wall = **P/F log only** on this product run (logged **FAIL 0/3**). Tip Track A ([#31](https://github.com/chouswei/SysMLEdge/pull/31); [RUNLOG-2026-09-12-h2h-foam-tip.md](RUNLOG-2026-09-12-h2h-foam-tip.md)) is **not** this table.

## Gate

| Field | Value |
|-------|--------|
| Product | `product_h2h_foam_bound` |
| Desk | `/tmp/foam-desk-gof/sysml-models` (bind **(F)** desk) |
| Session | **`mn_c7b75f2c`** |
| `rev.sha` | `f4679d848ccab5b26875eb9d2812171bb759ebf1` |
| Engine | memnet-llm **0.19.9** TCP |
| `claim_ready_table_and_cold` | **true** (Q table + cold folded; **not** a product pass) |
| `must_win_passed` | **false** (context **1/3**, no_drop **3/3**, wall **0/3**) |
| `proof_pass_claimed` | **false** |
| InvenTree | **untouched** |
| Tip / Path A / plumbing / refuse-attach | **untouched** (`mn_0d4f6178`, `mn_b05a9869`, `mn_be03c1a9`, `mn_27ce8714`, `mn_f9d25cfe`) |
| Cold protocol | **≥5s idle**; System cold truncated at **max-rows 80** (**12757B**) |

## Exact Q table + cold

| seed | A ms | A bytes | B warm ms | B warm bytes | B silent_drop | cold ms | cold bytes | cold silent_drop |
|------|------|---------|-----------|--------------|---------------|---------|------------|------------------|
| FoamDetectionLiteVer2::CoreVideoMonitorToolbar::backgroundSetIndicator | 103.038 | 4725 | 511.82 | 5849 | False | 605.252 | 5849 | False |
| FoamDetectionLiteVer2::CoreMonitorConfigPanel::backgroundSetIndicator | 103.171 | 4725 | 521.434 | 4877 | False | 611.714 | 4877 | False |
| FoamDetectionLiteVer2::FoamDetectionLiteVer2System | 91.17 | 8826 | 529.815 | 8397 | False | 644.354 | 12757 | False |

**Totals:** A **297.379ms** / **18276B** · B warm **1563.069ms** / **19123B**. `wall_pass` **0** fail **3**. `context_pass` **1** fail **2**. `no_silent_drop_pass` **3** fail **0**.

## Per-Q P/F

| Q | context | no_drop | wall |
|---|---------|---------|------|
| Toolbar BSI | **F** | **P** | **F** |
| Config BSI | **F** | **P** | **F** |
| System | **P** | **P** | **F** |

Hits (exact): Toolbar A **29** / B warm **25** / B cold **25**; Config A **29** / B warm **21** / B cold **21**; System A **53** / B warm **51** trunc **T** / B cold **81** trunc **T**. Toolbar and Config cold trunc **F**.

## Axes (logged)

| Axis | Result | Note |
|------|--------|------|
| **context** (must-win) | **1/3 FAIL** | Toolbar **F**, Config **F**, System **P**. B warm bytes **19123** vs A **18276**. |
| **no_drop** (must-win) | **3/3 PASS** | `silent_drop=false` warm and cold on all three. Honest Truncation on System ≠ empty. |
| **wall-clock** | **FAIL 0/3, P/F log only** | B warm slower on each seed (511.82>103.038, 521.434>103.171, 529.815>91.17). Totals B **1563.069ms** vs A **297.379ms**. |
| **must-win** | **false** | context **1/3** + no_drop **3/3** — both required. |
| **`proof_pass`** | **false** | MUST NOT set true. Table + cold folded ≠ pass. |
| **cold** | **run** | ≥5s idle. System cold **644.354ms** / **12757B** at max-rows **80**. |

## Kill theater (do not sell)

- This fold as **P1 / M5 / row 9** pass or `proof_pass_claimed`
- Context **1/3** or System-only context **P** as a product win
- Wall **FAIL 0/3** as unknown, as a tip meter, or as a Neo4j reopen
- System Truncation (max-rows 80, cold **12757B**) as silent drop
- Tip `mn_0d4f6178` Track A as this product table
- p1-tiny / `mn_be03c1a9` plumbing as the Foam wedge
- Attaching bind to refuse-attach sids (`mn_0d4f6178`, `mn_b05a9869`, `mn_be03c1a9`, `mn_27ce8714`, `mn_f9d25cfe`)
- InvenTree as touched
- Continuous same-session **(g)** (**(r)** deferred; **(g)** provisional)

## Explicit non-claims

- Not `proof_pass` / `proof_pass_claimed`
- Not `must_win_passed`
- Not tip H2H (`mn_0d4f6178`)
- Not plumbing H2H (`mn_be03c1a9`)
- Not Core GO **(F)** STOP / **(S)** STOP as this meter ([RUNLOG-2026-09-12-gof-filter-stop.md](RUNLOG-2026-09-12-gof-filter-stop.md))
- Not InvenTree / ClickUp product work
- Not Neo4j / dual-engine / C rewrite
- Not continuous same-session **(g)**
