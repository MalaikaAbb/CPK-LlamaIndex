import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/in-app-agent-read" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Agent state is not confined to the chat. <code>agent.state</code> is
          reactive, so any component can read it and re-render when it changes —
          here a language preference shown next to the conversation rather than
          inside it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The state originates on the server. <code>initial_state</code> on{" "}
          <code>get_ag_ui_workflow_router</code> seeds it, and{" "}
          <code>AGUIChatWorkflow</code> emits a{" "}
          <code>StateSnapshotWorkflowEvent</code> before it calls the model — so
          the panel populates at the start of the first run, not at the end of
          it. The workflow also wraps that state into the last user message, so
          the model can answer questions about it without any frontend plumbing.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "What language are you using?"]}
            expect="The Language line reads 'english' as soon as the first run starts, and the agent answers in English and says so."
            fail="The panel stays on '—' after a full reply — the agent id in useAgent does not match the one the chat is using, or the snapshot never arrived."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="`initialState` and `render` do not exist on useAgent">
        The doc seeds the value a second time with{" "}
        <code>useAgent({"{ agentId, initialState }"})</code> and shows a{" "}
        <code>render</code> prop for drawing state inside the chat. Neither is on{" "}
        <code>UseAgentProps</code> in <code>@copilotkit/react-core</code> 1.66.x
        — it accepts <code>agentId</code>, <code>threadId</code>,{" "}
        <code>runtimeAgentId</code>, <code>updates</code>, and{" "}
        <code>throttleMs</code>. The server-side <code>initial_state</code> the
        same page shows is the seed that actually works, so this repo uses that
        and nothing else.
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/shared-state/in-app-agent-read/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The router and its initial state"
        description="Lifted from the doc's Python sample — the system prompt and the state seed."
      >
        <SourceCodeGroup
          files={[{ file: "backend/agents.py", region: "language-router" }]}
        />
      </Panel>
    </>
  );
}
