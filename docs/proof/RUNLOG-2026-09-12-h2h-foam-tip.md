# RUNLOG — 2026-09-12 — Foam **tip** H2H Track A (Devicor higher-precision ms)

**Cite:** Devicor higher-precision wall-clock (prefer over rounded Memnetor integers). **Track A.** `mn_0d4f6178` @ **0.19.9**. **≠ SysMLEdge bind.** `proof_pass=false` / `proof_pass_claimed: false`. **Tip ≠ product.**

**CEO Core — narrow tip (2026-09-12):** Tip **must-win** = **context + no silent drop** only. Tip **wall-clock** = **log only** (not a tip pass/fail). Product **bind** H2H still logs wall as **P/F**. **Track B** Foam bind **unlocked** after this narrow. **No Neo4j.**

**[#31](https://github.com/chouswei/SysMLEdge/pull/31)** logged must-win **PASS** (context **3/3** · no_drop **3/3**) / wall **FAIL** **0/3** as honesty under the **old** tip-wall axis. **After the narrow, that wall fail does not block the tip claim.**

**Cut 1 settled:** F1/F2/F3 **none** closed the **~4×** gap; **~400ms** floor **constant**. Memnetor exact (F1 warm≈cold ~440ms; F2 +7–21ms; F3 M=200 omit150; A ~95–106ms vs B ~400–470ms): [RUNLOG-2026-09-12-cut1-tip-wall.md](RUNLOG-2026-09-12-cut1-tip-wall.md). **Confirm:** no factor missed; not ShapeWalk / Truncation / cold miss. **Out of scope:** serve/MCP hop, emit serialize, process-restart cold, session size.

**Tip H2H ≠ product. Tip H2H ≠ SysMLEdge bind.** Wedge still needs **SysMLEdge bind + H2H + cold** on Foam (`mn_0d4f6178` CON **124** + nested). Gold-200 stays out. Do **not** reopen Neo4j.

Pi artifact: `/tmp/h2h-mn_0d4f6178/RUNLOG-h2h.json`.

## What ran

| Field | Value |
|-------|--------|
| Track | **A** — Foam **tip** vs grep |
| Session | **`mn_0d4f6178`** @ **0.19.9** |
| Arm A | `FOAM_DIR` grep |
| Arm B | `memnet query pin-map --locator qname=… --depth 2` — **not** SysMLEdge MCP `gql_*` after `rev.sha` bind |
| Operator pack | **Devicor** ms (higher precision). Memnetor integers = same run, rounded |
| Track B | Foam **bind** — **unlocked** after CEO Core narrow tip (not run this log) |

### Housekeep (`mn_0d4f6178`) — Memnetor exact

rows **1673/5000** · edges **923** · relations **41** · orphans **750** · dangling **0**

**≠** `rev.sha`. **≠** lock **(f)** `mn_be03c1a9`. Same Path-B sid as [RUNLOG-2026-09-12-m1-bind.md](RUNLOG-2026-09-12-m1-bind.md).

### Per-seed meters — Devicor higher-precision (prefer)

| seed | A ms | A bytes | B ms | B bytes | B silent_drop | beat_context |
|------|-----:|--------:|-----:|--------:|:-------------:|:------------:|
| Toolbar::BSI | 107.125 | 6117 | 405.351 | 5849 | false | true |
| ConfigPanel::BSI | 106.204 | 6117 | 411.155 | 4877 | false | true |
| FoamDetectionLiteVer2System | 94.416 | 11370 | 470.169 | 8316 | false | true |

**Totals:** A **307.745ms** / **23604B** · B **1286.676ms** / **19042B** (~**4.2×**; B seeds sit on a **~400ms** floor)

`wall_pass` **0/3** (old axis, **log only** after narrow) · context **3/3** · no_drop **3/3**. Truncation honest.

Rounded Memnetor integers (same run; do **not** score): A 107/106/94 → **308ms**; B 405/411/470 → **1287ms**.

System cue: **Truncation=true** **M=80** omitted=**270** (honest clip ≠ empty).

## Axes (logged)

| Axis | Result | Note |
|------|--------|------|
| **context** (tip must-win) | **3/3 PASS** | `beat_context=true` on all three seeds. B bytes **19042** vs A **23604**. |
| **no_drop** (tip must-win) | **3/3 PASS** | `B silent_drop=false` on all three. Truncation honest (M=80 omitted=270 ≠ empty). |
| **wall-clock** | **FAIL 0/3, log only** | Honesty under the **old** tip-wall axis ([#31](https://github.com/chouswei/SysMLEdge/pull/31)). B slower on each seed (405.351>107.125, 411.155>106.204, 470.169>94.416). Totals B **1286.676ms** vs A **307.745ms**. **Does not block the tip claim** after CEO Core narrow tip. Product **bind** H2H still scores wall **P/F**. |
| **tip claim** | **must-win PASS** | context + no silent drop only. |
| **product / bind** | **not scored** | ≠ SysMLEdge bind. |
| **`proof_pass`** | **false** | MUST NOT set true until Foam bind H2H + cold. |
| **cold (row 12)** | **held** | Not run. |
| **Track B** | **unlocked** | Foam bind invent allowed after this narrow; not executed in this log. |

## CEO locks (this log)

| Lock | Application |
|------|-------------|
| Tip must-win = context + no drop | **PASS** 3/3 + 3/3. |
| Tip wall-clock = log only | **FAIL 0/3** logged; MUST NOT hide the ~4× / ~400ms floor; MUST NOT treat it as a tip fail. |
| Product bind H2H wall = P/F | Still the product axis. This log is **not** that run. |
| [#31](https://github.com/chouswei/SysMLEdge/pull/31) wall FAIL | Honesty under the **old** tip-wall axis. After the narrow, it does **not** block the tip claim. |
| Cut 1 settled | F1/F2/F3 **none** closed the ~4× gap; ~400ms floor **constant**. Memnetor exact: [RUNLOG-2026-09-12-cut1-tip-wall.md](RUNLOG-2026-09-12-cut1-tip-wall.md). MUST NOT reopen those cuts as if they were open. |
| Tip H2H ≠ product / ≠ SysMLEdge bind | B = `pin_map` `--locator qname=` `--depth 2`. Kill theater: tip-as-bind. |
| Track B Foam bind **unlocked** | Next invent = SysMLEdge **bind** H2H vs grep. **(f)** clean remains `mn_be03c1a9` @ `f6768b1108b20c15212f0895f41fb7a27b6a408d`. Dirty `mn_27ce8714` = honesty archive only. MUST NOT reopen Neo4j. |

## Kill theater (do not sell)

- Tip Path-B H2H as **P1 / M5 / row 9 product pass**
- Context **3/3** as a wall-clock win
- Wall **FAIL 0/3** as unknown, as product pass, as a tip-claim blocker after the narrow, or as a Neo4j reopen
- Truncation M=80 omitted=270 as empty / silent drop (honest clip ≠ empty)
- p1-tiny / `mn_be03c1a9` plumbing as the Foam wedge
- Gold **200** as the competitor bar
- Track B bind as **done** (unlocked ≠ executed)
- Cut 1 F1/F2/F3 as still open

## Explicit non-claims

- Not `proof_pass` / `proof_pass_claimed`
- Not SysMLEdge LIVE bind on `mn_0d4f6178` (Path-B **≠** `rev.sha`)
- Not Foam bind **executed** (Track B **unlocked**, not run)
- Not cold non-Core (row 12)
- Not Neo4j / dual-engine / C rewrite
- Not continuous same-session **(g)** (**(r)** deferred; **(g)** provisional)
- Not Cut 1 apparatus still in play
