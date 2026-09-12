import { TcpMemNet } from "./tcp.js";

export const LAN_PI_HOST = "10.0.0.10";
export const LOCAL_SERVE_HOST = "127.0.0.1";
export const LIVE_TCP_PROBE_HOSTS = [LOCAL_SERVE_HOST, LAN_PI_HOST] as const;

export interface TcpProbeRow {
  host: string;
  port: number;
  reachable: boolean;
}

export interface LiveTcpProbeReport {
  ok: boolean;
  blocker: string | null;
  serve_port: number;
  probes: TcpProbeRow[];
  proof_pass_claimed: false;
  note: string;
}

/**
 * Cloud VM / operator reachability. Connecting is not SysMLEdge bind.
 * pin_map / session_list over Cursor MCP is also not bind.
 */
export async function probeLiveTcp(opts?: {
  hosts?: readonly string[];
  port?: number;
  extraHost?: string;
}): Promise<LiveTcpProbeReport> {
  const port = opts?.port ?? 18765;
  const hosts = [...(opts?.hosts ?? LIVE_TCP_PROBE_HOSTS)];
  const extra = opts?.extraHost?.trim();
  if (extra && !hosts.includes(extra)) hosts.unshift(extra);
  const probes: TcpProbeRow[] = [];
  for (const host of hosts) {
    const tcp = new TcpMemNet({ host, port, timeoutMs: 800 });
    probes.push({ host, port, reachable: await tcp.probe() });
  }
  const ok = probes.some((p) => p.reachable);
  return {
    ok,
    blocker: ok
      ? null
      : `no TCP to memnet serve :${port} (${hosts.join(", ")}). Cloud VM cannot bind LIVE from here. Memnetor: run scripts/live-bind-operator.sh on the Pi (127.0.0.1).`,
    serve_port: port,
    probes,
    proof_pass_claimed: false,
    note: "TCP reachability ≠ rev.sha bind. Path-B pin_map on mn_0d4f6178 ≠ bind. #21 FAKE ego ≠ LIVE bind.",
  };
}
