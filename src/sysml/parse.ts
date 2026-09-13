import { readFile } from "node:fs/promises";
import { relative, sep } from "node:path";
import type { ParsedTree, SysmlEdge, SysmlNode } from "../types.js";
import { listSysmlFiles } from "../rev/sha.js";
import { groundSysmlGraph } from "./ground.js";
import { parseAntlrFile, type ParseEngine } from "./parse-antlr.js";
import { parseRegexFile } from "./parse-regex.js";

export type { ParseEngine };

export interface FileParseMeta {
  path: string;
  engine: ParseEngine;
  antlrErrors: string[];
}

export interface ParseMeta {
  files: FileParseMeta[];
}

/**
 * Whole-tree projection. Prefer the pinned ANTLR4 SysML v2 grammar
 * (daltskin/sysml-v2-grammar v2026.05.0). Fall back to the regex scanner
 * per file when ANTLR fails or would silent-drop parts/ports/connections.
 * Mapping stays Foam-complete; this is not full KerML.
 */
export async function parseSysmlTree(ssotDir: string): Promise<ParsedTree> {
  const { tree } = await parseSysmlTreeWithMeta(ssotDir);
  return tree;
}

export async function parseSysmlTreeWithMeta(
  ssotDir: string,
): Promise<{ tree: ParsedTree; meta: ParseMeta }> {
  const files = await listSysmlFiles(ssotDir);
  const nodes: SysmlNode[] = [];
  const edges: SysmlEdge[] = [];
  const relFiles: string[] = [];
  const metaFiles: FileParseMeta[] = [];
  for (const abs of files) {
    const rel = relative(ssotDir, abs).split(sep).join("/");
    relFiles.push(rel);
    const raw = await readFile(abs, "utf8");
    const chosen = pickEngine(raw, rel);
    nodes.push(...chosen.nodes);
    edges.push(...chosen.edges);
    metaFiles.push({
      path: rel,
      engine: chosen.engine,
      antlrErrors: chosen.antlrErrors,
    });
  }
  resolveConnectionEndpoints(nodes, edges);
  return {
    tree: groundSysmlGraph({ nodes, edges, files: relFiles }),
    meta: { files: metaFiles },
  };
}

function pickEngine(
  raw: string,
  path: string,
): {
  nodes: SysmlNode[];
  edges: SysmlEdge[];
  engine: ParseEngine;
  antlrErrors: string[];
} {
  const regex = parseRegexFile(raw, path);
  const antlr = parseAntlrFile(raw, path);
  if (antlr.ok && !wouldSilentDrop(antlr, regex)) {
    return {
      nodes: antlr.nodes,
      edges: antlr.edges,
      engine: "antlr",
      antlrErrors: antlr.errors,
    };
  }
  return {
    nodes: regex.nodes,
    edges: regex.edges,
    engine: "regex",
    antlrErrors: antlr.errors,
  };
}

function wouldSilentDrop(
  antlr: { nodes: SysmlNode[]; edges: SysmlEdge[] },
  regex: { nodes: SysmlNode[]; edges: SysmlEdge[] },
): boolean {
  const kinds = (nodes: SysmlNode[], kind: SysmlNode["kind"]) =>
    nodes.filter((n) => n.kind === kind).length;
  if (kinds(antlr.nodes, "part") < kinds(regex.nodes, "part")) return true;
  if (kinds(antlr.nodes, "port") < kinds(regex.nodes, "port")) return true;
  const pairs = (edges: SysmlEdge[]) =>
    new Set(
      edges.filter((e) => e.kind === "connection").map((e) => `${e.from}->${e.to}`),
    );
  return pairs(antlr.edges).size < pairs(regex.edges).size;
}

function resolveConnectionEndpoints(nodes: SysmlNode[], edges: SysmlEdge[]): void {
  const byShort = new Map<string, string[]>();
  for (const n of nodes) {
    const short = n.qname.split("::").pop() ?? n.qname;
    const list = byShort.get(short) ?? [];
    list.push(n.qname);
    byShort.set(short, list);
  }
  for (const e of edges) {
    e.from = resolveRef(e.from, nodes, byShort);
    e.to = resolveRef(e.to, nodes, byShort);
  }
}

function resolveRef(
  ref: string,
  nodes: SysmlNode[],
  byShort: Map<string, string[]>,
): string {
  if (nodes.some((n) => n.qname === ref)) return ref;
  const parts = ref.split(".");
  if (parts.length >= 2) {
    const portName = parts.at(-1) ?? "";
    const ownerHint = parts[0] ?? "";
    const ownerHits = byShort.get(ownerHint) ?? [];
    const portHits = byShort.get(portName) ?? [];
    const ownerQ = ownerHits[0];
    const port =
      portHits.find((q) => ownerQ && q.startsWith(ownerQ + "::") && q.endsWith("::" + portName)) ??
      portHits.find((q) => q.endsWith("::" + portName)) ??
      portHits[0];
    if (port) return port;
    if (ownerQ) return `${ownerQ}::${portName}`;
  }
  const hits = byShort.get(ref) ?? [];
  return hits[0] ?? ref;
}
