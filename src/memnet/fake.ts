import type { GqlSlice, ParsedTree, SysmlEdge, SysmlNode } from "../types.js";
import type { MemNetAdapter, MemNetReadCue } from "./adapter.js";
import { boundSlice } from "./adapter.js";

/**
 * In-memory projection for CI when memnet-llm serve is unreachable.
 * Mirrors Path-B ingest kinds (part/port/connection + nested usages).
 * Does not invent qnames. Does not write SysML.
 */
export class FakeMemNet implements MemNetAdapter {
  private nodes: SysmlNode[] = [];
  private edges: SysmlEdge[] = [];

  async reproject(_ssotDir: string, parsed: ParsedTree): Promise<string | undefined> {
    this.nodes = parsed.nodes.map((n) => ({ ...n, properties: { ...n.properties } }));
    this.edges = parsed.edges.map((e) => ({ ...e }));
    return "fake-session";
  }

  async gqlRead(cue: MemNetReadCue): Promise<Omit<GqlSlice, "rev.sha" | "rev.stale">> {
    let nodes = this.nodes;
    if (cue.kind) {
      nodes = nodes.filter((n) => n.kind === cue.kind);
    }
    if (cue.qname) {
      const q = cue.qname;
      nodes = nodes.filter(
        (n) => n.qname === q || n.qname.startsWith(q + "::") || n.ownerQname === q,
      );
    }
    if (cue.keyword) {
      const k = cue.keyword.toLowerCase();
      nodes = nodes.filter(
        (n) =>
          n.qname.toLowerCase().includes(k) ||
          Object.values(n.properties).some((v) => v.toLowerCase().includes(k)),
      );
    }
    const qset = new Set(nodes.map((n) => n.qname));
    const edges = this.edges.filter((e) => qset.has(e.from) || qset.has(e.to));
    return boundSlice(nodes, edges, cue.maxRows);
  }

  async gqlContext(opts: {
    qname: string;
    maxRows: number;
  }): Promise<Omit<GqlSlice, "rev.sha" | "rev.stale">> {
    const seed =
      this.nodes.find((n) => n.qname === opts.qname) ??
      this.nodes.find((n) => n.qname.endsWith("::" + opts.qname));
    if (!seed) return boundSlice([], [], opts.maxRows);
    const related = this.nodes.filter(
      (n) =>
        n.qname === seed.qname ||
        n.ownerQname === seed.qname ||
        n.qname.startsWith(seed.qname + "::") ||
        seed.ownerQname === n.qname,
    );
    const qset = new Set(related.map((n) => n.qname));
    const edges = this.edges.filter((e) => qset.has(e.from) || qset.has(e.to));
    return boundSlice(related, edges, opts.maxRows);
  }

  async gqlImpact(opts: {
    qname: string;
    maxRows: number;
  }): Promise<Omit<GqlSlice, "rev.sha" | "rev.stale">> {
    const ctx = await this.gqlContext(opts);
    const frontier = new Set(ctx.nodes.map((n) => n.qname));
    const extraEdges: SysmlEdge[] = [];
    for (const e of this.edges) {
      if (frontier.has(e.from) || frontier.has(e.to)) extraEdges.push(e);
    }
    const extraNodes = this.nodes.filter((n) =>
      extraEdges.some((e) => e.from === n.qname || e.to === n.qname),
    );
    const nodes = mergeNodes(ctx.nodes, extraNodes);
    return boundSlice(nodes, extraEdges, opts.maxRows);
  }

  async listScope(): Promise<string[]> {
    return this.nodes
      .filter((n) => n.kind === "package" || n.kind === "part")
      .map((n) => n.qname)
      .sort();
  }
}

function mergeNodes(a: SysmlNode[], b: SysmlNode[]): SysmlNode[] {
  const map = new Map<string, SysmlNode>();
  for (const n of [...a, ...b]) map.set(n.qname, n);
  return [...map.values()];
}
