import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createMemNetAdapter } from "./memnet/factory.js";
import { SysMLEdgeProject } from "./bind/project.js";
import { createMcpHttpServer } from "./mcp/http.js";

function usage(): never {
  console.error(`sysmledge — P1 runtime first cut (fixture + bind + MCP)

Usage:
  sysmledge import <sysml-tree> [--project DIR]
  sysmledge status [--project DIR]
  sysmledge reproject [--project DIR]
  sysmledge save [--message MSG] [--project DIR]
  sysmledge download [--rev SHA|current] -o FILE [--project DIR]
  sysmledge mcp [--project DIR] [--port N]

Env:
  MEMNET_BACKEND=fake|tcp     default fake (CI)
  MEMNET_SERVE_HOST/PORT      live memnet serve (0.19.8 TCP)
  SYSMLEDGE_MCP_TOKEN        Bearer token (optional locally)
  SYSMLEDGE_MCP_PORT         default 18776
`);
  process.exit(2);
}

async function main(argv: string[]): Promise<void> {
  const cmd = argv[0];
  if (!cmd || cmd === "-h" || cmd === "--help") usage();
  const projectDir = flag(argv, "--project") ?? process.cwd();
  const project = new SysMLEdgeProject(resolve(projectDir), createMemNetAdapter());

  if (cmd === "import") {
    const src = argv[1];
    if (!src) usage();
    const st = await project.importTree(resolve(src));
    console.log(JSON.stringify(st, null, 2));
    return;
  }
  if (cmd === "status") {
    console.log(JSON.stringify(await project.revStatus(), null, 2));
    return;
  }
  if (cmd === "reproject") {
    console.log(JSON.stringify(await project.reproject(), null, 2));
    return;
  }
  if (cmd === "save") {
    const msg = flag(argv, "--message") ?? "save sysml-models";
    console.log(JSON.stringify(await project.humanSave(msg), null, 2));
    return;
  }
  if (cmd === "download") {
    const rev = flag(argv, "--rev") ?? "current";
    const out = flag(argv, "-o") ?? flag(argv, "--out");
    if (!out) usage();
    const buf = await project.downloadZip(rev === "current" ? "current" : rev);
    await mkdir(dirname(resolve(out)), { recursive: true });
    await writeFile(out, buf);
    console.log(JSON.stringify({ out, bytes: buf.length, rev: rev }, null, 2));
    return;
  }
  if (cmd === "mcp") {
    const port = Number(flag(argv, "--port") ?? process.env.SYSMLEDGE_MCP_PORT ?? "18776");
    const { listen } = createMcpHttpServer({ project, port });
    const { url } = await listen();
    console.error(
      `SysMLEdge MCP streamable HTTP ${url} (Bearer ${process.env.SYSMLEDGE_MCP_TOKEN ? "on" : "off"})`,
    );
    console.error(
      `project=${project.projectRoot} MEMNET_BACKEND=${process.env.MEMNET_BACKEND ?? "fake"}`,
    );
    return;
  }
  usage();
}

function flag(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name);
  if (i >= 0) return argv[i + 1];
  const pref = argv.find((a) => a.startsWith(name + "="));
  return pref ? pref.slice(name.length + 1) : undefined;
}

main(process.argv.slice(2)).catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
