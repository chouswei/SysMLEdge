# SysMLEdge product plan

Living plan. **Locks (2026-09-11):** [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) — **NARROW** (Elon / Horcrux). **P0 behaviour:** [P0-contracts.md](P0-contracts.md). **P1 pass/fail + Foam proof:** [P1-acceptance.md](P1-acceptance.md). **Business / beachhead:** [BUSINESS-PLAN.md](BUSINESS-PLAN.md).

This repository seed does **not** implement runtime MCP/CLI. P2/P3 are not shipping here.

**Position:** SysML SSOT + GQL/MCP query face. Not SysON/graphic IDE. Not a GitHub rebuild.

**Core (unchanged):** name **SysMLEdge**; bilingual = SysML (author SSOT) + GQL (query/represent); SSOT = whole `sysml-models/` tree / zip (**all** `.sysml`); MemNet = one-way projected index (**no Kuzu**); `graph = model @ SHA`; GQL never invents; agents propose only (no write-SSOT tool); human save = whole-tree overwrite + git history; download = SysML zip only; P1 mapping = Foam-complete; pilot SoI = `chouswei/modelbasedPrj-itri-vedan-foam-detection`.

**NARROW (2026-09-11):** keep the Foam contract slice (bilingual bus). Freeze P2 spend until Foam proof **ALL** pass. Pro / Team / SaaS editor / AGI-as-product copy stay gated. Docs discipline ≠ product-market proof. Foam Phase-1 hours on P2 UI = kill signal.

---

## Phases

| Phase | Name | This repo | Intent |
|-------|------|-----------|--------|
| **P0** | Contracts | **Docs done** | Normative sheet so implementers do not rebuild a Kuzu indexer. |
| **P1** | Foam slice | **Docs done** ([P1-acceptance.md](P1-acceptance.md)). Runtime next (not this docs change). **Proof in progress.** | Contract rows 1–8 plus Foam proof 9–12 (head-to-head, STALE not theater, propose+ship rev, non-Core operator). ALL required. |
| **P2** | Single-tenant SaaS | Plan only. **Spend frozen** until Foam proof passes. | Hosted on the **existing droplet (Devicor)**. Identity, import/save/download, MemNet per project, MCP, in-tenant ACL, Save/STALE UI, optional autopilot/bot review (default off). **InvenTree on that host: untouched.** |
| **P3** | Tenancy | Plan only | Cross-tenant isolation, authz, billing-shaped tenancy. Not implied by P2. |

**Product gate:** Foam proof ALL pass, **then** a second paid outsider. Until then: no Pro/beachhead story as shipping intent.

**P2 freeze (explicit):** do not spend the two-week Foam window on SaaS editor, PR UI, Team ACL, billing, Cameo comparisons, ClickUp/InvenTree product, or **full KerML**. Mapping in that window is **Foam-complete** (whatever Foam uses), not a parts/ports forever cap. SSOT is **whole tree always**.

---

## P0 — Contracts

- [x] Product README (MemNet-only, lineage to codebase-sysmledgraph).
- [x] This living plan.
- [x] [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (2026-09-11, NARROW).
- [x] [BUSINESS-PLAN.md](BUSINESS-PLAN.md) (Pro/beachhead gated on Foam proof).
- [x] [P0-contracts.md](P0-contracts.md): rev identity, STALE, whole-tree import/save/download, MCP, Foam-complete mapping, proposal path, reject list.
- [x] [AGENTS.md](../AGENTS.md).
- [ ] Runtime MCP/CLI (out of P0 seed; not this change).

---

## P1 — Foam slice

Pilot: **https://github.com/chouswei/modelbasedPrj-itri-vedan-foam-detection** (`sysml-models/` as SSOT).

Acceptance (authoritative eight contract rows **plus** Foam proof 9–12): [P1-acceptance.md](P1-acceptance.md).

Must prove (same as that sheet; not ClickUp/InvenTree product):

1. Import zip or clone tree → bind `graph = model @ SHA`. Import/save/download = **all** `.sysml`. Never parts-only SSOT.
2. MemNet **Foam-complete** (every construct Foam uses). Widen kinds later as projects demand. Ids only if already in SysML.
3. STALE shown and live-SSOT pretence refused; `staleOk` read-only. Dirty ≠ STALE.
4. MCP `gql_read` / context / impact; `propose` → `sysml-models/proposals/<id>/`.
5. Human save overwrites current; download SysML zip @ rev; never download the graph.
6. MCP session binds **project@rev**; no silent SSOT overwrite.

Out of P1: SaaS accounts, in-tenant ACL, graphic canvas, autopilot UI, GitHub-like PR review UI, Kuzu, **whole-language** KerML, ClickUp/InvenTree features.

**Foam proof (ALL, 2-week):** competitor = tens-of-minutes grep (not Cameo). **Pain #2:** **big SysML + small LLM context.** Head-to-head MUST score **wall-clock + context footprint + no silent drop** (GQL/`pin_map` slices; far smaller than whole-tree dump; `rev.sha` + `rev.stale=false`). STALE not theater; propose + ship rev; non-Core operator yes/no. NARROW fail/pass unchanged. **Not** a feature-count win.

---

## Day loop (all later phases)

```text
edit SysML → Save → MCP ask → implement → (propose) → repeat
```

Re-entrant mid-implement: **Path A** engineer (files/SaaS) · **Path B** agent (`propose` only). Human merge/Save (or human-auth MCP merge with token+confirm). Agent merge banned. See [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md).

---

## P2 — Single-tenant SaaS

**Frozen until Foam proof passes.** Phase-1 hours here = kill signal ([PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) NARROW).

One organisation on **Devicor**. Accounts ≠ projects. Faces: **agent = Cursor MCP plugin**; **human = SaaS and/or files**.

Ships in intent **after** proof (not this seed): Save/STALE UI (Live / Dirty / STALE / Saving / Reprojecting / Error); merge blocked while STALE until Reproject; Freemium (Free = 1 small project + MCP + soft caps; Pro ~US$19–29/mo **only after** proof + second outsider); in-tenant ACL; optional autopilot (default off) and bot review (default off). Still SysML zip SSOT. Still no graph-as-download. No graphic modeler.

---

## P3 — Tenancy

Hard isolation between tenants (data, MemNet sessions, MCP credentials). Cross-tenant ACL. Team tier (~US$49–79) later. Do not start P3 shapes in P0/P1 APIs.

---

## Pinned users

1. Solo / small MBSE engineer (textual SysML).
2. Cursor / MCP agents (read + propose).
3. Later: in-tenant teammates (P2 ACL).

---

## Lineage vs this plan

[codebase-sysmledgraph](https://github.com/chouswei/codebase-sysmledgraph) planned Modelbase publisher + codebase Subscriber around **one Kuzu file** and a TCP worker. SysMLEdge replaces that with **MemNet projection per saved rev** and human-gated whole-tree SSOT. Do not carry Kuzu lock/worker phases into this product. Do not carry a graphic IDE or a GitHub clone.
