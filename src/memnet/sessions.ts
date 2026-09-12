/** Cited LIVE MemNet sessions. SysMLEdge bind MUST open a new session. */

export const PATH_A_OPS_SESSION = "mn_b05a9869";
export const PATH_B_SESSION = "mn_0d4f6178";
/** Devicor 2026-09-12 LIVE bind ingest (p1-tiny). Not Path-A/B; not M1 pass. */
export const LIVE_BIND_SESSION_2026_09_12 = "mn_27ce8714";

/** Path-B published M1 narrow (CON 124 + nested qname ego). Not project@rev. */
export const PROTECTED_MEMNET_SESSIONS = [PATH_A_OPS_SESSION, PATH_B_SESSION] as const;

export function isProtectedMemnetSession(sid: string | undefined | null): boolean {
  if (!sid) return false;
  return (PROTECTED_MEMNET_SESSIONS as readonly string[]).includes(sid.trim());
}
