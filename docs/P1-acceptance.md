# P1 acceptance — Foam vertical slice

Pilot SoI: `chouswei/modelbasedPrj-itri-vedan-foam-detection` (`sysml-models/`).
Engine: **MemNet**. No Kuzu. No SaaS accounts (P1 = local project).

Normative contracts: [P0-contracts.md](P0-contracts.md). Product locks: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (**NARROW**, Elon/Horcrux 2026-09-11; **Sysmler Core KEEP / NARROW**, 2026-09-12). Living plan: [PRODUCT-PLAN.md](PRODUCT-PLAN.md). Business: [BUSINESS-PLAN.md](BUSINESS-PLAN.md).

This document is the P1 pass/fail sheet. It does not implement runtime. **[#11](https://github.com/chouswei/SysMLEdge/pull/11) / [#12](https://github.com/chouswei/SysMLEdge/pull/12) ≠ P1 pass** (scaffold / fake CI).

Buyer roots **1, 2, 3, and 6** (trust, SSOT owner, beat-grep ask, ship rev) MUST pass via the **eight contract** rows below. Mapping: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md). Do not add extra **buyer-root** rows. Foam proof **9–12** is the NARROW wedge bar, not a ninth buyer-root row. Roots 4, 5, and 7 are locks, not extra P1 tests.

## Must pass

| # | Name | Pass criteria |
|---|------|----------------|
| 1 | Import | Import Foam `sysml-models/` (dir or zip) = **all** `.sysml` in the tree. Never parts-only SSOT. `rev.sha` bound. MemNet is **Foam-complete** (every construct Foam uses — not parts/ports forever, not whole KerML). Nodes only from that tree. Previous graph nodes gone. |
| 2 | GQL read | Via SysMLEdge MCP `gql_read` (or equivalent): reachability, ownership, usage for a known Foam element **without** stuffing the full `.sysml` tree into the agent context. Answers include `rev.sha` and `rev.stale=false`. P1 proof MAY still use MemNet `pin_map` for M1–M4. |
| 3 | STALE detect | Change a SysML file on disk without reproject. Structure reads with default `staleOk=false` **fail** with `code: STALE`. With `staleOk=true`, read may succeed but MUST return `rev.stale=true`. `propose` while STALE **refused**. |
| 4 | Reproject | `reproject` from current SysML → new bind; STALE clears; live reads succeed. |
| 5 | Propose isolation | `propose` writes only under `sysml-models/proposals/<id>/` (`PATCH.md` + `delta.sysml`). Current SSOT tree unchanged; no MemNet write-back as SSOT. |
| 6 | Human save + history | Human whole-tree save → new `rev.sha`. Previous SHA remains **downloadable**. |
| 7 | Download shape | Download @ rev = **SysML zip only**. No MemNet/GQL/Kuzu export as “the model”. |
| 8 | MCP bind | Session binds **project@rev**. No MCP tool silently overwrites current SSOT. |

## Out of P1

- Website UI, user accounts, in-tenant ACL, GitHub-like PR review UI (P2)
- Multi-tenant / billing (P3)
- Edit-in-graph as SSOT
- Everything on the NARROW freeze list in [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (SaaS editor, PR UI, Team ACL, billing, Cameo, ClickUp/InvenTree product, **full KerML** in two weeks)
- Whole-language coverage (P1 = Foam-complete projection + beat-grep / STALE / demo only)

## Foam proof (2-week, ALL required) — NARROW 2026-09-11

Hard pass/fail. Cited from [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md), [PRODUCT-PLAN.md](PRODUCT-PLAN.md), [BUSINESS-PLAN.md](BUSINESS-PLAN.md). **Demand ALL four.** Contract rows 1–8 above remain; this section extends them. Evidence is a scripted log or a short recording — **no slides**.

**Claimed pains 1–5** ([PRODUCT-LOCKS.md](PRODUCT-LOCKS.md)): **1** grep latency; **2** big SysML + small LLM context / **context footprint** (GQL/`pin_map` slices); **3** STALE blindness / wrong rev; **4** chat-as-SSOT (no ship-rev zip, no propose-only trail); **5** mid-flight model change → re-entrant reproject. **Non-claims freeze:** canvas, PLM, ClickUp/InvenTree, Team ACL.

**P1 head-to-head** scores **wall-clock + context footprint + no silent drop** (pains 1–2). Pains **3–5** are proven by STALE / propose / ship-rev / reproject rows below — **not** extra feature work this week.

### Row 9 — score all three axes

Same operator. Three fixed Foam questions: **usage / ownership / impact**.

| Arm | Path |
|-----|------|
| **A (competitor)** | raw Cursor + git + grep/LSP → LLM. Pain #1: **tens of minutes**. Pain #2: **big SysML + small LLM context** → truncate / **silent drop**. |
| **B** | SysMLEdge: agents query **slices** via **GQL/`pin_map`** over the full projected graph. MUST NOT stuff the tree. |

| Axis | Pass for SysMLEdge |
|------|---------------------|
| **wall-clock** | Faster than Arm A on each of the three Qs. Log elapsed time (not tokens as a proxy for time). |
| **context footprint** | Log prompt/context tokens used to answer each Q. SysMLEdge MUST be **far smaller** than a **whole-tree dump** of Foam `.sysml`, and smaller than Arm A. GQL/`pin_map` slices only. |
| **no silent drop** | GQL answers **preserve ownership / usage / impact edges** (read from the full projection). Arm A MAY omit via truncate/silent drop; score the drop. SysMLEdge answers MUST carry `rev.sha` + `rev.stale=false`. |

Log wall-clock, **context footprint** (prompt tokens per Q + whole-tree-dump baseline), **no silent drop** notes (edges kept vs dropped), `rev.sha` / `rev.stale`. Feature count is **not** a win.

| # | Name | Pass criteria |
|---|------|----------------|
| 9 | Head-to-head | **wall-clock + context footprint + no silent drop** on the three Foam Qs. Competitor = tens-of-minutes grep, not Cameo. Context footprint **far smaller** than whole-tree dump. |
| 10 | STALE not theater | **Pain 3 + 5:** mutate SysML on disk → structure read fails `code: STALE` → `propose` refused → `reproject` clears → live reads work. Scripted log or short recording. No extra feature work this week. |
| 11 | Propose + ship rev | **Pain 4:** `propose` only under `proposals/<id>/`; SSOT unchanged; human save → new SHA; prior SHA zip downloadable; download = SysML zip only. **All eight** rows above green on Foam MemNet. |
| 12 | Non-Core operator | One operator **not** from Core runs the demo **cold**. Keep using this vs grep? **Yes/no + why.** If **no**, narrow further or **kill** the wedge claim. |

### Fail / pass (product)

| Outcome | Product rule |
|---------|--------------|
| **Fail** (any of 9–12) | Kill the Pro/beachhead story for now. Keep docs as a contract sketch or fold into MemNet tooling. MUST NOT ship “bilingual bus” as a product without the head-to-head. |
| **Pass** (all of 9–12) | KEEP narrowed — Foam vertical + MCP marketplace path. Price/experiment only after a **second paid outsider**. P2 UI still gated. |

## MemNet proof (2-week, ALL required) — Elon 2026-09-11

**Alongside Foam.** KEEP MemNet as sole engine; **NARROW** the surface. No Kuzu hedge. **Kill only if** this proof fails. Amendment (Memnetor 2026-09-09/10): [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md#memnet-engine-elon-hard-review-2026-09-11).

**Proof env:** `memnet-llm==0.19.8` + TCP-shared MCP (`MEMNET_MCP_TRANSPORT=tcp`, serve `:18765` / mcp `:18766`). UNKNOWN on a required field = **fail that line**.

**Impact claim:** MUST NOT claim exhaustive impact until measured. Either prove `gql_impact` **closure** on Foam gold, **or** narrow the P1 win to neighbourhood / tip + **usage** cues. Sysmler Core (2026-09-12): [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md#sysmler-core-review-2026-09-12) — must-fix **before** Foam gold; do not market impact until that fork is explicit.

| # | Name | Pass criteria |
|---|------|----------------|
| **M1** | Gold fidelity | Frozen **N** from a **full Foam clone**: parse `connections.sysml` / `root.sysml`; coverage matrix **part / port / connection / satisfy / allocate / nested**. Gold MUST include **≥1 nested part** that today needs **manual CREATE** (e.g. `backgroundSetIndicator`). **Pass only if** ingest/reproject covers it **without** hand CREATE — **or** document it P1 out-of-scope and **narrow the claim**. Zero extras not in SysML. Zero silent drops. **Publish counts.** |
| **M2** | Query slice | Same 3 Foam Qs via `pin_map` and/or `gql_*`. **SysMLEdge** binds `rev.sha` + `rev.stale=false` (absent on MemNet wire). **UNKNOWN = fail that line.** Impact: closure on gold **or** narrowed neighbourhood/usage (see above). |
| **M3** | STALE/reproject | **SysMLEdge-owned** bind. Mutate → fail-closed → `propose` refused → `reproject` → live. Timed / scripted. MUST NOT invent first-class STALE inside MemNet. Theater if bind is missing. |
| **M4** | Bounce regression | **Re-run once** in the 2-week window on **0.19.8** TCP-shared: `session_save` → restart **serve + MCP together** → load → gold `pin_map` **non-empty**. Record memnet-llm version. **Fail if** MCP `session_list` ≠ serve. Known: **FAIL on 0.19.7**. Serve death without `session_save` loses in-process sessions. |
| **M5** | Wall-clock + context vs grep | Same 3 Qs vs grep/LSP. **MUST time wall-clock** (Path-B UNKNOWN until timed). Also **context footprint**. **After** bind owns `rev.sha`, on **0.19.8+TCP**. May share logs with row 9. |

| Outcome | Engine / product rule |
|---------|------------------------|
| **M1 or M2 fail** | MemNet **not ready** as sole engine. Stop Pro/beachhead. Keep as internal tool or fix fidelity. **No Kuzu.** |
| **M3–M5 fail** | Same: do not ship bilingual bus as a product on an unproven MemNet path. |
| **All M1–M5 pass** | KEEP MemNet sole engine, **narrowed** surface. Foam proof 9–12 still required for the wedge. |

**NOT this week:** full KerML map; Kuzu/Cypher dual; `snap_model`/PKG as mission SSOT; multi-tenant/billing/ACL/InvenTree; graph write-back SSOT; agent save; `pin_map` expand beyond Foam P1; graph dumps as downloadable source; autopilot/bot-merge; first-class `rev`/STALE inside MemNet.

## Done when

- **Contract:** all eight rows (1–8) pass on the Foam pilot tree with MemNet + MCP (or CLI stand-in for the same contracts). P1 = Foam-complete + these rows — **not** whole-language coverage.
- **Wedge:** all four Foam proof items (9–12) pass (NARROW fail/pass unchanged).
- **Engine:** all five MemNet proof items (M1–M5) pass. Until then MemNet is KEEP/NARROW, not a dual-engine hedge.
- **Not done:** green CI on [#11](https://github.com/chouswei/SysMLEdge/pull/11) / [#12](https://github.com/chouswei/SysMLEdge/pull/12). Scaffold ≠ Foam gold.
