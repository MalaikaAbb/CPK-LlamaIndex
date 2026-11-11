import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

/**
 * Shared layout for the reference-only "Components and surfaces" routes.
 *
 * Every page in that doc section needs `@copilotkit/react-core` 1.85+ (the
 * `/v2/generative-ui` entry, `standardUI`, `createCatalog`,
 * `<GenerativeUISurface>`, the provider's `generativeUI` prop). This repo pins
 * 1.75.1, so the page code is shown as text and nothing runs. `_shared` is a
 * private folder: Next does not route it.
 */
export interface DocSnippet {
  filename: string;
  language: string;
  code: string;
}

export function ComponentsReferencePage({
  path,
  summary,
  extra,
  snippets,
}: {
  path: string;
  summary: string;
  extra?: string;
  snippets: DocSnippet[];
}) {
  return (
    <>
      <RouteHeader path={path} />

      <Callout tone="warn" title="Reference only: needs a newer CopilotKit than this repo pins">
        <p>
          This doc section (marked experimental on the page) is built on{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code> and the
          provider&apos;s <code>generativeUI</code> prop, which first ship in
          CopilotKit 1.85. This repo is locked to 1.75.1, so the page&apos;s
          code is shown below as text and is not compiled or run. A
          CopilotKit bump is a separate infra change.
        </p>
        <p className="mt-2">
          Even after a bump, the LlamaIndex side is unproven: the page needs
          the agent to hand the run&apos;s <code>render_ui</code> tool and its
          context entries to the model, and the installed{" "}
          <code>llama-index-protocols-ag-ui</code> drops <code>context</code>{" "}
          and flattens frontend-tool parameters to strings (README Known
          issues). No page in the section shows a LlamaIndex agent.
        </p>
        {extra ? <p className="mt-2">{extra}</p> : null}
      </Callout>

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {summary}
        </p>
      </Panel>

      <Panel
        title="The page's code, verbatim"
        description="React-tab and untabbed blocks; the Angular tabs are left out. Not compiled."
      >
        <div className="space-y-4">
          {snippets.map((s, i) => (
            <CodeBlock
              key={`${i}-${s.filename}`}
              filename={s.filename}
              language={s.language}
              code={s.code}
            />
          ))}
        </div>
      </Panel>
    </>
  );
}
