import {
  type ATNSimulator,
  BailErrorStrategy,
  BaseErrorListener,
  CharStream,
  CommonTokenStream,
  DefaultErrorStrategy,
  ParserRuleContext,
  PredictionMode,
  type RecognitionException,
  type Recognizer,
  type Token,
} from "antlr4ng";
import type { SysmlEdge, SysmlNode } from "../types.js";
import { SysMLv2Lexer } from "./generated/SysMLv2Lexer.js";
import {
  type AttributeUsageContext,
  type ConnectionUsageContext,
  type IdentificationContext,
  type PackageContext,
  type PartDefinitionContext,
  type PartUsageContext,
  type PortDefinitionContext,
  type PortUsageContext,
  SysMLv2Parser,
  type UsageDeclarationContext,
} from "./generated/SysMLv2Parser.js";

const ATTR_KEYS = ["partNumber", "clickUp", "inventree"] as const;

export type ParseEngine = "antlr" | "regex";

export type WalkerDisposition = "projected" | "omitted" | "walked_not_kind";

export interface CensusConstruct {
  kind: string;
  rule: number;
  walker: WalkerDisposition;
  note: string;
}

/** Grammar constructs the walker may see. Projected kinds stay Foam-complete P0 only. */
export const CENSUS_CONSTRUCTS: readonly CensusConstruct[] = [
  { kind: "package", rule: SysMLv2Parser.RULE_package, walker: "projected", note: "package node" },
  { kind: "library_package", rule: SysMLv2Parser.RULE_libraryPackage, walker: "projected", note: "package node" },
  { kind: "part_def", rule: SysMLv2Parser.RULE_partDefinition, walker: "projected", note: "part node" },
  { kind: "part_usage", rule: SysMLv2Parser.RULE_partUsage, walker: "projected", note: "part node" },
  { kind: "port_def", rule: SysMLv2Parser.RULE_portDefinition, walker: "projected", note: "port node" },
  { kind: "port_usage", rule: SysMLv2Parser.RULE_portUsage, walker: "projected", note: "port node" },
  { kind: "connection_usage", rule: SysMLv2Parser.RULE_connectionUsage, walker: "projected", note: "connection edge when two ends resolve" },
  { kind: "connection_def", rule: SysMLv2Parser.RULE_connectionDefinition, walker: "walked_not_kind", note: "definition is not a usage edge" },
  { kind: "attribute_usage", rule: SysMLv2Parser.RULE_attributeUsage, walker: "walked_not_kind", note: "only partNumber / clickUp / inventree become properties" },
  { kind: "attribute_def", rule: SysMLv2Parser.RULE_attributeDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "item_def", rule: SysMLv2Parser.RULE_itemDefinition, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "item_usage", rule: SysMLv2Parser.RULE_itemUsage, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "requirement_def", rule: SysMLv2Parser.RULE_requirementDefinition, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "requirement_usage", rule: SysMLv2Parser.RULE_requirementUsage, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "satisfy_requirement", rule: SysMLv2Parser.RULE_satisfyRequirementUsage, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "action_def", rule: SysMLv2Parser.RULE_actionDefinition, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "action_usage", rule: SysMLv2Parser.RULE_actionUsage, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "perform_action", rule: SysMLv2Parser.RULE_performActionUsage, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "state_def", rule: SysMLv2Parser.RULE_stateDefinition, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "state_usage", rule: SysMLv2Parser.RULE_stateUsage, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "exhibit_state", rule: SysMLv2Parser.RULE_exhibitStateUsage, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "constraint_def", rule: SysMLv2Parser.RULE_constraintDefinition, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "constraint_usage", rule: SysMLv2Parser.RULE_constraintUsage, walker: "omitted", note: "Foam-complete mapping gap" },
  { kind: "enumeration_def", rule: SysMLv2Parser.RULE_enumerationDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "interface_def", rule: SysMLv2Parser.RULE_interfaceDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "interface_usage", rule: SysMLv2Parser.RULE_interfaceUsage, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "flow_def", rule: SysMLv2Parser.RULE_flowDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "flow_usage", rule: SysMLv2Parser.RULE_flowUsage, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "allocation_def", rule: SysMLv2Parser.RULE_allocationDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "allocation_usage", rule: SysMLv2Parser.RULE_allocationUsage, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "calc_def", rule: SysMLv2Parser.RULE_calculationDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "calc_usage", rule: SysMLv2Parser.RULE_calculationUsage, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "occurrence_def", rule: SysMLv2Parser.RULE_occurrenceDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "occurrence_usage", rule: SysMLv2Parser.RULE_occurrenceUsage, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "view_def", rule: SysMLv2Parser.RULE_viewDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "view_usage", rule: SysMLv2Parser.RULE_viewUsage, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "viewpoint_def", rule: SysMLv2Parser.RULE_viewpointDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "viewpoint_usage", rule: SysMLv2Parser.RULE_viewpointUsage, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "use_case_def", rule: SysMLv2Parser.RULE_useCaseDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "use_case_usage", rule: SysMLv2Parser.RULE_useCaseUsage, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "concern_def", rule: SysMLv2Parser.RULE_concernDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "concern_usage", rule: SysMLv2Parser.RULE_concernUsage, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "analysis_case_def", rule: SysMLv2Parser.RULE_analysisCaseDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "analysis_case_usage", rule: SysMLv2Parser.RULE_analysisCaseUsage, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "metadata_def", rule: SysMLv2Parser.RULE_metadataDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "rendering_def", rule: SysMLv2Parser.RULE_renderingDefinition, walker: "omitted", note: "not a P0 graph kind" },
  { kind: "rendering_usage", rule: SysMLv2Parser.RULE_renderingUsage, walker: "omitted", note: "not a P0 graph kind" },
];

const RULE_TO_CENSUS_KIND = new Map(CENSUS_CONSTRUCTS.map((c) => [c.rule, c.kind]));

export function emptyConstructHits(): Record<string, number> {
  const hits: Record<string, number> = {};
  for (const c of CENSUS_CONSTRUCTS) hits[c.kind] = 0;
  return hits;
}

export function countConstructHits(tree: ParserRuleContext): Record<string, number> {
  const hits = emptyConstructHits();
  const walk = (node: ParserRuleContext): void => {
    const kind = RULE_TO_CENSUS_KIND.get(node.ruleIndex);
    if (kind) hits[kind] = (hits[kind] ?? 0) + 1;
    walkChildren(node, walk);
  };
  walk(tree);
  return hits;
}

export interface AntlrFileParse {
  nodes: SysmlNode[];
  edges: SysmlEdge[];
  errors: string[];
  ok: boolean;
  hits: Record<string, number>;
}

interface Frame {
  kind: "package" | "part";
  name: string;
  qname: string;
}

class CollectingErrorListener extends BaseErrorListener {
  readonly errors: string[] = [];

  override syntaxError(
    _recognizer: Recognizer<ATNSimulator>,
    _offendingSymbol: Token | null,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | null,
  ): void {
    this.errors.push(`${line}:${charPositionInLine} ${msg}`);
  }
}

/**
 * Parse one SysML file with the pinned ANTLR4 grammar
 * (git submodule vendor/sysml-v2-grammar @ v2026.05.0).
 * Projects Foam-complete kinds only. Not a full-KerML claim.
 */
export function parseAntlrFile(src: string, path: string): AntlrFileParse {
  const errors: string[] = [];
  let tree: ParserRuleContext | null = null;
  try {
    const parsed = parseRoot(src);
    errors.push(...parsed.errors);
    tree = parsed.tree;
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }
  if (!tree) {
    return { nodes: [], edges: [], errors, ok: false, hits: emptyConstructHits() };
  }
  const walked = walkTree(tree, path);
  const hits = countConstructHits(tree);
  return { ...walked, errors, ok: errors.length === 0, hits };
}

function parseRoot(src: string): { tree: ParserRuleContext | null; errors: string[] } {
  const input = CharStream.fromString(src);
  const lexer = new SysMLv2Lexer(input);
  const listener = new CollectingErrorListener();
  lexer.removeErrorListeners();
  lexer.addErrorListener(listener);
  const tokens = new CommonTokenStream(lexer);
  tokens.fill();
  const parser = new SysMLv2Parser(tokens);
  parser.removeErrorListeners();

  let tree: ParserRuleContext | null = null;
  try {
    parser.interpreter.predictionMode = PredictionMode.SLL;
    parser.errorHandler = new BailErrorStrategy();
    tree = parser.rootNamespace();
  } catch {
    tree = null;
  }

  if (!tree) {
    tokens.seek(0);
    parser.reset();
    parser.interpreter.predictionMode = PredictionMode.LL;
    parser.errorHandler = new DefaultErrorStrategy();
    parser.addErrorListener(listener);
    try {
      tree = parser.rootNamespace();
    } catch {
      tree = null;
    }
  }

  return { tree, errors: listener.errors };
}

function walkTree(
  tree: ParserRuleContext,
  path: string,
): { nodes: SysmlNode[]; edges: SysmlEdge[] } {
  const nodes: SysmlNode[] = [];
  const edges: SysmlEdge[] = [];
  const stack: Frame[] = [];
  const seen = new Set<string>();

  const pushNode = (n: SysmlNode) => {
    const k = n.qname + "@" + n.kind;
    if (seen.has(k)) return;
    seen.add(k);
    nodes.push(n);
  };

  const walk = (node: ParserRuleContext): void => {
    switch (node.ruleIndex) {
      case SysMLv2Parser.RULE_package:
      case SysMLv2Parser.RULE_libraryPackage: {
        const pkg = node as PackageContext;
        const name = identFromIdentification(findChild(pkg, SysMLv2Parser.RULE_identification));
        if (name) {
          const qname = qualify(stack, name);
          pushNode({ kind: "package", qname, path, properties: {} });
          stack.push({ kind: "package", name, qname });
          walkChildren(node, walk);
          stack.pop();
          return;
        }
        break;
      }
      case SysMLv2Parser.RULE_partDefinition: {
        const ctx = node as PartDefinitionContext;
        const name = identFromIdentification(
          findChild(ctx.definition?.() ?? ctx, SysMLv2Parser.RULE_identification),
        );
        if (name) {
          const qname = qualify(stack, name);
          const owner = stack.at(-1)?.qname;
          const attrs = collectAttributes(ctx);
          pushNode({
            kind: "part",
            qname,
            path,
            ownerQname: owner,
            properties: attrs,
          });
          stack.push({ kind: "part", name, qname });
          walkChildren(node, walk);
          stack.pop();
          return;
        }
        break;
      }
      case SysMLv2Parser.RULE_partUsage: {
        const ctx = node as PartUsageContext;
        const usage = ctx.usage?.();
        const decl = usage?.usageDeclaration?.() as UsageDeclarationContext | null | undefined;
        const name = identFromIdentification(decl?.identification?.() ?? null);
        if (name) {
          const typeName = typeFromDecl(decl ?? null);
          const qname = qualify(stack, name);
          const owner = stack.at(-1)?.qname;
          pushNode({
            kind: "part",
            qname,
            path,
            ownerQname: owner,
            typeName,
            properties: typeName ? { type: typeName } : {},
          });
          stack.push({ kind: "part", name, qname });
          walkChildren(node, walk);
          stack.pop();
          return;
        }
        break;
      }
      case SysMLv2Parser.RULE_portDefinition: {
        const ctx = node as PortDefinitionContext;
        const name = identFromIdentification(
          findChild(ctx.definition?.() ?? ctx, SysMLv2Parser.RULE_identification),
        );
        if (name) {
          const qname = qualify(stack, name);
          const owner = stack.at(-1)?.qname;
          pushNode({ kind: "port", qname, path, ownerQname: owner, properties: {} });
        }
        walkChildren(node, walk);
        return;
      }
      case SysMLv2Parser.RULE_portUsage: {
        const ctx = node as PortUsageContext;
        const usage = ctx.usage?.();
        const decl = usage?.usageDeclaration?.() as UsageDeclarationContext | null | undefined;
        const name = identFromIdentification(decl?.identification?.() ?? null);
        if (name) {
          const typeName = typeFromDecl(decl ?? null);
          const qname = qualify(stack, name);
          const owner = stack.at(-1)?.qname;
          pushNode({
            kind: "port",
            qname,
            path,
            ownerQname: owner,
            typeName,
            properties: typeName ? { type: typeName } : {},
          });
        }
        walkChildren(node, walk);
        return;
      }
      case SysMLv2Parser.RULE_connectionDefinition:
        // Definition is not a usage edge (same as regex: EthernetHostToSwitchPort).
        walkChildren(node, walk);
        return;
      case SysMLv2Parser.RULE_connectionUsage: {
        const ctx = node as ConnectionUsageContext;
        const decl = ctx.usageDeclaration?.() as UsageDeclarationContext | null | undefined;
        const named = identFromIdentification(decl?.identification?.() ?? null);
        const ends = collectConnectorEnds(ctx);
        if (ends.length >= 2) {
          const from = ends[0]!;
          const to = ends[1]!;
          const name =
            named ?? `connect_${from}_to_${to}`.replace(/\./g, "_");
          const qname = qualify(stack, name);
          edges.push({ kind: "connection", qname, path, from, to });
        }
        walkChildren(node, walk);
        return;
      }
      case SysMLv2Parser.RULE_attributeUsage: {
        const ctx = node as AttributeUsageContext;
        const usage = ctx.usage?.();
        const decl = usage?.usageDeclaration?.() as UsageDeclarationContext | null | undefined;
        const key = identFromIdentification(decl?.identification?.() ?? null);
        const value = quotedValue(usage?.usageCompletion?.()?.valuePart?.() ?? null);
        if (key && value !== undefined && ATTR_KEYS.includes(key as (typeof ATTR_KEYS)[number])) {
          const owner = [...nodes].reverse().find((n) => n.kind === "part");
          if (owner) owner.properties[key] = value;
        }
        walkChildren(node, walk);
        return;
      }
      default:
        break;
    }
    walkChildren(node, walk);
  };

  walk(tree);
  return { nodes, edges };
}

function walkChildren(node: ParserRuleContext, walk: (n: ParserRuleContext) => void): void {
  for (let i = 0; i < node.getChildCount(); i++) {
    const child = node.getChild(i);
    if (child instanceof ParserRuleContext) walk(child);
  }
}

function findChild(node: ParserRuleContext | null | undefined, rule: number): IdentificationContext | null {
  if (!node) return null;
  if (node.ruleIndex === rule) return node as IdentificationContext;
  for (let i = 0; i < node.getChildCount(); i++) {
    const child = node.getChild(i);
    if (child instanceof ParserRuleContext) {
      const hit = findChild(child, rule);
      if (hit) return hit;
    }
  }
  return null;
}

function identFromIdentification(ctx: IdentificationContext | ParserRuleContext | null): string | undefined {
  if (!ctx) return undefined;
  const names: string[] = [];
  collectNames(ctx, names);
  const last = names.at(-1);
  if (!last) return undefined;
  return last.replace(/^["']|["']$/g, "");
}

function collectNames(node: ParserRuleContext, out: string[]): void {
  if (node.ruleIndex === SysMLv2Parser.RULE_name) {
    out.push(node.getText());
    return;
  }
  for (let i = 0; i < node.getChildCount(); i++) {
    const child = node.getChild(i);
    if (child instanceof ParserRuleContext) collectNames(child, out);
  }
}

function typeFromDecl(decl: UsageDeclarationContext | null): string | undefined {
  if (!decl) return undefined;
  const types: string[] = [];
  collectRuleText(decl, SysMLv2Parser.RULE_featureTyping, types);
  const t = types[0];
  return t || undefined;
}

function collectRuleText(node: ParserRuleContext, rule: number, out: string[]): void {
  if (node.ruleIndex === rule) {
    out.push(node.getText());
    return;
  }
  for (let i = 0; i < node.getChildCount(); i++) {
    const child = node.getChild(i);
    if (child instanceof ParserRuleContext) collectRuleText(child, rule, out);
  }
}

function collectConnectorEnds(ctx: ConnectionUsageContext): string[] {
  const ends: string[] = [];
  const visit = (node: ParserRuleContext): void => {
    if (
      node.ruleIndex === SysMLv2Parser.RULE_connectionUsage &&
      node !== ctx
    ) {
      return;
    }
    if (node.ruleIndex === SysMLv2Parser.RULE_connectionDefinition) return;
    if (node.ruleIndex === SysMLv2Parser.RULE_ownedReferenceSubsetting) {
      ends.push(node.getText());
      return;
    }
    for (let i = 0; i < node.getChildCount(); i++) {
      const child = node.getChild(i);
      if (child instanceof ParserRuleContext) visit(child);
    }
  };
  visit(ctx);
  return ends;
}

function collectAttributes(ctx: ParserRuleContext): Record<string, string> {
  const props: Record<string, string> = {};
  const visit = (node: ParserRuleContext): void => {
    if (
      node.ruleIndex === SysMLv2Parser.RULE_partDefinition ||
      node.ruleIndex === SysMLv2Parser.RULE_partUsage
    ) {
      if (node !== ctx) return;
    }
    if (node.ruleIndex === SysMLv2Parser.RULE_attributeUsage) {
      const attr = node as AttributeUsageContext;
      const usage = attr.usage?.();
      const decl = usage?.usageDeclaration?.() as UsageDeclarationContext | null | undefined;
      const key = identFromIdentification(decl?.identification?.() ?? null);
      const value = quotedValue(usage?.usageCompletion?.()?.valuePart?.() ?? null);
      if (key && value !== undefined && ATTR_KEYS.includes(key as (typeof ATTR_KEYS)[number])) {
        props[key] = value;
      }
    }
    for (let i = 0; i < node.getChildCount(); i++) {
      const child = node.getChild(i);
      if (child instanceof ParserRuleContext) visit(child);
    }
  };
  visit(ctx);
  return props;
}

function quotedValue(node: ParserRuleContext | null): string | undefined {
  if (!node) return undefined;
  const text = node.getText();
  const m = /"([^"]*)"/.exec(text);
  return m?.[1];
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
