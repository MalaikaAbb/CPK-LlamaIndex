import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const FIELDS: [string, string, string][] = [
  ["question", "UI → agent", "Set with agent.setState before the run."],
  [
    "answer",
    "agent → UI",
    "Written by answerQuestion, which emits a state snapshot.",
  ],
  [
    "resources",
    "server only",
    "Written by addResource, which deliberately does not emit.",
  ],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/workflow-execution" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Not every state key should travel. This route splits one{" "}
          <code>initial_state</code> into three roles — an input the UI sets, an
          output the agent produces, and a working list the UI never sees — and
          shows that the split needs no configuration at all.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          What decides visibility is whether a tool calls{" "}
          <code>ctx.write_event_to_stream(StateSnapshotWorkflowEvent(...))</code>
          . Both tools mutate the same dict; only one publishes it. That is the
          whole mechanism.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Key</th>
                <th className="pb-2 pr-4 font-medium">Direction</th>
                <th className="pb-2 font-medium">How</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {FIELDS.map(([key, dir, how]) => (
                <tr key={key}>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {key}
                  </td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">
                    {dir}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {how}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={[
              "What's the capital of France?",
              "Who wrote The Left Hand of Darkness? Track your sources.",
            ]}
            expect="Question fills in immediately, Answer fills in when answerQuestion runs, and resources stays [] in the raw state block even on the second prompt."
            fail="Answer never appears — the model replied in plain text instead of calling answerQuestion. The system prompt insists on the tool, so this usually means the model ignored it."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="`resources` is hidden by omission, not by a filter">
        There is no allow-list or schema keeping it back. If you added a snapshot
        emit to <code>addResource</code>, the whole list would appear in{" "}
        <code>agent.state</code> immediately. Worth knowing before treating this
        as a security boundary — it is a bandwidth and tidiness pattern, not an
        access control.
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/shared-state/workflow-execution/demo-chat/page.tsx" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The doc declares a <code>type AgentState</code> and then never applies
          it — <code>agent.state</code> stays loosely typed in the sample. This
          demo casts through a local type so the two reads are checked.
        </p>
      </Panel>

      <Panel
        title="The two tools and the split state"
        description="Both tools, their docstrings, the system prompt, and the three-key initial state are the doc's."
      >
        <SourceCodeGroup files={[{ file: "backend/agents.py", region: "qa" }]} />
      </Panel>
    </>
  );
}
