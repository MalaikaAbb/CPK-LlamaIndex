"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Agent Lock, five times over.
 *
 * The doc locks an agent once, on the provider: `<CopilotKit agent="my_agent">`.
 * That is a whole-app decision, so this harness cannot use it — every route
 * would be pinned to the same agent. Passing `agentId` per surface is the same
 * lock at a finer grain, and the doc's closing paragraph explicitly sanctions
 * it: you cannot nest providers, but different areas of one app may use
 * different agents.
 *
 * Router Mode is the other half of the doc and is not demonstrated. It needs the
 * runtime to hold an LLM service adapter so CopilotKit can pick an agent per
 * message; this repo uses `ExperimentalEmptyAdapter` because every LlamaIndex
 * workflow calls the model itself. See the notes page.
 */

const AGENTS = [
  { id: "my_agent", blurb: "stateless · getWeather" },
  { id: "sample_agent", blurb: "language state · no tools" },
  { id: "search_agent", blurb: "searches state · addSearch, runSearches" },
  { id: "qa_agent", blurb: "question/answer/resources · answerQuestion" },
  { id: "task_agent", blurb: "observed_steps · execute_task" },
] as const;

type AgentId = (typeof AGENTS)[number]["id"];

export default function Page() {
  const [agentId, setAgentId] = useState<AgentId>("my_agent");
  const active = AGENTS.find((a) => a.id === agentId)!;

  return (
    <DemoFrame
      parentPath="/multi-agent-flows"
      subtitle={`agent: ${agentId} · locked`}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {AGENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAgentId(a.id)}
              className={`rounded-md border px-3 py-1.5 font-mono text-sm transition-colors ${
                agentId === a.id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {a.id}
            </button>
          ))}
          <p className="text-xs text-slate-500">{active.blurb}</p>
        </div>

        <div className="min-h-0 flex-1">
          <CopilotChat key={agentId} agentId={agentId} />
        </div>

        <p className="shrink-0 border-t border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-800">
          Each id keeps its own message list, so switching starts a separate
          conversation. That is the lock working: nothing routes between them.
        </p>
      </div>
    </DemoFrame>
  );
}
