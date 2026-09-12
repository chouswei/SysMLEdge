import { createMemNetAdapter } from "./memnet/factory.js";
import { SysMLEdgeProject } from "./bind/project.js";
import { createMcpHttpServer } from "./mcp/http.js";

export function openProject(projectRoot: string): SysMLEdgeProject {
  return new SysMLEdgeProject(projectRoot, createMemNetAdapter());
}

export function startMcp(projectRoot: string) {
  const project = openProject(projectRoot);
  return createMcpHttpServer({ project });
}

export { SysMLEdgeProject } from "./bind/project.js";
export { createMemNetAdapter } from "./memnet/factory.js";
export { createSysmlEdgeMcpServer } from "./mcp/server.js";
