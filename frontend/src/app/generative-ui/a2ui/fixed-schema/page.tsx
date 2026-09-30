import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/a2ui/fixed-schema";

// The page's "Registering the runtime" snippets, verbatim. The demo route
// below contradicts the second one.
const PROSE_PROVIDER = `<CopilotKit runtimeUrl="/api/copilotkit" a2ui={{ catalog: myCatalog }}>
  {children}
</CopilotKit>`;

const PROSE_RUNTIME = `const runtime = new CopilotRuntime({
  agents: { "a2ui-fixed-schema": agent },
  a2ui: { injectA2UITool: false, agents: ["a2ui-fixed-schema"] },
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/fixed-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The opposite trade from dynamic schema: the component tree is
          authored once as JSON (<code>flight_schema.json</code>) and loaded at
          startup. The model only fills four fields — origin, destination,
          airline, price — through a <code>display_flight</code> tool, and
          schema components bind to them with JSON Pointer paths like{" "}
          <code>{"{ \"path\": \"/origin\" }"}</code>. No second LLM call, so the
          card appears as soon as the tool returns.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The delivery trick is the same as dynamic schema&apos;s: a workflow
          subclass re-emits the tool result as a streamed{" "}
          <code>render_a2ui</code> tool call, because the middleware
          ignores the adapter&apos;s messages snapshot.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Find me a flight from SFO to JFK on United for $289."]}
            expect="A flight card: 'Flight Details' under an ITINERARY label with a '1-stop · economy' badge, SFO → JFK in large mono type, a UNITED badge, the $289 total and a full-width 'Book flight' button. Clicking it does nothing, by design."
            fail={
              <>
                React error #31 (<code>Objects are not valid as a React child
                (found: object with keys {"{path}"})</code>) means a bound prop
                reached a renderer unresolved — check the prop is declared as a{" "}
                <code>DynString</code> union. Plain text with no card means the
                surface never mounted.
              </>
            }
          />
        </div>
      </Panel>

      <Callout tone="info" title="Source: the page's demo Code tab, verbatim">
        Every file on this route comes from the Code tab under the page&apos;s
        interactive demo, including <code>flight_schema.json</code> and{" "}
        <code>booked_schema.json</code>, which the prose references but never
        prints. The demo&apos;s <code>page.tsx</code> lives here as{" "}
        <code>a2ui-fixed-schema.tsx</code>.
      </Callout>

      <Panel title="The catalog">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/a2ui/definitions.ts` },
            { file: `${DIR}/a2ui/renderers.tsx` },
            { file: `${DIR}/a2ui/catalog.ts` },
          ]}
        />
      </Panel>

      <Panel title="The provider and the runtime">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/a2ui-fixed-schema.tsx` },
            { file: `${DIR}/chat.tsx` },
            { file: "frontend/src/app/api/copilotkit-a2ui-fixed-schema/route.ts" },
          ]}
        />
      </Panel>

      <Panel title="The agent and its schema">
        <SourceCodeGroup
          files={[
            { file: "backend/demos/a2ui_fixed.py" },
            { file: "backend/demos/a2ui_schemas/flight_schema.json" },
            { file: "backend/demos/a2ui_schemas/booked_schema.json" },
          ]}
          note={
            <>
              <code>booked_schema.json</code> is loaded by nothing. The page
              keeps it for the day the Python SDK accepts{" "}
              <code>action_handlers</code>, which would swap the card to a
              booked state on click.
            </>
          }
        />
      </Panel>

      <Panel
        title="“Registering the runtime” — as the prose publishes it"
        description="Shown, not wired. The demo's own runtime route above is what runs."
      >
        <Callout tone="warn" title="injectA2UITool: false here, true in the demo">
          The prose says to turn injection off because the agent owns the
          tool. The demo&apos;s route sets it <code>true</code>, and its comments
          explain that the middleware only watches the{" "}
          <code>render_a2ui</code> name when injection is on — with{" "}
          <code>false</code>, the re-emitted call would be ignored and the card
          would never mount. The prose snippet also uses plain{" "}
          <code>route.ts</code>, while the Quickstart runtime lives at{" "}
          <code>[[...slug]]/route.ts</code>.
        </Callout>
        <div className="mt-4 space-y-4">
          <CodeBlock code={PROSE_PROVIDER} filename="app/page.tsx" language="tsx" />
          <CodeBlock
            code={PROSE_RUNTIME}
            filename="app/api/copilotkit/route.ts"
            language="ts"
          />
        </div>
      </Panel>

      <Panel
        title="Leaf UI the renderers import"
        description="Shipped in the docs site's demo-source bundle for this demo, but not shown as a Code tab."
      >
        <SourceCodeGroup
          files={[
            { file: `${DIR}/_components/card.tsx` },
            { file: `${DIR}/_components/badge.tsx` },
            { file: `${DIR}/_components/button.tsx` },
            { file: `${DIR}/_components/separator.tsx` },
            { file: `${DIR}/suggestions.ts` },
          ]}
        />
      </Panel>
    </>
  );
}
