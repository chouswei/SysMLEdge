import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StaleError, SysMLEdgeProject, UnboundError } from "../bind/project.js";

function textResult(obj: unknown, isError = false) {
  return {
    isError,
    content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }],
  };
}

function fail(err: unknown) {
  if (err instanceof StaleError) {
    return textResult(err.shape, true);
  }
  if (err instanceof UnboundError) {
    return textResult({ code: "UNBOUND", hint: String(err.message) }, true);
  }
  return textResult({ code: "ERROR", hint: err instanceof Error ? err.message : String(err) }, true);
}

export function createSysmlEdgeMcpServer(project: SysMLEdgeProject): McpServer {
  const server = new McpServer({
    name: "sysmledge",
    version: "0.1.0",
  });

  server.tool(
    "rev_status",
    "Return current.sha, rev.sha, rev.stale, memnetSession. One-way: SysML → MemNet → GQL; not a reverse translator. SysMLEdge owns bind; not on the MemNet wire.",
    {},
    async () => {
      try {
        return textResult(await project.revStatus());
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.tool(
    "gql_read",
    "Bounded GQL read of the MemNet projection. Requires staleOk=true when STALE.",
    {
      qname: z.string().optional(),
      keyword: z.string().optional(),
      kind: z.string().optional(),
      staleOk: z.boolean().optional(),
      maxRows: z.number().int().positive().optional(),
    },
    async (args) => {
      try {
        return textResult(
          await project.gqlRead({
            qname: args.qname,
            keyword: args.keyword,
            kind: args.kind,
            staleOk: args.staleOk === true,
            maxRows: args.maxRows,
          }),
        );
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.tool(
    "gql_context",
    "Neighbourhood of one qname. Same STALE rules as gql_read.",
    {
      qname: z.string(),
      staleOk: z.boolean().optional(),
      maxRows: z.number().int().positive().optional(),
    },
    async (args) => {
      try {
        return textResult(
          await project.gqlContext({
            qname: args.qname,
            staleOk: args.staleOk === true,
            maxRows: args.maxRows,
          }),
        );
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.tool(
    "gql_impact",
    "Upstream/downstream along mapped connections (neighbourhood/usage; not exhaustive Foam closure).",
    {
      qname: z.string(),
      staleOk: z.boolean().optional(),
      maxRows: z.number().int().positive().optional(),
    },
    async (args) => {
      try {
        return textResult(
          await project.gqlImpact({
            qname: args.qname,
            staleOk: args.staleOk === true,
            maxRows: args.maxRows,
          }),
        );
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.tool(
    "list_scope",
    "Indexed package and part qnames in the bound projection.",
    { staleOk: z.boolean().optional() },
    async (args) => {
      try {
        return textResult(await project.listScope({ staleOk: args.staleOk === true }));
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.tool(
    "propose",
    "Write only under sysml-models/proposals/<id>/ (PATCH.md + delta.sysml). Refused while STALE. No SSOT save.",
    {
      intent: z.string(),
      delta_sysml: z.string(),
      affected: z.array(z.string()).optional(),
      id: z.string().optional(),
    },
    async (args) => {
      try {
        return textResult(
          await project.propose({
            intent: args.intent,
            deltaSysml: args.delta_sysml,
            affected: args.affected,
            id: args.id,
          }),
        );
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.tool(
    "reproject",
    "Rebuild MemNet from current SysML and bind rev.sha. Does not write SSOT. Does not pretend the graph is SSOT.",
    {},
    async () => {
      try {
        return textResult(await project.reproject());
      } catch (e) {
        return fail(e);
      }
    },
  );

  return server;
}
