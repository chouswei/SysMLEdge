import { startMcp } from "../index.js";

const projectRoot = process.env.SYSMLEDGE_PROJECT ?? process.cwd();
const { listen } = startMcp(projectRoot);
const { url } = await listen();
console.error(`SysMLEdge MCP ${url}`);
