import { readFile } from "node:fs/promises";
import { relative, sep } from "node:path";
import type { ParsedTree, SysmlEdge, SysmlNode } from "../types.js";
import { listSysmlFiles } from "../rev/sha.js";

const ATTR_KEYS = ["partNumber", "clickUp", "inventree"] as const;

export async function parseSysmlTree(ssotDir: string): Promise<ParsedTree> {
  const files = await listSysmlFiles(ssotDir);
  const nodes: SysmlNode[] = [];
  const edges: SysmlEdge[] = [];
  const relFiles: string[] = [];
  for (const abs of files) {
    const rel = relative(ssotDir, abs).split(sep).join("/");
    relFiles.push(rel);
    const src = stripStrings(stripComments(await readFile(abs, "utf8")));
    const parsed = parseFile(src, rel);
    nodes.push(...parsed.nodes);
    edges.push(...parsed.edges);
  }
  resolveConnectionEndpoints(nodes, edges);
  return { nodes, edges, files: relFiles };
}

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/.*$/gm, " ");
}

/** Brace matching must not see `{` / `}` inside quoted SysML strings. */
function stripStrings(src: string): string {
  return src.replace(/"(?:\\.|[^"\\])*"/g, '""');
}

interface Frame {
  kind: "package" | "part" | "port" | "other";
  name: string;
  qname: string;
  depth: number;
}

function parseFile(src: string, path: string): { nodes: SysmlNode[]; edges: SysmlEdge[] } {
  const nodes: SysmlNode[] = [];
  const edges: SysmlEdge[] = [];
  const stack: Frame[] = [];
  let depth = 0;
  const re =
    /\b(package|part\s+def|port\s+def|part|port|connection|attribute)\b|[{};]/g;
  let match: RegExpExecArray | null;
  const seen = new Set<string>();

  const pushNode = (n: SysmlNode) => {
    if (seen.has(n.qname + "@" + n.kind)) return;
    seen.add(n.qname + "@" + n.kind);
    nodes.push(n);
  };

  const popToDepth = (d: number) => {
    while (stack.length && (stack.at(-1)?.depth ?? 0) > d) stack.pop();
  };

  while ((match = re.exec(src))) {
    const tok = match[0];
    if (tok === "{") {
      depth += 1;
      continue;
    }
    if (tok === "}") {
      depth = Math.max(0, depth - 1);
      popToDepth(depth);
      continue;
    }
    if (tok === ";") continue;

    if (tok === "package") {
      const name = identAfter(src, re.lastIndex);
      if (!name) continue;
      const qname = qualify(stack, name);
      if (hasBraceBody(src, afterIdent(src, re.lastIndex))) {
        stack.push({ kind: "package", name, qname, depth: depth + 1 });
      }
      pushNode({
        kind: "package",
        qname,
        path,
        properties: {},
      });
      continue;
    }

    if (tok.startsWith("part") && tok.includes("def")) {
      const name = identAfter(src, re.lastIndex);
      if (!name) continue;
      const qname = qualify(stack, name);
      const owner = stack.at(-1)?.qname;
      const attrs = readAttributes(src, re.lastIndex);
      if (hasBraceBody(src, afterIdent(src, re.lastIndex))) {
        stack.push({ kind: "part", name, qname, depth: depth + 1 });
      }
      pushNode({
        kind: "part",
        qname,
        path,
        ownerQname: owner,
        properties: attrs,
      });
      continue;
    }

    if (tok === "part") {
      const usage = parseUsage(src, re.lastIndex);
      if (!usage) continue;
      const qname = qualify(stack, usage.name);
      const owner = stack.at(-1)?.qname;
      if (hasBraceBody(src, afterIdent(src, re.lastIndex))) {
        stack.push({ kind: "part", name: usage.name, qname, depth: depth + 1 });
      }
      pushNode({
        kind: "part",
        qname,
        path,
        ownerQname: owner,
        typeName: usage.typeName,
        properties: { ...(usage.typeName ? { type: usage.typeName } : {}) },
      });
      continue;
    }

    if (tok === "port" || (tok.startsWith("port") && tok.includes("def"))) {
      const usage = tok.includes("def")
        ? { name: identAfter(src, re.lastIndex) ?? "", typeName: undefined as string | undefined }
        : parseUsage(src, re.lastIndex);
      if (!usage?.name) continue;
      const qname = qualify(stack, usage.name);
      const owner = stack.at(-1)?.qname;
      pushNode({
        kind: "port",
        qname,
        path,
        ownerQname: owner,
        typeName: usage.typeName,
        properties: { ...(usage.typeName ? { type: usage.typeName } : {}) },
      });
      continue;
    }

    if (tok === "connection") {
      const conn = parseConnection(src, re.lastIndex);
      if (!conn) continue;
      const qname = qualify(stack, conn.name);
      edges.push({
        kind: "connection",
        qname,
        path,
        from: conn.from,
        to: conn.to,
      });
      continue;
    }

    if (tok === "attribute") {
      const attr = parseAttribute(src, re.lastIndex);
      if (!attr) continue;
      const owner = [...nodes].reverse().find((n) => n.kind === "part");
      if (owner && ATTR_KEYS.includes(attr.key as (typeof ATTR_KEYS)[number])) {
        owner.properties[attr.key] = attr.value;
      }
    }
  }

  return { nodes, edges };
}

function identAfter(src: string, from: number): string | null {
  const m = /\s*([A-Za-z_][A-Za-z0-9_]*)/.exec(src.slice(from));
  return m?.[1] ?? null;
}

function afterIdent(src: string, from: number): number {
  const m = /\s*[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(from));
  return from + (m ? m[0].length : 0);
}

function hasBraceBody(src: string, from: number): boolean {
  return /^\s*\{/.test(src.slice(from));
}

function parseUsage(
  src: string,
  from: number,
): { name: string; typeName?: string } | null {
  const m = /\s*([A-Za-z_][A-Za-z0-9_]*)(?:\s*:\s*([A-Za-z_][A-Za-z0-9_.]*))?/.exec(
    src.slice(from),
  );
  if (!m?.[1]) return null;
  return { name: m[1], typeName: m[2] };
}

function parseConnection(
  src: string,
  from: number,
): { name: string; from: string; to: string } | null {
  const slice = src.slice(from, from + 400);
  const named = /^\s*([A-Za-z_][A-Za-z0-9_]*)/.exec(slice);
  const name = named?.[1] ?? "connection";
  const conn = /connect\s+([A-Za-z0-9_.]+)\s+to\s+([A-Za-z0-9_.]+)/.exec(slice);
  const cFrom = conn?.[1];
  const cTo = conn?.[2];
  if (!cFrom || !cTo) return null;
  return { name, from: cFrom, to: cTo };
}

function parseAttribute(
  src: string,
  from: number,
): { key: string; value: string } | null {
  const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*"([^"]*)"/.exec(src.slice(from));
  const key = m?.[1];
  const value = m?.[2];
  if (!key || value === undefined) return null;
  return { key, value };
}

function readAttributes(src: string, from: number): Record<string, string> {
  const brace = src.indexOf("{", from);
  if (brace < 0) return {};
  const end = src.indexOf("}", brace);
  if (end < 0) return {};
  const body = src.slice(brace, end);
  const props: Record<string, string> = {};
  for (const key of ATTR_KEYS) {
    const m = new RegExp(`attribute\\s+${key}\\s*=\\s*"([^"]*)"`).exec(body);
    const val = m?.[1];
    if (val) props[key] = val;
  }
  return props;
}

function qualify(stack: Frame[], name: string): string {
  const pkg = stack.filter((f) => f.kind === "package").at(-1);
  const parts = stack.filter((f) => f.kind === "part");
  const bits: string[] = [];
  if (pkg) bits.push(pkg.qname);
  for (const p of parts) bits.push(p.name);
  bits.push(name);
  return bits.join("::");
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
  if (parts.length === 2) {
    const ownerHits = byShort.get(parts[0] ?? "") ?? [];
    const portHits = byShort.get(parts[1] ?? "") ?? [];
    const owner = ownerHits[0];
    const port = portHits.find((q) => q.includes("::" + (parts[1] ?? ""))) ?? portHits[0];
    if (port) return port;
    if (owner) return `${owner}::${parts[1]}`;
  }
  const hits = byShort.get(ref) ?? [];
  return hits[0] ?? ref;
}
