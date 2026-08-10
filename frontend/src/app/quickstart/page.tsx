import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

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
            { file: "frontend/src/app/api/copilotkit/route.ts" },
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

      <Panel title="The agent and its LLM">
        <SourceCodeGroup
          files={[
            { file: "backend/agents.py", region: "get-weather" },
            { file: "backend/llm.py" },
          ]}
        />
      </Panel>
    </>
  );
}
