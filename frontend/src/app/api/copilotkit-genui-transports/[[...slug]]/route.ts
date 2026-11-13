import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { LlamaIndexAgent } from "@ag-ui/llamaindex";

/**
 * The Transports page's runtime.
 *
 * https://docs.copilotkit.ai/llamaindex/generative-ui/components/transports
 * prints `new CopilotRuntime({ agents: { default: agent }, generativeUI: true })`
 * (verbatim below). `agent` is the same `/components` LlamaIndex router as
 * `/api/copilotkit-genui` (framework-own-agents swap for the section's
 * `BuiltInAgent`); mounted at `/api/copilotkit-genui-transports` so
 * `generativeUI: true` stays on this page.
 *
 * The page's "Only some agents" sample names a `shop` agent. No page publishes
 * one, so none is registered: only the `default` half of that sample runs.
 */
const AGENT_URL = process.env.LLAMAINDEX_AGENT_URL ?? "http://localhost:8000";

const agent = new LlamaIndexAgent({ url: `${AGENT_URL}/components/run` });

const runtime = new CopilotRuntime({
  agents: { default: agent },
  generativeUI: true,
});

const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit-genui-transports" });

export const GET = handler;
export const POST = handler;
