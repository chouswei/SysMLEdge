import type { GqlSlice, ParsedTree } from "../types.js";
import type { MemNetAdapter, MemNetReadCue } from "./adapter.js";
import { boundSlice } from "./adapter.js";
import { walkImpact, walkNeighbourhood } from "../sysml/ground.js";

/**
 * In-memory projection for CI when memnet-llm serve is unreachable.
 * Mirrors Path-B ingest kinds (part/port/connection + nested usages)
 * and SysML-grounded contains/owns/ends. Does not invent qnames or TSK owns.
 */
export class FakeMemNet implements MemNetAdapter {
  private tree: ParsedTree = { nodes: [], edges: [], files: [] };

  async reproject(_ssotDir: string, parsed: ParsedTree): Promise<string | undefined> {
    this.tree = {
      nodes: parsed.nodes.map((n) => ({ ...n, properties: { ...n.properties } })),
      edges: parsed.edges.map((e) => ({ ...e })),
      files: [...parsed.files],
    };
    return "fake-session";
  }

  async gqlRead(cue: MemNetReadCue): Promise<Omit<GqlSlice, "rev.sha" | "rev.stale">> {
    let nodes = this.tree.nodes;
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
    const edges = this.tree.edges.filter((e) => qset.has(e.from) || qset.has(e.to));
    return boundSlice(nodes, edges, cue.maxRows);
  }

  async gqlContext(opts: {
    qname: string;
    maxRows: number;
  }): Promise<Omit<GqlSlice, "rev.sha" | "rev.stale">> {
    const { nodes, edges } = walkNeighbourhood(this.tree, {
      qname: opts.qname,
      depth: 3,
      maxRows: opts.maxRows,
    });
    return boundSlice(nodes, edges, opts.maxRows);
  }

  async gqlImpact(opts: {
    qname: string;
    maxRows: number;
  }): Promise<Omit<GqlSlice, "rev.sha" | "rev.stale">> {
    const { nodes, edges } = walkImpact(this.tree, {
      qname: opts.qname,
      depth: 4,
      maxRows: opts.maxRows,
    });
    return boundSlice(nodes, edges, opts.maxRows);
  }

  async listScope(): Promise<string[]> {
    return this.tree.nodes
      .filter((n) => n.kind === "package" || n.kind === "part")
      .map((n) => n.qname)
      .sort();
  }

  snapshot(): ParsedTree {
    return this.tree;
  }
}
