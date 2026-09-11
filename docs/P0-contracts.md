# P0 contracts — SysMLEdge

This sheet is the first implementable deliverable. Implement against these names and behaviours. Engine is **MemNet**. **Kuzu is rejected.**

**Bilingual** = SysML (author SSOT) + GQL (query/represent). Not a zh/EN UI contract.

Pilot system of interest (P1, not this seed): `chouswei/modelbasedPrj-itri-vedan-foam-detection`.

Product locks (position, market pin, no graphic, day loop, merge/autopilot, faces, freemium): [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md) as of **2026-09-11**. Where that sheet clarifies this file, wording below is aligned; MemNet, STALE, and **no agent SSOT write** are not weakened.

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

SSOT operations are **whole tree**. Agents do not merge by dumping the graph.

### 3.1 Layout

Canonical on-disk SSOT:

```text
sysml-models/          # multi-file SysML v2 tree (author SSOT)
sysml-models/proposals/<id>/   # optional agent proposals (not SSOT until human save)
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
| Graph | **Save never writes the graph.** After commit, **auto-reproject** MemNet to the new SHA (Live). |
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

Query language is **GQL** against MemNet (cue → neighbourhood / find). GQL NEVER invents structure: every node/edge in a successful read MUST be projectable from SysML at `rev.sha` (v1 mapping in §5).

### 4.1 Required tools (P0 names)

| Tool | Mutates SSOT? | Behaviour |
|------|----------------|-----------|
| `rev_status` | No | Return `current.sha`, `rev.sha`, `rev.stale`. |
| `gql_read` | No | Bounded GQL read. Requires `staleOk=true` when STALE, else STALE error. |
| `gql_context` | No | Neighbourhood of one qname/path (part/port/connection). Same STALE rules. |
| `gql_impact` | No | Upstream/downstream along mapped connections. Same STALE rules. |
| `list_scope` | No | Indexed project roots / package qnames in the bound projection. |
| `propose` | No (SSOT) | Write **only** under `sysml-models/proposals/<id>/`. See §6. |
| `reproject` | No (SSOT) | Rebuild MemNet from **current** SysML. Human or privileged operator. Agents MAY request; MUST NOT pretend the graph is SSOT. |

### 4.2 Forbidden on MCP

| Forbidden | Why |
|-----------|-----|
| Silent overwrite of `sysml-models/` SSOT files | Human save (including human-auth MCP merge with token+confirm) is the only SSOT write path. **No agent write-SSOT tool.** |
| `save` / `import` / `download` as unattended **agent** tools | Those are human/operator APIs (CLI/UI/SaaS). Human-auth MCP merge is the human Save path, not an agent merge. |
| Agent-owned merge / apply of `delta.sysml` onto current | Agent path is read → draft → `propose` only. |
| Graph write-back as SSOT | Projection is derived. |
| Unbounded full-tree dump as the **only** merge story | Agents propose deltas (§6). Humans save the whole tree. |
| Cypher / Kuzu / `graph.kuzu` | Engine is MemNet. |
| `mutate` of MemNet that adds structure not in SysML | GQL MUST NOT invent. |

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

## 5. Mapping scope v1

Project **only** these SysML constructs into MemNet for v1. Anything else is out of scope until a later mapping rev (must bump a `mapping.version` on the projection).

| SysML | Graph | Locators (stable) |
|-------|-------|-------------------|
| `part` (definition/usage as in the tree) | node | `qname=`, `path=` (file in `sysml-models/`) |
| `port` | node | `qname=`, `path=`, owning part |
| `connection` | edge | endpoints = ports (or connected parts if the SysML says so) |
| `partNumber` | property on part | string as written in SysML; MUST NOT fabricate |
| ClickUp id | property when present in SysML | e.g. `clickUp=` / documented attribute name in the model |
| Inventree id | property when present in SysML | e.g. `inventree=` / documented attribute name in the model |

Unknown ClickUp/Inventree ids: **omit**. Do not invent placeholders.

**Not product features:** SysMLEdge does not ship ClickUp or InvenTree (no sync, no PLM UI). The rows above are SSOT fidelity when those strings already exist in SysML. P2 on the Devicor droplet MUST leave InvenTree **untouched**.

**MUST NOT** in v1: invent packages, requirements, actions, or allocations as first-class mapped kinds unless they appear as the constructs above. Unmapped SysML remains in the zip/tree only.

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

Human apply: merge `delta.sysml` into the tree (human/tooling or **human-auth MCP merge** with token+confirm), then **save** (commit + auto-reproject). There is no “apply GQL to SSOT”. Agents MUST NOT apply. Optional P2 **autopilot** (default off) and **bot review** (default off) are product locks, not P0 runtime — see [PRODUCT-LOCKS.md](PRODUCT-LOCKS.md).

---

## 7. Reject list (explicit)

Implementations MUST reject:

1. **Graph write-back as SSOT** — MemNet/GQL is a projection. Saving the graph is not saving the model.
2. **Kuzu** as required runtime, storage (`graph.kuzu`), Cypher, or a long-lived Kuzu worker.
3. **Full-tree dump as the only merge story for agents** — agents use `proposals/<id>/`; humans overwrite current as a whole tree and keep git history.
4. Serving the **graph** as downloadable source.
5. GQL that **invents** parts, ports, connections, or ids (including ClickUp/Inventree) not in SysML at `rev.sha`.
6. Claiming **P2 SaaS** or **P3 tenancy** as shipped in this cut.
7. **Graphic** SysML canvas / modeler / SysON-like IDE as a SysMLEdge surface (textual SysML + GQL/MCP only).
8. **ClickUp or InvenTree as product features** (mapping of ids already in SysML is not a product integration).

---

## 8. Lineage note (accuracy)

Verified from [codebase-sysmledgraph](https://github.com/chouswei/codebase-sysmledgraph) (npm **sysmledgraph** 0.8.2):

- Path-only indexer: `.sysml` paths via **sysml-v2-lsp**, graph in **Kuzu**.
- MCP tools: `indexDbGraph`, `list_indexed`, `clean_index`, `cypher`, `query`, `context`, `impact`, `rename` (dry-run in v1), `generate_map`.
- CLI: `analyze`, `list`, `clean`, `worker` (TCP daemon for Kuzu lock), `graph export` / `graph map`.
- Positioning: Modelbase publishes the graph; a codebase **Subscriber** shared `SYSMEDGRAPH_STORAGE_ROOT` over that worker.

SysMLEdge **does not** continue that DB or Cypher. It continues path index, agent MCP, and CLI as product patterns on **MemNet**.
