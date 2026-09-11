# SysMLEdge business plan (gated)

**As of:** 2026-09-11. **NARROW** lock: Elon / Horcrux. Source locks: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (including [market pin](PRODUCT-LOCKS.md#market-position-pin) and [human root requirements](PRODUCT-LOCKS.md#human-root-requirements-buyer)). Foam proof: [P1-acceptance.md](P1-acceptance.md). Living plan: [PRODUCT-PLAN.md](PRODUCT-PLAN.md).

This file is **not** a live price list and **not** a shipping claim. It does not implement runtime.

---

## Verdict

Keep the Foam **contract** slice (bilingual bus). Freeze Pro / Team / SaaS editor / endgame AGI copy until Foam proof passes.

| Keep now | Not a product story until proof |
|---------|----------------------------------|
| `graph = model @ SHA`, MemNet one-way, STALE fail-closed, propose-only, no canvas | Pro beachhead, Team ACL, SaaS editor, AGI endgame as marketing |

**Load-bearing claim:** `graph = model @ SHA` + STALE fail-closed is valuable enough that solo SysML+Cursor desks switch and later pay ~US$19–29. **Asserted.** Foam proof + a second paid outsider are the gates.

**Cut:** Docs discipline ≠ product-market proof. Foam Phase-1 hours on P2 UI = kill signal.

---

## Claimed pains 1–5 (CEO, 2026-09-11)

Exact claimed list. **Non-claims freeze:** canvas, PLM, ClickUp/InvenTree, Team ACL.

| # | Pain | Claim |
|---|------|--------|
| **1** | grep latency (tens of minutes) | Competitor to kill on **wall-clock**. |
| **2** | **big SysML + small LLM context** / **context footprint** | Agents query **slices** via **GQL/`pin_map`**. Not stuffing the tree. |
| **3** | STALE blindness / wrong rev | Fail closed; bind `rev.sha`. |
| **4** | chat-as-SSOT | Ship-rev zip + propose-only trail. Chat is not SSOT. |
| **5** | mid-flight reproject | Re-enter after Save/reproject. |

**P1 head-to-head** scores **wall-clock + context footprint + no silent drop** (pains 1–2). Pains **3–5** are contract claims (STALE / propose / ship-rev / reproject) — **not** extra feature work this week. [P1-acceptance.md](P1-acceptance.md). [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md).

---

## MemNet (Elon hard review)

**KEEP MemNet as sole engine — NARROW the surface.** No dual-engine / Kuzu hedge. Kill only if 2-week MemNet proof (M1–M5) fails.

`rev.sha` / STALE / reproject / `gql_*` is a product face on MemNet — not proven identical to Path-B until M1–M5.

If **M1 or M2 fail:** MemNet not ready as sole engine; stop Pro/beachhead; keep as internal tool or fix fidelity. Dual-engine only if Memnetor hard blocker — default **no Kuzu**.

---

## Position / endgame

SysMLEdge is the **bilingual bus / contract layer**: SysML is the locked model; GQL/MCP is how agents query and represent it at `graph = model @ rev`.

| Humans | Agents | Scale |
|--------|--------|-------|
| Lock SysML (whole-tree Save; git history) | Build against `model@rev`; **propose** only | AGI scales **agents**, not chat-as-SSOT |

**Not:** SysON, Cameo, graphic MBSE IDE, GitHub clone, defense PLM / enterprise >$100 (yet).

Bilingual = SysML (author SSOT) + GQL (query/represent). Not a zh/EN UI.

**Pitch:** `model@rev` is the API between humans and AGI builders. This **endgame** (contract layer) is already locked; this sheet MUST NOT expand it. AGI copy is **not** a P1/Pro story until Foam proof passes.

---

## Expert reception

Own the limits: **not whole SysML**, **no canvas**. Pitch **beat grep, not MagicDraw**. MUST NOT chase Cameo (or Cameo/defense lists as the find-path).

---

## Beachhead (asserted)

| | Who | Status |
|---|-----|--------|
| **Group A** | ~1k–10k people on textual SysML v2 + Cursor | **Asserted, not evidenced.** Design for A. |
| **Success before B** | **10–50 Pro seats** | Do not chase group B until this exists **and** Foam proof + second paid outsider. |
| **Desk #1** | Foam — `chouswei/modelbasedPrj-itri-vedan-foam-detection` | First vertical; proof not run |

Buyer pin: solo / 2–5 engineers on SysML v2 textual + Cursor. Foam desk first, then Pro ~US$19–29 **after** proof. Group B is not this cut (not defense PLM / enterprise >$100 yet).

**Required after Foam:** a **second paid outsider**. Do not treat one Core-adjacent Foam demo as a market.

---

## Personas

| # | Persona | Role |
|---|---------|------|
| 1 | Solo / lead MBSE engineer | **Buyer** — textual SysML; Path A day loop; seven roots below |
| 2 | MCP agent (Cursor) | **Operator** — bind `project@rev`; GQL; propose only |
| 3 | Teammate | **P2 derived** — in-tenant ACL; not a root; not a P1 buyer |

---

## Seven human roots

Normative locks: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md#human-root-requirements-buyer). These are why the buyer pays. They do not add extra buyer-root P1 rows.

| # | Root | Why it is a root |
|---|------|------------------|
| 1 | **Trust the model** | Always know `project@rev` vs STALE/Dirty; never wonder if agents saw a ghost tree. |
| 2 | **Stay SSOT owner** | Only they (or their policy) Save; agents cannot silently rewrite SysML. |
| 3 | **Ask without grep pain** | “What uses this?” via MCP without stuffing `.sysml` into chat. |
| 4 | **Keep git as home** | Link/sync the repo; do not abandon GitHub for a closed silo. |
| 5 | **Mid-flight change** | Fix the model while implementing (Path A) without breaking the loop. |
| 6 | **Ship a rev** | Download/tag SysML zip @ rev as the locked contract for that release. |
| 7 | **Affordable** | Free to try; Pro ~US$19–29 / month if it sticks. **Gated** on Foam proof. |

**Derived (not roots):** PR UI, teammates, autopilot — **P2**. See [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) merge/autopilot and faces.

### What P1 must prove first

P1 must prove roots **1, 2, 3, and 6** via the **eight contract rows**. NARROW Foam proof **9–12** is the wedge bar (head-to-head + STALE/propose/ship-rev), not extra buyer-root rows. Roots 4, 5, and 7 remain locks. P1 demo still **must beat grep**.

---

## Offer / freemium

| Tier | Intent | Gate |
|------|--------|------|
| **Free** | 1 small project + MCP + soft caps | Sketch until Foam proof |
| **Pro** | ~US$19–29 / month: few projects, SaaS editor, higher caps, basic PR | Foam proof **pass**, then **second paid outsider** |
| **Team** | ~US$49–79 later: in-tenant ACL | P2; frozen with P2 UI |

SaaS editor is P2 human UI. Basic PR UI is P2 derived, not a root. MUST NOT experiment on price, billing, or Pro packaging during the two-week Foam proof. MUST NOT ship P2 human UI before the P1 query demo beats grep.

If proof **fails:** kill the Pro/beachhead story for now. Keep docs as a contract sketch or fold into MemNet tooling. MUST NOT ship “bilingual bus” as a product without the head-to-head.

If proof **passes:** KEEP narrowed — Foam vertical + MCP marketplace path. Price/experiment only after the second outsider. P2 UI still gated.

---

## GTM (find-path)

Order:

1. Network / `modelbasedPrj` first.
2. Public SysML v2 + Cursor signals.
3. Foam “beat grep” content (GQL/`pin_map` slices; **context footprint**; no stuffing the `.sysml` tree).
4. Cursor MCP marketplace (after Foam proof).

**MUST NOT** use Cameo or defense lists as the find-path. Named design-partner market lists only **after** the P1 demo, and only when asked.

---

## Gates

| Gate | Lock |
|------|------|
| **P0** | Docs done (this seed). |
| **P1 demo** | Foam query demo **must beat grep**. Contract: eight rows in [P1-acceptance.md](P1-acceptance.md). Wedge: Foam proof 9–12 (**wall-clock + context footprint + no silent drop**; STALE/propose/ship-rev). Buyer roots **1, 2, 3, and 6**. |
| **Product gate** | Foam proof ALL pass, **then** a second paid outsider. Do not treat P2 as done until then. |
| **Hours** | Foam Phase-1 hours stay on the Foam slice (import, project, GQL/MCP, STALE, propose, zip). Do not spend them on P2 UI. Do not steal them for **VI**. |

---

## Skills (adjacent pack)

[cursor-user-skills PR #16](https://github.com/chouswei/cursor-user-skills/pull/16) landed:

- `sysmledge-workflow` — SysMLEdge day loop
- MemNet retarget of `mcp-sysmledgraph` (never Kuzu)

Skills are not this repository’s runtime.

---

## Risks (document only)

1. Beachhead size is asserted. Without a second paid outsider after Foam, do not keep the paid-wedge story.
2. MemNet is **SPOF** (KEEP/NARROW, not a Kuzu hedge). Documented: silent drop / fidelity; serve≠MCP; `rev`/STALE/reproject bridge; latency UNKNOWN until Memnetor. Proof: M1–M5.
3. “Beat grep” is soft until the timed head-to-head. Competitor = **tens-of-minutes grep**, not Cameo. MUST score **wall-clock + context footprint + no silent drop**. Feature count is not a win. Freemium/Pro SaaS editor (P2) cannot close that gap in P1.

No extra mitigations beyond: run the four proof items; freeze the list in [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md); fail closed on the product story if any item fails.

---

## Reject (business)

1. Selling Pro/Team or a SaaS editor before Foam proof ALL pass.
2. Treating Core or Foam-adjacent operators as the second paid outsider.
3. Cameo bake-offs as a two-week workstream (competitor is grep, not Cameo).
4. ClickUp / InvenTree as a SysMLEdge product to widen TAM.
5. AGI/endgame copy as a substitute for the head-to-head.
6. Shipping bilingual bus as a product if proof fails.
7. Parts-only SSOT, or treating parts/ports as a forever mapping cap.
8. Selling P1 as a feature-count win instead of **wall-clock + context footprint + no silent drop** vs grep.
9. Claiming canvas, PLM, ClickUp/InvenTree, or Team ACL as this-week pains (non-claims freeze).
10. Dual-engine / Kuzu unless Memnetor is a hard blocker.

## Out of this plan

No graphic canvas. No agent write-SSOT. No ClickUp/InvenTree product. No Kuzu. No P2/P3 shipping claim in this seed.
