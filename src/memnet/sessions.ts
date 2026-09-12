/** Cited LIVE MemNet sessions. SysMLEdge bind MUST open a new session. */

export const PATH_A_OPS_SESSION = "mn_b05a9869";
export const PATH_B_SESSION = "mn_0d4f6178";
/** Dirty LIVE bind 2026-09-12 (append honesty). Archive only — not lock (f). */
export const LIVE_BIND_DIRTY_ARCHIVE = "mn_27ce8714";
/** @deprecated Use LIVE_BIND_DIRTY_ARCHIVE. Honesty archive only. */
export const LIVE_BIND_SESSION_2026_09_12 = LIVE_BIND_DIRTY_ARCHIVE;
/** CEO Core lock (f) clean session. p1-tiny. Not Foam M1. */
export const LOCK_F_CLEAN_SESSION = "mn_be03c1a9";
export const LOCK_F_CLEAN_REV = "f6768b1108b20c15212f0895f41fb7a27b6a408d";

/** Path-B published M1 narrow (CON 124 + nested qname ego). Not project@rev. */
export const PROTECTED_MEMNET_SESSIONS = [
  PATH_A_OPS_SESSION,
  PATH_B_SESSION,
  LIVE_BIND_DIRTY_ARCHIVE,
] as const;

export function isProtectedMemnetSession(sid: string | undefined | null): boolean {
  if (!sid) return false;
  return (PROTECTED_MEMNET_SESSIONS as readonly string[]).includes(sid.trim());
}
