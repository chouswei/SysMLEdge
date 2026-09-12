# RUNLOG — 2026-09-12 — plumbing H2H (p1-tiny, **not** product pass)

**CEO Core:** p1-tiny H2H = **plumbing only**. `proof_pass_claimed: false` until **Foam** narrow H2H **and** cold, unless the desk is re-locked to tiny. **(f)** clean sid. MUST NOT sell continuous **(g)** until **(`r`)**. No Neo4j.

This log summarises operator meters after Devicor plumbing H2H. Pi artifact path: `/tmp/h2h-mn_be03c1a9/RUNLOG-h2h.json` (not copied into this repository). **MUST NOT invent numbers** beyond the meters stated below.

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
| **(g)** continuous graph-as-SSOT | **not sold** — wait **(`r`)** |
| SysMLEdge CLI `head-to-head` | **null scaffold** (known gap) |
| Neo4j / dual-engine | **unused** |

## Honesty — grep wins on tiny

Local **Arm A (grep)** beats **Arm B (MemNet `pin_map`)** on this **tiny** desk. That is an honesty note. It is **not** a Foam-scale beat-grep claim (P1 competitor remains tens-of-minutes grep on Foam).

| Axis | Stated meter |
|------|-----------|
| Wall-clock | Arm A **~6 ms** vs Arm B **~1992 ms** — **grep wins** |
| Context | grep wins on tiny (same honesty note). **Token counts not stated** → **UNKNOWN** here |
| No silent drop | Arm B **no silent drop ×3** (`pin_map`) |
| Feature count | **not** a win |

MUST NOT treat ~6 ms vs ~1992 ms as M5 / row 9. Tiny trees make grep cheap; Foam wall-clock is a different desk.

## Arms (this plumbing run)

| Arm | Path | Result |
|-----|------|--------|
| **A** | local grep on `fixtures/p1-tiny` | faster (~6 ms) |
| **B** | MemNet `pin_map` on **`mn_be03c1a9`** | slower (~1992 ms); **no silent drop** on three Qs |

Operator meters. SysMLEdge MCP `gql_*` was **not** the timed harness (CLI still null).

## Sessions (do not mix)

| Session | Role |
|---------|------|
| `mn_0d4f6178` | Foam Path-B **narrow M1** CON **124** + nested |
| `mn_27ce8714` | LIVE bind + **(g)** invent meter (same-sid **append**) |
| **`mn_be03c1a9`** | **(f)** clean sid — plumbing H2H only |

## Known gap — CLI `head-to-head`

```bash
npx tsx src/cli.ts head-to-head -o /tmp/h2h.json
```

Still emits `status: NOT_EXECUTED` with **null** `wall_clock_ms` / `context_tokens` and Foam question placeholders. It does **not** time Arm A or Arm B. **Prefer this honesty** over a fake timer harness.

**Invent next (CLI):** a recorder that copies an operator JSON (e.g. the Pi `RUNLOG-h2h.json`) without generating numbers — **not** a scaffold that invents timings.

**Invent next (product):** Foam **narrow** H2H (score 124 + nested ego, not gold-200) **after** Core **(`r`)** unless the desk is explicitly re-locked to tiny. Cold last. MUST NOT sell continuous **(g)** until **(`r`)**.

## Explicit non-claims

- Not Foam / M5 / row 9 pass
- Not beat-grep as a product story
- Not `proof_pass_claimed`
- Not continuous **(g)** / replace-on-reproject (**`r`** still open)
- Not mixing this sid with Foam CON **124** or `mn_27ce8714` housekeep
- Not Neo4j
