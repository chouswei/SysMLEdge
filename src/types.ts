export type ElementKind = "package" | "part" | "port" | "connection";

export interface SysmlNode {
  kind: ElementKind;
  qname: string;
  path: string;
  ownerQname?: string;
  typeName?: string;
  properties: Record<string, string>;
}

export interface SysmlEdge {
  kind: "connection";
  qname: string;
  path: string;
  from: string;
  to: string;
}

export interface ParsedTree {
  nodes: SysmlNode[];
  edges: SysmlEdge[];
  files: string[];
}

export interface RevIdentity {
  "current.sha": string;
  "rev.sha": string | null;
  "rev.stale": boolean;
  currentKind: "git" | "content";
  mappingVersion: string;
}

export interface StaleErrorShape {
  code: "STALE";
  "rev.sha": string | null;
  "current.sha": string;
  hint: string;
}

export interface GqlSlice {
  "rev.sha": string;
  "rev.stale": boolean;
  nodes: SysmlNode[];
  edges: SysmlEdge[];
}

export interface BindState {
  revSha: string;
  mappingVersion: string;
  memnetSession?: string;
  importedAt: string;
}

export const MAPPING_VERSION = "p1-tiny-0.1";

export const STALE_HINT =
  "reproject from current SysML, or read with staleOk=true (read-only)";
