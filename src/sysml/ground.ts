import type { FoamGoldList } from "./gold.js";
import type { ParsedTree, SysmlEdge, SysmlNode } from "../types.js";

/** Mission-session locators. Projection MUST NOT invent owns onto these. */
const MISSION_TSK = /^(TSK_|USR_)/;

export function isMissionTskLocator(qname: string): boolean {
  return MISSION_TSK.test(qname) || qname.includes("::TSK_") || qname.startsWith("TSK_");
}

export function assertNoMissionTsk(parsed: ParsedTree): string[] {
  const hits: string[] = [];
  for (const n of parsed.nodes) {
    if (isMissionTskLocator(n.qname) || n.kind === ("TSK" as SysmlNode["kind"])) {
      hits.push(`node ${n.qname}`);
    }
  }
  for (const e of parsed.edges) {
    if (
      isMissionTskLocator(e.qname) ||
      isMissionTskLocator(e.from) ||
      isMissionTskLocator(e.to)
    ) {
      hits.push(`edge ${e.kind} ${e.from}->${e.to}`);
    }
  }
  return hits;
}

/**
 * SysML-grounded neighbourhood relations for gql_context / gql_impact.
 * contains = nested part usage (part owner -> nested part)
 * owns = part -> port
 * ends = connection usage -> endpoint (port or part as SysML says)
 * connection = existing connect A to B
 */
export function groundSysmlGraph(parsed: ParsedTree): ParsedTree {
  const nodes = parsed.nodes.map((n) => ({
    ...n,
    properties: { ...n.properties },
  }));
  const edges: SysmlEdge[] = parsed.edges.map((e) => ({ ...e }));
  const seen = new Set(edges.map(edgeKey));
  const nodeKeys = new Set(nodes.map((n) => n.kind + ":" + n.qname));

  const pushEdge = (e: SysmlEdge) => {
    if (isMissionTskLocator(e.from) || isMissionTskLocator(e.to)) return;
    const k = edgeKey(e);
    if (seen.has(k)) return;
    seen.add(k);
    edges.push(e);
  };

  const pushNode = (n: SysmlNode) => {
    if (isMissionTskLocator(n.qname)) return;
    const k = n.kind + ":" + n.qname;
    if (nodeKeys.has(k)) return;
    nodeKeys.add(k);
    nodes.push(n);
  };

  const byQ = new Map(nodes.map((n) => [n.qname, n]));

  for (const n of parsed.nodes) {
    if (!n.ownerQname) continue;
    const owner = byQ.get(n.ownerQname);
    if (!owner) continue;
    if (n.kind === "part" && owner.kind === "part") {
      pushEdge({
        kind: "contains",
        qname: `${owner.qname}::contains::${shortName(n.qname)}`,
        path: n.path,
        from: owner.qname,
        to: n.qname,
      });
    }
    if (n.kind === "port" && (owner.kind === "part" || owner.kind === "package")) {
      pushEdge({
        kind: "owns",
        qname: `${owner.qname}::owns::${shortName(n.qname)}`,
        path: n.path,
        from: owner.qname,
        to: n.qname,
      });
    }
  }

  for (const e of parsed.edges.filter((x) => x.kind === "connection")) {
    pushNode({
      kind: "connection",
      qname: e.qname,
      path: e.path,
      properties: { from: e.from, to: e.to },
    });
    pushEdge({
      kind: "ends",
      qname: `${e.qname}::ends::from`,
      path: e.path,
      from: e.qname,
      to: e.from,
    });
    pushEdge({
      kind: "ends",
      qname: `${e.qname}::ends::to`,
      path: e.path,
      from: e.qname,
      to: e.to,
    });
  }

  return { nodes, edges, files: [...parsed.files] };
}

export function connectionEdges(parsed: ParsedTree): SysmlEdge[] {
  return parsed.edges.filter((e) => e.kind === "connection");
}

export interface NeighbourhoodOpts {
  qname: string;
  depth: number;
  maxRows: number;
}

/**
 * BFS along contains / owns / ends / connection. Seed and direct
 * contains/owns neighbours are kept first so maxRows does not drop nested.
 */
export function walkNeighbourhood(
  parsed: ParsedTree,
  opts: NeighbourhoodOpts,
): { nodes: SysmlNode[]; edges: SysmlEdge[] } {
  const seed = findSeed(parsed.nodes, opts.qname);
  if (!seed) return { nodes: [], edges: [] };

  const visited = new Set<string>([seed.qname]);
  let frontier = [seed.qname];
  const used: SysmlEdge[] = [];
  const ranked = [...parsed.edges].sort(
    (a, b) => groundPriority(a.kind) - groundPriority(b.kind),
  );

  for (let d = 0; d < opts.depth; d++) {
    const next: string[] = [];
    for (const q of frontier) {
      for (const e of ranked) {
        if (e.from !== q && e.to !== q) continue;
        used.push(e);
        const other = e.from === q ? e.to : e.from;
        if (!visited.has(other)) {
          visited.add(other);
          next.push(other);
        }
      }
    }
    frontier = next;
  }

  const byQ = new Map(parsed.nodes.map((n) => [n.qname, n]));
  const ordered: SysmlNode[] = [];
  const pushN = (q: string) => {
    const n = byQ.get(q);
    if (n && !ordered.some((x) => x.qname === n.qname && x.kind === n.kind)) {
      ordered.push(n);
    }
  };
  pushN(seed.qname);
  for (const e of used) {
    if (e.kind === "contains" || e.kind === "owns") {
      pushN(e.from);
      pushN(e.to);
    }
  }
  for (const q of visited) pushN(q);

  const nodes = ordered.slice(0, opts.maxRows);
  const qset = new Set(nodes.map((n) => n.qname));
  const edges = uniqueEdges(used).filter(
    (e) => qset.has(e.from) || qset.has(e.to) || qset.has(e.qname),
  );
  return { nodes, edges: edges.slice(0, opts.maxRows) };
}

export function walkImpact(
  parsed: ParsedTree,
  opts: NeighbourhoodOpts,
): { nodes: SysmlNode[]; edges: SysmlEdge[] } {
  return walkNeighbourhood(parsed, opts);
}

/**
 * Rebuild a ParsedTree from frozen gold lists (no Foam tree on disk).
 * Owners come from nested_parts / qname prefix. MUST NOT add TSK nodes.
 */
export function parsedTreeFromGold(gold: FoamGoldList): ParsedTree {
  const nestedOwner = new Map(
    gold.nested_parts.map((n) => [n.qname, n.ownerQname]),
  );
  const partSet = new Set(gold.parts);
  const nodes: SysmlNode[] = [];
  for (const q of gold.packages) {
    nodes.push({ kind: "package", qname: q, path: "gold.json", properties: {} });
  }
  for (const q of gold.parts) {
    nodes.push({
      kind: "part",
      qname: q,
      path: "gold.json",
      ownerQname: nestedOwner.get(q),
      properties: {},
    });
  }
  for (const q of gold.ports) {
    nodes.push({
      kind: "port",
      qname: q,
      path: "gold.json",
      ownerQname: longestPartPrefix(q, partSet),
      properties: {},
    });
  }
  const edges: SysmlEdge[] = gold.connections.map((c) => ({
    kind: "connection",
    qname: c.qname,
    path: "gold.json",
    from: c.from,
    to: c.to,
  }));
  return groundSysmlGraph({ nodes, edges, files: [...gold.tree_files] });
}

export function projectionCounts(parsed: ParsedTree): {
  parts: number;
  ports: number;
  connections: number;
  nested_parts: number;
  contains: number;
  owns: number;
  ends: number;
} {
  const parts = parsed.nodes.filter((n) => n.kind === "part");
  const partQ = new Set(parts.map((n) => n.qname));
  return {
    parts: parts.length,
    ports: parsed.nodes.filter((n) => n.kind === "port").length,
    connections: parsed.edges.filter((e) => e.kind === "connection").length,
    nested_parts: parts.filter((n) => n.ownerQname && partQ.has(n.ownerQname)).length,
    contains: parsed.edges.filter((e) => e.kind === "contains").length,
    owns: parsed.edges.filter((e) => e.kind === "owns").length,
    ends: parsed.edges.filter((e) => e.kind === "ends").length,
  };
}

function edgeKey(e: SysmlEdge): string {
  return `${e.kind}|${e.from}|${e.to}|${e.qname}`;
}

function shortName(qname: string): string {
  return qname.split("::").pop() ?? qname;
}

function groundPriority(kind: SysmlEdge["kind"]): number {
  if (kind === "contains" || kind === "owns") return 0;
  if (kind === "ends") return 1;
  if (kind === "connection") return 2;
  return 3;
}

function findSeed(nodes: SysmlNode[], qname: string): SysmlNode | undefined {
  return (
    nodes.find((n) => n.qname === qname) ??
    nodes.find((n) => n.qname.endsWith("::" + qname))
  );
}

function uniqueEdges(edges: SysmlEdge[]): SysmlEdge[] {
  const seen = new Set<string>();
  const out: SysmlEdge[] = [];
  for (const e of edges) {
    const k = edgeKey(e);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(e);
  }
  return out;
}

function longestPartPrefix(qname: string, parts: Set<string>): string | undefined {
  let best: string | undefined;
  for (const p of parts) {
    if (qname.startsWith(p + "::") && qname !== p) {
      if (!best || p.length > best.length) best = p;
    }
  }
  return best;
}
