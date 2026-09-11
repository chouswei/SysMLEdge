# SysMLEdge product locks

**As of:** 2026-09-11. Normative product locks for the living plan in [PRODUCT-PLAN.md](PRODUCT-PLAN.md). Implement against these plus [P0-contracts.md](P0-contracts.md). This file does not implement runtime.

If a lock and P0 wording differ, this sheet **notes** the difference and **aligns** P0 language. It MUST NOT weaken: MemNet-only projection, `graph = model @ SHA`, STALE, or **no agent write of SSOT**.

---

## Position

SysMLEdge is **SysML SSOT + GQL/MCP query face**.

| Is | Is not |
|----|--------|
| Textual SysML v2 as author SSOT; MemNet one-way projection; GQL/MCP to query and represent | SysON or any graphic SysML IDE |
| Link/sync a GitHub (or git) repo **at a SHA**; own projection, STALE, and propose | A rebuild of GitHub (issues, PRs-as-product, social VCS) |
| Project service for MBSE + agents | ClickUp or InvenTree as product features |

**No graphic:** no diagram canvas, graphic modeler, or diagram-as-SSOT. Authoring is **textual SysML**. Query is **GQL/MCP**.

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

**Pinned users:** solo / small MBSE engineer; Cursor/MCP agents; later, in-tenant teammates (P2 ACL).

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
| Graphic IDE | Not specified | Explicit reject | Add to P0 reject list (does not weaken contracts). |
| ClickUp/InvenTree | Mapped when present in SysML | Not product features | **Clarify** P0 §5: projection of SysML attributes only. |

---

## Reject (product)

Implementations MUST reject, in addition to P0 §7:

1. Graphic canvas / SysON-like modeler as a SysMLEdge surface.
2. Rebuilding GitHub (or treating GitHub review as the SSOT owner).
3. Agent-owned merge or any agent write-SSOT tool.
4. ClickUp or InvenTree as SysMLEdge features (including P2 touching InvenTree on Devicor).
5. Autopilot **on** by default; autopilot that skips allowlist / `rev_status` / hard-refuse rules.
6. Bot review that writes SSOT.
7. Serving MemNet/GQL as downloadable source; Kuzu/Cypher.
8. Claiming P2 SaaS or P3 tenancy as shipping in this repository seed.
