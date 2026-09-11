# P1 acceptance — Foam vertical slice

Pilot SoI: `chouswei/modelbasedPrj-itri-vedan-foam-detection` (`sysml-models/`).
Engine: **MemNet**. No Kuzu. No SaaS accounts (P1 = local project).

Normative contracts: [P0-contracts.md](P0-contracts.md). Product locks: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (**NARROW**, Elon/Horcrux 2026-09-11). Living plan: [PRODUCT-PLAN.md](PRODUCT-PLAN.md). Business: [BUSINESS-PLAN.md](BUSINESS-PLAN.md).

This document is the P1 pass/fail sheet. It does not implement runtime.

## Must pass

| # | Name | Pass criteria |
|---|------|----------------|
| 1 | Import | Import Foam `sysml-models/` (dir or zip) = **all** `.sysml` in the tree. Never parts-only SSOT. `rev.sha` bound. MemNet is **Foam-complete** (every construct Foam uses — not parts/ports forever, not whole KerML). Nodes only from that tree. Previous graph nodes gone. |
| 2 | GQL read | Via MCP/`gql_read` (or equivalent): reachability, ownership, usage for a known Foam element **without** stuffing the full `.sysml` tree into the agent context. Answers include `rev.sha` and `rev.stale=false`. |
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

**Pain lock:** tens-of-minutes grep is the competitor to kill. P1 win = **wall-clock + less context** on the **same** Foam Qs — **not** feature count. LLM context **cannot** hold a large SysML system; grep→LLM truncates/drops. Wedge = structured GQL over the **full** projected graph without stuffing the whole tree into the prompt.

### Row 9 — score all three axes

Same operator. Three fixed Foam questions: **usage / ownership / impact**.

| Arm | Path |
|-----|------|
| **A (competitor)** | raw Cursor + git + grep/LSP → LLM. Pain: **tens of minutes**; context window **cannot** hold the tree → **truncate / drop**. |
| **B** | SysMLEdge MCP / GQL over the **full** projected graph; prompt is bounded neighbourhoods, not the zip. |

| Axis | Pass for SysMLEdge |
|------|---------------------|
| **Wall-clock** | Faster than Arm A on each of the three Qs. Log elapsed time (not tokens as a proxy for time). |
| **Less context** | Log **prompt/context tokens** used to answer each Q. SysMLEdge MUST be **far smaller** than a **whole-tree dump** of Foam `.sysml`, and smaller than Arm A. MUST NOT paste the full tree into the prompt. |
| **Structure fidelity** | GQL answers **preserve ownership / usage / impact edges** (read from the full projection). Arm A MAY omit via truncate/silent drop; score the drop. SysMLEdge answers MUST carry `rev.sha` + `rev.stale=false`. |

Log wall-clock, **prompt/context tokens per Q**, whole-tree-dump token count (baseline), correctness, fidelity notes (edges kept vs silently dropped), `rev.sha` / `rev.stale`. Feature count is **not** a win.

| # | Name | Pass criteria |
|---|------|----------------|
| 9 | Head-to-head | All three axes above on the three Foam Qs. Competitor = tens-of-minutes grep, not Cameo. Prompt tokens **far smaller** than whole-tree dump. |
| 10 | STALE not theater | Mutate SysML on disk → structure read fails `code: STALE` → `propose` refused → `reproject` clears → live reads work. Scripted log or short recording. |
| 11 | Propose + ship rev | `propose` only under `proposals/<id>/`; SSOT unchanged; human save → new SHA; prior SHA zip downloadable; download = SysML zip only. **All eight** rows above green on Foam MemNet. |
| 12 | Non-Core operator | One operator **not** from Core runs the demo **cold**. Keep using this vs grep? **Yes/no + why.** If **no**, narrow further or **kill** the wedge claim. |

### Fail / pass (product)

| Outcome | Product rule |
|---------|--------------|
| **Fail** (any of 9–12) | Kill the Pro/beachhead story for now. Keep docs as a contract sketch or fold into MemNet tooling. MUST NOT ship “bilingual bus” as a product without the head-to-head. |
| **Pass** (all of 9–12) | KEEP narrowed — Foam vertical + MCP marketplace path. Price/experiment only after a **second paid outsider**. P2 UI still gated. |

## Done when

- **Contract:** all eight rows (1–8) pass on the Foam pilot tree with MemNet + MCP (or CLI stand-in for the same contracts). P1 = Foam-complete + these rows — **not** whole-language coverage.
- **Wedge:** all four Foam proof items (9–12) pass (NARROW fail/pass unchanged). Until then the product is NARROW / proof in progress — not a beachhead.
