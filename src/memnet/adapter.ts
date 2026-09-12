import type { GqlSlice, ParsedTree, SysmlEdge, SysmlNode } from "../types.js";

export interface MemNetReadCue {
  qname?: string;
  keyword?: string;
  kind?: string;
  maxRows: number;
}

export interface MemNetAdapter {
  /** Rebuild projection from current SysML. Returns optional session id. */
  reproject(ssotDir: string, parsed: ParsedTree): Promise<string | undefined>;
  gqlRead(cue: MemNetReadCue): Promise<Omit<GqlSlice, "rev.sha" | "rev.stale">>;
  gqlContext(opts: {
    qname: string;
    maxRows: number;
  }): Promise<Omit<GqlSlice, "rev.sha" | "rev.stale">>;
  gqlImpact(opts: {
    qname: string;
    maxRows: number;
  }): Promise<Omit<GqlSlice, "rev.sha" | "rev.stale">>;
  listScope(): Promise<string[]>;
}

export function boundSlice(
  nodes: SysmlNode[],
  edges: SysmlEdge[],
  maxRows: number,
): Omit<GqlSlice, "rev.sha" | "rev.stale"> {
  const n = nodes.slice(0, maxRows);
  const q = new Set(n.map((x) => x.qname));
  const e = edges
    .filter((x) => q.has(x.from) || q.has(x.to) || q.has(x.qname))
    .slice(0, maxRows);
  return { nodes: n, edges: e };
}
