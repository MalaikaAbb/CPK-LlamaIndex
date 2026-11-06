import { Callout, Panel, TryIt } from "@/components/ui";
import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";

export default function Page() {
  return (
    <>
      <RouteHeader path="/webmcp" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page opts a browser-side order lookup into WebMCP using
          <code> useFrontendTool</code>. CopilotKit registers the same handler
          for its agent tools and, when supported, on
          <code> document.modelContext</code> for compatible browser agents.
          WebMCP calls run in the page and do not pass through the backend.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Use Chrome's Model Context Tool Inspector to find searchOrders and search for shipped orders.",
            ]}
            expect="The WebMCP inspector discovers searchOrders and returns the sample orders matching the chosen status."
            fail="The tool is absent — confirm WebMCP is enabled in a supported Chrome build, then check that the page is open and the tool has a description."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Experimental browser support required">
        WebMCP is a draft API. Browser-agent discovery requires a compatible
        browser and WebMCP enabled (Chrome 149+ origin trial or local testing
        flag). An annotation such as <code> readOnlyHint</code> is guidance
        for agents, not an access
        control.
        <a
          className="ml-1 underline underline-offset-2"
          href="https://developer.chrome.com/docs/ai/webmcp"
          target="_blank"
          rel="noreferrer"
        >
          Chrome setup instructions
        </a>
        .
      </Callout>

      <Panel title="Source">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/webmcp/demo-chat/page.tsx" },
            { file: "frontend/src/components/OrderSearch.tsx" },
          ]}
        />
      </Panel>
    </>
  );
}
