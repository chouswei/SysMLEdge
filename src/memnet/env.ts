/**
 * Live MemNet floor (PRODUCT-LOCKS / P1-acceptance): memnet-llm==0.19.8
 * + TCP-shared MCP. SysMLEdge owns rev/STALE; this module only checks the engine path.
 */

export const MEMNET_LLM_FLOOR = "0.19.8";
/** Path-B CON from ingest (MemNet #158). Bounce stays 0.19.8. Pi Path-B = mn_0d4f6178 @ 0.19.9 (published narrow; not bind). */
export const MEMNET_PATH_B_CON_FLOOR = "0.19.9";
export const MEMNET_SERVE_PORT_DEFAULT = 18765;
export const MEMNET_MCP_PORT_DEFAULT = 18766;

export class MemNetEnvError extends Error {
  readonly code = "MEMNET_ENV";
  constructor(message: string) {
    super(message);
    this.name = "MemNetEnvError";
  }
}

export interface LiveMemNetEnv {
  host: string;
  servePort: number;
  mcpPort: number;
  transport: "tcp";
  declaredVersion?: string;
}

export function parseMemnetVersion(text: string): string | undefined {
  const m =
    /memnet-llm\s*[= ]+\s*(0\.\d+\.\d+)/i.exec(text) ||
    /\b(0\.\d+\.\d+)\b/.exec(text);
  return m?.[1];
}

export function versionAtLeastFloor(version: string, floor = MEMNET_LLM_FLOOR): boolean {
  const a = version.split(".").map((n) => Number(n));
  const b = floor.split(".").map((n) => Number(n));
  for (let i = 0; i < 3; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av > bv) return true;
    if (av < bv) return false;
  }
  return true;
}

/**
 * Fail closed when the live backend is requested without TCP-shared MCP
 * or with a declared version below 0.19.8.
 */
export function assertLiveMemNetEnv(env: NodeJS.ProcessEnv = process.env): LiveMemNetEnv {
  const backend = (env.MEMNET_BACKEND ?? "fake").toLowerCase();
  if (backend !== "tcp" && backend !== "live") {
    throw new MemNetEnvError(
      `MEMNET_BACKEND=${backend || "unset"} is not live TCP; set MEMNET_BACKEND=tcp`,
    );
  }
  const transport = (env.MEMNET_MCP_TRANSPORT ?? "").toLowerCase();
  if (transport !== "tcp") {
    throw new MemNetEnvError(
      `MEMNET_MCP_TRANSPORT must be tcp (got ${env.MEMNET_MCP_TRANSPORT ?? "unset"}). ` +
        `In-process MCP is session_not_found. Proof env: serve :${MEMNET_SERVE_PORT_DEFAULT} / mcp :${MEMNET_MCP_PORT_DEFAULT}, memnet-llm==${MEMNET_LLM_FLOOR}.`,
    );
  }
  const servePort = Number(env.MEMNET_SERVE_PORT ?? String(MEMNET_SERVE_PORT_DEFAULT));
  const mcpPort = Number(env.MEMNET_MCP_PORT ?? String(MEMNET_MCP_PORT_DEFAULT));
  if (servePort !== MEMNET_SERVE_PORT_DEFAULT) {
    throw new MemNetEnvError(
      `MEMNET_SERVE_PORT must be ${MEMNET_SERVE_PORT_DEFAULT} for the 0.19.8 TCP-shared proof env (got ${servePort})`,
    );
  }
  if (mcpPort !== MEMNET_MCP_PORT_DEFAULT) {
    throw new MemNetEnvError(
      `MEMNET_MCP_PORT must be ${MEMNET_MCP_PORT_DEFAULT} for TCP-shared MCP (got ${mcpPort})`,
    );
  }
  const declared = env.MEMNET_LLM_VERSION
    ? parseMemnetVersion(env.MEMNET_LLM_VERSION)
    : undefined;
  if (declared && !versionAtLeastFloor(declared)) {
    throw new MemNetEnvError(
      `memnet-llm==${declared} is below floor ${MEMNET_LLM_FLOOR} (0.19.7 bounce FAIL)`,
    );
  }
  return {
    host: env.MEMNET_SERVE_HOST ?? "127.0.0.1",
    servePort,
    mcpPort,
    transport: "tcp",
    declaredVersion: declared,
  };
}
