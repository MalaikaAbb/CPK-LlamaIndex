import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

/**
 * Shared layout for the "Components and surfaces" routes.
 *
 * The section needs `@copilotkit/react-core/v2/generative-ui`; this repo is on
 * CopilotKit 1.87 for it. Eight routes mount the page's code in `demo-chat/`
 * against the `/components` LlamaIndex router (`live`); State and actions is
 * reference-only. `_shared` is a private folder: Next does not route it.
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
  live = false,
}: {
  path: string;
  summary: string;
  extra?: string;
  snippets: DocSnippet[];
  /** The route has a demo wired to the `/components` LlamaIndex router. */
  live?: boolean;
}) {
  return (
    <>
      <RouteHeader path={path} />

      {live ? (
        <Callout tone="warn" title="Wired to the backend — broken: the LlamaIndex adapter cannot carry generative UI">
          <p>
            The demo runs the page&apos;s provider config on{" "}
            <code>/api/copilotkit-genui</code> (Transports:{" "}
            <code>/api/copilotkit-genui-transports</code>, its{" "}
            <code>generativeUI: true</code> runtime). The agent is this
            repo&apos;s <code>/components</code> LlamaIndex router, standing in
            for the section&apos;s TanStack <code>BuiltInAgent</code> with the
            same prompt and no tools. CopilotKit is 1.87 (was 1.75.1, which has
            no <code>v2/generative-ui</code>).
          </p>
          <p className="mt-2">
            Expect text answers and no UI. <code>llama-index-protocols-ag-ui</code>{" "}
            (0.5.0 here; 0.6.0 is the same) passes the run&apos;s{" "}
            <code>render_ui</code> tool to the model but turns its{" "}
            <code>operations</code> array into a string parameter, which the
            runtime&apos;s argument parser cannot read, and it drops the
            run&apos;s <code>context</code>, which carries the{" "}
            <code>render_ui</code> guide and markdown mode&apos;s schema. No
            page in the section shows a LlamaIndex agent, and the adapter is
            not patched here (README Known issues).
          </p>
          {extra ? <p className="mt-2">{extra}</p> : null}
        </Callout>
      ) : (
        <Callout tone="warn" title="Broken: reference only">
          <p>
            Nothing on this page is mounted. Its samples need a{" "}
            <code>Cart</code> type and a <code>cart</code> instance, and a{" "}
            <code>ProductCard</code>, that the page never defines, or are
            fragments (<code>events</code>, <code>writable</code>, function
            declarations) with no catalog around them. Nothing is written in
            their place, so it has no demo and no backend of its own.
          </p>
          {extra ? <p className="mt-2">{extra}</p> : null}
        </Callout>
      )}

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {summary}
        </p>
      </Panel>

      <Panel
        title="The page's code, verbatim"
        description={live ? "React-tab and untabbed blocks; the Angular tabs are left out. The runnable ones are mounted in the demo (see the status note)." : "React-tab and untabbed blocks; the Angular tabs are left out. Not compiled."}
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
