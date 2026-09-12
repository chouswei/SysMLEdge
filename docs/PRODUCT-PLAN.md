# SysMLEdge product plan

Living plan. **Locks (2026-09-11):** [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) — **NARROW** (Elon / Horcrux). **P0 behaviour:** [P0-contracts.md](P0-contracts.md). **P1 pass/fail + Foam proof:** [P1-acceptance.md](P1-acceptance.md). **Business (GTM / beachhead / buyer roots, gated):** [BUSINESS-PLAN.md](BUSINESS-PLAN.md).

This repository seed does **not** implement P2/P3. P1 **runtime first cut** (fixture + bind + MCP) lives in-tree; Foam proof is not claimed. `proof_pass_claimed: false`. **(g) is provisional.**

**CEO Core 2026-09-12 pinned features** (verbatim sense; locks: [PRODUCT-LOCKS.md — pinned features (v1)](PRODUCT-LOCKS.md#ceo-core--pinned-features-v1-2026-09-12)):

1. Upload/bind SysML tree @ `rev` + STALE fail-closed
2. GQL/MCP ask (no stuff/grep) — **narrow M1 claim** (`mn_0d4f6178` CON \|Q\|=**124** + nested; **not** gold 200; **not** p1-tiny)
3. Propose `delta.sysml` → Save/reproject (agents)
4. **(g) provisional:** typed SysML ops → bit-true zip @ rev (mirror-lie = kill). Mirror-lie meter on dirty archive `mn_27ce8714`: **PASS**. MUST NOT sell (g) as proven. MUST NOT sell continuous same-session **(g)** until **(r)**.
5. Streamable-HTTP MCP; MemNet sole backend

**Invent status:** mirror-lie **PASS** on dirty archive `mn_27ce8714` (InventProbe; gold parts **11→13**, ports **12→13**; zip≡disk; append 56→116). **Lock (f) exact:** `mn_be03c1a9` @ `f6768b1108b20c15212f0895f41fb7a27b6a408d`. **(r)** deferred. MUST NOT sell continuous same-session **(g)** until **(r)**. H2H on p1-tiny / `mn_be03c1a9` = **plumbing only** ([proof/RUNLOG-2026-09-12-h2h-plumbing.md](proof/RUNLOG-2026-09-12-h2h-plumbing.md)). **CEO Core narrow tip (2026-09-12):** tip must-win = context + no silent drop; tip wall = **log only**. [#31](https://github.com/chouswei/SysMLEdge/pull/31) must-win **PASS** / wall **FAIL** **0/3** (A **307.745ms/23604B** · B **1286.676ms/19042B**) = honesty under the old tip-wall axis — **does not block the tip claim**. Cut 1 settled: F1/F2/F3 none closed ~4×; ~400ms floor constant. **Track B unlocked.** Product bind H2H still logs wall as **P/F**. MUST NOT reopen Neo4j. [proof/RUNLOG-2026-09-12-h2h-foam-tip.md](proof/RUNLOG-2026-09-12-h2h-foam-tip.md) [proof/RUNLOG-2026-09-12-cut1-tip-wall.md](proof/RUNLOG-2026-09-12-cut1-tip-wall.md). `proof_pass_claimed` stays **false** until Foam SysMLEdge bind H2H + cold unless Core re-locks P1 desk to tiny. p1-tiny **no M1 claim**. don’t-migrate / no Pro until cold Foam. KEEP MemNet sole. Do not reopen Neo4j.

**Out:** canvas, Neo4j, ClickUp/InvenTree as product, P2 ACL/PR UI, Pro pitch until cold Foam.

**CEO Core:** [#11](https://github.com/chouswei/SysMLEdge/pull/11) = scaffold only — **fake CI ≠ P1 pass**. Gate remains **live Foam M1–M5 + beat-grep** on **memnet-llm==0.19.8+TCP**.

**Position:** bilingual bus for textual SysML v2 + agents (two faces at `model@rev`; after upload lock **(g)** — graph is live working SSOT, SysML is the machine-kept mirror — **provisional**, MUST NOT sell as proven). Not SysON/Cameo/graphic IDE. Not a GitHub clone. Not defense PLM yet. **Market pin (Steve):** beat grep / ghost trees for textual SysML v2 + Cursor — not Cameo/SysON. Sell that only; leave **(g)** out of the beachhead pitch. Pin: [PRODUCT-LOCKS.md — Market position](PRODUCT-LOCKS.md#market-position-pin).

**Core (lock g, 2026-09-12):** name **SysMLEdge**; bilingual = ask/propose GQL + author/view SysML mirror @ one `model@rev`; after upload, **working SSOT = graph**, SysML = machine-kept full-fidelity mirror (whole tree / zip, **all** `.sysml`); org SysML-first still applies **before** upload; MemNet = graph engine (**no Kuzu**; TCP backend-only; no C rewrite now); agent MCP face = **streamable HTTP** (Cursor Bearer, memnet-pi pattern); `graph = model @ SHA`; GQL/LLM never freeform-invents **(b)**; typed machine ops ≡ SysML constructs (Jon); agents propose only unless autopilot (no agent write-SSOT tool); download = SysML zip only; P1 mapping = Foam-complete **(projection fidelity + bind — not a dual-write editor)**; pilot SoI = `chouswei/modelbasedPrj-itri-vedan-foam-detection`.

**NARROW (2026-09-11):** keep the Foam contract slice (bilingual bus). Freeze P2 spend until Foam proof **ALL** pass. Pro / Team / SaaS editor / AGI-as-product copy stay gated. Docs discipline ≠ product-market proof. Foam Phase-1 hours on P2 UI = kill signal.

---

## Phases

| Phase | Name | This repo | Intent |
|-------|------|-----------|--------|
| **P0** | Contracts | **Docs done** | Normative sheet so implementers do not rebuild a Kuzu indexer. |
| **P1** | Foam slice | Runtime first cut + **Foam proof scaffolding**. **[#11](https://github.com/chouswei/SysMLEdge/pull/11) = scaffold only — fake CI ≠ P1 pass.** Gate = live Foam M1–M5 + beat-grep on memnet-llm==0.19.8+TCP. **Proof not executed / not passed.** | Contract rows 1–8 plus Foam proof 9–12 **and** MemNet proof M1–M5. ALL required. |
| **P2** | Single-tenant SaaS | Plan only. **Spend frozen** until Foam proof passes. | Hosted on the **existing droplet (Devicor)**. Identity, import/save/download, MemNet per project, MCP, in-tenant ACL, Save/STALE UI, optional autopilot/bot review (default off). **InvenTree on that host: untouched.** |
| **P3** | Tenancy | Plan only | Cross-tenant isolation, authz, billing-shaped tenancy. Not implied by P2. |

**P1 competitor to beat:** **grep** (git + SysML LSP) / ghost trees — not MagicDraw/Cameo/SysON. Do not pitch **(g)** until meters.

**Product gate:** Foam proof ALL pass, **then** a second paid outsider. Until then: no Pro/beachhead story as shipping intent.

**P2 freeze (explicit):** **Non-claims freeze:** canvas, PLM, ClickUp/InvenTree, Team ACL. Also: SaaS editor, PR UI, billing, Cameo, **full KerML**. Mapping in that window is **Foam-complete**. SysML **mirror** is **whole tree always**.

**Pitch:** `model@rev` is the API between humans and AGI builders. Endgame (already locked): bilingual bus / contract layer — [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md#market-position-pin). Do not expand that scope here. AGI copy stays gated until Foam proof.

---

## P0 — Contracts

- [x] Product README (MemNet-only, lineage to codebase-sysmledgraph).
- [x] This living plan.
- [x] [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (2026-09-11, NARROW).
- [x] [BUSINESS-PLAN.md](BUSINESS-PLAN.md) (Pro/beachhead gated on Foam proof).
- [x] [P0-contracts.md](P0-contracts.md): rev identity, STALE, whole-tree import/save/download, MCP, Foam-complete mapping, proposal path, reject list.
- [x] [AGENTS.md](../AGENTS.md).
- [x] Runtime MCP/CLI first cut (fixture + fake MemNet). Foam proof still outstanding.

---

## P1 — Foam slice

Pilot: **https://github.com/chouswei/modelbasedPrj-itri-vedan-foam-detection** (`sysml-models/` as the SysML **mirror** / invent tree before upload).

Acceptance (authoritative eight **contract** rows **plus** Foam proof 9–12): [P1-acceptance.md](P1-acceptance.md). Buyer roots **1, 2, 3, and 6** via the eight contract rows (no extra buyer-root rows).

Must prove (same as that sheet; not ClickUp/InvenTree product):

1. Import zip or clone tree → bind `graph = model @ SHA`. Import/save/download = **all** `.sysml`. Never parts-only SSOT.
2. MemNet **Foam-complete** (every construct Foam uses). Widen kinds later as projects demand. Ids only if already in SysML.
3. STALE shown and live-SSOT pretence refused; `staleOk` read-only. Dirty ≠ STALE.
4. MCP `gql_read` / context / impact; `propose` → `sysml-models/proposals/<id>/`.
5. Human save overwrites current; download SysML zip @ rev; never download the graph.
6. MCP session binds **project@rev**; no silent SSOT overwrite.

P1 stress tests: (a) beat a raw agent + git/grep; (b) STALE is real, not theater; (c) Foam desk demo > manifesto. Own **not whole SysML / no canvas**; do not chase Cameo.

Out of P1: SaaS accounts, in-tenant ACL, graphic canvas, autopilot UI, GitHub-like PR review UI, Kuzu, Neo4j, **whole-language** KerML, ClickUp/InvenTree features, Pro pitch until cold Foam. **(g)** is not a P1 pass (mirror-lie **PASS** ≠ proven).

**Foam + MemNet proof (ALL, 2-week):** **Pains 1–5** and MemNet KEEP/NARROW + Memnetor amendment in [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md). Proof env: **memnet-llm==0.19.8** + TCP-shared MCP. SysMLEdge **owns** `rev`/STALE (absent on MemNet wire). Mirror-lie **PASS** on dirty archive `mn_27ce8714` (append honesty); **lock (f)** exact = `mn_be03c1a9` @ `f6768b1108b20c15212f0895f41fb7a27b6a408d`; **(r)** deferred. MUST NOT sell continuous same-session **(g)** until **(r)**. Head-to-head **must time wall-clock** + **context footprint** on the **Foam** narrow claim (`mn_0d4f6178` CON **124** + nested). H2H on p1-tiny / `mn_be03c1a9` = **plumbing only**. Gold MUST include ≥1 nested part that today needs manual CREATE. Impact: `gql_impact` closure **or** narrow to neighbourhood/tip + usage. Bounce = one regression re-run. **Non-claims freeze:** canvas, PLM, ClickUp/InvenTree, Team ACL. **No Kuzu. No Neo4j.** **CEO Core (2026-09-11):** MemNet **improve-only** for M1–M5 / Foam fidelity — not a MemNet roadmap. **No C rewrite now**; reopen C/Rust/other only if wall-clock loses with numbers after fidelity is green. **(g) provisional**; `proof_pass_claimed: false`.

---

## Day loop (all later phases)

```text
before upload:  invent SysML → upload
SaaS runtime:   typed op → graph mutate → machine rewrite mirror → (propose | zip @ rev)
P1 this week:   import SysML → bind → MCP ask → (propose) → reproject
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

1. Solo / lead MBSE engineer (textual SysML v2 + Cursor; desk 2–5; buyer of the seven roots).
2. Cursor / MCP agents (read + propose).
3. Later: in-tenant teammates (P2 ACL).

---

## Lineage vs this plan

[codebase-sysmledgraph](https://github.com/chouswei/codebase-sysmledgraph) planned Modelbase publisher + codebase Subscriber around **one Kuzu file** and a TCP worker. SysMLEdge replaces that with **MemNet projection per saved rev** and human-gated whole-tree SSOT. Do not carry Kuzu lock/worker phases into this product. Do not carry a graphic IDE or a GitHub clone.
