import { readFile } from "node:fs/promises";
import type { ParsedTree, SysmlEdge, SysmlNode } from "../types.js";
import { parseSysmlTree } from "./parse.js";
import { listSysmlFiles } from "../rev/sha.js";

/** Nested usages that previously needed MemNet hand CREATE (Memnetor). */
export const FOAM_NESTED_HAND_CREATE_HINTS = ["backgroundSetIndicator"] as const;

export interface GoldUnknown {
  kind: string;
  name: string;
  path: string;
  reason: string;
}

export interface FoamGoldList {
  status: "FROZEN_LIST" | "NOT_A_PROOF_PASS";
  proof_executed: false;
  source: {
    repo: string;
    sha: string;
    tree: string;
    parser: string;
  };
  counts: {
    files: number;
    packages: number;
    parts: number;
    ports: number;
    connections_parsed: number;
    nested_parts: number;
  };
  packages: string[];
  parts: string[];
  ports: string[];
  connections: Array<{ qname: string; from: string; to: string }>;
  nested_parts: Array<{ qname: string; ownerQname?: string }>;
  nested_hand_create: Array<{
    hint: string;
    qnames: string[];
    status: "IDENTIFIED" | "UNKNOWN";
  }>;
  unknown: GoldUnknown[];
}

export function buildGoldFromParsed(
  parsed: ParsedTree,
  opts: {
    sourceSha: string;
    repo?: string;
    unknown?: GoldUnknown[];
  },
): FoamGoldList {
  const packages = parsed.nodes.filter((n) => n.kind === "package").map((n) => n.qname);
  const parts = parsed.nodes.filter((n) => n.kind === "part");
  const ports = parsed.nodes.filter((n) => n.kind === "port");
  const partQ = new Set(parts.map((n) => n.qname));
  const nested = parts.filter(
    (n) => n.ownerQname && partQ.has(n.ownerQname),
  );
  const nestedHand = FOAM_NESTED_HAND_CREATE_HINTS.map((hint) => {
    const qnames = parts
      .filter((n) => n.qname.split("::").pop() === hint)
      .map((n) => n.qname)
      .sort();
    return {
      hint,
      qnames,
      status: (qnames.length > 0 ? "IDENTIFIED" : "UNKNOWN") as "IDENTIFIED" | "UNKNOWN",
    };
  });
  return {
    status: "FROZEN_LIST",
    proof_executed: false,
    source: {
      repo: opts.repo ?? "chouswei/modelbasedPrj-itri-vedan-foam-detection",
      sha: opts.sourceSha,
      tree: "sysml-models/",
      parser: "src/sysml/parse.ts",
    },
    counts: {
      files: parsed.files.length,
      packages: packages.length,
      parts: parts.length,
      ports: ports.length,
      connections_parsed: parsed.edges.length,
      nested_parts: nested.length,
    },
    packages: sortUniq(packages),
    parts: sortUniq(parts.map((n) => n.qname)),
    ports: sortUniq(ports.map((n) => n.qname)),
    connections: parsed.edges
      .map((e) => ({ qname: e.qname, from: e.from, to: e.to }))
      .sort((a, b) => a.qname.localeCompare(b.qname)),
    nested_parts: nested
      .map((n) => ({ qname: n.qname, ownerQname: n.ownerQname }))
      .sort((a, b) => a.qname.localeCompare(b.qname)),
    nested_hand_create: nestedHand,
    unknown: opts.unknown ?? [],
  };
}

export async function extractFoamGold(
  ssotDir: string,
  sourceSha: string,
): Promise<FoamGoldList> {
  const parsed = await parseSysmlTree(ssotDir);
  const unknown = await scanUnknownConnections(ssotDir, parsed);
  unknown.push(...libsUnknown(parsed));
  unknown.push(...(await scanMissingPartDefs(ssotDir, parsed)));
  return buildGoldFromParsed(parsed, { sourceSha, unknown });
}

function libsUnknown(parsed: ParsedTree): GoldUnknown[] {
  const hasLibs = parsed.files.some((f) => f.startsWith("libs/"));
  if (hasLibs) return [];
  return [
    {
      kind: "submodule",
      name: "sysml-models/libs",
      path: "sysml-models/libs",
      reason:
        "UNKNOWN until git submodule sysml-models/libs is present. Gold freeze is the Foam tree files that were parsed; common-lib kinds are not claimed.",
    },
  ];
}

async function scanMissingPartDefs(
  ssotDir: string,
  parsed: ParsedTree,
): Promise<GoldUnknown[]> {
  const files = await listSysmlFiles(ssotDir);
  const shorts = new Set(
    parsed.nodes.filter((n) => n.kind === "part").map((n) => n.qname.split("::").pop()),
  );
  const unknown: GoldUnknown[] = [];
  const re = /\bpart\s+def\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  for (const abs of files) {
    const src = await readFile(abs, "utf8");
    const rel = parsed.files.find((f) => abs.endsWith(f)) ?? abs;
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(src))) {
      const name = m[1];
      if (!name) continue;
      if (!shorts.has(name)) {
        unknown.push({
          kind: "part_def",
          name,
          path: rel,
          reason:
            "part def present in SysML but missing from parser output (often `doc /*` closed early by markdown `**.../**`). UNKNOWN — do not invent a qname.",
        });
      }
    }
  }
  return uniqueUnknown(unknown);
}

/**
 * Parser only emits connection edges with `connect A to B`.
 * Foam uses many `connection def` / named usages without that syntax.
 */
async function scanUnknownConnections(
  ssotDir: string,
  parsed: ParsedTree,
): Promise<GoldUnknown[]> {
  const files = await listSysmlFiles(ssotDir);
  const parsedQ = new Set(parsed.edges.map((e) => e.qname));
  const unknown: GoldUnknown[] = [];
  const nameRe = /^[ \t]*connection(?:\s+def)?\s+([A-Za-z_][A-Za-z0-9_]*)/gm;
  for (const abs of files) {
    const src = await readFile(abs, "utf8");
    const rel = parsed.files.find((f) => abs.endsWith(f)) ?? abs;
    let m: RegExpExecArray | null;
    nameRe.lastIndex = 0;
    while ((m = nameRe.exec(src))) {
      const name = m[1];
      if (!name) continue;
      const hit = [...parsedQ].some((q) => q === name || q.endsWith("::" + name));
      if (!hit) {
        unknown.push({
          kind: "connection",
          name,
          path: rel,
          reason:
            "Parser requires `connect <from> to <to>`; this connection def/usage has no such clause in the 400-char window (UNKNOWN endpoints).",
        });
      }
    }
  }
  return uniqueUnknown(unknown);
}

function sortUniq(xs: string[]): string[] {
  return [...new Set(xs)].sort();
}

function uniqueUnknown(xs: GoldUnknown[]): GoldUnknown[] {
  const seen = new Set<string>();
  const out: GoldUnknown[] = [];
  for (const u of xs) {
    const k = `${u.kind}:${u.name}:${u.path}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(u);
  }
  return out;
}

export function goldJson(gold: FoamGoldList): string {
  return JSON.stringify(gold, null, 2) + "\n";
}

export function summariseGold(gold: FoamGoldList): string {
  const nested = gold.nested_hand_create
    .map((n) => `${n.hint}: ${n.status} (${n.qnames.join(", ") || "none"})`)
    .join("; ");
  return [
    `files=${gold.counts.files}`,
    `packages=${gold.counts.packages}`,
    `parts=${gold.counts.parts}`,
    `ports=${gold.counts.ports}`,
    `connections_parsed=${gold.counts.connections_parsed}`,
    `nested_parts=${gold.counts.nested_parts}`,
    `unknown=${gold.unknown.length}`,
    nested,
    "proof_executed=false",
  ].join("\n");
}

export function assertGoldShape(gold: FoamGoldList): string[] {
  const errors: string[] = [];
  if (gold.proof_executed !== false) errors.push("must not claim proof executed");
  if (gold.counts.parts < 1) errors.push("gold needs ≥1 part");
  const nested = gold.nested_hand_create.find((n) => n.hint === "backgroundSetIndicator");
  if (!nested || nested.status !== "IDENTIFIED" || nested.qnames.length < 1) {
    errors.push("gold MUST include ≥1 nested backgroundSetIndicator (or mark UNKNOWN explicitly)");
  }
  return errors;
}

export function countMatches(
  gold: FoamGoldList,
  nodes: SysmlNode[],
  edges: SysmlEdge[],
): { extra: string[]; missing: string[] } {
  const got = new Set([
    ...nodes.filter((n) => n.kind === "part").map((n) => n.qname),
  ]);
  const missing = gold.parts.filter((q) => !got.has(q));
  const extra = [...got].filter((q) => !gold.parts.includes(q));
  return { extra, missing };
}
