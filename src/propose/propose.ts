import { mkdir, writeFile } from "node:fs/promises";
import { join, normalize, relative, sep } from "node:path";
import { randomUUID } from "node:crypto";

export async function writeProposal(
  ssotDir: string,
  opts: {
    baseSha: string;
    intent: string;
    deltaSysml: string;
    affected: string[];
    id?: string;
  },
): Promise<{ id: string; path: string; "base.sha": string }> {
  const id = opts.id ?? `prop-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}`;
  if (id.includes("..") || id.includes("/") || id.includes("\\")) {
    throw new Error("propose refused: id must be a single path segment");
  }
  const dir = join(ssotDir, "proposals", id);
  const proposalsRoot = join(ssotDir, "proposals");
  const rel = relative(proposalsRoot, dir).split(sep).join("/");
  if (rel.startsWith("..") || normalize(dir) === normalize(ssotDir)) {
    throw new Error("propose refused: path escapes proposals/");
  }
  await mkdir(dir, { recursive: true });
  const patch = [
    `# Proposal ${id}`,
    "",
    `base.sha: ${opts.baseSha}`,
    "",
    "## Intent",
    "",
    opts.intent.trim(),
    "",
    "## Affected qnames",
    "",
    ...(opts.affected.length ? opts.affected.map((q) => `- \`${q}\``) : ["- (none listed)"]),
    "",
    "Agents propose only. Human save applies this onto current.",
    "",
  ].join("\n");
  await writeFile(join(dir, "PATCH.md"), patch, "utf8");
  await writeFile(join(dir, "delta.sysml"), opts.deltaSysml, "utf8");
  return { id, path: `sysml-models/proposals/${id}/`, "base.sha": opts.baseSha };
}
