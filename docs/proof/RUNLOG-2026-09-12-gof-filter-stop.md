# RUNLOG — 2026-09-12 — Core GO **(F)** STOP (OMG-examples filter dry-run)

**Cite:** Core GO **(F)** Track B Foam bind filter attempt. **STOP.** CueConflict remaining. Bind **not** attempted. New `mn_*` **null**. `proof_pass_claimed: false`. **≠ bind green.** **≠** tip Track A / Cut 1.

Pi exclude list (full 310 paths): `/tmp/trackb-foam-bind/FILTER-EXCLUDE.txt` (not copied into this repository). Compact status: [artifacts/RUNLOG-gof-bind.json](artifacts/RUNLOG-gof-bind.json).

**Escalate:** Core **(S)/(M)**. MUST NOT soft-pass. MUST NOT invent Path-B CueConflict dedupe. Tip sessions **untouched**.

## Gate

| Field | Value |
|-------|--------|
| Cut | Core GO **(F)** — OMG examples/training/validation filter (dry-run counts) |
| Status | **`STOP_CUE_CONFLICT_REMAINING`** |
| `bind_attempted` | **false** |
| New `mn_*` | **null** |
| `proof_pass_claimed` | **false** |
| SysMLEdge bind / H2H / cold | **not run** |
| `SoI_shrunk` | **false** (`models` + `common` + `outputs` **2692→2692**, CON **250→250**) |
| Next | Core **(S)/(M)** |
| Tip `mn_0d4f6178` / **(f)** `mn_be03c1a9` / dirty `mn_27ce8714` | **untouched** |
| Neo4j / dual-engine | **unused** |

## What ran

Dry-run **exclude** of OMG library examples/training/validation (310 paths). Counts taken **before bind**. No ingest session opened for this cut.

## Exclude prefixes (310 paths)

Full list lived on Pi `/tmp/trackb-foam-bind/FILTER-EXCLUDE.txt`. Prefixes + counts:

| Prefix | Count |
|--------|------:|
| `libs/omg/.../sysml/src/examples` | **95** |
| `libs/omg/.../sysml/src/training` | **100** |
| `libs/omg/.../sysml/src/validation` | **57** |
| `libs/omg/.../kerml/src/examples` | **58** |
| **Total** | **310** |

## Counts

| Axis | Pre-filter | Post-filter |
|------|----------:|------------:|
| Nodes | **5118** | **2876** |
| CON | **298** | **261** |
| Dup qnames | **215** | **2** |

**SoI (`models` + `common` + `outputs`):** nodes **2692→2692**, CON **250→250**. Filter cut OMG library noise, **not** the Foam SoI.

## Remaining dups (CueConflict)

1. **PKG `Semiconductors` ×2** — `ads1274-model.sysml` vs `semiconductors.sysml`
2. **PRT `Item::boundingShapes::inter` ×2** — `sysml.library` `Items.sysml`

These two remain after the 310-path exclude. **STOP.** Do not bind. Do not treat 215→2 as CueConflict cleared.

## Next (Core)

- **(S)/(M)** — escalate; operators, not this log
- **Folded (S) Ads1274:** PKG×2 **cleared**; only-inter remains; bind still **held** — [RUNLOG-2026-09-12-gos-ads1274-only-inter.md](RUNLOG-2026-09-12-gos-ads1274-only-inter.md). Next = Core **Items (S)/(M)**. **≠ bind green.**
- **No** soft-pass of CueConflict / bind / `proof_pass`
- **No** Path-B CueConflict dedupe invent (MemNet-side collapse of remaining dups)
- Tip sessions **untouched** (`mn_0d4f6178` tip Track A; Cut 1 wall apparatus)

## Kill theater (do not sell)

- Bind green / Foam SysMLEdge bind executed
- `proof_pass` / `proof_pass_claimed`
- New Foam bind session id from this cut
- 215→2 as CueConflict **cleared**
- `SoI_shrunk` (SoI nodes/CON unchanged)
- Path-B CueConflict dedupe invent as the (F) fix
- Tip Track A / Cut 1 as this STOP
- Tiny / `mn_be03c1a9` plumbing as wedge pass
- Neo4j / dual-engine reopen

## Explicit non-claims

- Not SysMLEdge LIVE bind
- Not Track B bind **done** (unlocked ≠ executed; **(F)** STOP)
- Not `proof_pass` / `proof_pass_claimed`
- Not CueConflict resolved
- Not a new `mn_*`
- Not continuous same-session **(g)** (**(r)** deferred; **(g)** provisional)
- Not tip must-win / tip wall as this result
