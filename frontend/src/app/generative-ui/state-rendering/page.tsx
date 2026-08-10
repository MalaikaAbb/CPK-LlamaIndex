import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_RENDER_SNIPPET = `// The doc's "render state in the chat" variant.
// \`render\` is not a property of UseAgentProps in @copilotkit/react-core 1.66.x,
// so this does not compile against the shipped types.
useAgent({
  agentId: "my_agent",
  render: ({ state }) => (
    <div>
      {state.searches?.map((search, index) => (
        <div key={index}>
          {search.done ? "✅" : "❌"} {search.query}{search.done ? "" : "..."}
        </div>
      ))}
    </div>
  ),
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/state-rendering" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Tool rendering shows you a tool <em>call</em>. State rendering shows
          you the agent&apos;s accumulated <em>state</em> — a list that grows
          across turns rather than a single event. Here that is a set of
          searches, each with a <code>query</code> and a <code>done</code> flag.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The mechanism is explicit on the LlamaIndex side: a backend tool opens{" "}
          <code>ctx.store.edit_state()</code>, mutates the dict, and pushes a{" "}
          <code>StateSnapshotWorkflowEvent</code> onto the stream. Nothing is
          inferred from tool arguments — if a tool does not emit, the UI does not
          update. <code>runSearches</code> emits once per completed search, which
          is why the list ticks over instead of jumping.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Search for the tallest mountains",
              "Now also search for the deepest oceans",
            ]}
            expect="An item appears with ❌ as addSearch runs, flips to ✅ about a second later when runSearches completes it, and the second prompt adds a second item while keeping the first."
            fail="The list stays empty while the chat replies normally — the model answered without calling addSearch, or the snapshot event never reached the runtime."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="The in-chat renderer is not implemented">
        The doc shows the same list twice: once via{" "}
        <code>useAgent({"{ agentId, render }"})</code> to draw it inside the
        chat, and once via <code>agent.state</code> to draw it anywhere else.
        Only the second exists in the shipped API — <code>UseAgentProps</code> in{" "}
        <code>@copilotkit/react-core</code> 1.66.x accepts{" "}
        <code>agentId</code>, <code>threadId</code>,{" "}
        <code>runtimeAgentId</code>, <code>updates</code>, and{" "}
        <code>throttleMs</code>, and nothing else. That is why this route is
        marked Partial.
      </Callout>

      <Panel title="What the doc shows for the in-chat variant">
        <CodeBlock
          filename="Does not compile — recorded for comparison"
          language="tsx"
          code={DOC_RENDER_SNIPPET}
        />
      </Panel>

      <Callout tone="info" title="Why this route uses a different agent">
        <code>get_ag_ui_workflow_router</code> takes one{" "}
        <code>initial_state</code>, and the docs define several —{" "}
        <code>searches</code> here, <code>language</code> on the Shared State
        pages, <code>observed_steps</code> on Predictive State Updates. This repo
        runs each as its own router rather than inventing a merged state that
        appears on no page.
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/generative-ui/state-rendering/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The tools and the initial state"
        description="Both tools and the state shape are lifted from the doc's Python sample."
      >
        <SourceCodeGroup
          files={[{ file: "backend/agents.py", region: "searches" }]}
          note={
            <>
              The system prompt matters more than usual here: it forces the model
              to call <code>runSearches</code> after every{" "}
              <code>addSearch</code>, and to call <code>addSearch</code> only
              once per query. Without those two rules a search is added and never
              completed, so it sits on ❌ forever.
            </>
          }
        />
      </Panel>
    </>
  );
}
