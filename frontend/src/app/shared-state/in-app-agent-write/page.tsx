import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/in-app-agent-write" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The other direction: the app writing into agent state.{" "}
          <code>agent.setState</code> updates the value and re-renders anything
          reading it, and the next run sends it to the workflow as{" "}
          <code>RunAgentInput.state</code> — which is what the workflow folds
          into the last user message.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Press Toggle Language, then ask: what language are you using?",
              "Press Toggle + re-run agent",
            ]}
            expect="Toggle flips the value immediately in the panel; the agent answers in Spanish on the next message you send. Toggle + re-run makes the agent respond straight away without you typing."
            fail="The panel value changes but the agent keeps answering in English — the new state is not reaching the run."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Set state, then decide when the agent reacts">
        <code>setState</code> alone is passive — the new value waits for the next
        run. When a UI change should provoke the agent immediately, the
        doc&apos;s pattern is to add a short hint message describing what changed
        and then call <code>copilotkit.runAgent()</code>. Both buttons in the
        demo exist to make that difference visible.
      </Callout>

      <Callout tone="warn" title="The app is the only writer here">
        The router this page uses declares no <code>backend_tools</code>, so
        nothing on the server can change <code>language</code>. The system prompt
        tells the model to answer in whatever the state says; the state itself
        moves only when <code>agent.setState</code> is called.
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/shared-state/in-app-agent-write/demo-chat/page.tsx" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The router, system prompt, and <code>initial_state</code> are the same
          ones shown on the{" "}
          <a
            href="/shared-state/in-app-agent-read"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            reading route
          </a>{" "}
          — the two doc pages publish one identical backend sample.
        </p>
      </Panel>
    </>
  );
}
