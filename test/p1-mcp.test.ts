import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { SysMLEdgeProject } from "../src/bind/project.js";
import { FakeMemNet } from "../src/memnet/fake.js";
import { createMcpHttpServer } from "../src/mcp/http.js";

const fixtureRoot = fileURLToPath(new URL("../fixtures/p1-tiny", import.meta.url));

test("streamable HTTP MCP rev_status + Bearer + no save tool", async () => {
  const dir = await mkdtemp(join(tmpdir(), "sysmledge-mcp-"));
  const project = new SysMLEdgeProject(dir, new FakeMemNet());
  await project.importTree(fixtureRoot);
  const token = "test-token";
  const { http, listen } = createMcpHttpServer({
    project,
    token,
    host: "127.0.0.1",
    port: 0,
  });
  const { url } = await listen();
  try {
    const unauthorized = await fetch(url, { method: "POST", body: "{}" });
    assert.equal(unauthorized.status, 401);

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
          clientInfo: { name: "p1-test", version: "0" },
        },
      }),
    });
    assert.equal(init.status, 200);
    const sessionId = init.headers.get("mcp-session-id");
    assert.ok(sessionId, "mcp-session-id header");
    const initJson = (await init.json()) as { result?: { capabilities?: unknown } };
    assert.ok(initJson.result);

    await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        "mcp-session-id": sessionId,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "notifications/initialized",
      }),
    });

    const listed = await rpc(url, token, sessionId, 2, "tools/list", {});
    const names = (listed.result as { tools: { name: string }[] }).tools.map((t) => t.name);
    for (const t of [
      "rev_status",
      "gql_read",
      "gql_context",
      "gql_impact",
      "list_scope",
      "propose",
      "reproject",
    ]) {
      assert.ok(names.includes(t), `missing ${t}`);
    }
    assert.ok(!names.includes("save"));
    assert.ok(!names.includes("import"));
    assert.ok(!names.includes("download"));

    const status = await rpc(url, token, sessionId, 3, "tools/call", {
      name: "rev_status",
      arguments: {},
    });
    const text = (status.result as { content: { text: string }[] }).content[0]?.text ?? "";
    const parsed = JSON.parse(text) as { "rev.stale": boolean };
    assert.equal(parsed["rev.stale"], false);
  } finally {
    await new Promise<void>((resolve, reject) => http.close((e) => (e ? reject(e) : resolve())));
  }
});

async function rpc(
  url: string,
  token: string,
  sessionId: string,
  id: number,
  method: string,
  params: unknown,
) {
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
    throw new Error(`MCP ${method} HTTP ${res.status}: ${raw.slice(0, 500)}`);
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
