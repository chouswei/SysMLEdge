# P1 tiny fixture

Synthetic SysML v2 tree for SysMLEdge P1 **runtime enablement** (import / bind / STALE / reproject / propose CI).

This is **not** a second real project desk and **not** the Foam pilot. Foam proof in `docs/P1-acceptance.md` is still outstanding.

## Layout

```text
sysml-models/P1Tiny.sysml
```

Constructs: packages, part definitions, **one nested part usage** (`SensorHub::nestedDetector`), ports, one connection, `partNumber`. Enough for nested gold without hand `CREATE`.

## Revision SHA

The fixture files in git are a sample tree only. `sysmledge import` copies them into a project working copy, commits that copy, and binds `rev.sha` to the **git commit SHA** of the imported snapshot.

If the working copy is dirty (SysML mutated on disk without save), `current.sha` is a **content-addressed SHA-1** of all `.sysml` files under `sysml-models/` excluding `proposals/`. That inequality is STALE.
