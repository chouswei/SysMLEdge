# SysMLEdge business plan

Plan intent only. **Source:** [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (2026-09-11 Core, including [market pin](PRODUCT-LOCKS.md#market-position-pin) and [human root requirements](PRODUCT-LOCKS.md#human-root-requirements-buyer)). **Product:** [PRODUCT-PLAN.md](PRODUCT-PLAN.md). **P1 pass/fail (unchanged eight rows):** [P1-acceptance.md](P1-acceptance.md).

This file does not implement runtime, does not add features, and does not widen P1. Prices are plan numbers, not a live price list in this repo.

---

## Position / endgame

SysMLEdge is the **bilingual bus / contract layer**: SysML is the locked model; GQL/MCP is how agents query and represent it at `graph = model @ rev`.

| Humans | Agents | Scale |
|--------|--------|-------|
| Lock SysML (whole-tree Save; git history) | Build against `model@rev`; **propose** only | AGI scales **agents**, not chat-as-SSOT |

**Not:** SysON, Cameo, graphic MBSE IDE, GitHub clone, defense PLM / enterprise >$100 (yet).

Bilingual = SysML (author SSOT) + GQL (query/represent). Not a zh/EN UI.

---

## Beachhead

| | Who | What we do |
|---|-----|------------|
| **Group A** | ~1k–10k people on textual SysML v2 + Cursor | **Design for A** |
| **Success before B** | **10–50 Pro seats** | Do not chase group B until this exists |
| **Desk #1** | Foam — `chouswei/modelbasedPrj-itri-vedan-foam-detection` | First vertical |

Buyer pin from locks: solo / 2–5 engineers on SysML v2 textual + Cursor. Foam desk first, then Pro ~US$19–29. Group B is not this cut (not defense PLM / enterprise >$100 yet).

---

## Personas

| # | Persona | Role |
|---|---------|------|
| 1 | Solo / lead MBSE engineer | **Buyer** — textual SysML; Path A day loop; seven roots below |
| 2 | MCP agent (Cursor) | **Operator** — bind `project@rev`; GQL; propose only |
| 3 | Teammate | **P2 derived** — in-tenant ACL; not a root; not a P1 buyer |

---

## Seven human roots

Normative locks: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md#human-root-requirements-buyer). These are why the buyer pays. They do not add P1 rows.

| # | Root | Why it is a root |
|---|------|------------------|
| 1 | **Trust the model** | Always know `project@rev` vs STALE/Dirty; never wonder if agents saw a ghost tree. |
| 2 | **Stay SSOT owner** | Only they (or their policy) Save; agents cannot silently rewrite SysML. |
| 3 | **Ask without grep pain** | “What uses this?” via MCP without stuffing `.sysml` into chat. |
| 4 | **Keep git as home** | Link/sync the repo; do not abandon GitHub for a closed silo. |
| 5 | **Mid-flight change** | Fix the model while implementing (Path A) without breaking the loop. |
| 6 | **Ship a rev** | Download/tag SysML zip @ rev as the locked contract for that release. |
| 7 | **Affordable** | Free to try; Pro ~US$19–29 / month if it sticks. |

**Derived (not roots):** PR UI, teammates, autopilot — **P2**. See [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) merge/autopilot and faces.

### What P1 must prove first

P1 must prove roots **1, 2, 3, and 6**. Mapping to the existing eight acceptance rows is in [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (no ninth row). Roots 4, 5, and 7 remain locks; they do not widen P1. P1 demo still **must beat grep**.

---

## Offer / freemium

| Tier | Intent |
|------|--------|
| **Free** | 1 small project + MCP + soft caps (project count / tree size / GQL rate) |
| **Pro** | ~US$19–29 / month: few projects, SaaS editor, higher caps, basic PR |
| **Team** | ~US$49–79 later: in-tenant ACL |

SaaS editor is P2 human UI. Basic PR UI is P2 derived, not a root. Locks: do not ship P2 human UI before the P1 query demo beats grep.

---

## GTM (find-path)

Order:

1. Network / `modelbasedPrj` first.
2. Public SysML v2 + Cursor signals.
3. Foam “beat grep” content (GQL/MCP without stuffing the `.sysml` tree).
4. Cursor MCP marketplace.

**MUST NOT** use Cameo or defense lists as the find-path. Named design-partner market lists only **after** the P1 demo, and only when asked.

---

## Gates

| Gate | Lock |
|------|------|
| **P0** | Docs done (this seed). |
| **P1 demo** | Foam query demo **must beat grep**. Proof is the existing eight rows in [P1-acceptance.md](P1-acceptance.md) (GQL without stuffing the tree) — not a ninth row. Those rows also prove buyer roots **1, 2, 3, and 6**. |
| **Product gate** | Second paid outsider **after** Foam. Do not treat P2 as done until then. |
| **Hours** | Foam Phase-1 hours stay on the Foam slice (import, project, GQL/MCP, STALE, propose, zip). Do not spend them on P2 UI. Do not steal them for **VI**. |

---

## Skills (adjacent pack)

[cursor-user-skills PR #16](https://github.com/chouswei/cursor-user-skills/pull/16) landed:

- `sysmledge-workflow` — SysMLEdge day loop
- MemNet retarget of `mcp-sysmledgraph` (never Kuzu)

Skills are not this repository’s runtime.

---

## Out of this plan

No graphic canvas. No agent write-SSOT. No ClickUp/InvenTree product. No Kuzu. No P2/P3 shipping claim in this seed.
