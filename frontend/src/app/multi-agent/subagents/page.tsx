import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/multi-agent/subagents";

export default function Page() {
  return (
    <>
      <RouteHeader path="/multi-agent/subagents" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A supervisor LLM that delegates instead of answering. Each of its
          three tools — <code>research_agent</code>,{" "}
          <code>writing_agent</code>, <code>critique_agent</code> — runs a
          separate LlamaIndex <code>FunctionAgent</code> with its own narrow
          system prompt and no shared memory; the supervisor only ever sees the
          text each one returns.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every delegation is also written into a <code>delegations</code> list
          in shared state, as <code>running</code> and then{" "}
          <code>completed</code> or <code>failed</code>. The installed adapter
          emits a state snapshot after every backend tool call, so the
          delegation log on the left fills in live while the supervisor works.
          Tool-call cards in the chat show the same activity inline.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Produce a short blog post about the benefits of cold exposure training. Research first, then write, then critique.",
              "Explain how large language models handle tool calling. Research, write a paragraph, then critique.",
            ]}
            expect="A 'Supervisor running' pill appears and three entries land in the log in order — Research, Writing, Critique — each showing its task and result, while the matching indicator chips light up. The chat ends with a short summary."
            fail="The chat answers directly and the log stays empty (the supervisor never delegated), or entries appear only after the whole run finishes (state snapshots are not streaming)."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Source: the page's demo Code tab, verbatim">
        The page prose prints the sub-agent setup, the delegation tools and{" "}
        <code>DelegationLog</code>. It does not print the supervisor router,
        the React page that wires <code>useAgent</code>, or the components the
        page imports. The Code tab under the page&apos;s demo has all of them,
        and every file here is copied from it. The demo&apos;s{" "}
        <code>page.tsx</code> lives here as <code>subagents-demo.tsx</code>.
      </Callout>

      <Panel title="The supervisor and its sub-agents">
        <SourceCode file="backend/demos/subagents_agent.py" />
      </Panel>

      <Panel title="The frontend">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/subagents-demo.tsx` },
            { file: `${DIR}/delegation-log.tsx` },
            { file: `${DIR}/demo-layout.tsx` },
          ]}
        />
      </Panel>

      <Panel
        title="Supporting files"
        description="Shipped in the docs site's demo-source bundle for this demo, but not shown as a Code tab."
      >
        <SourceCodeGroup
          files={[
            { file: `${DIR}/subagent-activity-card.tsx` },
            { file: `${DIR}/supervisor-activity-banner.tsx` },
            { file: `${DIR}/active-subagent.ts` },
            { file: `${DIR}/suggestions.ts` },
          ]}
        />
      </Panel>

      <Callout tone="info" title="How it is wired here">
        <p>
          The demo mounts its own{" "}
          <code>&lt;CopilotKit runtimeUrl=&quot;/api/copilotkit&quot;
          agent=&quot;subagents&quot;&gt;</code>. The Code tab&apos;s{" "}
          <code>route.ts</code> is a shared runtime that registers some thirty
          showcase agents; rather than copy it, this repo adds{" "}
          <code>subagents</code> to its own main runtime, pointing at{" "}
          <code>/subagents/run</code> — the prefix that route names.{" "}
          <code>backend/main.py</code> mounts the published{" "}
          <code>subagents_router</code> there.
        </p>
      </Callout>

      <Callout tone="warn" title="The page's note on duplicate entries">
        The page warns that a state slot which blindly appends will double the
        log when a thread continues, because the client echoes shared state
        back as run input. The published helpers read the current list, append
        one entry with a fresh <code>uuid</code> and write the list back, so
        they merge by id and the echo does not double anything.
      </Callout>
    </>
  );
}
