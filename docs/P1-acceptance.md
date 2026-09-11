# P1 acceptance — Foam vertical slice

Pilot SoI: `chouswei/modelbasedPrj-itri-vedan-foam-detection` (`sysml-models/`).
Engine: **MemNet**. No Kuzu. No SaaS accounts (P1 = local project).

Normative contracts: [P0-contracts.md](P0-contracts.md). Product locks: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (**NARROW**, Elon/Horcrux 2026-09-11). Living plan: [PRODUCT-PLAN.md](PRODUCT-PLAN.md). Business: [BUSINESS-PLAN.md](BUSINESS-PLAN.md).

This document is the P1 pass/fail sheet. It does not implement runtime.

## Must pass

| # | Name | Pass criteria |
|---|------|----------------|
| 1 | Import | Import Foam `sysml-models/` (dir or zip). `rev.sha` bound. MemNet projection contains only nodes projectable from that tree. Previous graph nodes gone. |
| 2 | GQL read | Via MCP/`gql_read` (or equivalent): reachability, ownership, usage for a known Foam part/port/connection **without** stuffing the full `.sysml` tree into the agent context. Answers include `rev.sha` and `rev.stale=false`. |
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
- Everything on the NARROW freeze list in [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (SaaS editor, PR UI, Team ACL, billing, Cameo, ClickUp/InvenTree product, mapping beyond parts/ports/connections)

## Foam proof (2-week, ALL required) — NARROW 2026-09-11

Hard pass/fail. Cited from [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md), [PRODUCT-PLAN.md](PRODUCT-PLAN.md), [BUSINESS-PLAN.md](BUSINESS-PLAN.md). **Demand ALL four.** Contract rows 1–8 above remain; this section extends them. Evidence is a scripted log or a short recording — **no slides**.

| # | Name | Pass criteria |
|---|------|----------------|
| 9 | Head-to-head | **Three** fixed Foam questions (usage / ownership / impact). Same operator. Arm A: raw Cursor + git + grep/LSP. Arm B: SysMLEdge MCP. Log **tokens**, **latency**, **answer correctness**, and that SysMLEdge answers carry `rev.sha` + `rev.stale=false`. SysMLEdge MUST win on **context size** and **structure fidelity**. |
| 10 | STALE not theater | Mutate SysML on disk → structure read fails `code: STALE` → `propose` refused → `reproject` clears → live reads work. Scripted log or short recording. |
| 11 | Propose + ship rev | `propose` only under `proposals/<id>/`; SSOT unchanged; human save → new SHA; prior SHA zip downloadable; download = SysML zip only. **All eight** rows above green on Foam MemNet. |
| 12 | Non-Core operator | One operator **not** from Core runs the demo **cold**. Keep using this vs grep? **Yes/no + why.** If **no**, narrow further or **kill** the wedge claim. |

### Fail / pass (product)

| Outcome | Product rule |
|---------|--------------|
| **Fail** (any of 9–12) | Kill the Pro/beachhead story for now. Keep docs as a contract sketch or fold into MemNet tooling. MUST NOT ship “bilingual bus” as a product without the head-to-head. |
| **Pass** (all of 9–12) | KEEP narrowed — Foam vertical + MCP marketplace path. Price/experiment only after a **second paid outsider**. P2 UI still gated. |

## Done when

- **Contract:** all eight rows (1–8) pass on the Foam pilot tree with MemNet + MCP (or CLI stand-in for the same contracts).
- **Wedge:** all four Foam proof items (9–12) pass. Until then the product is NARROW / proof in progress — not a beachhead.
