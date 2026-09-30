import {
  CopilotKitIntelligence,
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { LlamaIndexAgent } from "@ag-ui/llamaindex";

/**
 * The Copilot Runtime, as the Quickstart now builds it.
 *
 * Three things moved when the docs switched to the v2 runtime surface, and all
 * three are load-bearing:
 *
 *   - The import is `@copilotkit/runtime/v2`, not `@copilotkit/runtime`. There
 *     is no `serviceAdapter` on this surface at all — `ExperimentalEmptyAdapter`
 *     belonged to the v1 GraphQL runtime and has no counterpart here.
 *   - `createCopilotRuntimeHandler` returns a plain fetch handler rather than a
 *     `{ handleRequest }` wrapper, so the route is just the verb exports below.
 *   - The file lives at `[[...slug]]/route.ts`, not `route.ts`. The handler
 *     serves a subtree — `/info`, agent runs, thread list/rename/delete — so a
 *     single-segment route would 404 everything except the bare URL.
 */

// The AG-UI server from `backend/main.py`. `LlamaIndexAgent` is a thin subclass
// of `HttpAgent` — it pins the AG-UI protocol version the LlamaIndex router
// speaks, but the URL is still a plain HTTP endpoint.
const AGENT_URL = process.env.LLAMAINDEX_AGENT_URL ?? "http://localhost:8000";

// One agent per AG-UI router. `my_agent` is the Quickstart's; the next four
// exist because `get_ag_ui_workflow_router` takes exactly one `initial_state`,
// and the doc pages define four different state shapes. The last three serve
// the HITL and Sub-Agents pages.
//
// Every path ends in `/run` because `AGUIWorkflowRouter` always registers
// `POST /run` — the prefixes are how `main.py` serves more than one.
const agents = {
  my_agent: new LlamaIndexAgent({ url: `${AGENT_URL}/run` }),
  sample_agent: new LlamaIndexAgent({ url: `${AGENT_URL}/sample_agent/run` }),
  search_agent: new LlamaIndexAgent({ url: `${AGENT_URL}/search_agent/run` }),
  qa_agent: new LlamaIndexAgent({ url: `${AGENT_URL}/qa_agent/run` }),
  task_agent: new LlamaIndexAgent({ url: `${AGENT_URL}/task_agent/run` }),

  // The HITL pages. Both only need their frontend tool forwarded, which the
  // stock router does for any tool it did not declare — so both reuse the
  // Quickstart router. The docs route `hitl-in-chat` to a dedicated
  // `/hitl-in-chat` router whose code is published nowhere, and publish no
  // agent at all for governed actions (README §9).
  "hitl-in-chat": new LlamaIndexAgent({ url: `${AGENT_URL}/run` }),
  "governed-actions": new LlamaIndexAgent({ url: `${AGENT_URL}/run` }),

  // Sub-Agents: the supervisor from the page's demo code, mounted by
  // `backend/main.py` at the `/subagents` prefix its own route.ts names.
  subagents: new LlamaIndexAgent({ url: `${AGENT_URL}/subagents/run` }),
};

/**
 * Server-side only, and deliberately not `NEXT_PUBLIC_`. A project key prefixed
 * for the browser would ship in the bundle.
 */
const INTELLIGENCE_API_KEY = process.env.INTELLIGENCE_API_KEY;

/**
 * A SECOND, SEPARATE credential — and the one that unlocks the Threads Drawer.
 *
 * `INTELLIGENCE_API_KEY` authorizes the runtime against the platform: it is what
 * makes `/info` report `mode: "intelligence"` and what makes the thread REST
 * endpoints return real rows. It does NOT advertise a license.
 *
 * `licenseToken` is what does. The runtime builds a `licenseChecker` from it (or
 * from `COPILOTKIT_LICENSE_TOKEN`), and `/info` reports `licenseStatus` off that
 * checker — `"none"` when there is no checker at all. Client-side feature UIs
 * read that field: `<CopilotThreadsDrawer>` renders its locked "Threads are a
 * CopilotKit Intelligence feature" view unless the status is `valid` or
 * `expiring`, regardless of whether threads actually work.
 *
 * So a runtime can serve threads perfectly while every drawer in the app shows
 * an Upgrade button. Set both to avoid that.
 */
const LICENSE_TOKEN = process.env.COPILOTKIT_LICENSE_TOKEN;

/**
 * `CopilotRuntimeOptions` is a union, not one object with optional fields:
 * Intelligence mode requires both `intelligence` and `identifyUser`, and SSE
 * mode permits neither. So the two shapes are built separately rather than
 * spread conditionally into one literal.
 *
 * Without a key the runtime falls back to SSE with an in-memory runner. Chat
 * still works everywhere in this harness; Threads and the Inspector's thread
 * tab stay locked, and the key is never read.
 */
function buildRuntime(): CopilotRuntime {
  if (!INTELLIGENCE_API_KEY) {
    return new CopilotRuntime({
      agents,
      runner: new InMemoryAgentRunner(),
      ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    });
  }

  return new CopilotRuntime({
    agents,
    ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    intelligence: new CopilotKitIntelligence({
      // apiUrl and wsUrl default to the managed platform — leave them unset.
      apiKey: INTELLIGENCE_API_KEY,
    }),
    // Threads are per-user. Without this, every visitor shares one history.
    // `Providers` sends these headers so the harness has a stable identity to
    // key threads on; a real app would read them from a verified session.
    identifyUser: (request) => ({
      id: request.headers.get("x-user-id") ?? "anonymous",
      name: request.headers.get("x-user-name") ?? "Anonymous",
    }),
  });
}

const handler = createCopilotRuntimeHandler({
  runtime: buildRuntime(),
  basePath: "/api/copilotkit",
});

// Four verbs, not one. GET serves `/info` and the thread list, POST runs
// agents, and PATCH/DELETE are how threads are renamed, archived, and deleted.
export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
