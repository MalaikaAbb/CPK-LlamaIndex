import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/a2ui/dynamic-schema";

// The page's prose-level runtime guidance, verbatim, shown against the demo
// route that contradicts it.
const OPT_OUT_MIDDLEWARE = `import { A2UIMiddleware } from "@ag-ui/a2ui-middleware";

agent.use(new A2UIMiddleware({ injectA2UITool: false }));`;

const OPT_OUT_TOOL = `from ag_ui_langgraph import get_a2ui_tools
from langchain_openai import ChatOpenAI

generate_a2ui = get_a2ui_tools({
    "model": ChatOpenAI(model="gpt-4o"),
    "default_catalog_id": "copilotkit://app-dashboard-catalog",
})

tools = [my_other_tool, generate_a2ui]`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/dynamic-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          No layout is decided ahead of time. The model designs the whole
          surface per request — which catalog components to use, how to nest
          them, what data to fill in. You supply the vocabulary (the catalog);
          the model writes the sentence.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent here is a plain <code>get_ag_ui_workflow_router</code> with
          no backend tools; only its system prompt is specific to this page.
          The runtime&apos;s <code>injectA2UITool: true</code> adds a{" "}
          <code>render_a2ui</code> tool to each run, the stock router forwards
          it to the model as a pass-through tool, and the model&apos;s streamed
          call is what the A2UI middleware mounts.
        </p>
        <Callout tone="warn" title="Agent simplified — not the demo's">
          The demo Code tab&apos;s agent runs a secondary planner LLM behind a{" "}
          <code>generate_a2ui</code> tool and a workflow subclass that re-emits
          its output as <code>render_a2ui</code>. That was replaced, by
          request, with this simple router; the catalog description moved from
          the planner&apos;s prompt into the agent&apos;s system prompt.
        </Callout>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me my sales dashboard for this quarter.",
              "How are our sales reps performing against quota?",
            ]}
            expect="The agent replies with one short sentence, and a surface appears under it built from catalog pieces — metric tiles, a table or a chart — arranged differently for each prompt."
            fail="Only text (the model answered without calling render_a2ui), or a 'Catalog not found' error (the call omitted or mistyped catalogId)."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Source: the page's demo Code tab, verbatim">
        The page&apos;s prose shows <code>definitions.ts</code>,{" "}
        <code>renderers.tsx</code> and <code>catalog.ts</code>, but not the
        runtime route, the agent, or the helpers the renderers call. All of
        those are in the Code tab under the page&apos;s interactive demo, and
        every file on this route is copied from there unchanged. The demo&apos;s{" "}
        <code>page.tsx</code> lives here as <code>declarative-gen-ui.tsx</code>,
        because <code>page.tsx</code> is this notes page.
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
            { file: `${DIR}/declarative-gen-ui.tsx` },
            { file: `${DIR}/chat.tsx` },
            { file: "frontend/src/app/api/copilotkit-declarative-gen-ui/route.ts" },
          ]}
        />
      </Panel>

      <Panel title="The agent">
        <SourceCode file="backend/demos/a2ui_dynamic.py" />
      </Panel>

      <Callout tone="warn" title="The prose and the demo disagree about the runtime">
        <p>
          The prose says the catalog alone is enough and the runtime needs no{" "}
          <code>a2ui</code> block. The demo&apos;s runtime route sets{" "}
          <code>injectA2UITool: true</code> and a{" "}
          <code>defaultCatalogId</code>, and its comments say why: the
          middleware only watches <code>render_a2ui</code> when injection is
          on, and without the pinned id the model&apos;s missing{" "}
          <code>catalogId</code> falls back to a catalog the page never
          registered. This repo runs the demo&apos;s version.
        </p>
      </Callout>

      <Panel
        title="The opt-out path (reference only)"
        description="The page's “I opted out of auto-inject” steps, as published. Not wired here."
      >
        <Callout tone="warn" title="The Python half is LangGraph's">
          It builds the tool with <code>get_a2ui_tools</code> from{" "}
          <code>ag_ui_langgraph</code> and a <code>ChatOpenAI</code> model —
          neither exists in a LlamaIndex backend. The agent above uses the
          runtime-injected <code>render_a2ui</code> instead, forwarded by the
          stock router.
        </Callout>
        <div className="mt-4 space-y-4">
          <CodeBlock code={OPT_OUT_MIDDLEWARE} language="ts" />
          <CodeBlock code={OPT_OUT_TOOL} filename="agent.py" language="python" />
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
