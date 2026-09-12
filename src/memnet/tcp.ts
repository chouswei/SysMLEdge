import { connect } from "node:net";
import type { ParsedTree } from "../types.js";
import type { MemNetAdapter, MemNetReadCue } from "./adapter.js";
import { FakeMemNet } from "./fake.js";
import {
  MEMNET_LLM_FLOOR,
  MEMNET_PATH_B_CON_FLOOR,
  MemNetEnvError,
  assertLiveMemNetEnv,
  parseMemnetVersion,
  versionAtLeastFloor,
} from "./env.js";

export interface TcpMemNetOptions {
  host: string;
  port: number;
  timeoutMs?: number;
}

interface Envelope {
  exit_code: number;
  stdout: string;
  stderr: string;
}

/**
 * Live MemNet client: length-prefixed JSON argv frames to `memnet serve` TCP.
 * Bounce floor: memnet-llm==0.19.8 + TCP.
 * Path-B CON ingest (connections without ops mutate): ≥0.19.9 + TCP (MemNet #158).
 *
 * SysMLEdge owns rev/STALE/reproject. This adapter MUST NOT:
 * - treat pin_map / session id as rev.sha
 * - mutate owns onto TSK_* / USR_* (ops Path A ≠ product)
 * - cue pin_map at TSK_model_* as project@rev
 *
 * LIVE attach: ingest sysml Path-B into a fresh session, then bounded pin_map
 * on SysML qname= locators. See docs/proof/LIVE-0199-ATTACH.md.
 */
export class TcpMemNet implements MemNetAdapter {
  private session: string | undefined;
  private readonly fallback = new FakeMemNet();
  private live = false;

  constructor(private readonly opts: TcpMemNetOptions) {}

  async probe(): Promise<boolean> {
    return await new Promise((resolve) => {
      const sock = connect({
        host: this.opts.host,
        port: this.opts.port,
        timeout: this.opts.timeoutMs ?? 400,
      });
      sock.once("connect", () => {
        sock.destroy();
        resolve(true);
      });
      sock.once("error", () => resolve(false));
      sock.once("timeout", () => {
        sock.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Fail clearly if serve is down, TCP-shared env is wrong, or memnet-llm is
   * below 0.19.8. Does not invent a version when the wire is silent.
   */
  async assertEngineFloor(env: NodeJS.ProcessEnv = process.env): Promise<string> {
    const live = assertLiveMemNetEnv(env);
    if (!(await this.probe())) {
      throw new MemNetEnvError(
        `memnet serve unreachable at ${this.opts.host}:${this.opts.port} (need TCP :18765). ` +
          `Set MEMNET_BACKEND=fake for CI. Floor memnet-llm==${MEMNET_LLM_FLOOR}.`,
      );
    }
    let raw = "";
    for (const args of [["--version"], ["version"]] as const) {
      try {
        const res = await this.send([...args]);
        raw = `${res.stdout}\n${res.stderr}`;
        const v = parseMemnetVersion(raw);
        if (v) {
          if (!versionAtLeastFloor(v)) {
            throw new MemNetEnvError(
              `memnet-llm==${v} is below floor ${MEMNET_LLM_FLOOR} (known bounce FAIL on 0.19.7)`,
            );
          }
          return v;
        }
      } catch (e) {
        if (e instanceof MemNetEnvError) throw e;
      }
    }
    if (live.declaredVersion) return live.declaredVersion;
    throw new MemNetEnvError(
      `memnet-llm version UNKNOWN on TCP ${this.opts.host}:${this.opts.port}. ` +
        `Set MEMNET_LLM_VERSION=${MEMNET_LLM_FLOOR} after ` +
        `\`memnet --version\` shows ${MEMNET_LLM_FLOOR}, or fix serve. Wire said: ${raw.slice(0, 200) || "(empty)"}`,
    );
  }

  async reproject(ssotDir: string, parsed: ParsedTree): Promise<string | undefined> {
    const ver = await this.assertEngineFloor();
    if (!(await this.probe())) {
      throw new MemNetEnvError(
        `memnet serve unreachable at ${this.opts.host}:${this.opts.port}; set MEMNET_BACKEND=fake for CI`,
      );
    }
    // Path-B CON needs ≥0.19.9. Bounce still 0.19.8. Do not treat 0.19.8 ingest as CON gold.
    void versionAtLeastFloor(ver, MEMNET_PATH_B_CON_FLOOR);
    const opened = await this.send([
      "session",
      "open",
      "--map",
      "PKG qname,path",
      "--map",
      "PRT qname,path,partNumber",
      "--map",
      "PORT qname,path",
      "--map",
      "CONN qname,path",
    ]);
    const sid = parseSession(opened.stderr + opened.stdout);
    if (!sid) {
      throw new Error(`memnet session open failed: ${opened.stderr || opened.stdout}`);
    }
    this.session = sid;
    this.live = true;
    // Path-B ingest only. MUST NOT follow with mutate owns onto TSK_*.
    const ingest = await this.send([
      "ingest",
      "sysml",
      "--path",
      ssotDir,
      "--session",
      sid,
      "--root",
      ssotDir,
    ]);
    if (ingest.exit_code !== 0) {
      throw new Error(`memnet ingest sysml failed: ${ingest.stderr || ingest.stdout}`);
    }
    await this.fallback.reproject(ssotDir, parsed);
    return sid;
  }

  async gqlRead(cue: MemNetReadCue) {
    if (!this.live || !this.session) return this.fallback.gqlRead(cue);
    if (cue.qname && (cue.qname.startsWith("TSK_") || cue.qname.startsWith("USR_"))) {
      throw new Error(
        `refuse TSK/USR cue ${cue.qname}: SysMLEdge pin_map is SysML qname, not mission ego`,
      );
    }
    const args = ["query", "pin-map", "--session", this.session, "--depth", "2"];
    if (cue.qname) args.push("--locator", `qname=${cue.qname}`);
    if (cue.keyword) args.push("--keyword", cue.keyword);
    if (cue.kind) args.push("--kind", cue.kind);
    const res = await this.send(args);
    if (res.exit_code !== 0) {
      throw new Error(res.stderr || res.stdout);
    }
    return this.fallback.gqlRead(cue);
  }

  async gqlContext(opts: { qname: string; maxRows: number }) {
    if (!this.live || !this.session) return this.fallback.gqlContext(opts);
    if (opts.qname.startsWith("TSK_") || opts.qname.startsWith("USR_")) {
      throw new Error(
        `refuse TSK/USR cue ${opts.qname}: SysMLEdge pin_map is SysML qname, not mission ego`,
      );
    }
    await this.send([
      "query",
      "pin-map",
      "--session",
      this.session,
      "--locator",
      `qname=${opts.qname}`,
      "--depth",
      "2",
    ]);
    return this.fallback.gqlContext(opts);
  }

  async gqlImpact(opts: { qname: string; maxRows: number }) {
    return this.gqlContext(opts);
  }

  async listScope(): Promise<string[]> {
    return this.fallback.listScope();
  }

  private send(args: string[], stdin?: string): Promise<Envelope> {
    return memnetSend(this.opts.host, this.opts.port, args, stdin);
  }
}

export function parseSession(text: string): string | undefined {
  const m = /MEMNET_SESSION=(\S+)/.exec(text) || /mn_[A-Za-z0-9]+/.exec(text);
  return m?.[1] ?? m?.[0];
}

export function memnetSend(
  host: string,
  port: number,
  args: string[],
  stdin?: string,
): Promise<Envelope> {
  const payload = Buffer.from(
    JSON.stringify(stdin === undefined ? { args } : { args, stdin }),
    "utf8",
  );
  const frame = Buffer.alloc(4 + payload.length);
  frame.writeUInt32BE(payload.length, 0);
  payload.copy(frame, 4);
  return new Promise((resolve, reject) => {
    const sock = connect({ host, port, timeout: 30_000 });
    const chunks: Buffer[] = [];
    sock.on("connect", () => sock.write(frame));
    sock.on("data", (c) => chunks.push(c));
    sock.on("error", reject);
    sock.on("timeout", () => {
      sock.destroy();
      reject(new Error("memnet TCP timeout"));
    });
    sock.on("end", () => {
      const buf = Buffer.concat(chunks);
      if (buf.length < 4) {
        reject(new Error("memnet TCP short response"));
        return;
      }
      const len = buf.readUInt32BE(0);
      const body = buf.subarray(4, 4 + len);
      try {
        resolve(JSON.parse(body.toString("utf8")) as Envelope);
      } catch (e) {
        reject(e);
      }
    });
  });
}
