import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/open-generative-ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/open-generative-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The most open-ended form of generative UI: no catalog and no
          predefined components. One runtime flag,{" "}
          <code>openGenerativeUI: {"{ agents: [...] }"}</code>, makes the
          runtime inject a <code>generateSandboxedUi</code> tool. The model
          answers by writing HTML, CSS and JavaScript into it, and the
          provider&apos;s built-in renderer streams that into a sandboxed
          iframe as it arrives — styles first, then markup, then scripts.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo has two modes. <strong>Minimal</strong> swaps in a
          visualisation-focused <code>designSkill</code> and nothing else.{" "}
          <strong>Advanced</strong> registers <code>sandboxFunctions</code> —
          host-page handlers the generated UI can call from inside the iframe
          through <code>Websandbox.connection.remote.&lt;name&gt;()</code>.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["Quicksort visualization", "How a neural network works"]}
            expect="Minimal mode. Placeholder lines show first, then ONE iframe fills in with a labelled, animated SVG visual. The agent's own chat reply is one sentence and the run ends."
            fail="The agent describes the visual in prose and no iframe appears — generateSandboxedUi never reached the model, or the runtime is not the /api/copilotkit-ogui one."
          />
          <TryIt
            prompts={["Calculator (calls evaluateExpression)", "Ping the host (calls notifyHost)"]}
            expect={
              <>
                Advanced mode. ONE interactive widget renders at full height
                (not cut off); using it logs{" "}
                <code>[open-gen-ui/advanced] evaluateExpression …</code> or{" "}
                <code>notifyHost: …</code> in the browser console, and the
                widget shows the value the host returned.
              </>
            }
            fail="The same widget is drawn two or more times (the follow-up rule is not in effect — restart the backend), or it renders but nothing is logged, meaning the sandbox functions were not wired into the iframe."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Source: the page's demo Code tabs">
        The page&apos;s prose prints the runtime flag and the provider as
        fragments; the full files are in the Code tabs under its two
        interactive demos. Everything on this route is copied from there. Each
        demo&apos;s <code>page.tsx</code> is kept here under its demo name, and
        the minimal/advanced switcher around them is the harness&apos;s.
      </Callout>

      <Callout tone="warn" title="One import swapped: make_request_aware_router">
        Both agents import <code>make_request_aware_router</code> from{" "}
        <code>agents/_request_tools.py</code>, which the docs never publish.
        The call uses the same keyword arguments as{" "}
        <code>get_ag_ui_workflow_router</code>, so the import is aliased to
        that and the call is left alone. Nothing is lost:
        llama-index-protocols-ag-ui 0.5.0 already turns any tool in the
        run input that the agent did not declare (here{" "}
        <code>generateSandboxedUi</code>) into a pass-through tool. The
        agents&apos; own comments say the custom router exists to match
        recorded test fixtures.
      </Callout>

      <Callout tone="warn" title="Harness remedy: the published prompts loop">
        <p>
          The client answers every <code>generateSandboxedUi</code> call with
          the tool result <code>&quot;UI generated&quot;</code> and re-runs the
          agent. Both published prompts say to call the tool on{" "}
          <em>every</em> turn, so the model draws the UI again on each
          follow-up — three calculators for one question, with the run still
          going. In the advanced demo each iframe was also clipped at 200px.
          The renderer only measures its content if the sandbox has loaded
          when generation finishes. The LlamaIndex adapter sends the whole tool
          call at once, so that moment comes too early and the iframe stays at{" "}
          <code>initialHeight</code>, which defaults to 200 and which the
          advanced prompt never sets.
        </p>
        <p className="mt-2">
          Both agents keep the published router untouched. A{" "}
          <code>follow-up-remedy</code> region after it rebinds the router with
          the published prompt plus a rule: stop once the tool result arrives.
          The advanced agent also gets a rule to set an explicit{" "}
          <code>initialHeight</code>.
        </p>
        <p className="mt-2">
          <strong>Advanced buttons did nothing.</strong> The provider sends the
          sandbox functions&apos; names, parameter schemas and return shapes as{" "}
          <code>RunAgentInput.context</code>, and the published prompt tells
          the model to read them from there. llama-index-protocols-ag-ui 0.5.0
          never reads <code>context</code>, so the model guessed the call
          shape. The same one-chunk delivery can also drop{" "}
          <code>jsFunctions</code>/<code>jsExpressions</code>: they are queued
          before the renderer rebuilds the sandbox for the finished HTML, and
          the rebuild clears the queue. The advanced remedy therefore lists the
          two function contracts (copied from{" "}
          <code>sandbox-functions.ts</code>) and asks for all JavaScript in an
          inline <code>&lt;script&gt;</code> in the HTML. That HTML becomes the
          iframe&apos;s <code>srcdoc</code>, so its scripts always run.
        </p>
      </Callout>

      <Panel title="The runtime">
        <SourceCode file="frontend/src/app/api/copilotkit-ogui/route.ts" />
      </Panel>

      <Panel title="Minimal">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/open-gen-ui/open-gen-ui.tsx` },
            { file: `${DIR}/open-gen-ui/chat.tsx` },
            { file: `${DIR}/open-gen-ui/design-skill.ts` },
            { file: "backend/demos/open_gen_ui_agent.py" },
          ]}
        />
      </Panel>

      <Panel title="Advanced — sandbox functions">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/open-gen-ui-advanced/open-gen-ui-advanced.tsx` },
            { file: `${DIR}/open-gen-ui-advanced/sandbox-functions.ts` },
            { file: `${DIR}/open-gen-ui-advanced/suggestions.ts` },
            { file: "backend/demos/open_gen_ui_advanced_agent.py" },
          ]}
        />
      </Panel>

      <Callout tone="info" title="Why this runtime is separate">
        The demo&apos;s route explains it: turning the flag on changes what the
        runtime reports to the client, and on a shared runtime that would clear
        other pages&apos; per-page tool registrations. So Open Generative UI
        gets its own endpoint, <code>/api/copilotkit-ogui</code>, and the main
        runtime never sets the flag.
      </Callout>
    </>
  );
}
