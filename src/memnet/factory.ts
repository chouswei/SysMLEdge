import { FakeMemNet } from "./fake.js";
import { TcpMemNet } from "./tcp.js";
import type { MemNetAdapter } from "./adapter.js";

export function createMemNetAdapter(env: NodeJS.ProcessEnv = process.env): MemNetAdapter {
  const backend = (env.MEMNET_BACKEND ?? "fake").toLowerCase();
  if (backend === "tcp" || backend === "live") {
    return new TcpMemNet({
      host: env.MEMNET_SERVE_HOST ?? "127.0.0.1",
      port: Number(env.MEMNET_SERVE_PORT ?? "18765"),
    });
  }
  return new FakeMemNet();
}
