import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_RENDER_SNIPPET = `// The doc's in-chat progress renderer.
// \`render\` is not a property of UseAgentProps in @copilotkit/react-core 1.66.x.
useAgent({
  agentId: "my_agent",
  render: ({ state, status }) => {
    if (!state?.observed_steps?.length) return null;
    return (
      <div>
        <h3>{status === 'inProgress' ? '⏳ Progress:' : '✅ Completed:'}</h3>
        <ul>
          {state.observed_steps.map((step, i) => (
            <li key={i}>
              {step.status === 'completed' ? '✅' : '⏳'} {step.description}
            </li>
          ))}
        </ul>
      </div>
    );
  },
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/predictive-state-updates" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          State Rendering shows state that changes <em>between</em> tool calls.
          This shows state changing <em>inside one</em>. A single{" "}
          <code>execute_task</code> call takes several seconds, and it publishes
          a snapshot after every step it finishes — so the user watches progress
          instead of a spinner.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Mechanically it is the same <code>StateSnapshotWorkflowEvent</code>{" "}
          used everywhere else in this harness. What makes it &ldquo;predictive&rdquo;
          is only that the emits happen mid-tool rather than at the end. The
          final snapshot still wins: anything not present in the last emit is
          gone.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Teach me how to fix a tire",
              "Create a recipe for lemon pasta",
            ]}
            expect="A step list appears with every item on ⏳, then items flip to ✅ one at a time roughly half a second apart, before the chat reply finishes."
            fail="The whole list appears already completed in one jump — the snapshots are being coalesced, or the model returned a one-step task."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="The in-chat renderer is not implemented">
        As on{" "}
        <a
          href="/generative-ui/state-rendering"
          className="text-[var(--accent)] underline underline-offset-4"
        >
          State Rendering
        </a>
        , the doc draws the progress list inside the chat with{" "}
        <code>useAgent({"{ agentId, render }"})</code>. That prop is not on{" "}
        <code>UseAgentProps</code> in the shipped v2 API, so this route renders
        the list beside the sidebar instead — which is where the doc&apos;s own{" "}
        <code>&lt;aside&gt;</code> puts a second copy of it anyway. Hence
        Partial.
      </Callout>

      <Panel title="What the doc shows for the in-chat variant">
        <CodeBlock
          filename="Does not compile — recorded for comparison"
          language="tsx"
          code={DOC_RENDER_SNIPPET}
        />
      </Panel>

      <Callout tone="info" title="Two more drifts in the doc's frontend sample">
        <p>
          It imports <code>CopilotSidebar</code> from{" "}
          <code>@copilotkit/react-ui</code> — the v1 package — while importing
          hooks from <code>@copilotkit/react-core/v2</code> and the stylesheet
          from <code>@copilotkit/react-core/v2/styles.css</code>. The demo here
          takes the sidebar from v2 as well.
        </p>
        <p className="mt-2">
          The callout under the Python sample says state is emitted &ldquo;each
          time the agent calls the <code>stepProgress</code> tool&rdquo;. There
          is no <code>stepProgress</code> tool on the page; the tool is{" "}
          <code>execute_task</code>.
        </p>
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/shared-state/predictive-state-updates/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The tool that emits mid-run"
        description="The Step/Task models, the sleeps, and every emit are the doc's."
      >
        <SourceCodeGroup
          files={[{ file: "backend/agents.py", region: "execute-task" }]}
          note={
            <>
              The <code>asyncio.sleep</code> calls are in the doc sample and are
              there purely so the effect is visible — a real task would emit
              between real units of work.
            </>
          }
        />
      </Panel>
    </>
  );
}
