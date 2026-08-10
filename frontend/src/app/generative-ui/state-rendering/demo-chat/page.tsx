"use client";

import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/** The runtime id this demo binds to. Also shown in the demo header. */
const AGENT_ID = "search_agent";

/**
 * Agent state streamed into the UI.
 *
 * `search_agent` starts from `initial_state={"searches": []}`, and both of its
 * backend tools push a `StateSnapshotWorkflowEvent` while they run. `addSearch`
 * emits once per new query; `runSearches` emits again after each one flips to
 * `done`, so the list ticks over one item at a time rather than jumping to its
 * final shape.
 *
 * The doc renders this twice — "in the chat" and "outside the chat". Only the
 * second is implemented here; see the notes page for why.
 */

type SearchInfo = {
  query: string;
  done: boolean;
};

type AgentState = {
  searches: SearchInfo[];
};

export default function Page() {
  const { agent } = useAgent({ agentId: AGENT_ID });
  const state = agent.state as AgentState | undefined;

  return (
    <DemoFrame
      parentPath="/generative-ui/state-rendering"
      subtitle={`agent: ${AGENT_ID} · searches state`}
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 overflow-y-auto border-b border-slate-200 p-4 lg:border-b-0 lg:border-r dark:border-slate-800">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Searches (rendered outside the chat)
          </h2>

          <div className="mt-4 flex flex-col gap-2">
            {state?.searches?.length ? (
              state.searches.map((search, index) => (
                <div key={index} className="flex flex-row gap-2 text-sm">
                  <span>{search.done ? "✅" : "❌"}</span>
                  <span className="text-slate-800 dark:text-slate-100">
                    {search.query}
                    {search.done ? "" : "..."}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No searches yet. Ask the agent to search for something.
              </p>
            )}
          </div>

          <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Raw agent.state
          </h2>
          <pre className="mt-2 max-h-56 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
            {JSON.stringify(agent.state ?? {}, null, 2)}
          </pre>
        </div>

        <div className="min-h-0">
          <CopilotChat
            agentId={AGENT_ID}
            labels={{
              welcomeMessageText:
                'Try "Search for the tallest mountains, then search for the deepest oceans".',
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
