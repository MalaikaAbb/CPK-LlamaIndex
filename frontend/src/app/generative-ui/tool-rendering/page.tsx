import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-rendering" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A tool call is an event in the stream, not just a function result — so
          you can render it. <code>useRenderTool</code> attaches a component to
          one tool by name, and <code>useDefaultRenderTool</code> registers a
          wildcard that catches everything without a dedicated renderer.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The renderer name must equal the Python function name exactly. That is
          the single most common reason a tool runs but its UI never appears.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Tokyo?"]}
            expect="The reply is preceded by 'Calling weather API...' which becomes 'Called the weather API for Tokyo.' once the call completes."
            fail="The tool call renders as raw JSON or not at all — the renderer name and the Python function name disagree."
          />
        </div>
      </Panel>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/generative-ui/tool-rendering/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The tool being rendered"
        description="An ordinary Python function passed to backend_tools — nothing about it is CopilotKit-specific. LlamaIndex derives the schema from the annotations and the docstring."
      >
        <SourceCodeGroup
          files={[{ file: "backend/agents.py", region: "get-weather" }]}
        />
      </Panel>
    </>
  );
}
