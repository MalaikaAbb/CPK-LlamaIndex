/**
 * The MCP Apps page's runtime route, on its own path.
 *
 * Everything CopilotKit-specific is the page's snippet verbatim: the v2
 * imports, `mcpApps.servers` with the HTTP server on localhost:3108 and its
 * `serverId`, the in-memory runner, and the four-line handler with GET + POST.
 *
 * Two harness changes, both labelled:
 *   - Agent: LlamaIndex, not the doc's BuiltInAgent. The page builds
 *     `new BuiltInAgent({ model: "openai/gpt-6-luna", prompt: "You are a
 *     helpful assistant." })`; here `default` is a `LlamaIndexAgent` pointing
 *     at `create_mcp_apps_router()` (that prompt, no tools) in
 *     `backend/agents.py`, mounted at `/mcp-apps`.
 *   - Path: `/api/copilotkit-mcp-apps` instead of `/api/copilotkit`, so the
 *     MCP middleware (which needs the external server running) does not wrap
 *     every other agent in the harness.
 *
 * The MCP server itself is not part of this repo or the page: run one of the
 * example servers the page links (modelcontextprotocol/ext-apps) on 3108.
 */
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { LlamaIndexAgent } from "@ag-ui/llamaindex";

const AGENT_URL = process.env.LLAMAINDEX_AGENT_URL ?? "http://localhost:8000";

// 1. Create your agent
// Agent: LlamaIndex, not the doc's BuiltInAgent (see the header comment).
const agent = new LlamaIndexAgent({ url: `${AGENT_URL}/mcp-apps/run` });

// 2. Create a service adapter, empty if not relevant

// 3. Create the runtime with mcpApps configured
const runtime = new CopilotRuntime({
  agents: {
    default: agent,
  },
  mcpApps: {
    servers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "my-server", // Recommended: stable identifier
      },
    ],
  },
  runner: new InMemoryAgentRunner(),
});

// 4. Create the API route
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-mcp-apps",
});

export const GET = handler;
export const POST = handler;
