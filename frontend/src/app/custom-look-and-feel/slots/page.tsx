import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const ROOT_SLOTS: [string, string][] = [
  ["messageView", "The message list container."],
  ["scrollView", "The scroll container with auto-scroll behaviour."],
  ["input", "The text input area with send/transcribe controls."],
  ["suggestionView", "The suggestion pills shown below messages."],
  ["welcomeScreen", "The empty-state screen. Pass false to disable."],
  ["header / toggleButton", "Sidebar and Popup only."],
];

/**
 * Verbatim from the Slots page, "Grouping messages into one row" (the
 * `[!code highlight]` marker the rendered page strips is dropped). Shown as
 * text only: `messageGroup`, `messageRow`, `MessageRow` and
 * `MessageGroupWrapperProps` are not exported by @copilotkit/react-core
 * 1.75.1, the version this repo's lockfile pins.
 */
const GROUP_MESSAGES_SNIPPET = `import { useCallback } from "react";
import {
  CopilotChat,
  messageGroup,
  messageRow,
  type Message,
  type MessageGroupWrapperProps,
  type MessageRow,
} from "@copilotkit/react-core/v2";

// Define wrappers at module level. One created inside groupMessages is a new
// component on every call, so React would remount it each time.
function ToolActivity({
  messages,
  children,
  state,
  setState,
}: MessageGroupWrapperProps<boolean>) {
  const open = state ?? false;
  return (
    <div className="rounded-lg border">
      <button onClick={() => setState(!open)}>
        {messages.length} tool steps {open ? "▾" : "▸"}
      </button>
      {open && children}
    </div>
  );
}

// An assistant message that also carries text stays on its own row, so the
// text (or a card waiting on the user) is never folded into a closed group.
const isToolStep = (m: Message) =>
  m.role === "tool" ||
  (m.role === "assistant" && !!m.toolCalls?.length && !m.content);

export function Chat() {
  const groupMessages = useCallback((messages: Message[]): MessageRow[] => {
    const rows: MessageRow[] = [];
    let run: Message[] = [];
    const flush = () => {
      if (run.length > 0) {
        rows.push(
          messageGroup({ key: run[0].id, messages: run, wrapper: ToolActivity }),
        );
      }
      run = [];
    };
    for (const message of messages) {
      if (isToolStep(message)) run.push(message);
      else {
        flush();
        rows.push(messageRow(message));
      }
    }
    flush();
    return rows;
  }, []);

  return <CopilotChat messageView={{ groupMessages }} />;
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/slots" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every chat component is assembled from named sub-components — slots —
          each overridable at one of three levels: a Tailwind class string merged
          into the default, an object of props set on the default, or your own
          component replacing it. Slots nest, so{" "}
          <code>messageView.assistantMessage.copyButton</code> is a valid path.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Root slot</th>
                <th className="pb-2 font-medium">What it is</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ROOT_SLOTS.map(([slot, desc]) => (
                <tr key={slot}>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {slot}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={["Hello there"]}
            expect="Level 1 tints the message area and outlines the input. Level 2 focuses the input on mount. Level 3 shows a custom layout"
            fail="The chat looks identical across all three tabs — the slot props are not reaching the component."
          />
        </div>
      </Panel>

      <Panel title="Grouping messages into one row (reference only)">
        <Callout tone="warn" title="Not runnable on this repo's CopilotKit version">
          The page now teaches a <code>groupMessages</code> option on{" "}
          <code>messageView</code> that folds several messages (for example a
          run of tool calls) into one collapsible row, plus a{" "}
          <code>workSummary</code> slot and a{" "}
          <code>toolCallsView.group</code> sub-slot. The helpers it imports (
          <code>messageGroup</code>, <code>messageRow</code>,{" "}
          <code>MessageRow</code>, <code>MessageGroupWrapperProps</code>) first
          ship in <code>@copilotkit/react-core</code> 1.79; this repo is locked
          to 1.75.1, so the snippet would fail to import. It is shown verbatim
          below and is not wired into the demo. A CopilotKit bump is a separate
          infra change.
        </Callout>
        <div className="mt-4">
          <CodeBlock filename="page.tsx" language="tsx" code={GROUP_MESSAGES_SNIPPET} />
        </div>
      </Panel>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
