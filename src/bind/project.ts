import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { cp } from "node:fs/promises";
import type { BindState, GqlSlice, RevIdentity, StaleErrorShape } from "../types.js";
import { MAPPING_VERSION, STALE_HINT } from "../types.js";
import {
  computeCurrentSha,
  isGitRepo,
  listSysmlFiles,
  runGit,
} from "../rev/sha.js";
import type { MemNetAdapter } from "../memnet/adapter.js";
import { parseSysmlTree } from "../sysml/parse.js";
import { writeProposal } from "../propose/propose.js";
import { zipSysmlTree } from "../ssot/zip.js";

export class StaleError extends Error {
  readonly shape: StaleErrorShape;
  constructor(shape: StaleErrorShape) {
    super(
      `code: STALE\nrev.sha: ${shape["rev.sha"] ?? "unknown"}\ncurrent.sha: ${shape["current.sha"]}\nhint: ${shape.hint}`,
    );
    this.name = "StaleError";
    this.shape = shape;
  }
}

export class UnboundError extends Error {
  constructor(message = "projection cannot name a SHA; refuse unbound graph") {
    super(message);
    this.name = "UnboundError";
  }
}

export class SysMLEdgeProject {
  constructor(
    readonly projectRoot: string,
    readonly memnet: MemNetAdapter,
  ) {}

  ssotDir(): string {
    return join(this.projectRoot, "sysml-models");
  }

  bindPath(): string {
    return join(this.projectRoot, ".sysmledge", "bind.json");
  }

  async loadBind(): Promise<BindState | null> {
    try {
      const raw = await readFile(this.bindPath(), "utf8");
      return JSON.parse(raw) as BindState;
    } catch {
      return null;
    }
  }

  async saveBind(state: BindState): Promise<void> {
    await mkdir(dirname(this.bindPath()), { recursive: true });
    await writeFile(this.bindPath(), JSON.stringify(state, null, 2) + "\n");
  }

  async revStatus(): Promise<RevIdentity> {
    const current = await computeCurrentSha(this.projectRoot, this.ssotDir());
    const bind = await this.loadBind();
    const revSha = bind?.revSha ?? null;
    if (!revSha) {
      throw new UnboundError();
    }
    return {
      "current.sha": current.sha,
      "rev.sha": revSha,
      "rev.stale": current.sha !== revSha,
      currentKind: current.kind,
      mappingVersion: bind?.mappingVersion ?? MAPPING_VERSION,
    };
  }

  staleShape(status: RevIdentity): StaleErrorShape {
    return {
      code: "STALE",
      "rev.sha": status["rev.sha"],
      "current.sha": status["current.sha"],
      hint: STALE_HINT,
    };
  }

  async assertLiveForWrite(): Promise<RevIdentity> {
    const status = await this.revStatus();
    if (status["rev.stale"]) {
      throw new StaleError(this.staleShape(status));
    }
    return status;
  }

  async assertReadable(staleOk: boolean): Promise<RevIdentity> {
    const status = await this.revStatus();
    if (status["rev.stale"] && !staleOk) {
      throw new StaleError(this.staleShape(status));
    }
    return status;
  }

  /**
   * Whole-tree import. Overwrites current sysml-models/. Previous current
   * remains if the source is invalid.
   */
  async importTree(source: string): Promise<RevIdentity> {
    const sourceSsot = await resolveSsotRoot(source);
    const files = await listSysmlFiles(sourceSsot, { includeProposals: true });
    const ssotFiles = files.filter(
      (f) => !relative(sourceSsot, f).split(sep).join("/").startsWith("proposals/"),
    );
    if (ssotFiles.length === 0) {
      throw new Error("import failed: no .sysml in source (previous current unchanged)");
    }
    const dest = this.ssotDir();
    await mkdir(this.projectRoot, { recursive: true });
    await rm(dest, { recursive: true, force: true });
    await cp(sourceSsot, dest, { recursive: true });
    await this.ensureGitCommit(`import sysml-models from ${source}`);
    return this.reproject();
  }

  async ensureGitCommit(message: string): Promise<string | null> {
    if (!(await isGitRepo(this.projectRoot))) {
      await runGit(this.projectRoot, ["init"]);
    }
    await runGit(this.projectRoot, ["add", "-A", "--", "sysml-models"]);
    try {
      await runGit(this.projectRoot, ["diff", "--cached", "--quiet"]);
      return (await computeCurrentSha(this.projectRoot, this.ssotDir())).sha;
    } catch {
      // dirty index → commit
    }
    await runGit(this.projectRoot, ["commit", "-m", message]);
    const { stdout } = await runGit(this.projectRoot, ["rev-parse", "HEAD"]);
    return stdout.trim();
  }

  /** Human save: whole-tree commit + auto-reproject. Not an agent MCP tool. */
  async humanSave(message = "save sysml-models"): Promise<RevIdentity> {
    await this.ensureGitCommit(message);
    return this.reproject();
  }

  async reproject(): Promise<RevIdentity> {
    const current = await computeCurrentSha(this.projectRoot, this.ssotDir());
    const parsed = await parseSysmlTree(this.ssotDir());
    const session = await this.memnet.reproject(this.ssotDir(), parsed);
    await this.saveBind({
      revSha: current.sha,
      mappingVersion: MAPPING_VERSION,
      memnetSession: session,
      importedAt: new Date().toISOString(),
    });
    return this.revStatus();
  }

  async gqlRead(opts: {
    staleOk?: boolean;
    qname?: string;
    keyword?: string;
    kind?: string;
    maxRows?: number;
  }): Promise<GqlSlice> {
    const status = await this.assertReadable(opts.staleOk === true);
    const slice = await this.memnet.gqlRead({
      qname: opts.qname,
      keyword: opts.keyword,
      kind: opts.kind,
      maxRows: opts.maxRows ?? 50,
    });
    return attachRev(slice, status);
  }

  async gqlContext(opts: {
    qname: string;
    staleOk?: boolean;
    maxRows?: number;
  }): Promise<GqlSlice> {
    const status = await this.assertReadable(opts.staleOk === true);
    const slice = await this.memnet.gqlContext({
      qname: opts.qname,
      maxRows: opts.maxRows ?? 50,
    });
    return attachRev(slice, status);
  }

  async gqlImpact(opts: {
    qname: string;
    staleOk?: boolean;
    maxRows?: number;
  }): Promise<GqlSlice> {
    const status = await this.assertReadable(opts.staleOk === true);
    const slice = await this.memnet.gqlImpact({
      qname: opts.qname,
      maxRows: opts.maxRows ?? 50,
    });
    return attachRev(slice, status);
  }

  async listScope(opts: { staleOk?: boolean } = {}): Promise<{
    "rev.sha": string;
    "rev.stale": boolean;
    qnames: string[];
  }> {
    const status = await this.assertReadable(opts.staleOk === true);
    const qnames = await this.memnet.listScope();
    return {
      "rev.sha": status["rev.sha"] as string,
      "rev.stale": status["rev.stale"],
      qnames,
    };
  }

  async propose(opts: {
    intent: string;
    deltaSysml: string;
    affected?: string[];
    id?: string;
  }): Promise<{ id: string; path: string; "base.sha": string }> {
    await this.assertLiveForWrite();
    const status = await this.revStatus();
    return writeProposal(this.ssotDir(), {
      baseSha: status["current.sha"],
      intent: opts.intent,
      deltaSysml: opts.deltaSysml,
      affected: opts.affected ?? [],
      id: opts.id,
    });
  }

  async downloadZip(rev: string | "current"): Promise<Buffer> {
    const status = await this.revStatus();
    const target = rev === "current" ? status["current.sha"] : rev;
    if (rev !== "current" && target !== status["current.sha"]) {
      const gitZip = await archiveSysmlAtRev(this.projectRoot, target);
      if (gitZip) return gitZip;
      throw new Error(`rev ${target} is not downloadable from this working copy`);
    }
    return zipSysmlTree(this.ssotDir());
  }
}

function attachRev(slice: Omit<GqlSlice, "rev.sha" | "rev.stale">, status: RevIdentity): GqlSlice {
  return {
    ...slice,
    "rev.sha": status["rev.sha"] as string,
    "rev.stale": status["rev.stale"],
  };
}

export async function resolveSsotRoot(source: string): Promise<string> {
  const nested = join(source, "sysml-models");
  try {
    const s = await stat(nested);
    if (s.isDirectory()) return nested;
  } catch {
    /* fall through */
  }
  const s = await stat(source);
  if (s.isDirectory()) return source;
  throw new Error(`import failed: not a directory: ${source}`);
}

async function archiveSysmlAtRev(
  projectRoot: string,
  sha: string,
): Promise<Buffer | null> {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const execFileAsync = promisify(execFile);
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["archive", "--format=zip", sha, "--", "sysml-models"],
      { cwd: projectRoot, encoding: "buffer", maxBuffer: 20 * 1024 * 1024 },
    );
    return stdout as unknown as Buffer;
  } catch {
    return null;
  }
}

