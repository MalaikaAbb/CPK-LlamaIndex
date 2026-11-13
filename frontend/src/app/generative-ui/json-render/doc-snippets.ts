/**
 * Code from https://docs.copilotkit.ai/llamaindex/generative-ui/json-render, verbatim,
 * kept as text (it is not compiled or run here).
 *
 * RENDERED: what the LlamaIndex page itself renders — only the example agent
 * output. MD_EXPORT: frontend files that appear only in the page's Markdown
 * export; the rendered LlamaIndex page omits them and shows "Not supported on
 * LlamaIndex" instead. They import modules no page publishes.
 */
export interface DocSnippet {
  filename: string;
  language: string;
  code: string;
}

export const RENDERED: DocSnippet[] = [
  {
    "filename": "example agent output",
    "language": "json",
    "code": "{\n  \"root\": \"revenue-card\",\n  \"elements\": {\n    \"revenue-card\": {\n      \"type\": \"MetricCard\",\n      \"props\": { \"label\": \"Total revenue\", \"value\": \"$184,302\", \"trend\": \"+12%\" },\n      \"children\": [\"by-region\"]\n    },\n    \"by-region\": {\n      \"type\": \"BarChart\",\n      \"props\": {\n        \"title\": \"Revenue by region\",\n        \"description\": null,\n        \"data\": [\n          { \"label\": \"North America\", \"value\": 112000 },\n          { \"label\": \"EMEA\", \"value\": 72302 }\n        ]\n      }\n    }\n  }\n}"
  }
];

export const MD_EXPORT: DocSnippet[] = [
  {
    "filename": "src/app/demos/declarative-json-render/chat.tsx",
    "language": "tsx",
    "code": "// src/app/demos/declarative-json-render/chat.tsx\n\"use client\";\n\nimport {\n  CopilotChat,\n  CopilotChatAssistantMessage,\n} from \"@copilotkit/react-core/v2\";\nimport { JsonRenderAssistantMessage } from \"./json-render-renderer\";\nimport { useByocJsonRenderSuggestions } from \"./suggestions\";\n\nexport const AGENT_ID = \"byoc_json_render\";\n\nexport function Chat() {\n  useByocJsonRenderSuggestions();\n\n  return (\n    <CopilotChat\n      agentId={AGENT_ID}\n      className=\"h-full rounded-2xl\"\n      messageView={{\n        assistantMessage:\n          JsonRenderAssistantMessage as unknown as typeof CopilotChatAssistantMessage,\n      }}\n    />\n  );\n}"
  },
  {
    "filename": "src/app/demos/declarative-json-render/json-render-renderer.tsx",
    "language": "tsx",
    "code": "// src/app/demos/declarative-json-render/json-render-renderer.tsx\n\"use client\";\n\nimport { useMemo } from \"react\";\nimport {\n  CopilotChatAssistantMessage,\n  type CopilotChatAssistantMessageProps,\n} from \"@copilotkit/react-core/v2\";\nimport { JSONUIProvider, Renderer } from \"@json-render/react\";\nimport { registry } from \"./registry\";\nimport type { JsonRenderSpec } from \"./types\";\n\nconst ALLOWED_TYPES = new Set([\"MetricCard\", \"BarChart\", \"PieChart\"]);\n\nexport function JsonRenderAssistantMessage(\n  props: CopilotChatAssistantMessageProps,\n) {\n  const content =\n    typeof props.message.content === \"string\" ? props.message.content : \"\";\n  const spec = useMemo(() => parseSpec(content), [content]);\n\n  // Stream not yet a valid spec (or plain prose) — render the default bubble.\n  if (!spec) return <CopilotChatAssistantMessage {...props} />;\n\n  return (\n    <div\n      data-testid=\"copilot-assistant-message\"\n      data-message-role=\"assistant\"\n      className=\"w-full\"\n    >\n      <div data-testid=\"json-render-root\" className=\"w-full\">\n        <JSONUIProvider registry={registry}>\n          <Renderer\n            spec={spec as unknown as Parameters<typeof Renderer>[0][\"spec\"]}\n            registry={registry}\n          />\n        </JSONUIProvider>\n      </div>\n    </div>\n  );\n}\n\n/** Parse a json-render spec out of the assistant content, tolerating code fences and prose. */\nfunction parseSpec(raw: string): JsonRenderSpec | null {\n  const jsonText = extractJsonObject(raw);\n  if (!jsonText) return null;\n\n  let parsed: unknown;\n  try {\n    parsed = JSON.parse(jsonText);\n  } catch {\n    return null;\n  }\n\n  if (!isRecord(parsed)) return null;\n  const { root, elements } = parsed as { root?: unknown; elements?: unknown };\n  if (typeof root !== \"string\" || !isRecord(elements) || !(root in elements)) {\n    return null;\n  }\n\n  for (const el of Object.values(elements)) {\n    if (!isRecord(el)) return null;\n    if (typeof el.type !== \"string\" || !ALLOWED_TYPES.has(el.type)) return null;\n    if (el.props !== undefined && !isRecord(el.props)) return null;\n  }\n\n  return parsed as unknown as JsonRenderSpec;\n}\n\n/** Strip code fences, then return the first balanced {...} object as a string. */\nfunction extractJsonObject(raw: string): string | null {\n  if (!raw?.trim()) return null;\n  const fence = /```(?:json)?\\s*([\\s\\S]*?)```/i.exec(raw);\n  const candidate = (fence ? fence[1] : raw).trim();\n  const start = candidate.indexOf(\"{\");\n  if (start === -1) return null;\n\n  let depth = 0;\n  let inString = false;\n  let escape = false;\n  for (let i = start; i < candidate.length; i++) {\n    const ch = candidate[i];\n    if (escape) {\n      escape = false;\n      continue;\n    }\n    if (inString) {\n      if (ch === \"\\\\\") escape = true;\n      else if (ch === '\"') inString = false;\n      continue;\n    }\n    if (ch === '\"') {\n      inString = true;\n      continue;\n    }\n    if (ch === \"{\") depth++;\n    else if (ch === \"}\" && --depth === 0) return candidate.slice(start, i + 1);\n  }\n  return null;\n}\n\nfunction isRecord(v: unknown): v is Record<string, unknown> {\n  return typeof v === \"object\" && v !== null && !Array.isArray(v);\n}"
  },
  {
    "filename": "src/app/demos/declarative-json-render/catalog.ts",
    "language": "tsx",
    "code": "// src/app/demos/declarative-json-render/catalog.ts\nimport { defineCatalog } from \"@json-render/core\";\nimport { schema } from \"@json-render/react/schema\";\nimport { z } from \"zod4\";\n\nconst dataPoint = z.object({ label: z.string(), value: z.number() });\n\nexport const catalog = defineCatalog(schema, {\n  components: {\n    MetricCard: {\n      props: z.object({\n        label: z.string(),\n        value: z.string(),\n        trend: z.string().nullable(),\n      }),\n      description:\n        \"A labelled metric (single number) with an optional trend subtitle\",\n    },\n    BarChart: {\n      props: z.object({\n        title: z.string(),\n        description: z.string().nullable(),\n        data: z.array(dataPoint),\n      }),\n      description:\n        \"A vertical bar chart for comparing discrete values side by side\",\n    },\n    PieChart: {\n      props: z.object({\n        title: z.string(),\n        description: z.string().nullable(),\n        data: z.array(dataPoint),\n      }),\n      description:\n        \"A donut-style pie chart for breaking a total down into category slices\",\n    },\n  },\n  actions: {},\n});"
  },
  {
    "filename": "src/app/demos/declarative-json-render/registry.tsx",
    "language": "tsx",
    "code": "// src/app/demos/declarative-json-render/registry.tsx\nimport { defineRegistry } from \"@json-render/react\";\nimport { catalog } from \"./catalog\";\nimport { MetricCard, type MetricCardComponentProps } from \"./metric-card\";\nimport { BarChart, type BarChartComponentProps } from \"./charts/bar-chart\";\nimport { PieChart, type PieChartComponentProps } from \"./charts/pie-chart\";\n\nexport const { registry } = defineRegistry(catalog, {\n  components: {\n    // The agent may nest charts inside a MetricCard root — forward children.\n    MetricCard: ({ props, children }) => (\n      <div className=\"flex w-full flex-col items-stretch gap-3\">\n        <MetricCard {...(props as MetricCardComponentProps)} />\n        {children}\n      </div>\n    ),\n    BarChart: ({ props }) => (\n      <BarChart {...(props as BarChartComponentProps)} />\n    ),\n    PieChart: ({ props }) => (\n      <PieChart {...(props as PieChartComponentProps)} />\n    ),\n  },\n});"
  }
];
