# Agent rules — SysMLEdge

**Lock (g)** (CEO Core 2026-09-12): after a project is **uploaded**, SaaS runtime working SSOT is the **graph**. SysML is the **machine-kept full-fidelity mirror** @ rev (web UI + downloadable zip). Org invent of *new* domain models MAY still start as SysML **before** upload. GQL/LLM is **not** freeform invent-SSOT **(b)**. Typed machine ops ≡ SysML constructs (Jon).

## MUST

- Treat `sysml-models/` (or the SysML zip at a git SHA) as the **mirror** of `model@rev` — and as invent SSOT *before* upload.
- Read the bound graph as `graph = model @ <git commit SHA>`. If STALE, show it and refuse live-SSOT pretence (`staleOk` is read-only).
- Propose via `sysml-models/proposals/<id>/{PATCH.md, delta.sysml}` unless autopilot policy applies. Humans/policy apply; git keeps history. Graph mutate → **machines** rewrite the SysML mirror — **not LLM**.
- Use GQL to query/represent the bound model. Bounded reads; no full-tree dump as the only merge story.
- Hit **SysMLEdge MCP** (streamable HTTP, Cursor Bearer) for `rev_status` / `gql_*` / `propose`. MemNet is TCP backend-only once that face binds.

## MUST NOT

- Freeform LLM/GQL invent of the model, or serve MemNet/GQL dumps as downloadable source (download = SysML zip only).
- Use **Kuzu**, Cypher, or `graph.kuzu` in this product.
- Invent qnames, parts, ports, connections, or PLM ids that are not SysML constructs at `rev.sha` (Jon: ops ≡ constructs; else the graph invents beside the model).
- Silently overwrite `sysml-models/` as an agent. MCP has no silent save and **no agent write-SSOT tool** (agent merge banned).
- Claim P2 SaaS or P3 tenancy is shipping in this repository seed.
- Treat ClickUp or InvenTree as SysMLEdge features (ids in SysML may project; that is not a PLM product).
- Add a graphic SysML canvas or modeler.
- Widen **P1** to a dual-write editor. Foam proof still scores **projection fidelity + bind**.
- Reopen KEEP MemNet sole, M1 narrow (CON 124 + nested on `mn_0d4f6178` @ 0.19.9), or LIVE bind gates.
- Claim **(g)** proven or sell continuous same-session **(g)** until **(r)**. Mirror-lie **PASS** on dirty archive `mn_27ce8714` does **not** sell (g). **(g) is provisional.** MUST NOT claim `proof_pass`. **Lock (f) exact:** `mn_be03c1a9` @ `f6768b1108b20c15212f0895f41fb7a27b6a408d`. Dirty `mn_27ce8714` = honesty archive only. H2H on p1-tiny / `mn_be03c1a9` = **plumbing only** ([docs/proof/RUNLOG-2026-09-12-h2h-plumbing.md](docs/proof/RUNLOG-2026-09-12-h2h-plumbing.md)). CEO Core **narrow tip** (2026-09-12): tip must-win = context + no silent drop; tip wall = log only; [#31](https://github.com/chouswei/SysMLEdge/pull/31) wall FAIL does **not** block the tip claim. Tip ≠ Foam bind desk. Cut 1 settled (F1/F2/F3 none closed ~4×; ~400ms floor; Memnetor exact [docs/proof/RUNLOG-2026-09-12-cut1-tip-wall.md](docs/proof/RUNLOG-2026-09-12-cut1-tip-wall.md)). **Track B:** Foam bind ingest **GREEN** on `mn_c7b75f2c` @ `f4679d848ccab5b26875eb9d2812171bb759ebf1`. **CEO lock:** product H2H **FAIL**. Memnetor exact: `must_win_passed=false` (context **1/3**, no_drop **3/3**); wall **0/3 log-only**; must-win fail = **both BSI tips** context **F** (not wall). Invent next = **BSI context apparatus** **before** claim-narrow. [docs/proof/RUNLOG-2026-09-12-h2h-foam-bind.md](docs/proof/RUNLOG-2026-09-12-h2h-foam-bind.md). `proof_pass_claimed: false`. Do not reopen Neo4j.

Contracts: [docs/P0-contracts.md](docs/P0-contracts.md). Locks: [docs/PRODUCT-LOCKS.md](docs/PRODUCT-LOCKS.md) (CEO Core 2026-09-12 pinned features). Plan: [docs/PRODUCT-PLAN.md](docs/PRODUCT-PLAN.md).
