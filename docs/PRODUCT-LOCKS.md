# SysMLEdge product locks

**As of:** 2026-09-11. Normative product locks for the living plan in [PRODUCT-PLAN.md](PRODUCT-PLAN.md). Market pin and buyer roots also in [BUSINESS-PLAN.md](BUSINESS-PLAN.md) (GTM / beachhead). Implement against these plus [P0-contracts.md](P0-contracts.md). This file does not implement runtime.

If a lock and P0 wording differ, this sheet **notes** the difference and **aligns** P0 language. It MUST NOT weaken: MemNet-only projection, `graph = model @ SHA`, STALE, or **no agent write of SSOT**.

---

## Position

SysMLEdge is **SysML SSOT + GQL/MCP query face**. Competitive/buyer pin: [Market position (pin)](#market-position-pin).

| Is | Is not |
|----|--------|
| Textual SysML v2 as author SSOT; MemNet one-way projection; GQL/MCP to query and represent | Graphic MBSE IDE (SysON, Cameo, canvas, diagram-as-SSOT) |
| Link/sync a GitHub (or git) repo **at a SHA**; own projection, STALE, and propose | A GitHub clone (issues, PRs-as-product, social VCS) |
| Project service for MBSE + agents | ClickUp or InvenTree as product features |

**No graphic:** no diagram canvas, graphic modeler, or diagram-as-SSOT. Authoring is **textual SysML**. Query is **GQL/MCP**. Agents **propose** only; they do not write SSOT.

---

## Market position (pin)

SysMLEdge = **the bilingual bus for textual SysML v2 + agents** — SysML stays the model; GQL/MCP is how Cursor agents query it without grepping the tree.

| We are | We are not |
|--------|------------|
| Model + agent bus on git/SysML | SysON / Cameo / graphic MBSE IDE |
| Beats “git + LSP + grep `.sysml`” | A GitHub clone |
| Desk → Foam first, then Pro ~$19–29 | Defense PLM / enterprise >$100 (yet) |

**Buyer:** solo / 2–5 engineers on SysML v2 textual + Cursor.

**Competitor to beat on the P1 demo:** **grep** (git + SysML LSP). P1 is proven when GQL/MCP answers mapped structure **without** stuffing the `.sysml` tree into the agent.

**Product gate:** second paid outsider **after** the Foam slice. Foam is the first vertical; do not treat P2 as “done” until that second paid outsider exists.

**CEO review risk (do not look like another SysML editor):**

- Do not ship P2 human UI (SaaS editor / canvas-shaped surface) before P1 proves the query demo against grep.
- Foam Phase-1 hours stay on the Foam slice (import, project, GQL/MCP, STALE, propose, zip). Do not spend them on P2 UI.
- Freemium Pro ~US$19–29 is the desk wedge after Foam; Team / defense PLM is not this cut.

This pin does **not** widen scope: MemNet-only projection, `graph = model @ SHA`, STALE, no agent SSOT write, no graphic IDE, no GitHub clone, ClickUp/InvenTree not product features.

---

## Human root requirements (buyer)

Buyer: **solo / lead MBSE engineer** (same desk as [Market position (pin)](#market-position-pin): solo / 2–5 on SysML v2 textual + Cursor). These **seven** are the roots. They are product intent, not extra P1 rows and not runtime in this seed. GTM / beachhead: [BUSINESS-PLAN.md](BUSINESS-PLAN.md).

| # | Root | Lock |
|---|------|------|
| 1 | **Trust the model** | Always know `project@rev` versus **STALE** / **Dirty**. MUST NOT leave the human (or agents) wondering if they saw a ghost tree (unbound graph, Live pretence, or silent drift). |
| 2 | **Stay SSOT owner** | Only the human — or their explicit policy (human Save, human-auth MCP merge, later opt-in autopilot) — applies SysML. Agents MUST NOT silently rewrite SSOT. |
| 3 | **Ask without grep pain** | “What uses this?” via MCP/GQL **without** stuffing `.sysml` into chat. |
| 4 | **Keep git as home** | Link/sync the git/GitHub repo. MUST NOT abandon GitHub for a closed silo. |
| 5 | **Mid-flight change** | Path A: fix the model while implementing without breaking the day loop. |
| 6 | **Ship a rev** | Download/tag **SysML zip @ rev** as the locked contract for that release. |
| 7 | **Affordable** | Free to try; Pro ~US$19–29 / month if it sticks. Plan, not a live price list in this repo. |

**Derived (not roots):** GitHub-like PR UI, in-tenant teammates, autopilot — **P2**. MUST NOT treat them as buyer roots or as P1 scope.

### P1 must prove first

P1 proves roots **1, 2, 3, and 6** (trust, SSOT owner, beat-grep ask, ship rev). Roots **4, 5, and 7** stay locked here; they MUST NOT widen [P1-acceptance.md](P1-acceptance.md) (still **eight** rows; no ninth row).

| Root | Existing P1 rows |
|------|------------------|
| 1 Trust | 1 Import (`rev.sha` bound), 3 STALE detect, 4 Reproject, 8 MCP bind `project@rev` |
| 2 SSOT owner | 5 Propose isolation, 8 no silent SSOT overwrite; 6 human save + history |
| 3 Beat-grep ask | 2 GQL read without stuffing the `.sysml` tree |
| 6 Ship a rev | 6 previous SHA remains downloadable, 7 download = SysML zip only |

**Dirty ≠ STALE** stays in this sheet. P1 STALE rows prove projection drift; working-tree Dirty UI is not a P1 acceptance row.

---

## Stack

```text
SysML zip / sysml-models/ tree     author SSOT
        |  human Save (whole tree) → git commit
        v
MemNet one-way projection @ rev.sha
        |
        v
GQL query / MCP read + propose
```

| Layer | Lock |
|-------|------|
| **SSOT** | SysML zip or `sysml-models/` tree. Download = SysML zip @ rev only. |
| **Git / GitHub** | VCS backbone. Bind **project @ SHA**. SysMLEdge owns projection, STALE, and propose — not GitHub’s review UI. |
| **MemNet** | Projected index of mapping v1. **No Kuzu**, no Cypher, no `graph.kuzu`. |
| **GQL** | Query/represent what SysML already says at `rev.sha`. MUST NOT invent. |
| **STALE** | Projection `rev.sha` ≠ current SHA. Show it; refuse live-SSOT pretence. `staleOk` is read-only. |

Save **never** writes the graph. Save → auto-reproject → Live. Graph write-back is not a save.

---

## Day loop

Re-entrant. Mid-implement is allowed.

```text
edit SysML → Save → MCP ask → implement → (propose) → repeat
```

| Path | Who | Mid-implement |
|------|------|----------------|
| **A — eng** | Human engineer | Edit SysML (files or SaaS editor), Save, keep coding against MCP reads. |
| **B — agent propose** | Cursor/MCP agent | Read GQL → draft delta → `propose` only. Human merge or Save. |

Agents do **not** get a write-SSOT tool. A proposal is not current until a human (or a lock below that is still human-gated) applies it.

---

## Merge and Save (who may touch SSOT)

| Path | Allowed? | Gate |
|------|----------|------|
| **Agent merge** | **Banned** | No MCP tool for agents that apply `delta.sysml` onto current. |
| **Human Save** | Yes | UI/files/CLI: whole-tree overwrite of current; git commit; auto-reproject. |
| **Human-auth MCP merge** | Yes | Human token **and** explicit confirm → apply proposal + Save + reproject. Same human Save effect; not silent; not an agent. |
| **Autopilot** | P2, opt-in | Per **project**, default **off**. Metaphor: GitHub auto-merge (policy + checks + audit). Not agent-owned SSOT. |
| **Bot review** | Optional | Per project, default **off**. Pass/fail on a **proposal**. Never owns SSOT. |

### Autopilot gates (when enabled)

Additive allowlist, **≤ N** changes, `rev_status` live (not STALE). **Hard refuse:** delete/rename cascades; new equipment outside the allowlist.

Autopilot settings UI is **P2**. P0/P1 have no autopilot runtime.

---

## Save / STALE UI

Dirty is **not** STALE.

| State | Meaning |
|-------|---------|
| **Live** | Bound projection SHA equals current. Structure reads are live-SSOT. |
| **Dirty** | Working SysML differs from last Save. Projection may still match last Save (not STALE). |
| **STALE** | Projection SHA ≠ current SHA (Save or import landed; reproject not done — or disk drifted without reproject). |
| **Saving** | Whole-tree overwrite + git commit in flight. MUST NOT write MemNet as SSOT. |
| **Reprojecting** | Rebuilding MemNet from current SysML. |
| **Error** | Import/save/reproject/read failed; do not pretend Live. |

**Save** → commit current tree → **auto-reproject** → **Live**.  
**Merge** (human-auth or autopilot) is **blocked while STALE** until **Reproject** succeeds.

---

## Faces, project, tenancy

| Face | Surface |
|------|---------|
| **Agent** | Cursor **MCP plugin** (bind **project@rev**). |
| **Human** | SaaS editor and/or files (zip / `sysml-models/` tree). |

**Project ≠ account.** One account may hold several projects. MCP binds **project@rev**, not “the user’s graph”.

| Phase | Isolation |
|-------|----------|
| **P2** | Single tenant on the existing droplet (**Devicor**). **In-tenant ACL**. InvenTree on that host stays **untouched** (not a SysMLEdge feature). |
| **P3** | Cross-tenant isolation (data, MemNet, MCP credentials). Not implied by P2. |

---

## Users, freemium, product gate

**Pinned users:** solo / lead MBSE engineer (buyer of the seven roots; desk = 2–5 on SysML v2 textual + Cursor); Cursor/MCP agents; later, in-tenant teammates (P2 ACL — derived, not a root). See [Market position (pin)](#market-position-pin).

| Tier | Intent (plan, not a live price list in this repo) |
|------|---------------------------------------------------|
| **Free** | 1 small project + MCP + soft caps. |
| **Pro** | ~US$19–29 / month: few projects, SaaS editor, higher caps, basic PR. |
| **Team** | ~US$49–79 later: in-tenant ACL. |

**Product gate:** second paid outsider **after** the Foam slice. Foam is the first vertical; do not treat P2 as “done” until that second paid outsider exists.

---

## ClickUp / InvenTree (not product features)

SysMLEdge does **not** ship ClickUp or InvenTree: no sync, no PLM UI, no “link this task in ClickUp” product.

[P0-contracts.md](P0-contracts.md) §5 still **projects** `partNumber` and any ClickUp/Inventree **ids already written in SysML** into MemNet. That is SSOT fidelity, not a ClickUp/InvenTree product. Unknown ids: omit. Do not invent.

---

## Alignment with P0 (2026-09-11)

| Topic | P0 (seed) | This lock | Alignment |
|-------|-----------|-----------|-----------|
| Engine | MemNet; Kuzu rejected | Same | Unchanged. |
| STALE / `staleOk` | Show; refuse pretence; `staleOk` read-only | Same + UI states Dirty ≠ STALE | P0 STALE rules stand. Dirty added as working-tree, not projection drift. |
| Agent SSOT write | Silent MCP save forbidden | Agent merge **banned**; no write-SSOT tool | Unchanged. |
| Human-auth MCP merge | Save is human UI/CLI; MCP `save` forbidden as **unattended** | Token + confirm → apply + Save + reproject | **Clarify** P0: unattended/agent save stays forbidden; human-auth merge is the human Save path on MCP. |
| Graphic IDE | Not specified | Explicit reject (SysON/Cameo) | Add to P0 reject list (does not weaken contracts). |
| Market pin | Not specified | Bilingual bus; beat grep on P1; Desk→Foam then Pro; not defense PLM yet | Plan/locks only. Does not add runtime or P2 UI. |
| ClickUp/InvenTree | Mapped when present in SysML | Not product features | **Clarify** P0 §5: projection of SysML attributes only. |

---

## Reject (product)

Implementations MUST reject, in addition to P0 §7:

1. Graphic canvas / SysON- or Cameo-like modeler as a SysMLEdge surface; a product that looks like another SysML editor.
2. Rebuilding GitHub (or treating GitHub review as the SSOT owner).
3. Agent-owned merge or any agent write-SSOT tool.
4. ClickUp or InvenTree as SysMLEdge features (including P2 touching InvenTree on Devicor).
5. Autopilot **on** by default; autopilot that skips allowlist / `rev_status` / hard-refuse rules.
6. Bot review that writes SSOT.
7. Serving MemNet/GQL as downloadable source; Kuzu/Cypher.
8. Claiming P2 SaaS or P3 tenancy as shipping in this repository seed.
9. Shipping P2 UI before the P1 query demo beats grep; spending Foam Phase-1 hours on P2 UI.
