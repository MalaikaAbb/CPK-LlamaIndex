import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DIRECT_SNIPPET = `import { LlamaIndexAgent } from "@ag-ui/llamaindex";

const myAgent = new LlamaIndexAgent({ url: "http://localhost:8000/run" });

<CopilotKitProvider agents__unsafe_dev_only={{ "my-agent": myAgent }}>
  <YourApp />
</CopilotKitProvider>`;

const DEFAULT_SNIPPET = `// Register an agent as "default" and prebuilt UI uses it with no agentId.
const runtime = new CopilotRuntime({
  agents: {
    default: new LlamaIndexAgent({ url: "http://localhost:8000/run" }),
  },
});`;

const COMPARISON: [string, string, string][] = [
  ["Authentication", "Safe defaults provided", "You manage it"],
  ["AG-UI middleware", "Runs server-side", "Not available"],
  ["Agent routing", "Automatic", "Manual"],
  ["Ecosystem features", "Full support", "Limited"],
  ["Support", "Supported", "Not supported"],
  ["Setup", "Needs a backend endpoint", "Frontend only"],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/copilot-runtime" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The runtime is the server-side bridge between the app and the agents.
          It resolves agents by id, keeps credentials and middleware on the
          server, and re-encodes agent output as SSE for the browser.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          For LlamaIndex each binding is a <code>LlamaIndexAgent</code> from{" "}
          <code>@ag-ui/llamaindex</code>. It is a small subclass of{" "}
          <code>HttpAgent</code> that overrides <code>maxVersion</code> to pin
          the AG-UI protocol version the Python router speaks — otherwise the
          transport is an ordinary HTTP POST, which is why every URL here ends in{" "}
          <code>/run</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello"]}
            expect="All five ids stream a reply. Switching ids starts a separate conversation, because each agent id carries its own message list."
            fail="One id errors with an agent-not-found style message — it is missing from the runtime's agents map, or its router is not included in main.py."
          />
        </div>
      </Panel>

      <Panel
        title="This repo's runtime"
        description="Read from disk — diff it against the doc's single-agent sample."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/route.ts" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <code>ExperimentalEmptyAdapter</code> is used because the LlamaIndex
          workflow calls the model itself — the service adapter only matters when
          the runtime talks to a provider directly, which is also why Router Mode
          is not available here (see{" "}
          <a
            href="/multi-agent-flows"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Multi-Agent Flows
          </a>
          ).
        </p>
      </Panel>

      <Panel title="The demo page">
        <SourceCode file="frontend/src/app/copilot-runtime/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The `default` agent"
        description="Not used here — worth knowing why."
      >
        <CodeBlock
          filename="What the doc suggests for a single-agent app"
          language="ts"
          code={DEFAULT_SNIPPET}
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Registering one agent as <code>default</code> lets prebuilt components
          and <code>useAgent()</code> resolve with no id at all. This repo
          deliberately registers none: with five agents, an implicit default
          would quietly answer for whichever route forgot its{" "}
          <code>agentId</code>, and a missing id should fail loudly in a test
          harness rather than route somewhere plausible.
        </p>
      </Panel>

      <Panel
        title="Why not connect the browser straight to the agent?"
        description="AG-UI is an open protocol, so a direct connection is possible — with real losses."
      >
        <CodeBlock
          filename="Direct connection (dev only)"
          language="tsx"
          code={DIRECT_SNIPPET}
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium" />
                <th className="pb-2 pr-4 font-medium">With runtime</th>
                <th className="pb-2 font-medium">Direct</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {COMPARISON.map(([label, withRt, direct]) => (
                <tr key={label}>
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-100">
                    {label}
                  </td>
                  <td className="py-2 pr-4 text-emerald-700 dark:text-emerald-400">
                    {withRt}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {direct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Callout tone="warn" title="Not implemented here on purpose">
            The prop is literally named <code>agents__unsafe_dev_only</code>. A
            direct connection would expose the FastAPI server — which holds the
            OpenAI key — to the browser, and disable the server-side middleware
            other features depend on.
          </Callout>
        </div>
      </Panel>
    </>
  );
}
