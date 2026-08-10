"use client";

import { CopilotSidebar, useAgent } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/** The runtime id this demo binds to. Also shown in the demo header. */
const AGENT_ID = "task_agent";

/**
 * Intermediate state, streamed while one long tool call is still running.
 *
 * `execute_task` writes every step as `pending`, emits a snapshot, then flips
 * them to `completed` one at a time with a snapshot after each — so the list
 * below fills in over several seconds instead of appearing all at once when the
 * run ends.
 *
 * Two departures from the doc sample, both forced by the shipped packages:
 *   - `CopilotSidebar` comes from `@copilotkit/react-core/v2`. The sample
 *     imports it from `@copilotkit/react-ui`, which is the v1 package and is
 *     not a dependency of this repo.
 *   - The doc's second `useAgent({ agentId, render })` call is dropped. There
 *     is no `render` prop on `UseAgentProps` in 1.66.x, so the progress list is
 *     rendered here instead of inside the chat.
 */

interface Step {
  description: string;
  status: "pending" | "completed";
}

interface AgentState {
  observed_steps?: Step[];
}

export default function Page() {
  // Get access to both predicted and final states
  const { agent } = useAgent({ agentId: AGENT_ID });
  // const state = agent.state as AgentState | undefined;
  // const steps = state?.observed_steps ?? [];

  // Add a state renderer to show progress in the chat
    useAgent({
        agentId: AGENT_ID,
        render: ({ state, status }) => {
            if (!state?.observed_steps?.length) return null;
            return (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 my-2">
                    <h3 className="font-semibold text-gray-700 mb-2">
                        {status === 'inProgress' ? '⏳ Progress:' : '✅ Completed:'}
                    </h3>
                    <ul className="space-y-1">
                        {state.observed_steps.map((step, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span>
                                    {step.status === 'completed' ? '✅' : '⏳'}
                                </span>
                                <span className={step.status === 'completed' ? 'text-green-700' : 'text-gray-600'}>
                                    {step.description}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        },
    });

  return (
    <DemoFrame
      parentPath="/shared-state/predictive-state-updates"
      subtitle={`agent: ${AGENT_ID} · observed_steps streamed mid-run`}
    >

       <div>
            <header>
                <h1>Agent Progress Demo</h1>
            </header>
            <main>
                {/* Side panel showing final state */}
                <aside>
                    <h2>Agent State</h2>
                    {agent.state?.observed_steps?.length > 0 ? (
                        <ul>
                            {agent.state.observed_steps.map((step, i) => (
                                <li key={i}>
                                    <span>{step.status === 'completed' ? '✅' : '⏳'}</span>
                                    <span>{step.description}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            {"No steps yet. Try asking to build a plan like \"create a recipe for ___\" or \"teach me how to fix a tire.\""}
                        </p>
                    )}
                </aside>
                {/* Chat area */}
                <CopilotSidebar
                agentId={AGENT_ID}
                    labels={{
                        welcomeMessageText: "Hi! Ask me to do a task like \"teach me how to fix a tire.\""
                    }}
                />
            </main>
        </div>
    </DemoFrame>
  );
}
