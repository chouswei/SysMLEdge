import { createMcpHttpServer } from "../mcp/http.js";
import type { SysMLEdgeProject } from "../bind/project.js";

export interface McpBindExercise {
  tools: string[];
  rev_status_ok: boolean;
  gql_read_stale_refused: boolean;
  propose_stale_refused: boolean;
  reproject_live: boolean;
  gql_read_live: boolean;
  notes: string[];
}

const BIND_TOOLS = [
  "rev_status",
  "gql_read",
  "gql_context",
  "gql_impact",
  "list_scope",
  "propose",
  "reproject",
] as const;

/**
 * Exercise SysMLEdge MCP bind rules (streamable HTTP). Not MemNet pin_map.
 * Caller must already have mutated SysML so the projection is STALE.
 */
export async function exerciseMcpBind(project: SysMLEdgeProject): Promise<McpBindExercise> {
  const notes: string[] = [];
  const token = "bind-smoke-token";
  const { http, listen } = createMcpHttpServer({
    project,
    token,
    host: "127.0.0.1",
    port: 0,
  });
  const { url } = await listen();
  try {
    const sessionId = await mcpInitialize(url, token);
    const listed = await mcpRpc(url, token, sessionId, 2, "tools/list", {});
    const tools = ((listed.result as { tools?: { name: string }[] })?.tools ?? []).map(
      (t) => t.name,
    );
    for (const t of BIND_TOOLS) {
      if (!tools.includes(t)) notes.push(`missing MCP tool ${t}`);
    }
    if (tools.includes("save") || tools.includes("import")) {
      notes.push("forbidden agent SSOT tools listed");
    }

    const statusCall = await mcpTool(url, token, sessionId, 3, "rev_status", {});
    const staleOnStatus =
      statusCall.json["rev.stale"] === true &&
      typeof statusCall.json["rev.sha"] === "string";

    const gqlStale = await mcpTool(url, token, sessionId, 4, "gql_read", {});
    const gql_read_stale_refused = gqlStale.json.code === "STALE";

    const proposeStale = await mcpTool(url, token, sessionId, 5, "propose", {
      intent: "mcp-stale-smoke",
      delta_sysml: "// refused\n",
    });
    const propose_stale_refused = proposeStale.json.code === "STALE";

    const reproj = await mcpTool(url, token, sessionId, 6, "reproject", {});
    const reproject_live =
      reproj.isError !== true && reproj.json["rev.stale"] === false;

    const gqlLive = await mcpTool(url, token, sessionId, 7, "gql_read", {});
    const gql_read_live =
      gqlLive.isError !== true && gqlLive.json["rev.stale"] === false;

    return {
      tools,
      rev_status_ok: staleOnStatus,
      gql_read_stale_refused,
      propose_stale_refused,
      reproject_live,
      gql_read_live,
      notes,
    };
  } finally {
    await new Promise<void>((resolve, reject) =>
      http.close((e) => (e ? reject(e) : resolve())),
    );
  }
}

async function mcpInitialize(url: string, token: string): Promise<string> {
  const init = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "bind-smoke", version: "0" },
      },
    }),
  });
  if (init.status !== 200) {
    throw new Error(`MCP initialize HTTP ${init.status}`);
  }
  const sessionId = init.headers.get("mcp-session-id");
  if (!sessionId) throw new Error("MCP initialize missing mcp-session-id");
  await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      "mcp-session-id": sessionId,
    },
    body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
  });
  return sessionId;
}

async function mcpTool(
  url: string,
  token: string,
  sessionId: string,
  id: number,
  name: string,
  args: Record<string, unknown>,
): Promise<{ isError: boolean; json: Record<string, unknown> }> {
  const rpc = await mcpRpc(url, token, sessionId, id, "tools/call", {
    name,
    arguments: args,
  });
  const result = rpc.result as
    | { isError?: boolean; content?: { text?: string }[] }
    | undefined;
  const text = result?.content?.[0]?.text ?? "{}";
  let json: Record<string, unknown> = {};
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    json = { hint: text };
  }
  return { isError: result?.isError === true, json };
}

async function mcpRpc(
  url: string,
  token: string,
  sessionId: string,
  id: number,
  method: string,
  params: unknown,
): Promise<{ result?: unknown; error?: unknown }> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      "mcp-session-id": sessionId,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  const raw = await res.text();
  if (res.status !== 200) {
    throw new Error(`MCP ${method} HTTP ${res.status}: ${raw.slice(0, 400)}`);
  }
  return parseMcpHttpBody(raw);
}

function parseMcpHttpBody(raw: string): { result?: unknown; error?: unknown } {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed) as { result?: unknown; error?: unknown };
  }
  const dataLines = trimmed
    .split("\n")
    .filter((l) => l.startsWith("data:"))
    .map((l) => l.slice(5).trim())
    .filter(Boolean);
  if (dataLines.length === 0) {
    throw new Error(`unparsed MCP body: ${raw.slice(0, 400)}`);
  }
  return JSON.parse(dataLines[dataLines.length - 1]!) as {
    result?: unknown;
    error?: unknown;
  };
}
