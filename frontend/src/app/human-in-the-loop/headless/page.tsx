import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/headless" />

      <Callout tone="warn" title="Reference only: no code on the page for LlamaIndex">
        <p>
          The rendered LlamaIndex page shows &ldquo;Not supported on
          LlamaIndex&rdquo; for Human in the Loop: Interrupts. It describes a
          headless stand-in (a <code>useFrontendTool</code> whose handler keeps
          the pending call in React state so a separate panel can show the
          picker, with <code>render: () =&gt; null</code> in the chat) but
          prints none of it: the docs site reports its{" "}
          <code>headless-promise-primitives</code> region missing for{" "}
          <code>llamaindex::interrupt-headless</code>, and there is no Code
          tab, agent or runtime route. With no code at all, there is nothing
          to show or wire; the route is Broken.
        </p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Resolving an agent&apos;s pause from any part of the UI instead of a
          render slot in the chat: a button grid, form or modal driven by the
          same primitives <code>useInterrupt</code> uses. The page points to
          testing fixtures, non-chat dashboards and custom flow control as
          the reasons to do this.
        </p>
      </Panel>
    </>
  );
}
