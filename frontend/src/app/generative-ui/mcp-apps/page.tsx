import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// Verbatim from the page: scoping MCP Apps to one agent with `.use()`. Not run
// here (it needs `@ag-ui/mcp-apps-middleware` as a direct dependency and a
// BuiltInAgent); the route uses the runtime-level `mcpApps` option instead.
const SCOPED_SNIPPET = `import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware";

const agent = new BuiltInAgent({
  model: "openai/gpt-6-luna",
  prompt: "You are a helpful assistant.",
}).use(
  new MCPAppsMiddleware({
    mcpServers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "my-server",
      },
    ],
  }),
);`;

// Verbatim from the page's "Transport Types" section.
const TRANSPORTS_SNIPPET = `// HTTP Transport
{
  type: "http",
  url: "http://localhost:3101/mcp",
  serverId: "my-http-server"
}

// SSE Transport
{
  type: "sse",
  url: "https://mcp.example.com/sse",
  headers: {
    "Authorization": "Bearer token"
  },
  serverId: "my-sse-server"
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          An MCP server can ship UI with its tools. With{" "}
          <code>mcpApps.servers</code> on the runtime, the middleware adds that
          server&apos;s tools to each run; when the agent calls one that has a
          UI resource, the chat fetches the resource and renders it in a
          sandboxed iframe, and the iframe can talk back to the server through
          the middleware. The frontend needs no code for it.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What tools do you have?", "then ask for something one of those tools draws"]}
            expect="With an ext-apps example server listening on localhost:3108/mcp, the agent lists that server's tools, and calling a UI tool renders an interactive iframe in the sidebar."
            fail="The agent lists no MCP tools (the server isn't running on 3108, or isn't serving /mcp), or the tool runs but no iframe appears. A call with garbled arguments points at the adapter's string-flattening of tool parameters (README Known issues)."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="What is not from the page">
        <ul className="space-y-1.5">
          <li>
            · <strong>Agent: LlamaIndex, not the doc&apos;s BuiltInAgent.</strong>{" "}
            The page&apos;s runtime builds a CopilotKit{" "}
            <code>BuiltInAgent</code> (<code>openai/gpt-6-luna</code>,
            &ldquo;You are a helpful assistant.&rdquo;). Here{" "}
            <code>default</code> is a <code>LlamaIndexAgent</code> pointing at a
            stock LlamaIndex router with that prompt and no tools. The model
            comes from <code>build_llm()</code> like every other router here.
          </li>
          <li>
            · <strong>Own runtime path.</strong> The runtime and the
            provider&apos;s <code>runtimeUrl</code> use{" "}
            <code>/api/copilotkit-mcp-apps</code> rather than{" "}
            <code>/api/copilotkit</code>, so the MCP middleware wraps only this
            route&apos;s agent.
          </li>
          <li>
            · <strong>No MCP server.</strong> The page links the{" "}
            <code>modelcontextprotocol/ext-apps</code> repo of example servers
            but publishes none. Start one yourself on port 3108; none is
            bundled here.
          </li>
          <li>
            · <strong>Version.</strong> The page says to use{" "}
            <code>@copilotkit/runtime</code> 1.76.0 or later; this repo pins
            1.75.1. The <code>mcpApps</code> option and the middleware are
            present in 1.75.1&apos;s typings, but the combination is untested.
          </li>
        </ul>
      </Callout>

      <Panel title="The runtime route">
        <SourceCode file="frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="The agent">
        <SourceCode file="backend/agents.py" region="mcp-apps-router" />
      </Panel>

      <Panel title="Provider, layout and page">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/mcp-apps/demo-chat/providers.tsx" },
            { file: "frontend/src/app/generative-ui/mcp-apps/demo-chat/layout.tsx" },
            { file: "frontend/src/app/generative-ui/mcp-apps/demo-chat/page.tsx" },
          ]}
        />
      </Panel>

      <Panel title="Other options on the page (reference)">
        <div className="space-y-4">
          <CodeBlock filename="Scope to one agent with .use()" language="ts" code={SCOPED_SNIPPET} />
          <CodeBlock filename="Transport types" language="ts" code={TRANSPORTS_SNIPPET} />
        </div>
      </Panel>
    </>
  );
}
