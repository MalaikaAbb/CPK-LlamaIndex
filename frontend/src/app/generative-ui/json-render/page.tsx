import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

import { MD_EXPORT, RENDERED } from "./doc-snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/json-render" />

      <Callout tone="warn" title="Reference only: the page marks this unsupported on LlamaIndex">
        <p>
          The rendered LlamaIndex page carries a &ldquo;Not supported on
          LlamaIndex&rdquo; note, and its demo slot says the{" "}
          <code>declarative-json-render</code> demo hasn&apos;t been tagged for LlamaIndex.
          There is no LlamaIndex Code tab: no agent, no system prompt telling
          the model to emit the <code>{"{ root, elements }"}</code> spec, and no runtime route. Without those
          nothing produces the JSON this renderer reads, so this route has no
          demo and is marked Broken.
        </p>
        <p className="mt-2">
          The Markdown export does list four frontend files (below), but they
          import <code>./suggestions</code>, <code>./types</code>,{" "}
          <code>./metric-card</code> and <code>./charts/*</code>, which are not
          published, and they need <code>@json-render/react</code>,{" "}
          <code>@json-render/core</code> and a <code>zod4</code> alias that
          this repo does not install.
        </p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent replies with a JSON spec (a root id plus a map of
          elements, each a component type and props). A custom{" "}
          <code>messageView.assistantMessage</code> slot parses that reply and
          renders it through a <code>@json-render/react</code> registry
          limited to MetricCard, BarChart and PieChart, falling back to the
          normal bubble until the JSON parses.
        </p>
      </Panel>

      <Panel
        title="What the LlamaIndex page renders"
        description="The only code block on the rendered page: the shape the agent is expected to send."
      >
        <div className="space-y-4">
          {RENDERED.map((s) => (
            <CodeBlock key={s.filename} filename={s.filename} language={s.language} code={s.code} />
          ))}
        </div>
      </Panel>

      <Panel
        title="Frontend files in the page's Markdown export"
        description="Not shown on the rendered LlamaIndex page. Kept verbatim as text; not compiled."
      >
        <div className="space-y-4">
          {MD_EXPORT.map((s) => (
            <CodeBlock key={s.filename} filename={s.filename} language={s.language} code={s.code} />
          ))}
        </div>
      </Panel>
    </>
  );
}
