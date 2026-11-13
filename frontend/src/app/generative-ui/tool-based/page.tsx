import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/tool-based";

// Verbatim from the page prose ("How it works in code"). The demo's agent below
// is the Code-tab file, whose prompt differs from this one.
const PROSE_AGENT_SNIPPET = `from llama_index.llms.openai import OpenAI

llm = OpenAI(model="gpt-6-luna")

SYSTEM_PROMPT = """You are a data visualization assistant.

When the user asks for a chart, call \`render_bar_chart\` with a concise
title and a \`data\` array of \`{label, value}\` items."""`;

// Verbatim from the page's "Rendering in a headless chat" section. Not run
// here: the demo uses the prebuilt CopilotChat, which paints tool calls itself.
const HEADLESS_SNIPPET = `import { CopilotChatToolCallsView } from "@copilotkit/react-core/v2";

<CopilotChatToolCallsView message={assistantMessage} messages={allMessages} />;`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-based" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A React component becomes something the agent can call.{" "}
          <code>useComponent</code> registers it under a tool name with a Zod
          schema; the schema is sent to the agent as that tool&apos;s
          parameters, and when the agent calls it the chat renders the
          component with the arguments as props. There is no handler and
          nothing runs on the server.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The LlamaIndex router declares no tools of its own: the AG-UI request
          carries the frontend tool definitions, and the stock router forwards
          them to the model. Only the system prompt tells the model when to
          use them.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me a bar chart of quarterly revenue: Q1 120, Q2 150, Q3 90, Q4 180",
              "Show a pie chart of browser market share",
            ]}
            expect="A chart card renders inline in the chat with the title, description and one bar or slice per item."
            fail="The agent answers in prose (the tool was not offered or the prompt did not reach the model), or the card says 'No data available' — the adapter turned the data array into a string (see the callout below)."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Where this differs from the page">
        <ul className="space-y-1.5">
          <li>
            · <strong>Unpublished model import.</strong> The Code tab&apos;s
            agent imports <code>OpenAI</code> from{" "}
            <code>agents._openai_models</code>, which no page publishes. The
            page&apos;s own prose sample imports it from{" "}
            <code>llama_index.llms.openai</code>, so that line is used instead
            (marked <code>DOC GAP</code> in the file).
          </li>
          <li>
            · <strong>Unpublished suggestions.</strong> The demo page imports{" "}
            <code>useSuggestions</code> from <code>./suggestions</code>, which
            is not in the Code tab. Its import and call are commented out; the
            chat has no suggestion chips.
          </li>
          <li>
            · <strong>Two prompts.</strong> The prose prompt mentions only{" "}
            <code>render_bar_chart</code>; the Code tab&apos;s prompt covers
            bar and pie charts and a <code>generate_haiku</code> tool that no
            file registers. The demo runs the Code tab&apos;s prompt.
          </li>
          <li>
            · <strong>Model id.</strong> The agent hard-codes{" "}
            <code>gpt-6-luna</code>, as published. It does not go through{" "}
            <code>OPENAI_CHAT_MODEL_ID</code>.
          </li>
          <li>
            · <strong>Schema flattening (expected, not yet observed).</strong>{" "}
            <code>llama-index-protocols-ag-ui</code> rebuilds every
            frontend-tool parameter as a string (README Known issues), so the
            model may send <code>data</code> as a string and the chart shows
            its empty state.
          </li>
        </ul>
      </Callout>

      <Panel title="The agent (Code tab)">
        <SourceCode file="backend/demos/gen_ui_tool_based_agent.py" />
      </Panel>

      <Panel
        title="The agent, as the prose prints it"
        description="Two fragments of a chart_agent.py the page never shows whole."
      >
        <CodeBlock filename="src/agents/chart_agent.py" language="python" code={PROSE_AGENT_SNIPPET} />
      </Panel>

      <Panel title="The frontend (Code tab)">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/tool-based-demo.tsx` },
            { file: `${DIR}/bar-chart.tsx` },
            { file: `${DIR}/pie-chart.tsx` },
          ]}
          note={
            <>
              <code>tool-based-demo.tsx</code> is the demo&apos;s{" "}
              <code>page.tsx</code>. It mounts its own{" "}
              <code>&lt;CopilotKit agent=&quot;gen-ui-tool-based&quot;&gt;</code>{" "}
              against this harness&apos;s main runtime, where that id points at{" "}
              <code>/gen-ui-tool-based/run</code>. The Code tab&apos;s{" "}
              <code>route.ts</code> (the showcase&apos;s many-agent
              single-route runtime) is not copied; the existing runtime
              registers the id instead.
            </>
          }
        />
      </Panel>

      <Panel title="Rendering in a headless chat (reference)">
        <p className="mb-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A custom chat has to paint tool calls itself. The page names{" "}
          <code>CopilotChatToolCallsView</code> for that (it pairs each call with
          its tool result and calls the registered renderer). The demo uses the
          prebuilt chat, so this is not exercised here.
        </p>
        <CodeBlock filename="Headless chat" language="tsx" code={HEADLESS_SNIPPET} />
      </Panel>
    </>
  );
}
