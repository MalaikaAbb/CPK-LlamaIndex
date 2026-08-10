import Link from "next/link";

import { BackendHealth } from "@/components/backend-health";
import { RouteHeader } from "@/components/route-header";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";
import { DOCS_ROOT, NAV } from "@/lib/nav-config";

const AGENTS: [string, string, string][] = [
  [
    "my_agent",
    ":8000/run",
    "getWeather · Quickstart, Tool Rendering, and every stateless route",
  ],
  [
    "sample_agent",
    ":8000/sample_agent/run",
    "no tools, language state · Shared State read + write",
  ],
  [
    "search_agent",
    ":8000/search_agent/run",
    "addSearch, runSearches · State Rendering",
  ],
  [
    "qa_agent",
    ":8000/qa_agent/run",
    "answerQuestion, addResource · Workflow Execution",
  ],
  [
    "task_agent",
    ":8000/task_agent/run",
    "execute_task · Predictive State Updates",
  ],
];

export default function Page() {
  const counts = NAV.flatMap((g) => g.routes).reduce<Record<string, number>>(
    (acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }),
    {},
  );

  return (
    <>
      <RouteHeader path="/" />

      <Panel title="What this is">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A working test harness for the CopilotKit + LlamaIndex integration.
          Each route implements one doc page against a real agent, and shows the
          exact source that makes it work.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Everything here comes from the documentation. No tool, system prompt,
          or state shape was invented for this repo — the backend exposes exactly
          the six tools the doc pages define, and nothing else.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              [
                "Docs tracked",
                <a
                  key="d"
                  href={DOCS_ROOT}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  {DOCS_ROOT}
                </a>,
              ],
              [
                "Routes",
                `${counts.working ?? 0} working · ${counts.partial ?? 0} partial · ${
                  counts.reference ?? 0
                } reference · ${counts["not-started"] ?? 0} not started`,
              ],
            ]}
          />
        </div>
      </Panel>

      <Panel
        title="Connection check"
        description="Both processes must be up before any chat route will respond."
      >
        <BackendHealth />
      </Panel>

      <Panel title="The five agents">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The backend serves five AG-UI routers rather than one.{" "}
          <code>get_ag_ui_workflow_router</code> takes exactly one{" "}
          <code>initial_state</code> and one <code>backend_tools</code> list, and
          the docs define four different state shapes plus a stateless agent. One
          router cannot carry all of them without inventing a merged state that
          appears on no page.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[38rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Runtime id</th>
                <th className="pb-2 pr-4 font-medium">Endpoint</th>
                <th className="pb-2 font-medium">Backend tools · used by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {AGENTS.map(([id, endpoint, blurb]) => (
                <tr key={id}>
                  <td className="py-2 pr-4 font-mono text-xs">{id}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{endpoint}</td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {blurb}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Every path ends in <code>/run</code> because{" "}
          <code>AGUIWorkflowRouter</code> always registers{" "}
          <code>POST /run</code> on the router it returns. FastAPI{" "}
          <code>prefix=</code> is what lets five of them coexist.
        </p>
      </Panel>

      <Panel title="How a message travels">
        <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>1.</strong> A chat component posts to{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
              /api/copilotkit
            </code>{" "}
            in this Next app.
          </li>
          <li>
            <strong>2.</strong> The Copilot Runtime resolves the agent id and
            forwards the run to the matching AG-UI endpoint via a{" "}
            <code>LlamaIndexAgent</code>.
          </li>
          <li>
            <strong>3.</strong> <code>AGUIChatWorkflow</code> runs: it prepends
            the current state to the last user message, streams the model, and
            executes any backend tools.
          </li>
          <li>
            <strong>4.</strong> AG-UI events stream back as SSE. Browser-executed
            tools run here, and their results go back so the run can continue.
          </li>
        </ol>
        <div className="mt-4">
          <Callout tone="info">
            The OpenAI key lives only in the agent process. The browser never
            holds it, because it never talks to the agent directly.
          </Callout>
        </div>
      </Panel>

      <Panel title="Start here">
        <TryIt
          prompts={["Can you tell me a joke?"]}
          expect={
            <>
              On{" "}
              <Link href="/quickstart" className="underline">
                /quickstart
              </Link>
              , a streamed reply.
            </>
          }
          fail="An error banner, or no reply at all — check the connection panel above."
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Sidebar dot colours mirror status. The{" "}
          <Link
            href="/status"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            status overview
          </Link>{" "}
          lists every route in one table.
        </p>
      </Panel>
    </>
  );
}
