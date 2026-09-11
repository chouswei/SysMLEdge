# SysMLEdge product locks

**As of:** 2026-09-11. Normative product locks for the living plan in [PRODUCT-PLAN.md](PRODUCT-PLAN.md). Implement against these plus [P0-contracts.md](P0-contracts.md). Business gates: [BUSINESS-PLAN.md](BUSINESS-PLAN.md). Foam proof: [P1-acceptance.md](P1-acceptance.md). This file does not implement runtime.

If a lock and P0 wording differ, this sheet **notes** the difference and **aligns** P0 language. It MUST NOT weaken: MemNet-only projection, `graph = model @ SHA`, STALE, or **no agent write of SSOT**.

---

## NARROW lock (Elon / Horcrux, 2026-09-11)

**Verdict: NARROW** — keep the Foam contract slice; freeze the rest.

| Keep | Gated until Foam proof passes |
|-----|-------------------------------|
| Bilingual bus: `graph = model @ rev`, MemNet one-way, STALE fail-closed, propose-only, no canvas | Pro / Team / SaaS editor; endgame AGI narrative as product story |

**Load-bearing claim:** `graph = model @ SHA` + STALE fail-closed is valuable enough that solo SysML+Cursor desks switch and later pay ~US$19–29. That claim is **not** proven by this docs seed.

**Proof bar:** ALL four Foam proof items in [P1-acceptance.md](P1-acceptance.md) (head-to-head, STALE not theater, propose+ship rev, one non-Core operator). Business and pricing: [BUSINESS-PLAN.md](BUSINESS-PLAN.md). Plan freeze: [PRODUCT-PLAN.md](PRODUCT-PLAN.md).

| Gate | Rule |
|------|------|
| **Proof fails** | Kill the Pro/beachhead story for now. Keep docs as a contract sketch or fold into MemNet tooling. MUST NOT ship “bilingual bus” as a product without the head-to-head. |
| **Proof passes** | KEEP narrowed: Foam vertical + MCP marketplace path. Price/experiment only after a **second paid outsider**. P2 UI still gated. |

**Strongest cut:** Docs discipline ≠ product-market proof. Foam Phase-1 hours on P2 UI = kill signal.

### Freeze (do not spend the two weeks on)

1. P2 SaaS editor
2. PR UI
3. Team ACL
4. Billing
5. Cameo comparisons
6. ClickUp / InvenTree product
7. Expanding mapping beyond parts / ports / connections

### Risks (document; no extra mitigations here)

1. Beachhead ~1k–10k textual SysML v2 + Cursor is **asserted, not evidenced**. Second paid outsider **after Foam** is required.
2. MemNet is **SPOF** — thin/slow Foam projection kills GQL vs LSP.
3. “Beat grep” is **soft** until a timed head-to-head. Freemium/Pro SaaS editor (P2) is a **gap** while P1 forbids that UI.

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
| **Pro** | ~US$19–29 / month: few projects, SaaS editor, higher caps, basic PR. **Gated:** Foam proof MUST pass; then a second paid outsider before treating Pro as a beachhead. |
| **Team** | ~US$49–79 later: in-tenant ACL. **Gated** with P2 UI. |

**Product gate:** Foam proof (ALL four items) **then** a second paid outsider. Foam is the first vertical. Do not treat P2 as “done” until that outsider exists. MUST NOT spend Foam Phase-1 hours on the Pro SaaS editor.

**NARROW:** Pro/Team/SaaS editor and AGI-as-product copy stay frozen until [P1-acceptance.md](P1-acceptance.md) Foam proof passes.

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
9. Shipping “bilingual bus” as a product without the Foam head-to-head (NARROW, Elon/Horcrux 2026-09-11).
10. Spending Foam Phase-1 hours on P2 UI, PR UI, Team ACL, billing, Cameo, ClickUp/InvenTree product, or mapping beyond parts/ports/connections.
