"use client";

import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/** The runtime id this demo binds to. Also shown in the demo header. */
const AGENT_ID = "sample_agent";

/**
 * Reading the agent's live state in your own UI.
 *
 * `sample_agent` starts from `initial_state={"language": "english"}` and has no
 * backend tools at all. The workflow snapshots that state at the top of every
 * run and prepends it to the last user message, so the model both reads the
 * current language and is told to answer in it.
 *
 * The doc seeds the starting value a second time with
 * `useAgent({ initialState })`. That prop does not exist on `useAgent` in
 * 1.66.x, and it is redundant anyway — `initial_state` on the router is the
 * doc's own server-side seed.
 */

type AgentState = {
  language: "english" | "spanish";
};

export default function Page() {
  const { agent } = useAgent({ agentId: AGENT_ID });
  const state = agent.state as AgentState | undefined;

  return (
    <DemoFrame
      parentPath="/shared-state/in-app-agent-read"
      subtitle={`agent: ${AGENT_ID} · agent.state`}
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 overflow-y-auto border-b border-slate-200 p-4 lg:border-b-0 lg:border-r dark:border-slate-800">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Your main content
          </h1>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            Language:{" "}
            <strong className="text-[var(--accent)]">
              {state?.language ?? "—"}
            </strong>
          </p>

          <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Raw agent.state
          </h2>
          <pre className="mt-2 max-h-56 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
            {JSON.stringify(agent.state ?? {}, null, 2)}
          </pre>

          <p className="mt-4 text-xs text-slate-500">
            The panel fills in as soon as the first run starts — the workflow
            emits its opening state snapshot before it calls the model, so you do
            not have to wait for a reply. It stays on{" "}
            <code>english</code> from there: this router has no backend tools, so
            only the app can change the value. That is the{" "}
            <a
              href="/shared-state/in-app-agent-write"
              className="underline underline-offset-4"
            >
              writing route
            </a>
            .
          </p>
        </div>

        <div className="min-h-0">
          <CopilotChat
            agentId={AGENT_ID}
            labels={{
              welcomeMessageText:
                'Say hello — the state panel on the left fills in as the run starts.',
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
