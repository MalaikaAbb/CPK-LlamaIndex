import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { HANDLE_APPROVAL_SNIPPET, USE_INTERRUPT_SNIPPET } from "./doc-snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/governed-actions" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A frontend tool, <code>approve_governed_action</code>, that puts an
          approval card in front of a side effect. The card shows the action,
          the tool, its reference and the exact arguments, then acts on the
          verdict: <code>allow</code> approves itself, <code>deny</code>{" "}
          blocks, and <code>require_approval</code> waits for Approve or
          Reject. Whatever happens, the agent gets back an{" "}
          <code>approved</code> flag tied to the action&apos;s id and
          reference.
        </p>
        <div className="mt-4">
          <Callout tone="warn" title="The governance is not real">
            The page publishes no policy engine, no agent and no{" "}
            <code>executeSideEffect</code>. The agent is the Quickstart router,
            which has no page-specific prompt, so <code>id</code>,{" "}
            <code>reference</code> and <code>verdict</code> are whatever the
            model puts in the tool call. The approval mechanism is real; the
            decision it gates is made up.
          </Callout>
        </div>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Before emailing carol@northwind.test about her $420 refund, get my approval with approve_governed_action (verdict require_approval).",
              "Use approve_governed_action to apply a 30% discount to account NW-8812, verdict require_approval.",
            ]}
            expect={
              <>
                Only because both prompts spell out{" "}
                <code>verdict require_approval</code>: a card reading &quot;User
                approval required&quot; with the summary, tool, reference and an
                arguments block (likely a quoted string rather than an object),
                plus two unstyled buttons (the doc gives them no classes). The
                run waits. Approve or Reject resumes it, and the agent&apos;s
                reply depends on <code>approved</code>. Leave the verdict out
                and the buttons are usually missing — that is the bug above.
              </>
            }
            fail={
              <>
                No card, and the agent answers in prose. With no instruction
                telling it when, the model decides whether to call the tool,
                so name it explicitly as in the prompts above.
              </>
            }
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Broken: the buttons usually don't render">
        <p>
          Observed: a prompt such as{" "}
          <em>&quot;Before emailing carol@northwind.test about her $420 refund,
          get my approval with approve_governed_action&quot;</em> draws the
          card — &quot;User approval required&quot;, summary, tool, reference —
          but no Approve/Reject buttons, and <code>arguments</code> shows as
          one quoted string.
        </p>
        <p className="mt-2">
          Cause: llama-index-protocols-ag-ui 0.5.0 (
          <code>_ag_ui_tool_to_llama_index</code>) rebuilds every frontend
          tool&apos;s parameters as plain <code>str</code> fields, dropping the
          JSON schema&apos;s enums and types. The model never learns that{" "}
          <code>verdict</code> must be <code>allow</code>, <code>deny</code> or{" "}
          <code>require_approval</code>, or that <code>arguments</code> is an
          object. The card&apos;s status line treats any unrecognised verdict
          as &quot;User approval required&quot;, but its buttons render only
          for the exact string <code>require_approval</code>, so they
          disappear. The same flattening affects every frontend tool with
          non-string parameters in this repo. Left unfixed on purpose;
          spelling out the verdict in the prompt usually works around it.
        </p>
      </Callout>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/human-in-the-loop/governed-actions/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="info" title="Which agent answers">
        <code>governed-actions</code> is registered on the main runtime against
        the Quickstart router (<code>POST /run</code>). The page publishes no
        agent, and none is needed: the stock LlamaIndex router forwards any
        tool it did not declare, so <code>approve_governed_action</code> reaches
        the model with no Python changes.
      </Callout>

      <Panel title="Inline approval with useInterrupt — not runnable on LlamaIndex">
        <Callout tone="warn" title="The LlamaIndex adapter never raises an interrupt">
          This half needs the backend to pause the run with an AG-UI
          interrupt. llama-index-protocols-ag-ui 0.5.0 never emits one, and
          the page shows no LlamaIndex code that would. The block is shown as
          published but is not mounted. Its <code>GovernedActionCard</code> is
          the card the demo above renders.
        </Callout>
        <div className="mt-4">
          <CodeBlock code={USE_INTERRUPT_SNIPPET} language="tsx" />
        </div>
      </Panel>

      <Panel title="Resume handling — reference only">
        <Callout tone="warn" title="executeSideEffect is never defined">
          The server-side check the page shows calls{" "}
          <code>executeSideEffect</code>, which no page defines, and there is
          no agent to put it in.
        </Callout>
        <div className="mt-4">
          <CodeBlock code={HANDLE_APPROVAL_SNIPPET} language="ts" />
        </div>
      </Panel>
    </>
  );
}
