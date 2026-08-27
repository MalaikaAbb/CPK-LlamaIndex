import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/quickstart" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The bring-your-own-agent path. Three pieces: a FastAPI server that
          exposes a LlamaIndex workflow over AG-UI, a runtime route that binds
          it, and a chat component. Everything else in this harness is a
          variation on these.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Worth noting how thin the binding is:{" "}
          <code>get_ag_ui_workflow_router</code> on the Python side and a{" "}
          <code>LlamaIndexAgent</code> on the runtime side. That class is a
          three-line subclass of <code>HttpAgent</code> that pins the AG-UI
          protocol version — the transport underneath is a plain HTTP POST to{" "}
          <code>/run</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Can you tell me a joke?", "Can you help me understand AI?"]}
            expect="Tokens stream in a word at a time and the reply renders as markdown."
            fail="Nothing streams, or an error appears — the agent process is probably down. Check the connection panel on the home page."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/quickstart/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The two files that make it work"
        description="Read from this repo, so they can be diffed against the doc's samples directly."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit/[[...slug]]/route.ts" },
            { file: "backend/main.py" },
          ]}
          note={
            <>
              The runtime registers five agent ids rather than the doc&apos;s
              one, and the server includes five routers rather than one. That is
              the only structural departure, and it exists because{" "}
              <code>get_ag_ui_workflow_router</code> takes exactly one{" "}
              <code>initial_state</code> — see the{" "}
              <a
                href="/copilot-runtime"
                className="text-[var(--accent)] underline underline-offset-4"
              >
                Copilot Runtime
              </a>{" "}
              route.
            </>
          }
        />
      </Panel>

      <Callout tone="warn" title="The runtime route moved — and its old shape fails quietly">
        The Quickstart now mounts the runtime at{" "}
        <code>app/api/copilotkit/[[...slug]]/route.ts</code> with{" "}
        <code>createCopilotRuntimeHandler</code> from{" "}
        <code>@copilotkit/runtime/v2</code>, exporting four verbs instead of one
        POST. The handler serves a subtree, so the old single-segment{" "}
        <code>route.ts</code> answers <code>GET /info</code> with a 200 while
        404-ing every actual run — the app looks connected and never replies.
        This repo moved with it; the{" "}
        <a
          href="/copilot-runtime"
          className="text-[var(--accent)] underline underline-offset-4"
        >
          Copilot Runtime
        </a>{" "}
        route has the full before/after.
      </Callout>

      <Callout tone="info" title="`useSingleEndpoint={false}` is the doc's, not this repo's">
        The Quickstart passes it because it wraps the app in{" "}
        <code>&lt;CopilotKit&gt;</code>, which pins the flag to <code>true</code>{" "}
        in every released version — against a multi-route handler that 404s. This
        harness uses <code>&lt;CopilotKitProvider&gt;</code>, where an omitted
        flag means auto: the client probes <code>/info</code> and picks the
        matching transport. Both are correct; only one is necessary.
      </Callout>

      <Panel title="The agent and its LLM">
        <SourceCodeGroup
          files={[
            { file: "backend/agents.py", region: "get-weather" },
            { file: "backend/llm.py" },
          ]}
        />
      </Panel>

      <Panel
        title="Step 1: the license key"
        description="The Quickstart opens by asking you to sign up, then uses the key eight steps later."
      >
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          That key is what turns on Threads and the Inspector&apos;s Threads tab.
          It reaches the runtime as <code>INTELLIGENCE_API_KEY</code> — a
          server-side secret, never <code>NEXT_PUBLIC_</code> — and the runtime
          reads it off the <code>CopilotKitIntelligence</code> client you
          construct, not off the environment directly.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          It is optional here. With no key the runtime falls back to SSE mode
          with an in-memory runner and every route in this harness still works.
          The connection panel on the home page reports which mode you are
          actually in, read from <code>/info</code> rather than from whether the
          variable happens to be set.
        </p>
      </Panel>
    </>
  );
}
