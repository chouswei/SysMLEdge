# RUNLOG — 2026-09-12 — Foam **tip** H2H Track A (Devicor higher-precision ms)

**Cite:** Devicor higher-precision wall-clock (prefer over rounded Memnetor integers). **Track A.** `mn_0d4f6178` @ **0.19.9**. **≠ SysMLEdge bind.** `proof_pass=false` / `proof_pass_claimed: false`. **Tip ≠ product.**

**Tip H2H ≠ product. Tip H2H ≠ SysMLEdge bind.** Wedge still needs **SysMLEdge bind + H2H + cold** on Foam (`mn_0d4f6178` CON **124** + nested). Gold-200 stays out. Do **not** reopen Neo4j. **Track B** Foam bind **held**.

Pi artifact: `/tmp/h2h-mn_0d4f6178/RUNLOG-h2h.json`.

## What ran

| Field | Value |
|-------|--------|
| Track | **A** — Foam **tip** vs grep |
| Session | **`mn_0d4f6178`** @ **0.19.9** |
| Arm A | `FOAM_DIR` grep |
| Arm B | `memnet query pin-map --locator qname=… --depth 2` — **not** SysMLEdge MCP `gql_*` after `rev.sha` bind |
| Operator pack | **Devicor** ms (higher precision). Memnetor integers = same run, rounded |
| Track B | Foam **bind** — **held** |

### Housekeep (`mn_0d4f6178`) — Memnetor exact

rows **1673/5000** · edges **923** · relations **41** · orphans **750** · dangling **0**

**≠** `rev.sha`. **≠** lock **(f)** `mn_be03c1a9`. Same Path-B sid as [RUNLOG-2026-09-12-m1-bind.md](RUNLOG-2026-09-12-m1-bind.md).

### Per-seed meters — Devicor higher-precision (prefer)

| seed | A ms | A bytes | B ms | B bytes | B silent_drop | beat_context |
|------|-----:|--------:|-----:|--------:|:-------------:|:------------:|
| Toolbar::BSI | 107.125 | 6117 | 405.351 | 5849 | false | true |
| ConfigPanel::BSI | 106.204 | 6117 | 411.155 | 4877 | false | true |
| FoamDetectionLiteVer2System | 94.416 | 11370 | 470.169 | 8316 | false | true |

**Totals:** A **307.745ms** / **23604B** · B **1286.676ms** / **19042B**

`wall_pass` **0/3** · context **3/3** · no_drop **3/3**. Truncation honest. B slower → **reopen apparatus invent**, not soft-pass.

Rounded Memnetor integers (same run; do **not** score): A 107/106/94 → **308ms**; B 405/411/470 → **1287ms**.

System cue: **Truncation=true** **M=80** omitted=**270** (honest clip ≠ empty).

## Axes (logged)

| Axis | Result | Note |
|------|--------|------|
| **context** | **3/3** | `beat_context=true` on all three seeds. B bytes **19042** vs A **23604**. |
| **no_drop** | **3/3** | `B silent_drop=false` on all three. Truncation honest (M=80 omitted=270 ≠ empty). |
| **wall-clock** (`wall_pass`) | **0/3 FAIL** | B slower on each seed (405.351>107.125, 411.155>106.204, 470.169>94.416). Totals B **1286.676ms** vs A **307.745ms**. |
| **product / bind** | **not scored** | ≠ SysMLEdge bind. |
| **`proof_pass`** | **false** | MUST NOT set true. |
| **cold (row 12)** | **held** | Not run. |
| **Track B** | **held** | Foam bind not invent this cut. |

Wall-clock is a **logged pass/fail axis**. **FAIL 0/3** → **reopen apparatus invent** (not soft-pass). MUST NOT treat this tip loss as a Neo4j / dual-engine reopen. Engine-form reopen stays gated: fidelity green **and** timed H2H loses **after bind**.

## CEO locks (this log)

| Lock | Application |
|------|-------------|
| Wall-clock = logged pass/fail | **FAIL 0/3** with exact ms above. MUST NOT hide the loss or swap tokens for time. |
| Bad wall loss → **reopen apparatus invent** | Not soft-pass. Next apparatus = SysMLEdge **bind** H2H vs grep. MUST NOT reopen Neo4j from tip loss. |
| Tip H2H ≠ product / ≠ SysMLEdge bind | B = `pin_map` `--locator qname=` `--depth 2`. Kill theater: tip-as-bind. |
| Track B Foam bind **held** | No invent bind. **(f)** clean remains `mn_be03c1a9` @ `f6768b1108b20c15212f0895f41fb7a27b6a408d`. Dirty `mn_27ce8714` = honesty archive only. |

## Kill theater (do not sell)

- Tip Path-B H2H as **P1 / M5 / row 9 product pass**
- Context **3/3** as a wall-clock win
- Wall **FAIL 0/3** as unknown, as product pass, or as a Neo4j reopen
- Truncation M=80 omitted=270 as empty / silent drop (honest clip ≠ empty)
- p1-tiny / `mn_be03c1a9` plumbing as the Foam wedge
- Gold **200** as the competitor bar
- Track B bind as done

## Explicit non-claims

- Not `proof_pass` / `proof_pass_claimed`
- Not SysMLEdge LIVE bind on `mn_0d4f6178` (Path-B **≠** `rev.sha`)
- Not Foam bind invent (Track B **held**)
- Not cold non-Core (row 12)
- Not Neo4j / dual-engine / C rewrite
- Not continuous same-session **(g)** (**(r)** deferred; **(g)** provisional)
