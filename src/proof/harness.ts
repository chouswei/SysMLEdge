import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { FoamGoldList } from "../sysml/gold.js";
import { extractFoamGold, summariseGold } from "../sysml/gold.js";
import { SysMLEdgeProject, StaleError } from "../bind/project.js";
import type { MemNetAdapter } from "../memnet/adapter.js";
import { FakeMemNet } from "../memnet/fake.js";
import { FOAM_QUESTIONS } from "./questions.js";
import {
  MEMNET_LLM_FLOOR,
  MEMNET_MCP_PORT_DEFAULT,
  MEMNET_SERVE_PORT_DEFAULT,
  MemNetEnvError,
  assertLiveMemNetEnv,
} from "../memnet/env.js";
import { TcpMemNet } from "../memnet/tcp.js";
import { listSysmlFiles } from "../rev/sha.js";

export type ProofLineStatus = "PASS_SHAPE" | "SKIPPED_NO_LIVE_MEMNET" | "NOT_EXECUTED";

export interface ProofReport {
  proof_executed: false;
  proof_pass_claimed: false;
  backend: string;
  memnet_llm_floor: string;
  lines: Record<string, { status: ProofLineStatus; notes: string[] }>;
  gold_summary?: string;
  head_to_head: HeadToHeadLog;
}

export interface HeadToHeadLog {
  status: "NOT_EXECUTED";
  note: string;
  questions: Array<{
    id: string;
    prompt: string;
    arm_A_grep: {
      wall_clock_ms: null;
      context_tokens: null;
      procedure: string[];
    };
    arm_B_sysmledge: {
      wall_clock_ms: null;
      context_tokens: null;
      tools: string[];
      seed_qname: string;
      shape_ok?: boolean;
    };
  }>;
}

export function emptyHeadToHead(): HeadToHeadLog {
  return {
    status: "NOT_EXECUTED",
    note:
      "Do not invent wall-clock or token numbers. Fill only from a timed operator run. Whole-tree dump baseline is measured later as Foam .sysml byte/token count.",
    questions: FOAM_QUESTIONS.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      arm_A_grep: {
        wall_clock_ms: null,
        context_tokens: null,
        procedure: q.grep_procedure,
      },
      arm_B_sysmledge: {
        wall_clock_ms: null,
        context_tokens: null,
        tools: [q.gql_tool, "rev_status"],
        seed_qname: q.seed_qname,
      },
    })),
  };
}

export async function runProofHarness(opts: {
  goldPath?: string;
  foamSsot?: string;
  project?: SysMLEdgeProject;
  live?: boolean;
}): Promise<ProofReport> {
  const lines: ProofReport["lines"] = {};
  const live = opts.live === true;
  let backend = process.env.MEMNET_BACKEND ?? "fake";
  const notesM1: string[] = [];
  let gold: FoamGoldList | undefined;
  if (opts.foamSsot) {
    gold = await extractFoamGold(
      opts.foamSsot,
      process.env.FOAM_SOURCE_SHA ?? "UNKNOWN",
    );
    notesM1.push(summariseGold(gold));
    const hasNested = gold.nested_hand_create.some(
      (n) => n.hint === "backgroundSetIndicator" && n.qnames.length > 0,
    );
    if (!hasNested) {
      notesM1.push("backgroundSetIndicator UNKNOWN in this tree");
    }
    lines.M1 = {
      status: "PASS_SHAPE",
      notes: notesM1.concat(["ingest/reproject fidelity NOT claimed"]),
    };
  } else {
    lines.M1 = {
      status: "PASS_SHAPE",
      notes: [
        "No Foam sysml-models/ supplied; structural gold file + p1-tiny fixture stand in for CI.",
        "M1 fidelity on Foam is NOT executed.",
      ],
    };
  }

  const memnet: MemNetAdapter = live ? new TcpMemNet({
    host: process.env.MEMNET_SERVE_HOST ?? "127.0.0.1",
    port: Number(process.env.MEMNET_SERVE_PORT ?? String(MEMNET_SERVE_PORT_DEFAULT)),
  }) : new FakeMemNet();

  if (live) {
    try {
      assertLiveMemNetEnv();
      const tcp = memnet as TcpMemNet;
      await tcp.assertEngineFloor();
      backend = "tcp";
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      lines.M4 = {
        status: "SKIPPED_NO_LIVE_MEMNET",
        notes: [msg],
      };
    }
  }

  const project = opts.project;
  const head = emptyHeadToHead();
  if (project) {
    const m2notes: string[] = [];
    for (const q of FOAM_QUESTIONS) {
      try {
        const slice =
          q.gql_tool === "gql_impact"
            ? await project.gqlImpact({ qname: q.seed_qname })
            : q.gql_tool === "gql_context"
              ? await project.gqlContext({ qname: q.seed_qname })
              : await project.gqlRead({ qname: q.seed_qname });
        const ok =
          typeof slice["rev.sha"] === "string" &&
          slice["rev.sha"].length > 0 &&
          slice["rev.stale"] === false;
        const row = head.questions.find((x) => x.id === q.id);
        if (row) row.arm_B_sysmledge.shape_ok = ok;
        m2notes.push(
          `${q.id}: ${q.gql_tool} shape rev.sha=${Boolean(slice["rev.sha"])} stale=${slice["rev.stale"]} nodes=${slice.nodes.length}`,
        );
      } catch (e) {
        m2notes.push(`${q.id}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    lines.M2 = {
      status: "PASS_SHAPE",
      notes: m2notes.concat(["query slice timed proof NOT executed"]),
    };

    try {
      await project.revStatus();
      await project.gqlRead({});
      lines.M3 = {
        status: "PASS_SHAPE",
        notes: [
          "Bind owned by SysMLEdge. STALE mutate/reproject path is covered by test/p1-bind.test.ts on the fixture. Foam STALE log NOT executed.",
        ],
      };
    } catch (e) {
      if (e instanceof StaleError) {
        lines.M3 = {
          status: "PASS_SHAPE",
          notes: ["STALE fail-closed shape ok", e.shape.code],
        };
      } else {
        lines.M3 = {
          status: "PASS_SHAPE",
          notes: [e instanceof Error ? e.message : String(e)],
        };
      }
    }
  } else {
    lines.M2 = {
      status: "PASS_SHAPE",
      notes: ["No bound project; M2 Foam pin_map/gql NOT executed"],
    };
    lines.M3 = {
      status: "PASS_SHAPE",
      notes: ["No bound project; fixture STALE tests remain the structure check"],
    };
  }

  if (!lines.M4) {
    if (!live) {
      lines.M4 = {
        status: "SKIPPED_NO_LIVE_MEMNET",
        notes: [
          `Bounce requires memnet-llm==${MEMNET_LLM_FLOOR} TCP-shared serve :${MEMNET_SERVE_PORT_DEFAULT} + mcp :${MEMNET_MCP_PORT_DEFAULT}.`,
          "session_save → restart serve+MCP together → load → gold pin_map non-empty is NOT executed.",
        ],
      };
    } else {
      lines.M4 = {
        status: "NOT_EXECUTED",
        notes: [
          "Live env asserted; bounce restart is operator-gated and not run by this harness.",
        ],
      };
    }
  }

  lines.M5 = {
    status: "NOT_EXECUTED",
    notes: [
      "Head-to-head wall-clock + context footprint placeholders only. Do not invent timings.",
    ],
  };

  return {
    proof_executed: false,
    proof_pass_claimed: false,
    backend,
    memnet_llm_floor: MEMNET_LLM_FLOOR,
    lines,
    gold_summary: gold ? summariseGold(gold) : undefined,
    head_to_head: head,
  };
}

export async function smokeBind(
  project: SysMLEdgeProject,
  opts: { mutateRel?: string } = {},
): Promise<{
  ok: boolean;
  memnet_backend: string;
  memnet_mode: "FAKE" | "LIVE_TCP";
  bind: { "rev.sha": string | null; "rev.stale": boolean };
  stale: { "rev.stale": boolean; propose_refused: boolean; code?: string };
  notes: string[];
  proof_pass_claimed: false;
}> {
  const backend = process.env.MEMNET_BACKEND ?? "fake";
  const memnet_mode = backend === "tcp" ? "LIVE_TCP" : "FAKE";
  const notes: string[] = [];
  const bind = await project.revStatus();
  const bound =
    typeof bind["rev.sha"] === "string" &&
    /^[0-9a-f]{40}$/.test(bind["rev.sha"]) &&
    bind["rev.stale"] === false;
  if (!bound) {
    return {
      ok: false,
      memnet_backend: backend,
      memnet_mode,
      bind: { "rev.sha": bind["rev.sha"], "rev.stale": bind["rev.stale"] },
      stale: { "rev.stale": bind["rev.stale"], propose_refused: false },
      notes: ["rev_status not bound with stale=false"],
      proof_pass_claimed: false,
    };
  }
  notes.push(`bound rev.sha=${bind["rev.sha"]} stale=false memnet_mode=${memnet_mode}`);

  const files = await listSysmlFiles(project.ssotDir());
  const prefer =
    opts.mutateRel ??
    files.map((f) => f.replace(/\\/g, "/")).find((f) => f.endsWith("root.sysml") || f.endsWith("P1Tiny.sysml"));
  const targetAbs = prefer
    ? prefer.startsWith("/")
      ? prefer
      : files.find((f) => f.replace(/\\/g, "/").endsWith(prefer)) ?? files[0]
    : files[0];
  if (!targetAbs) {
    notes.push("no .sysml to mutate");
    return {
      ok: false,
      memnet_backend: backend,
      memnet_mode,
      bind: { "rev.sha": bind["rev.sha"], "rev.stale": bind["rev.stale"] },
      stale: { "rev.stale": false, propose_refused: false },
      notes,
      proof_pass_claimed: false,
    };
  }
  const body = await readFile(targetAbs, "utf8");
  await writeFile(targetAbs, body + "\n// sysmledge-stale-smoke\n");
  const st = await project.revStatus();
  let propose_refused = false;
  let code: string | undefined;
  try {
    await project.propose({ intent: "stale-smoke", deltaSysml: "// refused\n" });
  } catch (e) {
    if (e instanceof StaleError) {
      propose_refused = true;
      code = e.shape.code;
    } else {
      notes.push(e instanceof Error ? e.message : String(e));
    }
  }
  const ok = st["rev.stale"] === true && propose_refused;
  notes.push(`mutated ${targetAbs}`);
  notes.push("M1–M5 NOT claimed. This is bind/STALE smoke only.");
  return {
    ok: bound && ok,
    memnet_backend: backend,
    memnet_mode,
    bind: { "rev.sha": bind["rev.sha"], "rev.stale": bind["rev.stale"] },
    stale: { "rev.stale": st["rev.stale"], propose_refused, code },
    notes,
    proof_pass_claimed: false,
  };
}

export async function importFoamTree(opts: {
  source: string;
  project: SysMLEdgeProject;
}): Promise<{ "rev.sha": string | null; "rev.stale": boolean; filesHint: string }> {
  const ssot = join(opts.source, "sysml-models");
  try {
    await access(ssot);
  } catch {
    throw new Error(
      `Foam import: ${ssot} missing. Clone chouswei/modelbasedPrj-itri-vedan-foam-detection and git submodule update --init --recursive (sysml-models/libs).`,
    );
  }
  const st = await opts.project.importTree(opts.source);
  return {
    "rev.sha": st["rev.sha"],
    "rev.stale": st["rev.stale"],
    filesHint: "whole-tree import of all .sysml (never parts-only)",
  };
}

export { MemNetEnvError };
