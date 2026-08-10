"use client";

import {
  CopilotChat,
  CopilotChatMessageView,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/** The runtime id this demo binds to. Also shown in the demo header. */
const AGENT_ID = "my_agent";

type Level = "classes" | "props" | "component";

const LEVELS: { id: Level; label: string; blurb: string }[] = [
  {
    id: "classes",
    label: "1 · Tailwind classes",
    blurb: "A class string merges with the slot's own classes. Nothing is replaced.",
  },
  {
    id: "props",
    label: "2 · Props override",
    blurb: "An object sets props on the default component — className, autoFocus.",
  },
  {
    id: "component",
    label: "3 · Custom component",
    blurb: "Your own component replaces a slot, plus a custom layout.",
  },
];

/**
 * The doc's custom `messageView`, with the props typed.
 *
 * The sample writes `({ messages, isRunning })` with no annotation, which is an
 * implicit-any error under this repo's `strict` tsconfig. The shape is the
 * doc's; only the type annotation is added.
 */
const CustomMessageView = ({
  messages,
  isRunning,
}: {
  messages?: { id: string; role: string; content?: string }[];
  isRunning?: boolean;
}) => (
  <div className="space-y-4 p-6">
    {messages?.map((msg) => (
      <div
        key={msg.id}
        className={msg.role === "user" ? "text-right" : "text-left"}
      >
        {msg.content}
      </div>
    ))}
    {isRunning && <div className="animate-pulse">Thinking...</div>}
  </div>
);

export default function Page() {
  const [level, setLevel] = useState<Level>("classes");
  const active = LEVELS.find((l) => l.id === level)!;

  return (
    <DemoFrame parentPath="/custom-look-and-feel/slots" subtitle={`agent: ${AGENT_ID} · ${active.blurb}`}>
       <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLevel(l.id)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                level === l.id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1">
          {level === "classes" && (
            <CopilotChat
              agentId={AGENT_ID}
              key="classes"
               messageView={{
                assistantMessage: "bg-blue-50 rounded-xl p-2",
                userMessage: "bg-blue-100 rounded-xl",
              }}
              input="border-2 border-[var(--accent)] rounded-xl text-purple-800"
              labels={{
                welcomeMessageText:
                  "Slot level 1 — classes merged into messageView and input.",
              }}
            />
          )}

          {level === "props" && (
            <CopilotChat
              agentId={AGENT_ID}
              key="props"
              messageView={{
                className: "rounded-lg bg-slate-50 dark:bg-slate-300 p-4",
              }}
              input={{ autoFocus: true }}
              labels={{
                welcomeMessageText:
                  "Slot level 2 — the input is focused automatically via a prop override.",
              }}
            />
          )}

          {level === "component" && (
            <CopilotChat
              agentId={AGENT_ID}
              key="component"
              // The doc passes the bare function component. `SlotValue` for
              // this slot is `typeof CopilotChatMessageView`, which also carries
              // a static `Cursor` sub-component, so a plain function is not
              // assignable without a cast.
              messageView={
                CustomMessageView as unknown as typeof CopilotChatMessageView
              }
              labels={{
                welcomeMessageText:
                  "Slot level 3 — the streaming cursor and the whole layout are ours.",
              }}
            />
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
