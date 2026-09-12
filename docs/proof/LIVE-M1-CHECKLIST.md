# LIVE M1 checklist (Memnetor on Pi)

SysMLEdge cloud VM **cannot** reach `10.0.0.10` (`:18765` / `:18766` / `:22` timeout 2026-09-12). **Do not invent LIVE counts.** Record operator output below.

Memnetor already reported (**env unlocked**, not an M1 pass): `memnet-llm==0.19.8` + TCP; session `mn_b05a9869`; **2922** rows; `pin_map` cue `TSK_model_vfdl2` **non-empty**.

Parser gold to compare against (this PR): `fixtures/foam-gold/gold.json` @ Foam SHA `76459224e6afbe74612cca9b37ffe0b3503bda85`. Nested `backgroundSetIndicator` is **AUTO** in the parser. Live CREATE vs AUTO is **this checklist**, not claimed here.

`proof_pass_claimed` stays **false** until every box has operator-measured numbers (not copied from parser gold).

## Env (Pi)

```bash
export MEMNET_MCP_TRANSPORT=tcp
export MEMNET_SERVE_HOST=10.0.0.10   # or 127.0.0.1 on the Pi
export MEMNET_SERVE_PORT=18765
export MEMNET_MCP_PORT=18766
export MEMNET_LLM_VERSION=0.19.8
# session already loaded:
# mn_b05a9869
```

Record: `memnet --version` (must show `0.19.8`). Fail if UNKNOWN.

## pin_map (MemNet MCP or TCP-shared CLI)

Use session **`mn_b05a9869`**. Empty cue = outline of S (do not dump full 2922 into chat).

| # | Tool | Exact cue | Record |
|---|------|-----------|--------|
| P0 | `pin_map` | `session=mn_b05a9869` **empty cue** (outline) | kinds + LIMIT exemplars; **non-empty**; do not paste full S |
| P1 | `pin_map` | `session=mn_b05a9869` `cue=TSK_model_vfdl2` `depth=2` `max_rows=50` | non-empty; note Truncation if present |
| P2 | `pin_map` | `session=mn_b05a9869` `locators=["qname=FoamDetectionLiteVer2::CoreVideoMonitorToolbar::backgroundSetIndicator"]` `depth=2` `max_rows=50` | nested row present **without** extra hand CREATE? yes/no |
| P3 | `pin_map` | `session=mn_b05a9869` `locators=["qname=FoamDetectionLiteVer2::CoreMonitorConfigPanel::backgroundSetIndicator"]` `depth=2` `max_rows=50` | distinct owner from P2? yes/no |
| P4 | `pin_map` | `session=mn_b05a9869` `keyword=linkFoamDetectionToVideoDisplay` `max_rows=50` | connection usage present? |
| P5 | `pin_map` | `session=mn_b05a9869` `keyword=backgroundSetIndicator` `max_rows=50` | both nested qnames? |

If the MCP uses `cue` instead of `locators`, equivalent:

- `cue=FoamDetectionLiteVer2::CoreVideoMonitorToolbar::backgroundSetIndicator`
- `cue=FoamDetectionLiteVer2::CoreMonitorConfigPanel::backgroundSetIndicator`

## SysMLEdge `gql_*` (desk on the Pi, after `import` Foam + bind)

These fields are **absent on the MemNet wire**. Run on SysMLEdge MCP (`:18776/mcp`) with `MEMNET_BACKEND=tcp` **only if** that desk talks to this serve.

| # | Tool | Args | Record |
|---|------|------|--------|
| S0 | `rev_status` | (none) | `rev.sha` 40-hex; `rev.stale=false`; **do not** invent sha |
| S1 | `gql_read` | `qname=FoamDetectionLiteVer2::CoreVideoMonitorToolbar::backgroundSetIndicator` | `rev.stale=false`; node present; `rev.sha` matches S0 |
| S2 | `gql_context` | `qname=FoamDetectionLiteVer2::CoreMonitorConfigPanel::backgroundSetIndicator` | owner neighbourhood; no whole-tree dump |
| S3 | `gql_impact` | `qname=FoamDetectionLiteVer2::FoamLiteVer2EdgePcSoftware::foamDetection` | neighbourhood/usage only unless closure measured |

## Compare (fill numbers only from pin_map / gql output)

| Parser gold (`gold.json`) | LIVE pin_map / gql (Memnetor) |
|---------------------------|-------------------------------|
| files= (see `tree_files`) | LIVE files N/A (graph rows, not files) |
| parts=647 | PRT / part rows = **leave blank until counted** |
| ports=1400 | PORT rows = **leave blank** |
| connections_parsed=186 | CONN rows = **leave blank** |
| nested `backgroundSetIndicator` AUTO (2 qnames) | present without hand CREATE? **leave blank** |

**2922** is Memnetor’s session row total. It is **not** a parser construct count. Do not equate 2922 to parts+ports+connections.

## Bounce (M4) — still not claimed

`session_save` → restart **serve + MCP together** → load `mn_b05a9869` → P0/P1 still non-empty. Record version again.

## Out

H2H (M5), P2 UI, Kuzu, P1 pass claim.
