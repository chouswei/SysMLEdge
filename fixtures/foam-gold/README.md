# Foam gold freeze

Human-checkable list from the **existing SysML parser** (`src/sysml/parse.ts`) over Foam `sysml-models/`.

- Source: `chouswei/modelbasedPrj-itri-vedan-foam-detection`
- Frozen at git SHA in `gold.json` → `source.sha`
- **Not** an M1 pass. `proof_executed: false`

Regenerate after cloning Foam (see `docs/proof/FOAM-IMPORT.md`):

```bash
npx tsx src/cli.ts gold /path/to/foam/sysml-models --sha <SHA> -o fixtures/foam-gold/gold.json
```

Nested hand-CREATE example (Memnetor): `backgroundSetIndicator` under `CoreVideoMonitorToolbar` and `CoreMonitorConfigPanel`.

UNKNOWN (explicit):

- `connection` defs/usages without `connect A to B` (parser emits no edge)
- `part def` present in SysML but missing after `doc /*` / markdown `**.../**` comment close
- `sysml-models/libs` until the git submodule is in the tree
