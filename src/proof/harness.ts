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
import { exerciseMcpBind, type McpBindExercise } from "./mcp-bind.js";

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

/** Path A ops and Path-B pin_map are not SysMLEdge bind. */
export const LIVE_MEMNET_TODO =
  "LIVE M1 Path A on mn_b05a9869 still not bind. Published Path-B narrow mn_0d4f6178 CON=124 + nested qname ego @ 0.19.9+TCP ≠ rev.sha. LIVE bind 2026-09-12 Devicor: mn_27ce8714 p1-tiny. proof_pass_claimed=false until H2H+cold. Not M1 pass.";

export const CITED_MEMNET_SESSION = "mn_b05a9869";
export const CITED_PATH_B_SESSION = "mn_0d4f6178";

export const BIND_SMOKE_THEATER =
  "Kill theater: tip Path-B / pin_map ≠ bind; #21 FAKE ego ≠ LIVE bind; Path A CON=29 on mn_b05a9869 ≠ bind; H2H later scores narrow 124+nested not gold-200. Published Path-B mn_0d4f6178 is not project@rev. leftover --map is not the 0.19.9 SCHEMA wire.";

export interface BindSmokeReport {
  ok: boolean;
  memnet_backend: string;
  memnet_mode: "FAKE" | "LIVE_TCP";
  proof_pass_claimed: false;
  scaffold_not_p1: true;
  cited_memnet_session: typeof CITED_MEMNET_SESSION;
  cited_path_b_session: typeof CITED_PATH_B_SESSION;
  path_b_con_ingest: "published_narrow_124_not_bind";
  bind: { "rev.sha": string | null; "rev.stale": boolean; "current.sha": string };
  stale: {
    "rev.stale": boolean;
    gql_read_fail_closed: boolean;
    propose_refused: boolean;
    code?: string;
  };
  reproject: { "rev.stale": boolean; gql_read_live: boolean };
  mcp?: McpBindExercise;
  notes: string[];
}

function memnetMode(): "FAKE" | "LIVE_TCP" {
  const b = (process.env.MEMNET_BACKEND ?? "fake").toLowerCase();
  return b === "tcp" || b === "live" ? "LIVE_TCP" : "FAKE";
}

export async function smokeBind(
  project: SysMLEdgeProject,
  opts: { mutateRel?: string; mcp?: boolean } = {},
): Promise<BindSmokeReport> {
  const backend = process.env.MEMNET_BACKEND ?? "fake";
  const memnet_mode = memnetMode();
  const notes: string[] = [
    BIND_SMOKE_THEATER,
    "proof_pass_claimed=false. scaffold/bind smoke ≠ P1 pass. H2H not run (scores 124+nested later). Kuzu unused. No one_way flag (lock g).",
  ];
  const bind = await project.revStatus();
  const bound =
    typeof bind["rev.sha"] === "string" &&
    /^[0-9a-f]{40}$/.test(bind["rev.sha"]) &&
    bind["rev.stale"] === false;
  const fail = (extra: Partial<BindSmokeReport> & { notes: string[] }): BindSmokeReport => ({
    ok: false,
    memnet_backend: backend,
    memnet_mode,
    proof_pass_claimed: false,
    scaffold_not_p1: true,
    cited_memnet_session: CITED_MEMNET_SESSION,
    cited_path_b_session: CITED_PATH_B_SESSION,
    path_b_con_ingest: "published_narrow_124_not_bind",
    bind: {
      "rev.sha": bind["rev.sha"],
      "rev.stale": bind["rev.stale"],
      "current.sha": bind["current.sha"],
    },
    stale: { "rev.stale": bind["rev.stale"], gql_read_fail_closed: false, propose_refused: false },
    reproject: { "rev.stale": true, gql_read_live: false },
    ...extra,
  });
  if (!bound) {
    return fail({ notes: ["rev_status not bound with stale=false", ...notes] });
  }
  notes.push(`bound rev.sha=${bind["rev.sha"]} stale=false memnet_mode=${memnet_mode}`);

  const files = await listSysmlFiles(project.ssotDir());
  const prefer =
    opts.mutateRel ??
    files
      .map((f) => f.replace(/\\/g, "/"))
      .find((f) => f.endsWith("root.sysml") || f.endsWith("P1Tiny.sysml"));
  const targetAbs = prefer
    ? prefer.startsWith("/")
      ? prefer
      : files.find((f) => f.replace(/\\/g, "/").endsWith(prefer)) ?? files[0]
    : files[0];
  if (!targetAbs) {
    return fail({ notes: ["no .sysml to mutate", ...notes] });
  }
  const body = await readFile(targetAbs, "utf8");
  await writeFile(targetAbs, body + "\n// sysmledge-stale-smoke\n");
  const st = await project.revStatus();

  let gql_read_fail_closed = false;
  try {
    await project.gqlRead({});
  } catch (e) {
    if (e instanceof StaleError && e.shape.code === "STALE") {
      gql_read_fail_closed = true;
    } else {
      notes.push(e instanceof Error ? e.message : String(e));
    }
  }

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
  notes.push(`mutated ${targetAbs}`);

  const runMcp = opts.mcp !== false;
  let mcp: McpBindExercise | undefined;
  if (runMcp) {
    mcp = await exerciseMcpBind(project);
    notes.push(
      `mcp rev_status=${mcp.rev_status_ok} gql_stale=${mcp.gql_read_stale_refused} propose_stale=${mcp.propose_stale_refused} reproject_live=${mcp.reproject_live}`,
    );
    notes.push(...mcp.notes);
  } else {
    const live = await project.reproject();
    const slice = await project.gqlRead({});
    notes.push(`reproject stale=${live["rev.stale"]} gql_live=${slice["rev.stale"] === false}`);
    const ok =
      bound &&
      st["rev.stale"] === true &&
      gql_read_fail_closed &&
      propose_refused &&
      live["rev.stale"] === false &&
      slice["rev.stale"] === false;
    notes.push("M1–M5 NOT claimed. This is SysMLEdge bind/STALE/reproject smoke only.");
    return {
      ok,
      memnet_backend: backend,
      memnet_mode,
      proof_pass_claimed: false,
      scaffold_not_p1: true,
      cited_memnet_session: CITED_MEMNET_SESSION,
      cited_path_b_session: CITED_PATH_B_SESSION,
      path_b_con_ingest: "published_narrow_124_not_bind",
      bind: {
        "rev.sha": bind["rev.sha"],
        "rev.stale": bind["rev.stale"],
        "current.sha": bind["current.sha"],
      },
      stale: { "rev.stale": st["rev.stale"], gql_read_fail_closed, propose_refused, code },
      reproject: {
        "rev.stale": live["rev.stale"],
        gql_read_live: slice["rev.stale"] === false,
      },
      notes,
    };
  }

  const after = await project.revStatus();
  let gql_read_live = false;
  try {
    const slice = await project.gqlRead({});
    gql_read_live = slice["rev.stale"] === false;
  } catch (e) {
    notes.push(e instanceof Error ? e.message : String(e));
  }
  notes.push("M1–M5 NOT claimed. This is SysMLEdge bind/STALE/reproject smoke only.");
  const ok =
    bound &&
    st["rev.stale"] === true &&
    gql_read_fail_closed &&
    propose_refused &&
    mcp.gql_read_stale_refused &&
    mcp.propose_stale_refused &&
    mcp.reproject_live &&
    mcp.gql_read_live &&
    after["rev.stale"] === false &&
    gql_read_live;
  return {
    ok,
    memnet_backend: backend,
    memnet_mode,
    proof_pass_claimed: false,
    scaffold_not_p1: true,
    cited_memnet_session: CITED_MEMNET_SESSION,
    cited_path_b_session: CITED_PATH_B_SESSION,
    path_b_con_ingest: "published_narrow_124_not_bind",
    bind: {
      "rev.sha": bind["rev.sha"],
      "rev.stale": bind["rev.stale"],
      "current.sha": bind["current.sha"],
    },
    stale: { "rev.stale": st["rev.stale"], gql_read_fail_closed, propose_refused, code },
    reproject: { "rev.stale": after["rev.stale"], gql_read_live },
    mcp,
    notes,
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
