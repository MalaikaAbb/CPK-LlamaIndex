import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/human-in-the-loop/index";

const TABLE: [string, string, string][] = [
  [
    "useHumanInTheLoop",
    "The LLM, by calling a registered client-side tool",
    "A frontend-only tool description (Zod schema + render)",
  ],
  [
    "useInterrupt",
    "The graph, by calling interrupt(...) during a node",
    "A server-side interrupt() call in your LangGraph agent",
  ],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/index" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A run that stops mid-turn and waits for a person.{" "}
          <code>useHumanInTheLoop</code> registers a client-side tool that has a{" "}
          <code>render</code> function instead of a handler. When the model
          calls <code>book_call</code>, CopilotKit draws a time picker inline
          and holds the run open until <code>respond(...)</code> is called. The
          chosen slot reaches the model as the tool&apos;s result, so the agent
          continues with its context intact.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Please book an intro call with the sales team to discuss pricing.",
              "Schedule a 1:1 with Alice next week to review Q2 goals.",
            ]}
            expect="A time-picker card appears in the chat and the reply stops there. Pick a slot and the run resumes — the agent confirms the specific time you chose, which proves respond() reached it."
            fail="The agent invents a time without showing a card, or the card appears and picking a slot does nothing. The second means respond() is not wired."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Source: the page's demo Code tab, verbatim">
        <code>hitl-in-chat.tsx</code> is the demo&apos;s <code>page.tsx</code>{" "}
        and <code>time-picker-card.tsx</code> is its card. Both are copied
        unchanged, including the demo&apos;s own{" "}
        <code>&lt;CopilotKit runtimeUrl=&quot;/api/copilotkit&quot;
        agent=&quot;hitl-in-chat&quot;&gt;</code>. The page prose prints the
        same hook, and it imports <code>TimePickerCard</code> without showing
        it; the Code tab has it.
      </Callout>

      <Panel title="The demo and the card it renders">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/hitl-in-chat.tsx` },
            { file: `${DIR}/time-picker-card.tsx` },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="The backend router is not published">
        The Code tab&apos;s <code>route.ts</code> sends{" "}
        <code>hitl-in-chat</code> to a dedicated <code>/hitl-in-chat</code>{" "}
        router, and no file for that router exists anywhere in the docs. It
        is not needed: <code>book_call</code> is a frontend tool, and the
        stock LlamaIndex router forwards any tool it did not declare. So this
        repo registers <code>hitl-in-chat</code> on its main runtime against
        the Quickstart router (<code>POST /run</code>), with no extra Python.
      </Callout>

      <Panel
        title="The page's two patterns"
        description="Reproduced from the page. Only the first applies to LlamaIndex."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {["Pattern", "Who decides to pause?", "Backend surface"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-slate-200 px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE.map(([pattern, who, backend]) => (
                <tr key={pattern}>
                  <td className="border-b border-slate-100 px-2 py-2 font-mono text-xs dark:border-slate-800">
                    {pattern}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2 dark:border-slate-800">
                    {who}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2 dark:border-slate-800">
                    {backend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Pattern 2 is described in LangGraph terms (<code>interrupt()</code>{" "}
          inside a graph node) and only links out to a separate deep-dive page,
          so it is not implemented here. The installed
          llama-index-protocols-ag-ui 0.5.0 never emits an AG-UI interrupt
          either.
        </p>
      </Panel>
    </>
  );
}
