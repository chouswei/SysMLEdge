import { FakeMemNet } from "./fake.js";
import { TcpMemNet } from "./tcp.js";
import type { MemNetAdapter } from "./adapter.js";
import { assertLiveMemNetEnv } from "./env.js";

export function createMemNetAdapter(env: NodeJS.ProcessEnv = process.env): MemNetAdapter {
  const backend = (env.MEMNET_BACKEND ?? "fake").toLowerCase();
  if (backend === "tcp" || backend === "live") {
    const live = assertLiveMemNetEnv(env);
    return new TcpMemNet({
      host: live.host,
      port: live.servePort,
    });
  }
  return new FakeMemNet();
}
