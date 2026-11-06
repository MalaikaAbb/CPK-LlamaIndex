"use client";

// Step 3: Import useComponent and Zod for the frontend component tool.
import {
  CopilotChat,
  CopilotChatToolCallsView,
  useAgent,
  useComponent,
  useCopilotKit,
} from "@copilotkit/react-core/v2";
import { useCallback, useState } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "tool_based_agent";

const chartDataSchema = z.array(
  z.object({
    label: z.string().describe("The category label."),
    value: z.number().describe("The numeric value."),
  }),
);

const barChartPropsSchema = z.object({
  title: z.string().describe("A concise title for the chart."),
  data: chartDataSchema.describe("The labeled numeric values to display."),
});

type BarChartProps = z.infer<typeof barChartPropsSchema>;

function BarChart({ title, data }: BarChartProps) {
  let chartData: unknown = data;
  if (typeof chartData === "string") {
    try {
      chartData = JSON.parse(chartData);
    } catch {
      chartData = undefined;
    }
  }

  const parsedData = chartDataSchema.safeParse(chartData);

  return (
    <section className="my-3 w-full max-w-xl rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {parsedData.success ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={parsedData.data}
              margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="var(--accent)" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          Chart data is invalid. The agent must provide data as an array of
          labeled numeric values.
        </p>
      )}
    </section>
  );
}

function HeadlessChat() {
  const { agent } = useAgent({ agentId: AGENT_ID });
  const { copilotkit } = useCopilotKit();
  const [input, setInput] = useState("");

  const sendMessage = useCallback(async () => {
    if (!input.trim() || agent.isRunning) return;
    agent.addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    });
    setInput("");
    await copilotkit.runAgent({ agent });
  }, [agent, copilotkit, input]);

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {agent.messages.length === 0 && (
          <p className="text-sm text-slate-500">
            Ask for a chart to render a tool call in this headless chat.
          </p>
        )}
        {agent.messages.map((message) => {
          if (message.role === "tool") return null;
          const text =
            typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content ?? "");

          return (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "ml-auto max-w-xl rounded-lg bg-blue-100 p-3 text-slate-900"
                  : "max-w-xl rounded-lg bg-slate-100 p-3 text-slate-900"
              }
            >
              {text && <p>{text}</p>}
              {message.role === "assistant" && (
                <CopilotChatToolCallsView
                  message={message}
                  messages={agent.messages}
                />
              )}
            </div>
          );
        })}
        {agent.isRunning && (
          <p className="text-sm text-slate-500">Thinking...</p>
        )}
      </div>
      <form
        className="flex gap-2 border-t border-slate-200 p-4 dark:border-slate-800"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask for a bar chart..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
        <button
          type="submit"
          disabled={agent.isRunning || !input.trim()}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default function Page() {
  // Step 4: Register the typed chart component as the render_bar_chart tool.
  useComponent(
    {
      name: "render_bar_chart",
      description: "Display a bar chart with labeled numeric values.",
      parameters: barChartPropsSchema,
      render: BarChart,
    },
    [],
  );

  const [view, setView] = useState<"built-in" | "headless">("built-in");

  return (
    <DemoFrame
      parentPath="/generative-ui/tool-based"
      subtitle={`agent: ${AGENT_ID} · frontend chart component`}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setView("built-in")}
            aria-pressed={view === "built-in"}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
          >
            CopilotChat
          </button>
          <button
            type="button"
            onClick={() => setView("headless")}
            aria-pressed={view === "headless"}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
          >
            Headless chat
          </button>
        </div>
        <div className="min-h-0 flex-1">
          {view === "built-in" ? (
            <CopilotChat
              agentId={AGENT_ID}
              labels={{
                welcomeMessageText:
                  'Try "Show me a bar chart of monthly sales this year."',
              }}
            />
          ) : (
            <>
              {/* Step 5: Render assistant tool calls in a headless chat. */}
              <HeadlessChat />
            </>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
