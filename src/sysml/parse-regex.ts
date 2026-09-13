import type { SysmlEdge, SysmlNode } from "../types.js";

const ATTR_KEYS = ["partNumber", "clickUp", "inventree"] as const;

/** Regex projection of one file. Caller supplies raw SysML; comments/strings are stripped here. */
export function parseRegexFile(
  raw: string,
  path: string,
): { nodes: SysmlNode[]; edges: SysmlEdge[] } {
  const src = stripStrings(stripComments(raw));
  return parseFile(src, path);
}

/**
 * Strip block comments. Skip glob star-star-slash-star (second star then slash)
 * so markdown globs do not close `doc` comments early and drop later constructs.
 */
export function stripComments(src: string): string {
  let out = "";
  let i = 0;
  while (i < src.length) {
    if (src.startsWith("//", i)) {
      const nl = src.indexOf("\n", i);
      i = nl < 0 ? src.length : nl;
      continue;
    }
    if (src.startsWith("/*", i)) {
      i += 2;
      while (i < src.length) {
        if (src[i] === "*" && src[i + 1] === "/") {
          const globStarSlashStar = src[i - 1] === "*" && src[i + 2] === "*";
          if (!globStarSlashStar) {
            i += 2;
            out += " ";
            break;
          }
        }
        i += 1;
      }
      continue;
    }
    out += src[i];
    i += 1;
  }
  return out;
}

/**
 * Brace matching must not see `{` / `}` inside quoted SysML strings.
 * Only pair quotes on the same line. An unmatched `"` (odd count after
 * comment strip, or a closer treated as opener) must not swallow later
 * `connection` usages on following lines.
 */
export function stripStrings(src: string): string {
  let out = "";
  let i = 0;
  while (i < src.length) {
    if (src[i] === '"') {
      const start = i;
      i += 1;
      while (i < src.length && src[i] !== '"' && src[i] !== "\n") i += 1;
      if (src[i] === '"') {
        i += 1;
        out += '""';
        continue;
      }
      out += '"';
      i = start + 1;
      continue;
    }
    out += src[i];
    i += 1;
  }
  return out;
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
    /\b(package|part\s+def|port\s+def|part|port|connection|connect|attribute)\b|[{};]/g;
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

    if (tok === "connection" || tok === "connect") {
      const conn =
        tok === "connect"
          ? parseConnectStmt(src, re.lastIndex)
          : parseConnection(src, re.lastIndex);
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

function matchingBrace(src: string, openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function connectionWindow(src: string, from: number): string {
  const brace = src.indexOf("{", from);
  const semi = src.indexOf(";", from);
  if (brace >= 0 && (semi < 0 || brace < semi)) {
    const end = matchingBrace(src, brace);
    return src.slice(from, end >= 0 ? end + 1 : from + 8000);
  }
  return src.slice(from, from + 800);
}

function parseConnectStmt(
  src: string,
  from: number,
): { name: string; from: string; to: string } | null {
  const m = /^\s*([A-Za-z0-9_.]+)\s+to\s+([A-Za-z0-9_.]+)/.exec(src.slice(from));
  const cFrom = m?.[1];
  const cTo = m?.[2];
  if (!cFrom || !cTo) return null;
  return { name: `connect_${cFrom}_to_${cTo}`.replace(/\./g, "_"), from: cFrom, to: cTo };
}

function parseConnection(
  src: string,
  from: number,
): { name: string; from: string; to: string } | null {
  const isDef = /^\s*def\b/.test(src.slice(from));
  const head = /^\s*(?:def\s+)?([A-Za-z_][A-Za-z0-9_]*)(?:\s*:\s*[A-Za-z_][A-Za-z0-9_]*)?/.exec(
    src.slice(from),
  );
  const name = head?.[1] ?? "connection";
  const window = connectionWindow(src, from);
  const connect = /connect\s+([A-Za-z0-9_.]+)\s+to\s+([A-Za-z0-9_.]+)/.exec(window);
  if (connect?.[1] && connect[2]) {
    return { name, from: connect[1], to: connect[2] };
  }
  const usageEnds = [
    ...window.matchAll(/\bend\s+port\s+[A-Za-z_][A-Za-z0-9_]*\s*::>\s*([A-Za-z0-9_.]+)/g),
  ].map((m) => m[1]);
  if (usageEnds[0] && usageEnds[1]) {
    return { name, from: usageEnds[0], to: usageEnds[1] };
  }
  if (isDef) return null;
  const defEnds = [
    ...window.matchAll(/\bend\s+port\s+([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([A-Za-z_][A-Za-z0-9_.]*)/g),
  ];
  if (defEnds[0]?.[1] && defEnds[1]?.[1]) {
    return { name, from: `${name}.${defEnds[0][1]}`, to: `${name}.${defEnds[1][1]}` };
  }
  return null;
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

