import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** leftover `--map` TAG wire. 0.19.9 SCHEMA open is `--map-file` only. */
export const LEFTOVER_MAP_FLAG = "--map";
export const MAP_FILE_FLAG = "--map-file";

/** Path-B kinds that must keep locators on session_save/load. */
export const SYSML_LOCATOR_KINDS = ["PKG", "PRT", "POR", "CON"] as const;

/** Locators `pin_map qname=` needs after hydrate. Narrow operator SCHEMA omits these. */
export const SYSML_LOCATOR_FIELDS = ["qname", "path", "sysml_kind"] as const;

/** Pi overwrite that dropped Path-B locators (Peak_L CueConflict). */
export const NARROW_OPERATOR_PRT_FIELDS = "id name kind role status recycle";

export function defaultSysmlSchemaMapPath(env: NodeJS.ProcessEnv = process.env): string {
  const override = env.MEMNET_MAP_FILE?.trim();
  if (override) return override;
  return fileURLToPath(new URL("../../fixtures/memnet-session.map", import.meta.url));
}

/**
 * argv for `memnet session open` on TCP serve (0.19.9+).
 * Path must exist on the serve host (Pi operator: same machine as SysMLEdge).
 */
export function sessionOpenArgs(mapFile = defaultSysmlSchemaMapPath()): string[] {
  if (!mapFile) {
    throw new Error("MEMNET_MAP_FILE / schema path empty; need SCHEMA --map-file");
  }
  return ["session", "open", MAP_FILE_FLAG, mapFile];
}

export function usesLeftoverMapFlag(args: readonly string[]): boolean {
  return args.includes(LEFTOVER_MAP_FLAG);
}

export function parseSchemaFields(body: string): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    const m = /^SCHEMA\s+([A-Z]+)\s*;\s*fields=(\S.*)$/.exec(line);
    if (!m) continue;
    out.set(
      m[1],
      m[2]
        .trim()
        .split(/\s+/)
        .filter(Boolean),
    );
  }
  return out;
}

/**
 * Refuse a map that would strip qname/path/sysml_kind on keep-id hydrate.
 * TcpMemNet reproject is Path-B `ingest sysml` (not CREATE kind/role/status).
 * Keep partNumber / CON kind when present; do not drop locators to add mission fields.
 */
export function assertSysmlLocatorSchema(body: string, mapFile = "map"): void {
  const schemas = parseSchemaFields(body);
  for (const kind of SYSML_LOCATOR_KINDS) {
    const fields = schemas.get(kind);
    if (!fields?.length) {
      throw new Error(
        `SCHEMA ${kind} missing in ${mapFile}; LIVE bind --map-file must keep qname/path/sysml_kind`,
      );
    }
    const joined = fields.join(" ");
    if (kind === "PRT" && joined === NARROW_OPERATOR_PRT_FIELDS) {
      throw new Error(
        `SCHEMA PRT in ${mapFile} is the narrow operator shape (${NARROW_OPERATOR_PRT_FIELDS}); ` +
          `that omits qname so session_save/load drops Path-B locators and pin_map qname= misses`,
      );
    }
    if (!fields.includes("qname")) {
      throw new Error(
        `SCHEMA ${kind} in ${mapFile} omits qname; narrow SCHEMA strips locators on keep-id hydrate`,
      );
    }
    for (const f of SYSML_LOCATOR_FIELDS) {
      if (!fields.includes(f)) {
        throw new Error(
          `SCHEMA ${kind} in ${mapFile} omits ${f}; merge locators with ingest columns, do not overwrite`,
        );
      }
    }
  }
}

export function assertSchemaMapFile(mapFile: string): string {
  if (!existsSync(mapFile)) {
    throw new Error(
      `SCHEMA --map-file missing: ${mapFile}. Set MEMNET_MAP_FILE to the SysML SCHEMA on the serve host.`,
    );
  }
  const body = readFileSync(mapFile, "utf8");
  assertSysmlLocatorSchema(body, mapFile);
  return mapFile;
}
