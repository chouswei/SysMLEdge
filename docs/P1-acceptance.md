# P1 acceptance — Foam vertical slice

Pilot SoI: `chouswei/modelbasedPrj-itri-vedan-foam-detection` (`sysml-models/`).
Engine: **MemNet**. No Kuzu. No SaaS accounts (P1 = local project).

Normative contracts: [P0-contracts.md](P0-contracts.md).

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

## Done when

All eight rows pass on the Foam pilot tree with MemNet + MCP (or CLI stand-in for the same contracts).
