import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createMemNetAdapter } from "./memnet/factory.js";
import { SysMLEdgeProject } from "./bind/project.js";
import { createMcpHttpServer } from "./mcp/http.js";
import { extractFoamGold, goldJson, summariseGold } from "./sysml/gold.js";
import { importFoamTree, runProofHarness, emptyHeadToHead, smokeBind } from "./proof/harness.js";
import { TcpMemNet } from "./memnet/tcp.js";
import { assertLiveMemNetEnv } from "./memnet/env.js";
import { probeLiveTcp } from "./memnet/probe.js";
import { isProtectedMemnetSession } from "./memnet/sessions.js";

function usage(): never {
  console.error(`sysmledge — P1 runtime (fixture + Foam proof scaffolding)

Usage:
  sysmledge import <sysml-tree> [--project DIR]
  sysmledge import-foam <foam-repo> [--project DIR]
  sysmledge gold <sysml-models-dir> [--sha SHA] [-o FILE]
  sysmledge proof [--project DIR] [--foam-ssot DIR] [--live]
  sysmledge smoke-bind [--project DIR] [--mutate-file REL] [--mcp|--no-mcp]
  sysmledge head-to-head [-o FILE]
  sysmledge memnet-check
  sysmledge live-probe
  sysmledge status [--project DIR]
  sysmledge reproject [--project DIR]
  sysmledge save [--message MSG] [--project DIR]
  sysmledge download [--rev SHA|current] -o FILE [--project DIR]
  sysmledge mcp [--project DIR] [--port N]

Env:
  MEMNET_BACKEND=fake|tcp          default fake (CI)
  MEMNET_MCP_TRANSPORT=tcp          required when backend=tcp
  MEMNET_SERVE_HOST                default 127.0.0.1
  MEMNET_SERVE_PORT                must be 18765 for live proof env
  MEMNET_MCP_PORT                  must be 18766 for TCP-shared MCP
  MEMNET_LLM_VERSION                bounce 0.19.8; LIVE bind 0.19.9 if serve omits version
  MEMNET_MAP_FILE                  SCHEMA --map-file with qname on PRT/POR/CON (default fixtures/memnet-session.map)
  SYSMLEDGE_MCP_TOKEN              Bearer token (optional locally)
  SYSMLEDGE_MCP_PORT               default 18776
  FOAM_SOURCE_SHA                  Foam git SHA for gold freeze

Proof M1–M5 is scaffolding only. This CLI MUST NOT claim a Foam/MemNet proof pass.
  head-to-head is a null scaffold (known gap). Plumbing p1-tiny meters are operator-logged, not this command.
`);
  process.exit(2);
}

async function main(argv: string[]): Promise<void> {
  const cmd = argv[0];
  if (!cmd || cmd === "-h" || cmd === "--help") usage();

  if (cmd === "live-probe") {
    const report = await probeLiveTcp({
      extraHost: process.env.MEMNET_SERVE_HOST,
    });
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exit(2);
    return;
  }

  if (cmd === "memnet-check") {
    const attach = process.env.MEMNET_ATTACH_SESSION;
    if (isProtectedMemnetSession(attach)) {
      throw new Error(
        `refuse MEMNET_ATTACH_SESSION=${attach}: cited Path-A/Path-B sessions are not SysMLEdge bind. Open a new ingest session (docs/proof/LIVE-0199-ATTACH.md).`,
      );
    }
    const live = assertLiveMemNetEnv();
    const tcp = new TcpMemNet({ host: live.host, port: live.servePort });
    const version = await tcp.assertEngineFloor();
    console.log(
      JSON.stringify(
        {
          ok: true,
          memnet_llm: version,
          serve: `${live.host}:${live.servePort}`,
          mcp_port: live.mcpPort,
          transport: live.transport,
          proof_pass_claimed: false,
        },
        null,
        2,
      ),
    );
    return;
  }

  if (cmd === "gold") {
    const src = argv[1];
    if (!src) usage();
    const sha = flag(argv, "--sha") ?? process.env.FOAM_SOURCE_SHA ?? "UNKNOWN";
    const gold = await extractFoamGold(resolve(src), sha);
    const json = goldJson(gold);
    const out = flag(argv, "-o") ?? flag(argv, "--out");
    if (out) {
      await mkdir(dirname(resolve(out)), { recursive: true });
      await writeFile(out, json);
    } else {
      process.stdout.write(json);
    }
    console.error(summariseGold(gold));
    return;
  }

  if (cmd === "head-to-head") {
    const log = emptyHeadToHead();
    const json = JSON.stringify(log, null, 2) + "\n";
    const out = flag(argv, "-o") ?? flag(argv, "--out");
    if (out) {
      await mkdir(dirname(resolve(out)), { recursive: true });
      await writeFile(out, json);
      console.error(
        `wrote ${out} (null scaffold: wall-clock and tokens still null; plumbing H2H ≠ product pass; see docs/proof/RUNLOG-2026-09-12-h2h-plumbing.md)`,
      );
    } else {
      process.stdout.write(json);
    }
    return;
  }

  const projectDir = flag(argv, "--project") ?? process.cwd();
  const project = new SysMLEdgeProject(resolve(projectDir), createMemNetAdapter());

  if (cmd === "smoke-bind") {
    const mutateRel = flag(argv, "--mutate-file");
    const mcp = !argv.includes("--no-mcp");
    const report = await smokeBind(project, { mutateRel, mcp });
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exit(1);
    return;
  }

  if (cmd === "import") {
    const src = argv[1];
    if (!src) usage();
    const st = await project.importTree(resolve(src));
    console.log(JSON.stringify(st, null, 2));
    return;
  }
  if (cmd === "import-foam") {
    const src = argv[1];
    if (!src) usage();
    const st = await importFoamTree({ source: resolve(src), project });
    console.log(JSON.stringify({ ...st, proof_pass_claimed: false }, null, 2));
    return;
  }
  if (cmd === "proof") {
    const foamSsot = flag(argv, "--foam-ssot");
    const live = argv.includes("--live");
    const report = await runProofHarness({
      foamSsot: foamSsot ? resolve(foamSsot) : undefined,
      project,
      live,
    });
    console.log(JSON.stringify(report, null, 2));
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
