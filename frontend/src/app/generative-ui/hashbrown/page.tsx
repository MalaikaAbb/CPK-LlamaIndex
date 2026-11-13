import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

import { MD_EXPORT, RENDERED } from "./doc-snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Callout tone="warn" title="Reference only: the page marks this unsupported on LlamaIndex">
        <p>
          The rendered LlamaIndex page carries a &ldquo;Not supported on
          LlamaIndex&rdquo; note, and its demo slot says the{" "}
          <code>declarative-hashbrown</code> demo hasn&apos;t been tagged for LlamaIndex.
          There is no LlamaIndex Code tab: no agent, no system prompt telling
          the model to emit the <code>{"{ ui: [...] }"}</code> envelope, and no runtime route. Without those
          nothing produces the JSON this renderer reads, so this route has no
          demo and is marked Broken.
        </p>
        <p className="mt-2">
          The Markdown export does list three frontend files (below), but they
          import <code>./suggestions</code>, <code>./types</code>,{" "}
          <code>./metric-card</code> and <code>./charts/*</code>, which are not
          published, post to a <code>/api/copilotkit-declarative-hashbrown</code>{" "}
          runtime route no page prints, and need <code>@hashbrownai/core</code>{" "}
          and <code>@hashbrownai/react</code> (the page names{" "}
          <code>0.5.0-beta.4</code>), which this repo does not install.
        </p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent streams one JSON object whose <code>ui</code> array names
          components from a Hashbrown UI kit (metric, pie and bar charts, a
          deal card, Markdown). The assistant-message slot runs it through{" "}
          <code>useJsonParser</code> against the kit&apos;s schema and renders
          each finished part while the rest is still streaming.
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
