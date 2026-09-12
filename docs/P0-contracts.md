# P0 contracts — SysMLEdge

This sheet is the first implementable deliverable. Implement against these names and behaviours. Engine is **MemNet**. **Kuzu is rejected.**

**Bilingual** = two faces at `model@rev` (ask/propose GQL + author/view SysML mirror). After upload, lock **(g)**: working SSOT = graph; SysML = machine-kept full-fidelity mirror. Org SysML-first still applies **before** upload. Not a zh/EN UI contract.

Pilot system of interest (P1, not this seed): `chouswei/modelbasedPrj-itri-vedan-foam-detection`.

Product locks (position, market pin, no graphic, day loop, merge/autopilot, faces, freemium): [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) as of **2026-09-12** lock **(g)**. Where that sheet clarifies this file, wording below is aligned; MemNet, STALE, and **no agent / LLM freeform SSOT write** are not weakened.

---

## 1. Revision identity

**Invariant:** `graph = model @ <git commit SHA>`.

| Field | Rule |
|-------|------|
| **Current tree** | The saved SysML tree under `sysml-models/` (zip import unpacks to that layout). Git records every accepted human save. |
| **Bound SHA** | After a successful **import**, **human save**, or **reproject**, the MemNet projection stores `rev.sha` = full git commit SHA of that tree. |
| **Short form** | UI/MCP MAY show 7–12 hex chars; APIs MUST return the full SHA. |
| **Equality** | A GQL answer is live-SSOT only when `rev.sha` equals the SHA of **current** (HEAD of the stored model repo / project rev). |

Every read that returns structure MUST include:

```text
rev.sha:    <40-char git SHA>
rev.stale:  true | false
```

If the projection cannot name a SHA, the read MUST fail closed (do not serve an unbound graph as the model).

---

## 2. STALE behaviour

**STALE** means the MemNet projection’s `rev.sha` does not equal the SHA of **current**.

| Actor | MUST |
|-------|------|
| Any surface (MCP, CLI, future UI) | **Show** STALE. Do not hide it in a footnote only. |
| Live-SSOT pretence | **Refuse.** Do not present STALE GQL as “the current model”, “HEAD”, or “what is saved”. |
| Writes to current SSOT | **Refuse** while STALE (import/save/reproject first, or the client must target the bound rev explicitly as historical). |
| `staleOk` | Optional flag on **read-only** GQL. When `staleOk=true` and STALE, return the bound-rev projection **and** `rev.stale=true`. Default `staleOk=false`: read of structure **fails** with a STALE error (still include `rev.sha`). |
| `staleOk` + propose | **Refuse.** Proposals MUST be against a non-STALE current, or the proposal MUST declare `base.sha` and is invalid until a human rebases. |

**STALE error (normative shape):**

```text
code: STALE
rev.sha: <bound>
current.sha: <current or unknown>
hint: reproject from current SysML, or read with staleOk=true (read-only)
```

---

## 3. Whole-tree import, save, download

SSOT operations after upload treat the **graph** as live working truth **(g)** and the SysML tree as the **full-fidelity mirror**. Import / save / download of the mirror = **all** `.sysml`. **Never** parts-only. Agents do not merge by dumping GQL. P1 still scores Foam-complete **projection** (it MUST NOT shrink the zip). P1 MUST NOT ship a dual-write editor.

### 3.1 Layout

Canonical on-disk **SysML mirror** (invent SSOT *before* upload):

```text
sysml-models/          # multi-file SysML v2 tree (mirror @ rev; invent tree before upload)
sysml-models/proposals/<id>/   # optional agent proposals (not applied until human/policy)
```

Zip import/export is that tree (see 3.4). `proposals/` MAY be omitted from a “source zip” download of a published rev; if included, it is labelled proposal material, not SSOT.

### 3.2 Import

| Rule | |
|------|--|
| Input | SysML zip **or** a `sysml-models/` directory tree. |
| Effect | **Overwrite current** with the imported tree. Create a git commit. Bind MemNet to that commit SHA. |
| Graph | Rebuild projection from the new tree. GQL MUST NOT keep nodes from the previous tree. |
| Fail | Invalid zip / missing SysML → no partial current. Previous current remains; previous `rev.sha` unchanged. |

### 3.3 Human save

| Rule | |
|------|--|
| Who | Human (UI/files/CLI with explicit save). **Agent merge is banned.** MCP MUST NOT call this silently or as an unattended agent tool. |
| Human-auth MCP merge | Allowed: human **token + confirm** → apply a proposal onto current + Save + reproject. Same effect as human Save. Not an agent tool. |
| Effect | **Whole-tree overwrite of current** from the working SysML tree the human accepted. Git keeps **revision history** (previous SHAs remain downloadable). |
| Graph | **Save never dumps GQL.** P1: after commit, **auto-reproject** MemNet from the imported SysML (Live). SaaS lock **(g):** typed machine ops mutate the live graph; machines rewrite this mirror. |
| STALE | Merge is blocked while STALE until **reproject** succeeds. Dirty working tree ≠ STALE (see [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md)). |
| Agents | A proposal is not saved until a human applies it (files/SaaS Save, or human-auth MCP merge). There is no agent write-SSOT tool. |

### 3.4 Download @ rev

| Rule | |
|------|--|
| Input | `rev` = git SHA (or `current`). |
| Output | **SysML zip only** of `sysml-models/` at that rev (SSOT files). |
| Forbidden | Serving MemNet snapshots, GQL dumps, or Kuzu/Cypher exports as “the model”. |

---

## 4. MCP tool surface (agents)

Resume the *roles* from [codebase-sysmledgraph](https://github.com/chouswei/codebase-sysmledgraph) MCP (`query` / `context` / `impact` / list indexed / map) — **not** Cypher, **not** `indexDbGraph` writing Kuzu, **not** a TCP worker for a Kuzu file lock.

**Transport (2026-09-11 Core):** the agent-facing **SysMLEdge MCP** is **streamable HTTP** with Cursor **Bearer**, same pattern as **memnet-pi**. Agents call this face for `rev_status` / `gql_*` / `propose` (and the rest of §4.1). **MemNet** is **TCP backend-only** (`serve` + MCP TCP-shared). Once SysMLEdge MCP binds, MemNet is not the Cursor plugin wedge. This does **not** reopen KEEP sole / NARROW / improve-only / **no C rewrite now**.

**P1 proof** MAY still use MemNet `pin_map` for **M1–M4**. That is not the product agent face.

Query language is **GQL** against MemNet (cue → neighbourhood / find). GQL NEVER invents structure: every node/edge in a successful read MUST be projectable from SysML at `rev.sha` (mapping in §5).

### 4.1 Required tools (P0 names)

| Tool | Mutates SSOT? | Behaviour |
|------|----------------|-----------|
| `rev_status` | No | Return `current.sha`, `rev.sha`, `rev.stale`. |
| `gql_read` | No | Bounded GQL read. Requires `staleOk=true` when STALE, else STALE error. |
| `gql_context` | No | Neighbourhood of one qname/path (mapped Foam kinds). Same STALE rules. |
| `gql_impact` | No | Upstream/downstream along mapped connections / relations Foam uses. Same STALE rules. |
| `list_scope` | No | Indexed project roots / package qnames in the bound projection. |
| `propose` | No (SSOT) | Write **only** under `sysml-models/proposals/<id>/`. See §6. |
| `reproject` | No (agent SSOT) | P1: rebuild MemNet from **current** SysML. SaaS **(g)** also regenerates the SysML mirror from the graph (machines, not LLM). Agents MAY request; MUST NOT treat a GQL dump as the zip. |

### 4.2 Forbidden on MCP

| Forbidden | Why |
|-----------|-----|
| Silent overwrite of `sysml-models/` SSOT files | Human save (including human-auth MCP merge with token+confirm) is the only SSOT write path. **No agent write-SSOT tool.** |
| `save` / `import` / `download` as unattended **agent** tools | Those are human/operator APIs (CLI/UI/SaaS). Human-auth MCP merge is the human Save path, not an agent merge. |
| Agent-owned merge / apply of `delta.sysml` onto current | Agent path is read → draft → `propose` only. |
| Graph dump as downloadable source | Download = SysML zip @ rev only. Working SSOT after upload is the graph **(g)**; the zip is the regenerable mirror. |
| Unbounded full-tree dump as the **only** merge **or query** story | Agents propose deltas (§6). GQL/MCP reads are **bounded** (prompt tokens far below whole-tree dump). Humans save the whole mirror. |
| Cypher / Kuzu / `graph.kuzu` | Engine is MemNet. |
| `mutate` of MemNet that adds structure not a SysML construct | **Jon:** typed ops ≡ SysML constructs. GQL/LLM MUST NOT invent **(b)**. |
| MemNet as the agent MCP face after SysMLEdge binds | MemNet stays TCP-shared backend; agents hit SysMLEdge streamable HTTP. |

`rename` in the old package was dry-run preview. SysMLEdge: rename is a **proposal** (`delta.sysml` + `PATCH.md`), not a graph edit.

### 4.3 CLI (pattern, not Kuzu)

| Command (planned) | Maps from sysmledgraph | SysMLEdge |
|-------------------|------------------------|-----------|
| `sysmledge project <path>` | `analyze` / path index | Project `sysml-models/` into MemNet; bind SHA |
| `sysmledge status` | freshness / list | SHA + STALE |
| `sysmledge list` | `list` | Scope qnames/paths |
| `sysmledge import <zip>` | (new) | Whole-tree import |
| `sysmledge save` | (new) | Human whole-tree overwrite + commit |
| `sysmledge download [--rev SHA]` | (new) | SysML zip @ rev |
| *(no Kuzu worker)* | `worker start/stop` | Not applicable |

---

## 5. Mapping scope

After upload, **working SSOT** is the bound **graph** **(g)**. Mapping is what MemNet/GQL **indexes**. The **mirror** is always the whole `.sysml` tree (see §3).

| Gate | Rule |
|------|------|
| **P1** | **Foam-complete:** project every construct **Foam uses**. Not whole-language / full KerML. |
| **Later** | Widen element kinds as projects demand. Bump `mapping.version` on the projection. |
| **Not** | “Parts/ports forever.” That Elon freeze was 2-week anti-scope-creep only ([PRODUCT-LOCKS.md](PRODUCT-LOCKS.md)). |
| **Not** | Full KerML in two weeks. |

Baseline kinds Foam (and typical trees) already use — **minimum**, not a cap:

| SysML | Graph | Locators (stable) |
|-------|-------|-------------------|
| `part` (definition/usage as in the tree) | node | `qname=`, `path=` (file in `sysml-models/`) |
| `port` | node | `qname=`, `path=`, owning part |
| `connection` | edge | endpoints = ports (or connected parts if the SysML says so) |
| `partNumber` | property on part | string as written in SysML; MUST NOT fabricate |
| ClickUp id | property when present in SysML | e.g. `clickUp=` / documented attribute name in the model |
| Inventree id | property when present in SysML | e.g. `inventree=` / documented attribute name in the model |

Plus **whatever else Foam’s tree uses**. GQL MUST NOT invent kinds or ids absent from SysML at `rev.sha`. Unmapped SysML (kinds not yet in `mapping.version`) remains in the zip/tree only — the download is still the **full** tree.

Unknown ClickUp/Inventree ids: **omit**. Do not invent placeholders.

**Not product features:** SysMLEdge does not ship ClickUp or InvenTree (no sync, no PLM UI). Those id rows are SSOT fidelity when the strings already exist in SysML. P2 on the Devicor droplet MUST leave InvenTree **untouched**.

MemNet ingest (when implemented) MUST use path-B SysML ingest with `qname=` / `path=` locators and MUST NOT mint client `NEW` ids as SSOT identity. Identity of structure is the SysML qname + file path + `rev.sha`.

---

## 6. Agent proposal path (optional before human save)

Agents **propose**; they do not save.

```text
sysml-models/proposals/<id>/
  PATCH.md      # human-readable intent, base.sha, affected qnames
  delta.sysml   # SysML delta the human can apply; not a graph patch
```

| Rule | |
|------|--|
| `<id>` | Opaque proposal id (UUID or `prop-<utc>-<n>`). |
| `PATCH.md` | MUST include `base.sha` (current SHA when proposed). If current moves, proposal is **invalid** until regenerated or explicitly rebased by a human. |
| `delta.sysml` | SysML text only. MUST NOT be GQL, Cypher, or a MemNet snapshot. |
| SSOT | Files outside `proposals/` change only on **human save** (whole-tree overwrite). |
| MCP `propose` | Creates/updates this directory. Returns the path + `base.sha`. |

Human apply: merge `delta.sysml` into the tree (human/tooling or **human-auth MCP merge** with token+confirm), then **save** (commit + auto-reproject). There is no “apply freeform GQL as invent-SSOT” **(b)**. Typed machine ops only. Agents MUST NOT apply. Optional P2 **autopilot** (default off) and **bot review** (default off) are product locks, not P0 runtime — see [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md).

---

## 7. Reject list (explicit)

Implementations MUST reject:

1. **LLM/GQL freeform write-back as SSOT (b)** — only **typed machine ops** mutate the live graph; machines rewrite the SysML mirror. Saving a graph dump is not saving the model. P1 MUST NOT ship a dual-write editor.
2. **Kuzu** as required runtime, storage (`graph.kuzu`), Cypher, a long-lived Kuzu worker, or a **dual-engine hedge** (default: MemNet sole engine; dual only if Memnetor hard blocker).
3. **Full-tree dump as the only merge or query story for agents** — agents use `proposals/<id>/` and **bounded** GQL; humans overwrite current as a whole tree and keep git history. MUST NOT stuff the whole `.sysml` tree into the LLM prompt.
4. Serving the **graph** as downloadable source.
5. GQL that **invents** structure or ids (including ClickUp/Inventree) not in SysML at `rev.sha`.
6. Claiming **P2 SaaS** or **P3 tenancy** as shipped in this cut.
7. **Graphic** SysML canvas / modeler / SysON-like IDE as a SysMLEdge surface (textual SysML + GQL/MCP only).
8. **ClickUp or InvenTree as product features** (mapping of ids already in SysML is not a product integration).
9. **Parts-only SSOT** — import/save/download MUST be all `.sysml` in the tree.
10. Treating **MemNet** (TCP or its MCP) as the agent-facing wedge once SysMLEdge MCP binds.

---

## 8. Lineage note (accuracy)

Verified from [codebase-sysmledgraph](https://github.com/chouswei/codebase-sysmledgraph) (npm **sysmledgraph** 0.8.2):

- Path-only indexer: `.sysml` paths via **sysml-v2-lsp**, graph in **Kuzu**.
- MCP tools: `indexDbGraph`, `list_indexed`, `clean_index`, `cypher`, `query`, `context`, `impact`, `rename` (dry-run in v1), `generate_map`.
- CLI: `analyze`, `list`, `clean`, `worker` (TCP daemon for Kuzu lock), `graph export` / `graph map`.
- Positioning: Modelbase publishes the graph; a codebase **Subscriber** shared `SYSMEDGRAPH_STORAGE_ROOT` over that worker.

SysMLEdge **does not** continue that DB or Cypher. It continues path index, agent MCP, and CLI as product patterns on **MemNet**.
