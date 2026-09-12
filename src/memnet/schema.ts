import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** leftover `--map` TAG wire. 0.19.9 SCHEMA open is `--map-file` only. */
export const LEFTOVER_MAP_FLAG = "--map";
export const MAP_FILE_FLAG = "--map-file";

export function defaultSysmlSchemaMapPath(env: NodeJS.ProcessEnv = process.env): string {
  const override = env.MEMNET_MAP_FILE?.trim();
  if (override) return override;
  return fileURLToPath(new URL("../../fixtures/memnet-schema.sysml.txt", import.meta.url));
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

export function assertSchemaMapFile(mapFile: string): string {
  if (!existsSync(mapFile)) {
    throw new Error(
      `SCHEMA --map-file missing: ${mapFile}. Set MEMNET_MAP_FILE to the SysML SCHEMA on the serve host.`,
    );
  }
  return mapFile;
}
