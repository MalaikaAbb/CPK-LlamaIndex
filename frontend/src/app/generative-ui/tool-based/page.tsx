import { Callout, Panel, TryIt } from "@/components/ui";
import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-based" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent can call a frontend component as a tool to show structured
          data inline in chat. The chart component receives the tool arguments
          as typed props; it has no handler and performs no server-side action.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show me a bar chart of monthly sales this year."]}
            expect="The agent calls render_bar_chart and a chart appears in the chat."
            fail="The agent replies only in prose or the chart has no data — check the tool name, schema, and agent prompt."
          />
        </div>
      </Panel>

      <Callout tone="info" title="No backend tool is registered">
        The Python agent only provides the model and the prompt. The component
        is sent to it as a frontend tool with each AG-UI run.
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/generative-ui/tool-based/demo-chat/page.tsx" />
        <SourceCode file="backend/demos/tool_based_agent.py" />
      </Panel>
    </>
  );
}
