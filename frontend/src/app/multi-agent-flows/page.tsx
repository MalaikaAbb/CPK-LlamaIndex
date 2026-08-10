import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const ROUTER_SNIPPET = `// Router Mode — omit the agent prop, and CopilotKit picks per message.
<CopilotKit runtimeUrl="<copilot-runtime-url>">
  {/* Your application components */}
</CopilotKit>`;

const LOCK_SNIPPET = `// Agent Lock — name the agent, and every request stays inside it.
<CopilotKit runtimeUrl="<copilot-runtime-url>" agent="<the-name-of-the-agent>">
  {/* Your application components */}
</CopilotKit>`;

const THIS_REPO_SNIPPET = `// This repo: no agent on the provider, an agentId per surface.
// Same lock, finer grain — the doc allows different agents in different areas
// of one app, and forbids only nesting a second provider.
<CopilotKitProvider runtimeUrl="/api/copilotkit" showDevConsole="auto">
  {children}
</CopilotKitProvider>

// …then, on each route:
<CopilotChat agentId="search_agent" />
const { agent } = useAgent({ agentId: "search_agent" });`;

const MODES: [string, string, string][] = [
  [
    "Who picks the agent",
    "The runtime's LLM, per message",
    "You, once — at the provider or the surface",
  ],
  ["Needs a service adapter", "Yes", "No"],
  [
    "Conversation shape",
    "One thread that can change hands",
    "One thread per agent id",
  ],
  ["Exercisable in this repo", "No", "Yes — the demo route"],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/multi-agent-flows" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          CopilotKit can either decide which agent handles a message, or be told.
          Router Mode is the default and delegates the choice to an LLM in the
          runtime; Agent Lock names one agent and keeps every request inside it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          This repo is Agent Lock throughout, applied per surface rather than
          once on the provider. Five routers are registered and every chat, hook,
          and demo names the one it wants — which is why switching ids in the
          demo starts a clean conversation each time.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium" />
                <th className="pb-2 pr-4 font-medium">Router Mode</th>
                <th className="pb-2 font-medium">Agent Lock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MODES.map(([label, router, lock]) => (
                <tr key={label} className="align-top">
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-100">
                    {label}
                  </td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">
                    {router}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {lock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={[
              "On my_agent: What's the weather in Oslo?",
              "Switch to search_agent, then: Search for the tallest mountains",
            ]}
            expect="Each agent answers with only its own tools, and switching tabs shows an empty conversation rather than the previous agent's history."
            fail="An agent-not-found error on one tab — that id is missing from the runtime's agents map, or its router is not included in main.py."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Router Mode is not wired up here">
        The doc&apos;s own callout says Router Mode requires an LLM adapter on
        the runtime. This repo registers{" "}
        <code>ExperimentalEmptyAdapter</code>, because each LlamaIndex workflow
        calls OpenAI itself and the runtime has no reason to hold a second key.
        Enabling routing would mean giving the Next process its own model
        credentials purely to pick between agents — a real change to the
        architecture every other route in this harness tests, so it is left out
        and this route is marked Partial rather than Working.
      </Callout>

      <Panel title="The two modes, as the doc writes them">
        <div className="space-y-4">
          <CodeBlock
            filename="Router Mode (default)"
            language="tsx"
            code={ROUTER_SNIPPET}
          />
          <CodeBlock filename="Agent Lock" language="tsx" code={LOCK_SNIPPET} />
          <CodeBlock
            filename="What this repo does instead"
            language="tsx"
            code={THIS_REPO_SNIPPET}
          />
        </div>
      </Panel>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/multi-agent-flows/demo-chat/page.tsx" />
      </Panel>

      <Panel title="Orchestration lives in the workflow, not the runtime">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Worth separating two things the page&apos;s title blurs together.
          &ldquo;Multi-agent orchestration&rdquo; in LlamaIndex means one
          workflow delegating to sub-agents inside{" "}
          <code>get_ag_ui_workflow_router</code> — CopilotKit never sees it, and
          the doc gives no sample for it. What the doc actually documents is the
          much narrower question of how the <em>frontend</em> chooses between
          agents the runtime already knows about. Only the second is implemented
          here, because only the second has code on the page.
        </p>
      </Panel>
    </>
  );
}
