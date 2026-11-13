import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui" />

      <Panel title="What it covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The A2UI overview. CopilotKit exposes two switches: on the server,{" "}
          <code>a2ui: {"{}"}</code> on <code>CopilotRuntime</code> wraps every
          registered agent in the A2UI middleware (or only the ids listed in{" "}
          <code>a2ui.agents</code>); in the browser, an optional{" "}
          <code>a2ui={"{{ theme }}"}</code> prop on{" "}
          <code>&lt;CopilotKit&gt;</code> replaces the built-in theme. The page
          has no demo and no LlamaIndex-specific code.
        </p>
      </Panel>

      <Callout tone="info" title="Where this runs in the harness">
        The runtime half is exercised by the two existing A2UI routes, both
        built from their pages&apos; demo Code tabs:{" "}
        <a className="underline" href="/generative-ui/a2ui/fixed-schema">
          Fixed Schema
        </a>{" "}
        and{" "}
        <a className="underline" href="/generative-ui/a2ui/dynamic-schema">
          Dynamic Schema
        </a>
        . Each has its own runtime route with an <code>a2ui</code> block. The
        snippets on this page are kept byte-for-byte below and type-checked
        with the rest of the app, but not served or rendered.
      </Callout>

      <Callout tone="warn" title="Gaps in the published snippets">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The runtime snippet registers <code>{"{ default: myAgent }"}</code>{" "}
            and never defines <code>myAgent</code> (for LlamaIndex that would be
            a <code>LlamaIndexAgent</code> pointing at a router).
          </li>
          <li>
            The theme snippet is a bare JSX expression around an undefined{" "}
            <code>children</code>.
          </li>
          <li>
            The page says any A2UI the agent returns then renders with no other
            code, but publishes no LlamaIndex agent that returns A2UI. The
            harness&apos;s A2UI routes get theirs from the Fixed/Dynamic Schema
            demo code (see README Known issues on <code>injectA2UITool</code>).
          </li>
        </ul>
        Both undefined names are suppressed with{" "}
        <code>@ts-expect-error</code>; the expressions are unchanged.
      </Callout>

      <Panel title="The page's snippets, verbatim">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/a2ui/_doc/route.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/_doc/theme.tsx" },
          ]}
        />
      </Panel>
    </>
  );
}
