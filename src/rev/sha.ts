import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const execFileAsync = promisify(execFile);

export function isProposalPath(relPosix: string): boolean {
  return relPosix === "proposals" || relPosix.startsWith("proposals/");
}

export async function listSysmlFiles(
  ssotDir: string,
  opts: { includeProposals?: boolean } = {},
): Promise<string[]> {
  const out: string[] = [];
  await walk(ssotDir, ssotDir, out, opts.includeProposals === true);
  out.sort();
  return out;
}

async function walk(
  root: string,
  dir: string,
  out: string[],
  includeProposals: boolean,
): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const abs = join(dir, entry.name);
    const rel = relative(root, abs).split(sep).join("/");
    if (!includeProposals && isProposalPath(rel)) continue;
    if (entry.isDirectory()) {
      await walk(root, abs, out, includeProposals);
    } else if (entry.isFile() && entry.name.endsWith(".sysml")) {
      out.push(abs);
    }
  }
}

/** Content-addressed SHA-1 (40 hex) of SSOT `.sysml` excluding proposals/. */
export async function contentAddressedSha(ssotDir: string): Promise<string> {
  const files = await listSysmlFiles(ssotDir);
  const h = createHash("sha1");
  for (const abs of files) {
    const rel = relative(ssotDir, abs).split(sep).join("/");
    const body = await readFile(abs);
    h.update(rel);
    h.update("\0");
    h.update(String(body.length));
    h.update("\0");
    h.update(body);
  }
  return h.digest("hex");
}

export async function gitRevParseHead(cwd: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], {
      cwd,
    });
    const sha = stdout.trim();
    return /^[0-9a-f]{40}$/.test(sha) ? sha : null;
  } catch {
    return null;
  }
}

export async function gitIsDirty(cwd: string): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["status", "--porcelain", "--", "sysml-models"],
      { cwd },
    );
    const lines = stdout
      .split("\n")
      .map((l) => l.trimEnd())
      .filter(Boolean)
      .filter((line) => {
        const path = line.slice(3).replace(/\\/g, "/");
        return !path.includes("sysml-models/proposals/");
      });
    return lines.length > 0;
  } catch {
    return true;
  }
}

export async function isGitRepo(dir: string): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["rev-parse", "--is-inside-work-tree"],
      { cwd: dir },
    );
    return stdout.trim() === "true";
  } catch {
    return false;
  }
}

export async function findGitRoot(dir: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["rev-parse", "--show-toplevel"],
      { cwd: dir },
    );
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

/**
 * current.sha: git HEAD when the SSOT worktree (excluding proposals) is clean;
 * otherwise content-addressed SHA of current `.sysml` files.
 */
export async function computeCurrentSha(
  projectRoot: string,
  ssotDir: string,
): Promise<{ sha: string; kind: "git" | "content" }> {
  const exists = await stat(ssotDir).then(
    (s) => s.isDirectory(),
    () => false,
  );
  if (!exists) {
    throw Object.assign(new Error("unbound: no sysml-models/ tree"), {
      code: "UNBOUND",
    });
  }
  const files = await listSysmlFiles(ssotDir);
  if (files.length === 0) {
    throw Object.assign(new Error("unbound: no .sysml in sysml-models/"), {
      code: "UNBOUND",
    });
  }
  const gitRoot = await findGitRoot(projectRoot);
  if (gitRoot) {
    const dirty = await gitIsDirty(gitRoot);
    if (!dirty) {
      const sha = await gitRevParseHead(gitRoot);
      if (sha) return { sha, kind: "git" };
    }
  }
  return { sha: await contentAddressedSha(ssotDir), kind: "content" };
}

export async function runGit(
  cwd: string,
  args: string[],
): Promise<{ stdout: string; stderr: string }> {
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: process.env.GIT_AUTHOR_NAME ?? "SysMLEdge",
    GIT_AUTHOR_EMAIL:
      process.env.GIT_AUTHOR_EMAIL ?? "sysmledge@invalid.example",
    GIT_COMMITTER_NAME: process.env.GIT_COMMITTER_NAME ?? "SysMLEdge",
    GIT_COMMITTER_EMAIL:
      process.env.GIT_COMMITTER_EMAIL ?? "sysmledge@invalid.example",
  };
  return execFileAsync(
    "git",
    [
      "-c",
      `user.name=${env.GIT_AUTHOR_NAME}`,
      "-c",
      `user.email=${env.GIT_AUTHOR_EMAIL}`,
      ...args,
    ],
    { cwd, env },
  );
}
