import { readFile } from "node:fs/promises";
import { relative, sep } from "node:path";
import type { FoamGoldList } from "./gold.js";
import { extractFoamGoldFromParsed } from "./gold.js";
import {
  CENSUS_CONSTRUCTS,
  emptyConstructHits,
  type WalkerDisposition,
} from "./parse-antlr.js";
import { parseSysmlTreeWithMeta } from "./parse.js";
import { stripComments } from "./parse-regex.js";
import { listSysmlFiles } from "../rev/sha.js";

const ERROR_SAMPLE = 3;
const QNAME_SAMPLE = 20;

/** Source keywords for files where ANTLR has no tree, and as a cross-check. */
const SOURCE_KEYWORDS: ReadonlyArray<{ kind: string; re: RegExp }> = [
  { kind: "requirement_def", re: /\brequirement\s+def\b/g },
  { kind: "requirement_usage", re: /\brequirement\s+(?!def\b)[A-Za-z_]/g },
  { kind: "item_def", re: /\bitem\s+def\b/g },
  { kind: "item_usage", re: /\bitem\s+(?!def\b)[A-Za-z_]/g },
  { kind: "action_def", re: /\baction\s+def\b/g },
  { kind: "action_usage", re: /\baction\s+(?!def\b)[A-Za-z_]/g },
  { kind: "state_def", re: /\bstate\s+def\b/g },
  { kind: "state_usage", re: /\bstate\s+(?!def\b)[A-Za-z_]/g },
  { kind: "connection_def", re: /\bconnection\s+def\b/g },
  { kind: "constraint_def", re: /\bconstraint\s+def\b/g },
  { kind: "attribute_def", re: /\battribute\s+def\b/g },
  { kind: "enumeration_def", re: /\benum\s+def\b/g },
  { kind: "interface_def", re: /\binterface\s+def\b/g },
  { kind: "flow_def", re: /\bflow\s+def\b/g },
  { kind: "calc_def", re: /\bcalc\s+def\b/g },
  { kind: "view_def", re: /\bview\s+def\b/g },
  { kind: "viewpoint_def", re: /\bviewpoint\s+def\b/g },
  { kind: "use_case_def", re: /\buse\s+case\s+def\b/g },
  { kind: "allocation_usage", re: /\ballocate\b/g },
];

export interface FileEngineRow {
  path: string;
  engine: "antlr" | "regex";
  antlrOk: boolean;
  fallbackReason: "none" | "antlr_fail" | "silent_drop";
  antlrErrorCount: number;
  antlrErrorsSample: string[];
}

export interface OmittedKindRow {
  kind: string;
  walker: WalkerDisposition;
  antlr_hits: number;
  source_keyword_hits: number;
  files: string[];
  note: string;
}

export interface CountDelta {
  got: number;
  frozen: number;
  d: number;
}

export interface ProjectionCensus {
  proof_pass_claimed: false;
  proof_executed: false;
  source: {
    repo: string;
    sha: string;
    tree: string;
    parser: string;
    grammar: string;
  };
  engines: {
    antlr: number;
    regex: number;
    regex_antlr_fail: number;
    regex_silent_drop: number;
    files: FileEngineRow[];
  };
  projected: {
    files: number;
    packages: number;
    parts: number;
    ports: number;
    connections: number;
    nested_parts: number;
  };
  frozen_gold: null | {
    sha: string;
    counts: FoamGoldList["counts"];
    delta: Record<string, CountDelta>;
    extra_part_qnames_sample: string[];
    missing_part_qnames_sample: string[];
  };
  omitted_kinds: OmittedKindRow[];
  unknown: FoamGoldList["unknown"];
}

export async function censusSysmlTree(
  ssotDir: string,
  opts: {
    sourceSha: string;
    repo?: string;
    frozenGold?: FoamGoldList;
  },
): Promise<ProjectionCensus> {
  const { tree, meta } = await parseSysmlTreeWithMeta(ssotDir);
  const gold = await extractFoamGoldFromParsed(ssotDir, tree, opts.sourceSha, opts.repo);
  const files = await listSysmlFiles(ssotDir);
  const sourceHitsByFile = new Map<string, Record<string, number>>();
  for (const abs of files) {
    const path = relative(ssotDir, abs).split(sep).join("/");
    const raw = await readFile(abs, "utf8");
    sourceHitsByFile.set(path, scanSourceKeywords(raw));
  }

  const engineFiles: FileEngineRow[] = meta.files.map((f) => ({
    path: f.path,
    engine: f.engine,
    antlrOk: f.antlrOk,
    fallbackReason: f.fallbackReason,
    antlrErrorCount: f.antlrErrors.length,
    antlrErrorsSample: f.antlrErrors.slice(0, ERROR_SAMPLE),
  }));

  const omitted = rollupOmitted(meta.files, sourceHitsByFile);

  return {
    proof_pass_claimed: false,
    proof_executed: false,
    source: {
      repo: opts.repo ?? "chouswei/modelbasedPrj-itri-vedan-foam-detection",
      sha: opts.sourceSha,
      tree: "sysml-models/",
      parser: "src/sysml/parse.ts (antlr-first; regex per-file fallback)",
      grammar: "vendor/sysml-v2-grammar @ v2026.05.0",
    },
    engines: {
      antlr: engineFiles.filter((f) => f.engine === "antlr").length,
      regex: engineFiles.filter((f) => f.engine === "regex").length,
      regex_antlr_fail: engineFiles.filter((f) => f.fallbackReason === "antlr_fail").length,
      regex_silent_drop: engineFiles.filter((f) => f.fallbackReason === "silent_drop").length,
      files: engineFiles.sort((a, b) => a.path.localeCompare(b.path)),
    },
    projected: {
      files: gold.counts.files,
      packages: gold.counts.packages,
      parts: gold.counts.parts,
      ports: gold.counts.ports,
      connections: gold.counts.connections_parsed,
      nested_parts: gold.counts.nested_parts,
    },
    frozen_gold: opts.frozenGold ? deltaAgainstFrozen(gold, opts.frozenGold) : null,
    omitted_kinds: omitted,
    unknown: gold.unknown,
  };
}

export function scanSourceKeywords(raw: string): Record<string, number> {
  const src = stripComments(raw);
  const hits = emptyConstructHits();
  for (const row of SOURCE_KEYWORDS) {
    const re = new RegExp(row.re.source, row.re.flags);
    const n = src.match(re)?.length ?? 0;
    hits[row.kind] = (hits[row.kind] ?? 0) + n;
  }
  return hits;
}

function rollupOmitted(
  files: Array<{ path: string; antlrHits: Record<string, number> }>,
  sourceHitsByFile: Map<string, Record<string, number>>,
): OmittedKindRow[] {
  const byKind = new Map<string, OmittedKindRow>();
  for (const c of CENSUS_CONSTRUCTS) {
    if (c.walker === "projected") continue;
    byKind.set(c.kind, {
      kind: c.kind,
      walker: c.walker,
      antlr_hits: 0,
      source_keyword_hits: 0,
      files: [],
      note: c.note,
    });
  }
  for (const f of files) {
    const src = sourceHitsByFile.get(f.path) ?? emptyConstructHits();
    for (const row of byKind.values()) {
      const antlr = f.antlrHits[row.kind] ?? 0;
      const source = src[row.kind] ?? 0;
      row.antlr_hits += antlr;
      row.source_keyword_hits += source;
      if (antlr > 0 || source > 0) row.files.push(f.path);
    }
  }
  return [...byKind.values()]
    .filter((r) => r.antlr_hits > 0 || r.source_keyword_hits > 0)
    .map((r) => ({ ...r, files: [...new Set(r.files)].sort() }))
    .sort((a, b) => a.kind.localeCompare(b.kind));
}

function deltaAgainstFrozen(got: FoamGoldList, frozen: FoamGoldList): NonNullable<ProjectionCensus["frozen_gold"]> {
  const keys = ["files", "packages", "parts", "ports", "connections_parsed", "nested_parts"] as const;
  const delta: Record<string, CountDelta> = {};
  for (const k of keys) {
    const g = got.counts[k];
    const f = frozen.counts[k];
    delta[k] = { got: g, frozen: f, d: g - f };
  }
  const gotParts = new Set(got.parts);
  const frozenParts = new Set(frozen.parts);
  const extra = got.parts.filter((q) => !frozenParts.has(q)).slice(0, QNAME_SAMPLE);
  const missing = frozen.parts.filter((q) => !gotParts.has(q)).slice(0, QNAME_SAMPLE);
  return {
    sha: frozen.source.sha,
    counts: frozen.counts,
    delta,
    extra_part_qnames_sample: extra,
    missing_part_qnames_sample: missing,
  };
}

export function censusJson(census: ProjectionCensus): string {
  return JSON.stringify(census, null, 2) + "\n";
}

export function summariseCensus(census: ProjectionCensus): string {
  const omitted = census.omitted_kinds
    .map((k) => `${k.kind}=${k.antlr_hits}/${k.source_keyword_hits}`)
    .join(", ");
  const d = census.frozen_gold
    ? Object.entries(census.frozen_gold.delta)
        .map(([k, v]) => `${k}:${v.d >= 0 ? "+" : ""}${v.d}`)
        .join(" ")
    : "no frozen gold";
  return [
    `engine antlr=${census.engines.antlr} regex=${census.engines.regex} (fail=${census.engines.regex_antlr_fail} silent_drop=${census.engines.regex_silent_drop})`,
    `projected files=${census.projected.files} packages=${census.projected.packages} parts=${census.projected.parts} ports=${census.projected.ports} connections=${census.projected.connections} nested=${census.projected.nested_parts}`,
    `omitted ${omitted || "none"}`,
    `vs frozen gold ${d}`,
    "proof_pass_claimed=false",
  ].join("\n");
}
