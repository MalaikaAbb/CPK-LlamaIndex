import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { LlamaIndexAgent } from "@ag-ui/llamaindex";

/**
 * The Components and surfaces runtime.
 *
 * https://docs.copilotkit.ai/llamaindex/generative-ui/components ("Add the
 * runtime and an agent"): `new CopilotRuntime({ agents: { default: agent },
 * runner: new InMemoryAgentRunner() })`, served multi-route at
 * `[[...slug]]`, as published. Two harness changes, both labelled:
 *
 *   - `agent` is this repo's `/components` LlamaIndex router
 *     (`backend/agents.py: create_components_router`), reached with
 *     `LlamaIndexAgent` like `/api/copilotkit` reaches its routers, instead of
 *     the page's TanStack `BuiltInAgent` (framework-own-agents).
 *   - It is mounted at `/api/copilotkit-genui`, not `/api/copilotkit`, so the
 *     catalogs these demos send never reach the other routes' agents.
 */
const AGENT_URL = process.env.LLAMAINDEX_AGENT_URL ?? "http://localhost:8000";

const agent = new LlamaIndexAgent({ url: `${AGENT_URL}/components/run` });

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit-genui" });

export const GET = handler;
export const POST = handler;
