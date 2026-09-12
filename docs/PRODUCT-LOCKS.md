# SysMLEdge product locks

**As of:** 2026-09-12. Normative product locks for the living plan in [PRODUCT-PLAN.md](PRODUCT-PLAN.md). Implement against these plus [P0-contracts.md](P0-contracts.md). Business / GTM / buyer roots: [BUSINESS-PLAN.md](BUSINESS-PLAN.md). Foam proof: [P1-acceptance.md](P1-acceptance.md). This file does not implement runtime.

If a lock and P0 wording differ, this sheet **notes** the difference and **aligns** P0 language. It MUST NOT weaken: MemNet-only projection, `graph = model @ SHA`, STALE, or **no agent write of SSOT**.

---

## NARROW lock (Elon / Horcrux, 2026-09-11)

**Verdict: NARROW** — keep the Foam contract slice; freeze the rest.

| Keep | Gated until Foam proof passes |
|-----|-------------------------------|
| Bilingual bus: `graph = model @ rev`, MemNet one-way, STALE fail-closed, propose-only, no canvas | Pro / Team / SaaS editor; endgame AGI narrative as product story |

**Load-bearing claim:** `graph = model @ SHA` + STALE fail-closed is valuable enough that solo SysML+Cursor desks switch and later pay ~US$19–29. That claim is **not** proven by this docs seed.

**Proof bar:** ALL Foam proof items **and** ALL MemNet proof items in [P1-acceptance.md](P1-acceptance.md). Kill the engine story only if the 2-week **MemNet** proof fails. Kill Pro/beachhead if Foam head-to-head fails.

| Gate | Rule |
|------|------|
| **Proof fails** | Kill the Pro/beachhead story for now. Keep docs as a contract sketch or fold into MemNet tooling. MUST NOT ship “bilingual bus” as a product without the head-to-head. |
| **Proof passes** | KEEP narrowed: Foam vertical + MCP marketplace path. Price/experiment only after a **second paid outsider**. P2 UI still gated. |
| **plan ≠ product** (CEO Core 2026-09-12) | Ready to *build* P1. Not ready to *serve* projects until Foam + MemNet proof **and** SysMLEdge MCP bind pass. Until then **MemNet tip only**. MUST NOT migrate other repos onto SysMLEdge. |
| **don’t-migrate** (Elon Core 2026-09-12) | KEEP the freeze. NARROW dogfood = **synthetic fixture tree** (CI only). Kill-theater 1–5 below. Optional second-repo replay **not** required for P1. |

**Strongest cut:** Docs discipline ≠ product-market proof. Foam Phase-1 hours on P2 UI = kill signal.

NARROW fail/pass gates above **stand**. Mapping and SSOT rules below do **not** reopen P2 UI, Pro, or AGI copy. **plan ≠ product** (CEO) and **don’t-migrate** (Elon Core 2026-09-12) stand with those gates (sections below).

### Freeze (do not spend the two weeks on)

**Non-claims freeze:** canvas, PLM, ClickUp/InvenTree, Team ACL.

Product / ocean — **not** a forever mapping cap:

1. P2 SaaS editor
2. PR UI
3. Team ACL
4. Billing
5. Cameo comparisons
6. ClickUp / InvenTree product
7. Full KerML / whole-language coverage in two weeks
8. A second **real** in-house SysML desk / multi-repo onboarding (synthetic fixture CI is allowed; see Elon Core 2026-09-12)

Elon’s “parts/ports” freeze was **2-week anti-scope-creep for mapping work**. It is **superseded** by: **Foam-complete mapping** + **whole-tree SSOT always** (this sheet, Core 2026-09-11). MUST NOT read it as “parts/ports forever” or as permission for parts-only SSOT.

### Risks (document; no extra mitigations here)

1. Beachhead ~1k–10k textual SysML v2 + Cursor is **asserted, not evidenced**. Second paid outsider **after Foam** is required.
2. MemNet is **SPOF** — thin/slow Foam projection kills GQL vs LSP.
3. “Beat grep” is **soft** until the timed head-to-head scores **wall-clock + context footprint + no silent drop** on the same Foam Qs. Freemium/Pro SaaS editor (P2) is a **gap** while P1 forbids that UI.

---

## plan ≠ product (CEO Core, 2026-09-12)

**plan ≠ product.** Ready to *build* P1; not ready to *serve* projects until **Foam proof** + **MemNet proof** ([P1-acceptance.md](P1-acceptance.md) 9–12 and M1–M5) **and** **SysMLEdge MCP bind** ([P1-acceptance.md](P1-acceptance.md) row 8) pass.

Until then: **MemNet tip only**. MUST NOT migrate other repos onto SysMLEdge.

Cited with NARROW fail/pass and MemNet M1–M5 above. Those gates **stand**. This lock does **not** reopen P2 UI, Pro, or AGI copy.

---

## don’t-migrate freeze (Elon Core, 2026-09-12)

**KEEP** the don’t-migrate freeze (CEO **plan ≠ product** stands). NARROW dogfood is a **synthetic fixture tree**: tiny parts / ports / connections + **one nested**, for CI of import / bind / STALE / reproject / propose. It is **not** a second real in-house SysML desk.

**Kill-theater** (any of these = theater; stop):

1. Foam tip demo sold as SysMLEdge bind **before** `rev.sha` exists.
2. Agents / repos pointed at MemNet mission sessions as `project@rev`.
3. “Almost P1” migration of a second repo when only Path-B / `pin_map` works.
4. Hours on P2 UI or multi-repo onboarding before timed head-to-head **and** gold fidelity.
5. Pinning below **memnet-llm==0.19.8** or dropping TCP share.

**Optional** only after Foam **gold** bind + STALE **green**: read-only replay of the same **eight** P1 contract rows on a second repo. **Not** required for P1.

---

## Claimed pains 1–5 (CEO, 2026-09-11)

Exact claimed list. **Non-claims freeze:** canvas, PLM, ClickUp/InvenTree, Team ACL.

| # | Pain | SysMLEdge claim |
|---|------|-----------------|
| **1** | grep latency (tens of minutes) | Beat grep on **wall-clock** (head-to-head). |
| **2** | **big SysML + small LLM context** / **context footprint** | Agents query **slices** via **GQL/`pin_map`**. Not stuffing the tree. |
| **3** | STALE blindness / wrong rev | Show STALE; fail closed; `rev.sha` bound. |
| **4** | chat-as-SSOT | No ship-rev zip, no propose-only trail — SysMLEdge **has** both. |
| **5** | mid-flight model change → re-entrant reproject | Day loop: edit → Save → reproject → keep going. |

**P1 head-to-head** still scores **wall-clock + context footprint + no silent drop** (pains **1–2** + silent-drop vs grep→LLM). Pains **3–5** are **contract claims** proven by existing STALE / propose / ship-rev / reproject rows in [P1-acceptance.md](P1-acceptance.md) — **not** extra feature work this week.

| Axis | Measure |
|------|---------|
| **wall-clock** | Elapsed time vs grep path. Not tokens as a proxy for time. |
| **context footprint** | Prompt/context tokens per Q. Far smaller than a whole-tree dump. GQL/`pin_map` slices. |
| **no silent drop** | Preserve ownership / usage / impact edges. Grep→LLM MAY omit. SysMLEdge MUST include `rev.sha` + `rev.stale=false`. |

P1 MUST NOT be declared won on feature count. Scoring: [P1-acceptance.md](P1-acceptance.md) row 9 (axes) and rows 3–8 / 10–11 (pains 3–5).

---

## MemNet engine (Elon hard review, 2026-09-11)

**Verdict: KEEP MemNet as sole SysMLEdge engine — NARROW the MemNet surface.** No dual-engine / Kuzu hedge. **Kill only if** the 2-week MemNet proof fails. **Stands.**

**Why narrow:** MemNet is session / mission / `pin_map` goldfish (catalog ≠ mission; serve + MCP MUST share TCP; empty `pin_map` / `session_not_found` known). SysMLEdge `rev.sha` / STALE / reproject / `gql_*` is a **product face on top** — not proven identical to the Path-B mission loop.

**One owner for `rev` / STALE:** **SysMLEdge**. MUST NOT invent first-class `rev` / STALE inside MemNet.

### Amendment — Memnetor fact sheet (2026-09-09 / 10)

Verified (do not relitigate):

| Fact | Status |
|------|--------|
| Tip Path-B + `pin_map` | **PASS** on `mn_b05a9869` TCP-shared. Nested e.g. `backgroundSetIndicator` needed **manual CREATE**. Impact **PARTIAL**. Path-B wall-clock **UNKNOWN**. |
| Serve + MCP | **PASS** with `MEMNET_MCP_TRANSPORT=tcp`, serve `:18765` / mcp `:18766`, **memnet-llm==0.19.8**. Pre-fix in-process → `session_not_found`. |
| Bounce | **PASS** on **0.19.8**. **FAIL** on **0.19.7**. **Floor = 0.19.8**. |
| `rev.sha` / STALE / reproject@SHA | **CONFIRMED ABSENT** on the MemNet wire — **SysMLEdge-to-build**. Without SysMLEdge owning the bind, STALE proof is **theater**. |
| Serve death | Loses in-process sessions without `session_save`. |
| Kuzu | **Not necessary** for tip `pin_map` / Path-B. |

**Proof env lock:** `memnet-llm==0.19.8` + **TCP-shared** MCP (`MEMNET_MCP_TRANSPORT=tcp`). Bounce is a **regression re-run once** in the 2-week window (not a new feature).

**Risks (re-ranked):**

1. **Contract bridge** — SysMLEdge must own `rev` / STALE / reproject@SHA (was risk #3; now #1).
2. Silent drop / **nested** fidelity (manual CREATE gap).
3. Version / ops floor: **0.19.8 + TCP**. Latency still **UNKNOWN** until timed (M5).

**2-week MemNet proof (ALL pass/fail, alongside Foam):** [P1-acceptance.md](P1-acceptance.md) M1–M5 (tightened below).

| Fail | Rule |
|------|------|
| **M1 or M2 fail** | MemNet **not ready** as sole engine. Stop Pro/beachhead. Keep as internal tool or fix fidelity. |
| **Dual-engine / Kuzu** | **No.** Kuzu is not necessary for tip Path-B. Dual-engine only if Memnetor becomes a **hard blocker** later. Default: **no Kuzu**. |

### NOT build (2 weeks) — MemNet surface

In addition to the NARROW product freeze:

1. Full KerML map
2. Kuzu / Cypher dual-engine
3. `snap_model` / PKG as mission SSOT
4. Multi-tenant / billing / ACL / InvenTree
5. Graph write-back as SSOT
6. Agent save
7. `pin_map` expand beyond Foam P1
8. Graph dumps as downloadable source
9. Autopilot / bot-merge
10. First-class `rev` / STALE inside MemNet (SysMLEdge owns the bind)
11. A **MemNet product roadmap** (engine features not required for M1–M5 / Foam fidelity)
12. **C rewrite now** (or Rust/other engine-form rewrite). Prove on **0.19.8 + TCP** first.

### Improve only (CEO Core, 2026-09-11)

**Lock:** MemNet work in this cut is **improve-only** for **M1–M5 / Foam fidelity**. It is **not** a MemNet roadmap. **No C rewrite now.** KEEP sole / NARROW / the NOT-build list above **stand**.

| Owner | Stays |
|-------|-------|
| **SysMLEdge** | `rev.sha` / STALE / reproject@SHA. Product face; bind is not on the MemNet wire. |
| **MemNet** | Engine at **memnet-llm==0.19.8 + TCP**. Do not fork a SysMLEdge MemNet line. Do not rewrite the engine in C/Rust/other in this cut. |

**Engine form:** prove on **memnet-llm==0.19.8 + TCP** first. Reopen C / Rust / other **only if** wall-clock **loses with numbers** after **fidelity is green** (M1–M2 / Foam gold). MUST NOT reopen on taste, “faster in C”, or before M5 is timed.

MUST NOT: add MemNet features beyond what M1–M5 / Foam fidelity require; put `rev` / STALE / reproject inside MemNet; dual-engine / Kuzu; treat this product as MemNet's backlog.

---

## Whole tree and mapping (Core 2026-09-11)

| Lock | Rule |
|------|------|
| **Whole tree always** | Import / save / download = **all** `.sysml` in the tree. Never parts-only SSOT. Projection may omit unmapped *kinds* from GQL; the zip/tree MUST still be the full tree. |
| **Mapping** | Every construct **that tree uses**. Not “parts/ports forever”. Not “full KerML in 2 weeks.” |
| **P1 gate** | **Foam-complete** projection (whatever Foam uses) + beat-grep / STALE / demo. **Not** whole-language coverage. Widen element kinds as later projects demand (`mapping.version` bump). |

**Head-to-head:** P1 axes = **wall-clock + context footprint + no silent drop** (pains 1–2). Pains 3–5 = existing contract rows, not extra features this week. [P1-acceptance.md](P1-acceptance.md).

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

**Competitor to beat on the P1 demo:** **grep** (git + SysML LSP). P1 is proven when GQL/MCP answers mapped structure **without** stuffing the `.sysml` tree into the agent — scored as **wall-clock + context footprint + no silent drop**.

**Product gate:** Foam proof ALL pass, **then** a second paid outsider. Foam is the first vertical; do not treat P2 as “done” until that second paid outsider exists.

**CEO review risk (do not look like another SysML editor):**

- Do not ship P2 human UI (SaaS editor / canvas-shaped surface) before P1 proves the query demo against grep.
- Foam Phase-1 hours stay on the Foam slice (import, project, GQL/MCP, STALE, propose, zip). Do not spend them on P2 UI.
- Freemium Pro ~US$19–29 is the desk wedge after Foam **and** after Foam proof; Team / defense PLM is not this cut.

**Expert reception:** own **not whole SysML** and **no canvas**. Pitch **beat grep, not MagicDraw**. MUST NOT chase Cameo.

**P1 stress tests** sit on the eight **contract** rows plus NARROW Foam proof 9–12 (not extra buyer-root rows): (a) beat a raw agent + git/grep; (b) STALE is real, not theater; (c) Foam desk demo beats a manifesto.

**Pitch:** `model@rev` is the API between humans and AGI builders.

**Endgame** (already locked; do not expand this cut): bilingual bus / **contract layer** — SysML locked by humans; agents build against `model@rev`. See [BUSINESS-PLAN.md](BUSINESS-PLAN.md#position--endgame). AGI copy is **not** a P1/Pro story until Foam proof passes.

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
| 7 | **Affordable** | Free to try; Pro ~US$19–29 / month if it sticks. Plan, not a live price list in this repo. **Gated** on Foam proof. |

**Derived (not roots):** GitHub-like PR UI, in-tenant teammates, autopilot — **P2**. MUST NOT treat them as buyer roots or as P1 scope.

### P1 must prove first

P1 proves roots **1, 2, 3, and 6** (trust, SSOT owner, beat-grep ask, ship rev) via the **eight contract rows**. Roots **4, 5, and 7** stay locked here; they MUST NOT add extra buyer-root rows. NARROW Foam proof **9–12** is the product wedge bar (not a ninth buyer-root row).

| Root | Existing P1 rows |
|------|------------------|
| 1 Trust | 1 Import (`rev.sha` bound), 3 STALE detect, 4 Reproject, 8 MCP bind `project@rev` |
| 2 SSOT owner | 5 Propose isolation, 8 no silent SSOT overwrite; 6 human save + history |
| 3 Beat-grep ask | 2 GQL read without stuffing the `.sysml` tree; Foam proof 9 (wall-clock + context footprint + no silent drop) |
| 6 Ship a rev | 6 previous SHA remains downloadable, 7 download = SysML zip only |

**Dirty ≠ STALE** stays in this sheet. P1 STALE rows prove projection drift; working-tree Dirty UI is not a P1 acceptance row.

---

## Stack

```text
SysML zip / sysml-models/ tree     author SSOT
        |  human Save (whole tree) → git commit
        v
MemNet one-way projection @ rev.sha     TCP backend (serve + MCP TCP-shared)
        |
        v
SysMLEdge MCP  streamable HTTP (Cursor Bearer)
  rev_status / gql_* / propose
```

| Layer | Lock |
|-------|------|
| **SSOT** | SysML zip or `sysml-models/` tree. Import/save/download = **all** `.sysml` in that tree. Never parts-only SSOT. Download = SysML zip @ rev only. |
| **Git / GitHub** | VCS backbone. Bind **project @ SHA**. SysMLEdge owns projection, STALE, and propose — not GitHub’s review UI. |
| **MemNet** | Projected index. **P1:** Foam-complete (kinds Foam uses). Later: widen as projects demand. **TCP backend-only** (`serve` + MCP TCP-shared). **No Kuzu**, no Cypher, no `graph.kuzu`. Not the agent-facing wedge once SysMLEdge MCP binds. |
| **GQL** | Query/represent what SysML already says at `rev.sha`. MUST NOT invent. |
| **MCP face** | **Streamable HTTP** with Cursor **Bearer**, same pattern as **memnet-pi**. Agents call **SysMLEdge MCP** (`rev_status` / `gql_*` / `propose`). |
| **STALE** | Projection `rev.sha` ≠ current SHA. Show it; refuse live-SSOT pretence. `staleOk` is read-only. |

Save **never** writes the graph. Save → auto-reproject → Live. Graph write-back is not a save.

This face lock does **not** reopen KEEP sole / NARROW / improve-only / **no C rewrite now**. SysMLEdge consumes MemNet as the projection engine; it does not replace it.

### Agent MCP vs MemNet (2026-09-11 Core)

| Surface | Role |
|---------|------|
| **SysMLEdge MCP** | Agent-facing wedge. Streamable HTTP, Cursor Bearer (memnet-pi pattern). Bind **project@rev**. Tools: `rev_status`, `gql_read` / `gql_context` / `gql_impact`, `propose` (P0 §4). |
| **MemNet** | Backend only: TCP `serve` plus MCP **TCP-shared** with that serve. One-way projection. Not the Cursor plugin target once SysMLEdge binds. |

**P1 proof** MAY still use MemNet `pin_map` for **M1–M4**. That is a proof path, not a second product MCP face.

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
| **Agent** | Cursor **MCP plugin** → **SysMLEdge MCP** streamable HTTP (Bearer). Bind **project@rev**. |
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
| Engine | MemNet; Kuzu rejected | Same; TCP backend-only; no C rewrite now | Unchanged. KEEP sole / NARROW / improve-only stand. |
| Agent MCP transport | Tool names; not Cypher / Kuzu worker | Streamable HTTP + Bearer (memnet-pi); MemNet TCP-shared is backend | **Clarify** P0 §4: product face is SysMLEdge MCP, not MemNet HTTP. |
| STALE / `staleOk` | Show; refuse pretence; `staleOk` read-only | Same + UI states Dirty ≠ STALE | P0 STALE rules stand. Dirty added as working-tree, not projection drift. |
| Agent SSOT write | Silent MCP save forbidden | Agent merge **banned**; no write-SSOT tool | Unchanged. |
| Human-auth MCP merge | Save is human UI/CLI; MCP `save` forbidden as **unattended** | Token + confirm → apply + Save + reproject | **Clarify** P0: unattended/agent save stays forbidden; human-auth merge is the human Save path on MCP. |
| Graphic IDE | Not specified | Explicit reject (SysON/Cameo) | Add to P0 reject list (does not weaken contracts). |
| Market pin | Not specified | Bilingual bus; beat grep on P1; Desk→Foam then Pro; not defense PLM yet | Plan/locks only. Does not add runtime or P2 UI. |
| ClickUp/InvenTree | Mapped when present in SysML | Not product features | **Clarify** P0 §5: projection of SysML attributes only. |
| SSOT shape | Whole-tree import/save/download | **All** `.sysml`; never parts-only SSOT | Align P0 §3. |
| Mapping | P0 seed listed part/port/connection as v1 | **P1 = Foam-complete**; not parts/ports forever; not full KerML in 2 weeks | **Supersede** a forever parts/ports cap. Elon freeze = 2-week anti-scope-creep only. |
| MemNet improve | Engine + Path-B | **Improve-only** M1–M5 / Foam fidelity; **0.19.8 + TCP**; **no C rewrite now**; SysMLEdge owns `rev`/STALE/reproject | Does **not** reopen KEEP sole / NARROW / NOT-build. Not a MemNet roadmap. Engine form (C/Rust/other) only after fidelity green **and** timed wall-clock loss. |

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
9. Shipping “bilingual bus” as a product without the Foam head-to-head (NARROW, Elon/Horcrux 2026-09-11).
10. Spending Foam Phase-1 hours on P2 UI, PR UI, Team ACL, billing, Cameo, ClickUp/InvenTree product, or **full KerML** in two weeks.
11. Parts-only SSOT (import/save/download of a subset of `.sysml` as “the model”).
12. Treating “parts/ports” as a forever mapping cap, or boiling the ocean (whole-language) in the two-week proof.
13. Declaring P1 won on **feature count** instead of **wall-clock + context footprint + no silent drop** vs tens-of-minutes grep.
14. Stuffing the whole SysML tree into the LLM prompt instead of GQL/`pin_map` slices.
15. Dual-engine / Kuzu hedge. Kuzu is **not necessary** for tip Path-B. Dual only if Memnetor becomes a documented hard blocker later.
16. Inventing first-class `rev` / STALE inside MemNet. SysMLEdge owns the bind. Treating STALE proof as pass without that bind is theater.
17. A MemNet **roadmap** from this product. MemNet improve-only for **M1–M5 / Foam fidelity**; engine stays **0.19.8 + TCP**.
18. A **C rewrite now** (or Rust/other engine-form rewrite) before **0.19.8 + TCP** proof. Reopen form only if wall-clock **loses with numbers** after fidelity is green.
19. Serving **MemNet** (TCP or its MCP) as the agent-facing wedge once SysMLEdge MCP binds.
20. Serving projects on SysMLEdge, or migrating other repos onto it, before Foam + MemNet proof **and** SysMLEdge MCP bind pass (**plan ≠ product**, CEO Core 2026-09-12). Until then MemNet tip only.
21. Treating NARROW dogfood as a second **real** in-house SysML desk (Elon Core 2026-09-12). Fixture tree = CI of import / bind / STALE / reproject / propose only.
22. Kill-theater (Elon Core 2026-09-12): Foam tip sold as SysMLEdge bind before `rev.sha`; agents/repos on MemNet mission sessions as `project@rev`; “almost P1” second-repo migrate on Path-B/`pin_map` only; P2 UI or multi-repo onboarding before timed head-to-head + gold fidelity; pin below **memnet-llm==0.19.8** or drop TCP share.
