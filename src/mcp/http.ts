import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import type { SysMLEdgeProject } from "../bind/project.js";
import { createSysmlEdgeMcpServer } from "./server.js";

export interface McpHttpOptions {
  host?: string;
  port?: number;
  token?: string;
  project: SysMLEdgeProject;
}

/**
 * Streamable HTTP MCP face (Cursor Bearer), same pattern as memnet-pi.
 * MemNet stays TCP backend-only.
 */
export function createMcpHttpServer(opts: McpHttpOptions) {
  const host = opts.host ?? process.env.SYSMLEDGE_MCP_HOST ?? "127.0.0.1";
  const port = opts.port ?? Number(process.env.SYSMLEDGE_MCP_PORT ?? "18776");
  const token = opts.token ?? process.env.SYSMLEDGE_MCP_TOKEN;
  const sessions = new Map<
    string,
    { transport: StreamableHTTPServerTransport }
  >();

  const http = createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (e) {
      if (!res.headersSent) {
        res.writeHead(500, { "content-type": "application/json" });
      }
      res.end(JSON.stringify({ error: String(e) }));
    }
  });

  async function handle(req: IncomingMessage, res: ServerResponse) {
    const url = req.url ?? "/";
    if (url === "/health") {
      res.writeHead(200, { "content-type": "text/plain" });
      res.end("ok");
      return;
    }
    if (!url.startsWith("/mcp")) {
      res.writeHead(404).end();
      return;
    }
    if (token) {
      const auth = req.headers.authorization ?? "";
      if (auth !== `Bearer ${token}`) {
        res.writeHead(401, {
          "content-type": "application/json",
          "www-authenticate": "Bearer",
        });
        res.end(JSON.stringify({ error: "unauthorized" }));
        return;
      }
    }

    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (sessionId && sessions.has(sessionId)) {
      const rec = sessions.get(sessionId)!;
      const parsed =
        req.method === "POST" || req.method === "PUT" ? await readJson(req) : undefined;
      await rec.transport.handleRequest(req, res, parsed);
      return;
    }

    if (req.method === "POST") {
      const body = await readJson(req);
      if (body && isInitializeRequest(body)) {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          enableJsonResponse: true,
          onsessioninitialized: (sid) => {
            sessions.set(sid, { transport });
          },
        });
        const mcp = createSysmlEdgeMcpServer(opts.project);
        await mcp.connect(transport);
        await transport.handleRequest(req, res, body);
        return;
      }
    }

    res.writeHead(400, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Bad Request: No valid session ID" },
        id: null,
      }),
    );
  }

  return { http, host, port, listen: () => listen(http, host, port) };
}

function listen(
  http: ReturnType<typeof createServer>,
  host: string,
  port: number,
): Promise<{ url: string }> {
  return new Promise((resolve) => {
    http.listen(port, host, () => {
      const addr = http.address();
      const actual = typeof addr === "object" && addr ? addr.port : port;
      resolve({ url: `http://${host}:${actual}/mcp` });
    });
  });
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return undefined;
  return JSON.parse(raw);
}
