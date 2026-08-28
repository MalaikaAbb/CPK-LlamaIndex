import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const DRY_RUN_SNIPPET = `# ADK
npx copilotkit@latest import --source adk --dry-run

# LangGraph
npx copilotkit@latest import --source langgraph --dry-run`;

const DEST_SNIPPET = `export INTELLIGENCE_API_URL="https://..."
export INTELLIGENCE_API_KEY="cpk_..."`;

const MAP_SNIPPET = `{
  "support-agent": "support-agent",
  "sales-agent": "sales-agent"
}`;

const PROJECT_SNIPPET = `npx copilotkit@latest project select`;

const IMPORTED: string[] = [
  "user, assistant, tool, system, and developer messages",
  "tool calls and tool results",
  "reasoning traces when the source exposes them",
  "media that can be resolved during extraction",
  "original timestamps",
  "import provenance and per-conversation import outcomes",
];

const NOT_IMPORTED: string[] = [
  "agent state snapshots",
  "framework transport noise",
  "LangSmith traces",
  "unsupported source stores",
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/threads-import" />

      <Callout tone="warn" title="There is no LlamaIndex importer — this route is notes only">
        <p>
          Every other route in this harness runs. This one cannot, and the reason
          is on the doc page itself: &ldquo;Built-in import currently supports
          Google ADK and LangGraph, with more sources coming soon.&rdquo; The
          supported-sources table lists exactly those two, each linking to a
          framework-specific guide (<code>/google-adk/threads-import</code>,{" "}
          <code>/langgraph-python/threads-import</code>). Neither applies here.
        </p>
        <p className="mt-2">
          So there is nothing to demo, and nothing was invented to fill the gap.
          What follows is the flow as published, so it is legible when a
          LlamaIndex source appears.
        </p>
      </Callout>

      <Panel title="What it is">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A one-time backfill: pull conversations that already exist in a
          framework&apos;s own store into CopilotKit Intelligence as Rich
          Threads, then keep running them through CopilotKit so users resume them
          in the same thread UI as new ones.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          It is additive, not a migration. Existing storage and analytics stay in
          place; for future CopilotKit-mediated runs, both stores get written
          when the agent is still wired to its own durable persistence.
        </p>
      </Panel>

      <Panel title="What crosses over, and what does not">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Imported
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {IMPORTED.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Not imported
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              {NOT_IMPORTED.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <Panel
        title="The flow"
        description="Entirely CLI-driven — there is no React surface to this feature at all."
      >
        <ol className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              1. Confirm the target project
            </p>
            <p className="mt-1">
              The importer targets the project selected when the app was created.
              To send threads elsewhere, select it first — the command rewrites
              the project for the current directory and writes its
              project-scoped key to the generated <code>.env</code>.
            </p>
            <div className="mt-2">
              <CodeBlock filename="Terminal" language="bash" code={PROJECT_SNIPPET} />
            </div>
          </li>

          <li>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              2. Dry run
            </p>
            <p className="mt-1">
              Reads the source, discovers agent keys, counts conversations,
              reports skips, and estimates upload size without opening a batch.
              It needs no Intelligence URL or key.
            </p>
            <div className="mt-2">
              <CodeBlock filename="Terminal" language="bash" code={DRY_RUN_SNIPPET} />
            </div>
          </li>

          <li>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              3. Map source agents
            </p>
            <p className="mt-1">
              Each source agent key maps to the <code>agentId</code> your live
              runtime uses. Keeping the labels aligned is what stops imported
              history and future traffic from splitting across two ids.
            </p>
            <div className="mt-2">
              <CodeBlock
                filename="agent-map.json"
                language="json"
                code={MAP_SNIPPET}
              />
            </div>
          </li>

          <li>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              4. Prepare the destination
            </p>
            <p className="mt-1">
              A real import needs the app-api URL and the project key. The
              importer reads flags or the current process environment only — it
              does <em>not</em> load <code>.env</code> or{" "}
              <code>.copilotkit/project.json</code>, so exporting them is a
              required step rather than a convenience.
            </p>
            <div className="mt-2">
              <CodeBlock filename="Terminal" language="bash" code={DEST_SNIPPET} />
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              <code>COPILOTKIT_API_KEY</code> is also accepted for the key, and
              both can be passed as <code>--api-url</code> /{" "}
              <code>--api-key</code> instead.
            </p>
          </li>

          <li>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              5. Import, then verify
            </p>
            <p className="mt-1">
              Re-running the same import is safe — already-imported
              conversations are skipped, and <code>--replace</code> is the opt-in
              for refreshing them. Verification is manual: open the Threads
              Drawer, select an imported conversation, and confirm its history
              appears in the chat.
            </p>
          </li>
        </ol>
      </Panel>

      <Panel title="Where this repo would pick it up">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The last step of the flow — &ldquo;keep future conversations
          synced&rdquo; — is the part this harness already implements. It offers
          two paths, and both have routes here:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            ·{" "}
            <a
              href="/prebuilt-components/copilot-threads-drawer"
              className="text-[var(--accent)] underline underline-offset-4"
            >
              Threads Drawer
            </a>{" "}
            — the ready-made switcher the doc tells you to verify against.
          </li>
          <li>
            ·{" "}
            <a
              href="/headless-threads"
              className="text-[var(--accent)] underline underline-offset-4"
            >
              Headless Threads
            </a>{" "}
            — select a thread with <code>useThreads</code>, store its{" "}
            <code>thread.id</code>, pass it to the chat as{" "}
            <code>threadId</code>. That is exactly what that route&apos;s demo
            does.
          </li>
        </ul>
      </Panel>
    </>
  );
}
