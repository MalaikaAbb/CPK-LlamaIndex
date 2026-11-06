import { Callout, Panel, TryIt } from "@/components/ui";
import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Following the guide&apos;s <code>BuiltInAgent</code> runtime example,
          the Copilot Runtime connects to a local MCP Apps server at
          <code> http://localhost:3108/mcp</code>. When the agent calls a tool
          with a UI resource, CopilotKit renders that resource in the chat.
          This tests the guide&apos;s CopilotKit BuiltInAgent example, not a
          LlamaIndex backend agent.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Ask the agent to create a simple flowchart and verify that the MCP App appears in the chat.",
            ]}
            expect="The local MCP server's tool is called and its associated interactive UI resource renders in the chat."
            fail="No MCP App appears — check that the local MCP server is running at http://localhost:3108/mcp and that the request called a tool with a UI resource."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Start the local MCP Apps example">
        The guide&apos;s quickstart command scaffolds its pre-built MCP Apps
        example:
        <pre className="mt-2 overflow-x-auto rounded-md bg-slate-100 p-3 text-xs dark:bg-slate-800">
          npx copilotkit create -f mcp-apps
        </pre>
        Start the MCP server from the generated example, then run this frontend.
        The runtime connects to the guide&apos;s
        <code> http://localhost:3108/mcp</code> endpoint. Set
        <code> OPENAI_API_KEY</code> in <code> frontend/.env.local</code> for
        the BuiltInAgent.
      </Callout>

      <Panel title="Source">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/mcp-apps/demo-chat/page.tsx" },
            {
              file: "frontend/src/app/api/copilotkit-mcp/[[...slug]]/route.ts",
            },
          ]}
        />
      </Panel>
    </>
  );
}
