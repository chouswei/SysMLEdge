# P1 acceptance — Foam vertical slice

Pilot SoI: `chouswei/modelbasedPrj-itri-vedan-foam-detection` (`sysml-models/`).
Engine: **MemNet**. No Kuzu. No SaaS accounts (P1 = local project).

Normative contracts: [P0-contracts.md](P0-contracts.md). Product locks: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (**NARROW**, Elon/Horcrux 2026-09-11; **Sysmler KEEP / NARROW** + **CEO Core P1 gate** + **Edison Core experiment**, 2026-09-12). Living plan: [PRODUCT-PLAN.md](PRODUCT-PLAN.md). Business: [BUSINESS-PLAN.md](BUSINESS-PLAN.md).

This document is the P1 pass/fail sheet. It does not implement runtime.

### P1 gate (Edison + CEO Core 2026-09-12)

No scope widen. Source: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md#ceo-core-p1-gate-2026-09-12). **Cite:** Edison Core (Thomas Alva Edison / Horcrux) + CEO Core 2026-09-12.

**Sequence:** M1 fidelity → `rev` bind → timed H2H → cold non-Core.

**Pass only:** live `0.19.8`+TCP after bind; wall-clock + context vs same Foam Qs; fail-closed STALE; no silent drop.

**Kill theater:** fake CI, tip-as-bind, H2H before meters, H2H vs gold-200.

**Must-fix before Foam gold:** full-clone construct matrix; nested ingest without hand CREATE (or narrow the claim); timed H2H on 0.19.8+TCP after `rev` bind.

**Kill risks:** silent drop (`connections_parsed:0` / omitted files); tip Path-B sold as bind; full KerML in 2 weeks; shrink zip to parts-only.

**OK:** propose `delta.sysml` + human Save; narrow impact until proven; scaffold ≠ P1.

### Experiment sequence (Edison Core — Thomas Alva Edison / Horcrux 2026-09-12)

**KEEP / NARROW.** 2-week Foam (9–12 + M1–M5) is the right first cycle. Engine + story locks untouched. Scaffold ≠ P1. Source: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md#edison-core-experiment-thomas-alva-edison--horcrux-2026-09-12).

**Do not invert:**

1. **M1** gold fidelity (construct matrix + nested without hand-CREATE, **or** narrow) + **publish counts**
2. SysMLEdge `rev.sha` / STALE / reproject bind (**M2–M3**)
3. Timed H2H wall-clock + context on **0.19.8+TCP after bind** (**M5** / row **9**). Score the **narrow** claim (124 + nested ego); gold-200 stays out of the competitor story.
4. Then cold non-Core yes/no (**row 12**)

**Day-1 instruments:** env lock 0.19.8+TCP; M1 counts; bind existence (`rev.sha` + stale on structure read); STALE smoke (mutate → STALE → `propose` refused).

**Refuse:** P2 UI / canvas / IDE / Pro–Team–marketplace; full KerML; parts-only zip; dual-engine / Kuzu; C rewrite now; second desk; MemNet mission as `project@rev`; timing H2H before M1+bind; scaffold CI as gold; expand `pin_map` / impact before fidelity.

| Fail | Stop |
|------|------|
| Silent drop / nested hand-CREATE un-narrowed | Stop the wedge |
| No `rev` bind | STALE theater — stop the story |
| M1 or M2 fail | MemNet **not** a sole-engine claim |
| M5 loses with numbers **after** fidelity | Reopen engine **form** only then |
| Row 12 cold **no** | Kill Pro/beachhead |
| Hours on freeze list | Cut immediately |

Buyer roots **1, 2, 3, and 6** (trust, SSOT owner, beat-grep ask, ship rev) MUST pass via the **eight contract** rows below. Mapping: [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md). Do not add extra **buyer-root** rows. Foam proof **9–12** is the NARROW wedge bar, not a ninth buyer-root row. Roots 4, 5, and 7 are locks, not extra P1 tests.

## Must pass

| # | Name | Pass criteria |
|---|------|----------------|
| 1 | Import | Import Foam `sysml-models/` (dir or zip) = **all** `.sysml` in the tree. Never parts-only SSOT. `rev.sha` bound. MemNet is **Foam-complete** (every construct Foam uses — not parts/ports forever, not whole KerML). Nodes only from that tree. Previous graph nodes gone. |
| 2 | GQL read | Via SysMLEdge MCP `gql_read` (or equivalent): reachability, ownership, usage for a known Foam element **without** stuffing the full `.sysml` tree into the agent context. Answers include `rev.sha` and `rev.stale=false`. P1 proof MAY still use MemNet `pin_map` for M1–M4. |
| 3 | STALE detect | Change a SysML file on disk without reproject. Structure reads with default `staleOk=false` **fail** with `code: STALE`. With `staleOk=true`, read may succeed but MUST return `rev.stale=true`. `propose` while STALE **refused**. |
| 4 | Reproject | `reproject` from current SysML → new bind; STALE clears; live reads succeed. |
| 5 | Propose isolation | `propose` writes only under `sysml-models/proposals/<id>/` (`PATCH.md` + `delta.sysml`). Current mirror tree unchanged; no LLM/GQL dump as SSOT. P1 does **not** add a dual-write editor row. |
| 6 | Human save + history | Human whole-tree save → new `rev.sha`. Previous SHA remains **downloadable**. |
| 7 | Download shape | Download @ rev = **SysML zip only**. No MemNet/GQL/Kuzu export as “the model”. |
| 8 | MCP bind | Session binds **project@rev**. No MCP tool silently overwrites current SSOT. |

## Out of P1

- Website UI, user accounts, in-tenant ACL, GitHub-like PR review UI (P2)
- Multi-tenant / billing (P3)
- Edit-in-graph as a **P1** dual-write editor (SaaS lock **(g)** is published; P1 still scores **projection fidelity + bind** only)
- Everything on the NARROW freeze list in [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) (SaaS editor, PR UI, Team ACL, billing, Cameo, ClickUp/InvenTree product, **full KerML** in two weeks)
- Whole-language coverage (P1 = Foam-complete projection + beat-grep / STALE / demo only)

## Foam proof (2-week, ALL required) — NARROW 2026-09-11

Hard pass/fail. Cited from [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md), [PRODUCT-PLAN.md](PRODUCT-PLAN.md), [BUSINESS-PLAN.md](BUSINESS-PLAN.md). **Demand ALL four.** Contract rows 1–8 above remain; this section extends them. Evidence is a scripted log or a short recording — **no slides**. **Edison sequence:** row 9 only after M1 + `rev` bind; row 12 last.

**Claimed pains 1–5** ([PRODUCT-LOCKS.md](PRODUCT-LOCKS.md)): **1** grep latency; **2** big SysML + small LLM context / **context footprint** (GQL/`pin_map` slices); **3** STALE blindness / wrong rev; **4** chat-as-SSOT (no ship-rev zip, no propose-only trail); **5** mid-flight model change → re-entrant reproject. **Non-claims freeze:** canvas, PLM, ClickUp/InvenTree, Team ACL.

**P1 head-to-head** scores **wall-clock + context footprint + no silent drop** (pains 1–2). **CEO+Elon Core (verbatim):** Timed H2H must score the **narrow** claim (124 + nested ego) — gold-200 stays out of the competitor story. Pains **3–5** are proven by STALE / propose / ship-rev / reproject rows below — **not** extra feature work this week.

### Row 9 — score all three axes

Same operator. Three fixed Foam questions: **usage / ownership / impact**.

| Arm | Path |
|-----|------|
| **A (competitor)** | raw Cursor + git + grep/LSP → LLM. Pain #1: **tens of minutes**. Pain #2: **big SysML + small LLM context** → truncate / **silent drop**. |
| **B** | SysMLEdge: agents query **slices** via **GQL/`pin_map`** over the full projected graph. MUST NOT stuff the tree. |

| Axis | Pass for SysMLEdge |
|------|---------------------|
| **wall-clock** | Faster than Arm A on each of the three Qs. Log elapsed time (not tokens as a proxy for time). |
| **context footprint** | Log prompt/context tokens used to answer each Q. SysMLEdge MUST be **far smaller** than a **whole-tree dump** of Foam `.sysml`, and smaller than Arm A. GQL/`pin_map` slices only. |
| **no silent drop** | GQL answers **preserve the narrow claim** (LIVE CON **124** + nested qname ego). Arm A MAY omit via truncate/silent drop; score the drop. SysMLEdge answers MUST carry `rev.sha` + `rev.stale=false`. Gold-200 stays **out** of the competitor story. |

Log wall-clock, **context footprint** (prompt tokens per Q + whole-tree-dump baseline), **no silent drop** notes (narrow edges kept vs dropped), `rev.sha` / `rev.stale`. Feature count is **not** a win. MUST NOT treat parser gold **200** as the H2H bar.

| # | Name | Pass criteria |
|---|------|----------------|
| 9 | Head-to-head | **wall-clock + context footprint + no silent drop** on the three Foam Qs, scoring the **narrow** claim (124 + nested ego). Competitor = tens-of-minutes grep, not Cameo, **not** gold-200. Context footprint **far smaller** than whole-tree dump. |
| 10 | STALE not theater | **Pain 3 + 5:** mutate SysML on disk → structure read fails `code: STALE` → `propose` refused → `reproject` clears → live reads work. Scripted log or short recording. No extra feature work this week. |
| 11 | Propose + ship rev | **Pain 4:** `propose` only under `proposals/<id>/`; current mirror unchanged; human save → new SHA; prior SHA zip downloadable; download = SysML zip only. **All eight** rows above green on Foam MemNet. |
| 12 | Non-Core operator | One operator **not** from Core runs the demo **cold**. Keep using this vs grep? **Yes/no + why.** If **no**, narrow further or **kill** the wedge claim. |

### Fail / pass (product)

| Outcome | Product rule |
|---------|--------------|
| **Fail** (any of 9–12) | Kill the Pro/beachhead story for now. Keep docs as a contract sketch or fold into MemNet tooling. MUST NOT ship “bilingual bus” as a product without the head-to-head. |
| **Pass** (all of 9–12) | KEEP narrowed — Foam vertical + MCP marketplace path. Price/experiment only after a **second paid outsider**. P2 UI still gated. |

## MemNet proof (2-week, ALL required) — Elon 2026-09-11

**Alongside Foam.** KEEP MemNet as sole engine; **NARROW** the surface. No Kuzu hedge. **Kill only if** this proof fails. Amendment (Memnetor 2026-09-09/10): [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md#memnet-engine-elon-hard-review-2026-09-11). **Sequence:** Edison Core — M1 before bind; timed H2H (M5 / row 9) only after M1+bind; row 12 last. MUST NOT invert.

**Proof env:** `memnet-llm==0.19.8` + TCP-shared MCP (`MEMNET_MCP_TRANSPORT=tcp`, serve `:18765` / mcp `:18766`). UNKNOWN on a required field = **fail that line**.

**Impact claim:** **OK** to **narrow impact until proven**. MUST NOT claim exhaustive impact until measured. Either prove `gql_impact` **closure** on Foam gold, **or** narrow the P1 win to neighbourhood / tip + **usage** cues. [CEO Core P1 gate](PRODUCT-LOCKS.md#ceo-core-p1-gate-2026-09-12).

| # | Name | Pass criteria |
|---|------|----------------|
| **M1** | Gold fidelity (narrow) | **Published** (Core GO 2026-09-12; advisors Jon/Edison/Steve/Elon + CEO prefer **narrow+counts**). Path-B LIVE `mn_0d4f6178` @ **memnet-llm==0.19.9+TCP**. CON find \|Q\|=**124** (**29** `connection_def` + **95** `connectionUsage`) — ingest alone, **no** owns mutate. Nested: both `backgroundSetIndicator` gold qnames close via SysML `qname=` `pin_map` + `contains` (Truncation=false on tip ego). TSK-only ego = **wrong cue** (not claimed). Parser gold `connections_parsed` **200** = **reference only**, **not** the M1 fail bar. MUST NOT invent CON to chase 200. [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego ≠ pass; this publish is the LIVE narrow. **LIVE-bind gate cleared** — next Edison step = LIVE bind. `proof_pass_claimed` for full P1 remains **false** until bind + H2H + cold. Kill: silent drop (`connections_parsed:0` / omitted files). Zero extras not in SysML. |
| **M2** | Query slice | Same 3 Foam Qs via `pin_map` and/or `gql_*`. **SysMLEdge** binds `rev.sha` + `rev.stale=false` (absent on MemNet wire). **UNKNOWN = fail that line.** Impact: closure on gold **or** narrowed neighbourhood/usage (see above). |
| **M3** | STALE/reproject | **SysMLEdge-owned** bind. Mutate → fail-closed → `propose` refused → `reproject` → live. Timed / scripted. MUST NOT invent first-class STALE inside MemNet. Theater if bind is missing. |
| **M4** | Bounce regression | **Re-run once** in the 2-week window on **0.19.8** TCP-shared: `session_save` → restart **serve + MCP together** → load → gold `pin_map` **non-empty**. Record memnet-llm version. **Fail if** MCP `session_list` ≠ serve. Known: **FAIL on 0.19.7**. Serve death without `session_save` loses in-process sessions. |
| **M5** | Wall-clock + context vs grep | **Must-fix:** timed H2H on **0.19.8+TCP** after `rev` bind. Same 3 Qs vs grep/LSP. **MUST time wall-clock** (Path-B UNKNOWN until timed). Also **context footprint**. **CEO+Elon Core (verbatim):** Timed H2H must score the **narrow** claim (124 + nested ego) — gold-200 stays out of the competitor story. Kill: tip Path-B sold as bind; H2H vs gold-200. May share logs with row 9. |

| Outcome | Engine / product rule |
|---------|------------------------|
| **M1 or M2 fail** | MemNet **not ready** as sole engine. Stop Pro/beachhead. Keep as internal tool or fix fidelity. **No Kuzu.** |
| **M3–M5 fail** | Same: do not ship bilingual bus as a product on an unproven MemNet path. |
| **All M1–M5 pass** | KEEP MemNet sole engine, **narrowed** surface. Foam proof 9–12 still required for the wedge. |

**NOT this week:** full KerML map; Kuzu/Cypher dual; `snap_model`/PKG as mission SSOT; multi-tenant/billing/ACL/InvenTree; LLM/GQL freeform write-back **(b)**; P1 dual-write editor; agent save; `pin_map` expand beyond Foam P1; graph dumps as downloadable source; autopilot/bot-merge; first-class `rev`/STALE inside MemNet.

## Done when

- **Contract:** all eight rows (1–8) pass on the Foam pilot tree with MemNet + MCP (or CLI stand-in for the same contracts). P1 = Foam-complete + these rows — **not** whole-language coverage.
- **Wedge:** all four Foam proof items (9–12) pass (NARROW fail/pass unchanged).
- **Engine:** all five MemNet proof items (M1–M5) pass. Until then MemNet is KEEP/NARROW, not a dual-engine hedge.
- **Not done:** scaffold ≠ P1 ([#11](https://github.com/chouswei/SysMLEdge/pull/11) / [#12](https://github.com/chouswei/SysMLEdge/pull/12)). [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego ≠ pass. M1 LIVE-bind gate **cleared** by published Path-B narrow+counts; full P1 still **false** until bind + H2H + cold. Edison: do not invert M1 → bind → H2H → row 12.
