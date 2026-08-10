"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Agent routing: five registered ids, five AG-UI endpoints, one runtime.
 *
 * The frontend only ever names an id — it never learns where the agent lives or
 * that four of the five sit behind a FastAPI prefix. Each id carries its own
 * message list, so switching starts a fresh conversation.
 */

const AGENTS = [
  { id: "my_agent", url: ":8000/run" },
  { id: "sample_agent", url: ":8000/sample_agent/run" },
  { id: "search_agent", url: ":8000/search_agent/run" },
  { id: "qa_agent", url: ":8000/qa_agent/run" },
  { id: "task_agent", url: ":8000/task_agent/run" },
] as const;

type AgentId = (typeof AGENTS)[number]["id"];

export default function Page() {
  const [agentId, setAgentId] = useState<AgentId>("my_agent");
  const active = AGENTS.find((a) => a.id === agentId)!;

  return (
    <DemoFrame parentPath="/copilot-runtime" subtitle={`agent: ${agentId}`}>
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
          <p className="font-mono text-xs text-slate-500">{active.url}</p>
        </div>

        <div className="min-h-0 flex-1">
          <CopilotChat key={agentId} agentId={agentId} />
        </div>
      </div>
    </DemoFrame>
  );
}
