import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

import { SNIPPETS } from "./doc-snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/useInterrupt" />

      <Callout tone="warn" title="Reference only: the page marks interrupts unsupported on LlamaIndex">
        <p>
          The rendered LlamaIndex page carries &ldquo;Not supported on
          LlamaIndex&rdquo; for Human in the Loop: Interrupts. Its stand-in
          (a <code>useFrontendTool</code> with a Promise-returning handler
          instead of <code>useInterrupt</code>) is described but not shown:
          the frontend snippet is missing from the page (the docs site
          reports its <code>frontend-promise-handler</code> region missing for
          <code> llamaindex::gen-ui-interrupt</code>), and there is no Code tab.
        </p>
        <p className="mt-2">
          The backend it does print is a fragment: it uses{" "}
          <code>FixedAGUIChatWorkflow</code>, <code>FunctionTool</code>,{" "}
          <code>OpenAI</code>, <code>_openai_kwargs</code> and{" "}
          <code>get_ag_ui_workflow_router(workflow_factory=...)</code> without
          any imports or definitions, and <code>FixedAGUIChatWorkflow</code>{" "}
          is not published anywhere. The frontend half that would call{" "}
          <code>schedule_meeting</code> (the time picker) is missing, so no
          route can be wired from it. Nothing was filled in; the route is
          Broken.
        </p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A run pauses for user input and resumes with the answer. On
          frameworks with AG-UI interrupts, <code>useInterrupt</code> renders a
          component when the run finishes with an interrupt outcome and
          submits <code>resolve</code>/<code>cancel</code> responses to resume
          it. LlamaIndex has no interrupt primitive, so the page swaps in a
          frontend tool whose handler holds the call open until the user picks
          a meeting slot.
        </p>
      </Panel>

      <Panel
        title="The page's code, verbatim"
        description="The LlamaIndex backend fragment and the generic useInterrupt examples. Not compiled."
      >
        <div className="space-y-4">
          {SNIPPETS.map((s, i) => (
            <CodeBlock key={`${i}-${s.filename}`} filename={s.filename} language={s.language} code={s.code} />
          ))}
        </div>
      </Panel>
    </>
  );
}
