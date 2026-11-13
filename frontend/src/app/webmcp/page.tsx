import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/webmcp" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A frontend tool can also be published to the browser&apos;s{" "}
          <code>document.modelContext</code> (WebMCP), so a WebMCP-aware
          browser agent can find it by name and schema and call the same
          handler, with no CopilotKit runtime or backend agent in that path.
          Opting in is one option on <code>useFrontendTool</code>:{" "}
          <code>webmcp: true</code> or <code>webmcp: {"{ annotations }"}</code>.
          Without browser support, CopilotKit registers nothing and carries on.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show my shipped orders"]}
            expect="Broken by design: the agent calls searchOrders, and the handler throws a ReferenceError because the page never defines searchOrders; the chat shows the tool failing. In Chrome 149+ with the WebMCP flag, the Model Context Tool Inspector lists searchOrders with its status enum and readOnlyHint, and calling it fails the same way."
            fail="The agent answers without calling searchOrders (the tool did not reach the run), or the Model Context Tool Inspector does not list it with WebMCP enabled."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Broken as published: searchOrders is never defined">
        <p>
          Both snippets call <code>searchOrders(status)</code>, which the page
          never defines or imports. The code is kept verbatim with a{" "}
          <code>@ts-expect-error</code> on that line, so the handler throws
          whenever either the CopilotKit agent or a browser agent calls it.
          Nothing stands in for it.
        </p>
        <p className="mt-2">
          The demo&apos;s chat and the <code>document.modelContext</code>{" "}
          indicator are harness glue. Testing the WebMCP half needs Chrome 149+
          with the origin trial or{" "}
          <code>chrome://flags/#enable-webmcp-testing</code>, which this repo
          can&apos;t check automatically.
        </p>
      </Callout>

      <Panel title="The React frontend tool (page code)">
        <SourceCode file="frontend/src/app/webmcp/OrderSearch.tsx" />
      </Panel>

      <Panel title="WebMCP only, with no agent (page code, type-checked, not run)">
        <SourceCode file="frontend/src/app/webmcp/_doc/webmcp.ts" />
      </Panel>

      <Panel title="The demo page">
        <SourceCode file="frontend/src/app/webmcp/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
