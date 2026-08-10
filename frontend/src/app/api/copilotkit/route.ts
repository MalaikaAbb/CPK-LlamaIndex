import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { LlamaIndexAgent } from "@ag-ui/llamaindex";
import { NextRequest } from "next/server";

// The AG-UI server from `backend/main.py`. `LlamaIndexAgent` is a thin subclass
// of `HttpAgent` from `@ag-ui/llamaindex` — it pins the AG-UI protocol version
// the LlamaIndex router speaks, but the URL is still a plain HTTP endpoint.
const AGENT_URL = process.env.LLAMAINDEX_AGENT_URL ?? "http://localhost:8000";

// 1. Any service adapter works for multi-agent setups. The empty adapter is
//    right here because the LlamaIndex workflow calls the model itself.
const serviceAdapter = new ExperimentalEmptyAdapter();

// 2. Five agents, one per AG-UI router. `my_agent` is the Quickstart's; the
//    other four exist because `get_ag_ui_workflow_router` takes exactly one
//    `initial_state`, and the doc pages define four different state shapes.
//
//    Every path ends in `/run` because `AGUIWorkflowRouter` always registers
//    `POST /run` — the prefixes are how `main.py` serves more than one.
const runtime = new CopilotRuntime({
  agents: {
    my_agent: new LlamaIndexAgent({ url: `${AGENT_URL}/run` }),
    sample_agent: new LlamaIndexAgent({ url: `${AGENT_URL}/sample_agent/run` }),
    search_agent: new LlamaIndexAgent({ url: `${AGENT_URL}/search_agent/run` }),
    qa_agent: new LlamaIndexAgent({ url: `${AGENT_URL}/qa_agent/run` }),
    task_agent: new LlamaIndexAgent({ url: `${AGENT_URL}/task_agent/run` }),
  },
});

// 3. A Next.js route handler for the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
