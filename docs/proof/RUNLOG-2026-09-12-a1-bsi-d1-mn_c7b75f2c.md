# RUNLOG — 2026-09-12 — A1 BSI remeter depth=1 (`mn_c7b75f2c`)

**Cite:** CEO Core **A1 claim pin** = **depth=1 ego**. BSI tips **Toolbar + Config only**. Session **`mn_c7b75f2c`** @ cap **5903/10000** after **`MAX_ROWS=10000`** bounce. Desk **`/tmp/foam-desk-gof/sysml-models`**. `must_win_passed: false`. `claim_text: null`. `proof_pass_claimed: false`. **No soft-pass.** Tip **untouched**. InvenTree **untouched**. **No serve invent.**

Artifact: [artifacts/RUNLOG-a1-bsi-d1.json](artifacts/RUNLOG-a1-bsi-d1.json). Product H2H+cold on the same sid ([#36](https://github.com/chouswei/SysMLEdge/pull/36)) is **not** this remeter.

**Must-win (this pin):** depth=1 BSI ego on Toolbar + Config. **System skipped.** Wall logged; blocker is **CueConflict |Q|=118**, not wall.

## Gate

| Field | Value |
|-------|--------|
| Cut | A1 BSI remeter — `--locator qname=SEED --depth 1` |
| Lock | CEO Core A1 claim pin = **depth=1 ego**; BSI tips **Toolbar+Config only** |
| Desk | `/tmp/foam-desk-gof/sysml-models` |
| Session | **`mn_c7b75f2c`** |
| Cap | **5903/10000** after **`MAX_ROWS=10000`** bounce |
| Protocol | explicit `--locator qname=SEED --depth 1`; warm+cold **≥5s**; **System skipped** |
| `must_win_passed` | **false** |
| `claim_text` | **null** |
| `proof_pass_claimed` | **false** |
| InvenTree | **untouched** |
| Tip / Path A / plumbing / refuse-attach | **untouched** (`mn_0d4f6178`, `mn_b05a9869`, `mn_be03c1a9`, `mn_27ce8714`, `mn_f9d25cfe`) |
| Serve invent | **none** |

## Exact Q table + cold

Arm A = one `grep` `backgroundSetIndicator` on the desk (shared). Arm B = explicit `--locator qname=SEED --depth 1`.

| seed | A ms | A bytes | A hits | B warm ms | B warm bytes | B warm hits | cold ms | cold bytes | cold hits | ctx | nodrop |
|------|------:|--------:|-------:|----------:|-------------:|-----------:|--------:|-----------:|----------:|:---:|:------:|
| FoamDetectionLiteVer2::CoreVideoMonitorToolbar::backgroundSetIndicator | 102.134 | 4725 | 29 | 667.475 | 2998 | 51 | 690.446 | 2998 | 51 | **P** | **F** |
| FoamDetectionLiteVer2::CoreMonitorConfigPanel::backgroundSetIndicator | 102.134 | 4725 | 29 | 684.264 | 2998 | 51 | 713.021 | 2998 | 51 | **P** | **F** |

**Arm A (shared grep):** **102.134ms** / **4725** bytes / **29** hits / desk `/tmp/foam-desk-gof/sysml-models`. **System skipped.**

## Per-Q P/F

| Q | context | nodrop | CueConflict |
|---|---------|--------|-------------|
| Toolbar BSI | **P** | **F** | **\|Q\|=118** (warm+cold) |
| Config BSI | **P** | **F** | **\|Q\|=118** (warm+cold) |
| System | **skipped** | — | — |

## Axes (logged)

| Axis | Result | Note |
|------|--------|------|
| **context** | **P** ×2 | Toolbar **2998B** / Config **2998B** vs Arm A **4725B**. |
| **nodrop** | **F** ×2 | CueConflict \|Q\|=**118** on **all** Arm B outs. |
| **must-win** | **false** | A1 pin needs depth=1 BSI ego, not a CON locator dump. |
| **`claim_text`** | **null** | MUST NOT fill. |
| **`proof_pass`** | **false** | MUST NOT set true. Remeter folded ≠ pass. |
| **cold** | **run** | ≥5s idle. Toolbar **690.446ms** / Config **713.021ms**. Same **2998B** / **51** hits as warm. |
| **blocker** | **CueConflict** | Post-10k bounce. Pre-bounce MCP d=1 was **~655/649B clean**. |

## CueConflict |Q|=118

Locators-only CON list (all Arm B outs; Toolbar+Config; warm and cold). Post-10k. Pre-bounce MCP d=1 was ~655/649B clean.

```
## CueConflict |Q|=118
<locators-only CON list>
```

The 118 locators were **not** copied into this repository. Do **not** invent the CON list. CueConflict is the honesty; `nodrop F` on every Arm B out.

## Next

- **No** soft-pass of A1 / `claim_text` / `proof_pass`
- **No** treat post-10k CueConflict dump as depth=1 BSI ego
- **No** serve invent
- Tip sessions **untouched**
- Pre-bounce MCP d=1 **~655/649B clean** is the contrast, not a claimed pass after bounce

## Kill theater (do not sell)

- This remeter as **P1 / M5 / row 9** pass or `proof_pass_claimed`
- Context **P** as an A1 claim (`claim_text` stays **null**)
- CueConflict \|Q\|=118 locators-only CON as depth=1 BSI ego
- Pre-bounce ~655/649B as still true after the 10k bounce
- Tip `mn_0d4f6178` Track A as this table
- Product H2H+cold [#36](https://github.com/chouswei/SysMLEdge/pull/36) (d≠1 BSI / System included) as this A1 pin
- p1-tiny / `mn_be03c1a9` plumbing as the Foam wedge
- InvenTree as touched
- Serve / MCP hop invent
- Neo4j / dual-engine reopen

## Explicit non-claims

- Not `proof_pass` / `proof_pass_claimed`
- Not `must_win_passed`
- Not `claim_text` (null)
- Not tip H2H (`mn_0d4f6178`)
- Not plumbing H2H (`mn_be03c1a9`)
- Not product H2H+cold as this A1 d=1 pin
- Not InvenTree / ClickUp product work
- Not Neo4j / dual-engine / C rewrite
- Not continuous same-session **(g)**
