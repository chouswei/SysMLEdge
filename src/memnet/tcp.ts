import { connect } from "node:net";
import type { ParsedTree } from "../types.js";
import type { MemNetAdapter, MemNetReadCue } from "./adapter.js";
import { FakeMemNet } from "./fake.js";

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
 * Live MemNet client: length-prefixed JSON argv frames to `memnet serve` TCP
 * (memnet-llm==0.19.8). Floor is 0.19.8 + TCP. This adapter does not own rev/STALE.
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

  async reproject(ssotDir: string, parsed: ParsedTree): Promise<string | undefined> {
    if (!(await this.probe())) {
      throw new Error(
        `memnet serve unreachable at ${this.opts.host}:${this.opts.port}; set MEMNET_BACKEND=fake for CI`,
      );
    }
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
