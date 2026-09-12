# RUNLOG — 2026-09-12 — plumbing H2H (p1-tiny, **not** product pass)

**CEO Core:** p1-tiny H2H = **plumbing only**. `proof_pass_claimed: false` until **Foam** narrow H2H **and** cold, unless the desk is re-locked to tiny. **(f)** clean sid. MUST NOT sell continuous **(g)** until **(`r`)**. No Neo4j.

Pi artifact: `/tmp/h2h-mn_be03c1a9/RUNLOG-h2h.json` (not copied into this repository). **MUST NOT invent numbers** beyond the Memnetor table below.

## Gate

| Gate | Status |
|------|--------|
| Kind | **plumbing** (Devicor / MemNet `pin_map`) |
| Desk | `fixtures/p1-tiny` |
| Session | **`mn_be03c1a9`** — **(f) clean sid** (not `mn_27ce8714` append, not Foam `mn_0d4f6178`, not Path A `mn_b05a9869`) |
| `rev.sha` | `f6768b1108b20c15212f0895f41fb7a27b6a408d` |
| `proof_pass_claimed` | **false** |
| P1 / row 9 / M5 | **not claimed** |
| Cold / non-Core | **not run** |
| Product H2H | still **Foam bind** on **`mn_0d4f6178`** + **cold**. **Track B unlocked.** Tip must-win ([#31](https://github.com/chouswei/SysMLEdge/pull/31)) does **not** set `proof_pass_claimed` |
| **(g)** continuous graph-as-SSOT | **not sold** — wait **(`r`)** |
| SysMLEdge CLI `head-to-head` | **null scaffold** (known gap) |
| Neo4j / dual-engine | **unused** |

## Memnetor exact plumbing H2H (verbatim)

`proof_pass=false`. Plumbing only.

Desk p1-tiny · mn_be03c1a9 @ rev f6768b1108b20c15212f0895f41fb7a27b6a408d

Arm A: grep -RIn · Arm B: live pin_map (CLI head-to-head null scaffold)

| Q | A ms/B | B ms/B | silent_drop B |
|---|--------|--------|---------------|
| nestedDetector | 2/102 | 534/1488 | no |
| SensorHub | 2/271 | 488/3998 | no |
| powerFeed | 2/808 | 970/3071 | no |

A_total 6ms/1181B · B_total 1992ms/8557B · B no silent drop · B does not beat grep wall/context on tiny (expected; beat-grep = Foam-scale).

MemNet post-H2H still 56/5000 clean. Pi artifact /tmp/h2h-mn_be03c1a9/RUNLOG-h2h.json.

Product H2H still Foam narrow on mn_0d4f6178 cite + cold.

Columns `ms/B` = wall-clock milliseconds / context **bytes** (not tokens). MUST NOT treat this table as M5 / row 9.

## Arms (this plumbing run)

| Arm | Path | Result |
|-----|------|--------|
| **A** | `grep -RIn` on `fixtures/p1-tiny` | **wins** wall + context (`A_total` **6ms/1181B**) |
| **B** | live `pin_map` on **`mn_be03c1a9`** | **6ms/1181B vs 1992ms/8557B**; silent_drop **no** ×3 |

SysMLEdge MCP `gql_*` was **not** the timed harness (CLI still null).

## Sessions (do not mix)

| Session | Role |
|---------|------|
| `mn_0d4f6178` | Foam Path-B **narrow M1** CON **124** + nested — **product H2H cite** (not this run) |
| `mn_27ce8714` | LIVE bind + **(g)** invent meter (same-sid **append**; housekeep **not** this 56/5000) |
| **`mn_be03c1a9`** | **(f)** clean sid — plumbing H2H; post-H2H housekeep **56/5000 clean** |

## Known gap — CLI `head-to-head`

```bash
npx tsx src/cli.ts head-to-head -o /tmp/h2h.json
```

Still emits `status: NOT_EXECUTED` with **null** `wall_clock_ms` / `context_tokens` and Foam question placeholders. It does **not** time Arm A or Arm B. Operator meters are the table above. **Prefer this honesty** over a fake timer harness.

**Invent next (CLI):** a recorder that copies an operator JSON (e.g. the Pi `RUNLOG-h2h.json`) without generating numbers — **not** a scaffold that invents timings.

**Invent next (product):** Foam **bind** H2H on **`mn_0d4f6178`** + **cold** (**Track B unlocked**). Product bind H2H still logs wall as **P/F**. MUST NOT sell continuous **(g)** until **(`r`)**.

## Explicit non-claims

- Not Foam / M5 / row 9 pass
- Not beat-grep as a product story (B does **not** beat grep on tiny; expected)
- Not `proof_pass_claimed`
- Not continuous **(g)** / replace-on-reproject (**`r`** still open)
- Not mixing this sid with Foam CON **124** or `mn_27ce8714` append housekeep
- Not Neo4j
