/**
 * Code from https://docs.copilotkit.ai/llamaindex/generative-ui/components, verbatim, kept as text (not compiled or run here).
 * React-tab and untabbed blocks only; the page's 7 Angular-tab
 * block(s) are left out because this harness is a Next.js app.
 */
import type { DocSnippet } from "./_shared/reference-page";

export const SNIPPETS: DocSnippet[] = [
  {
    "filename": "bash (React)",
    "language": "bash",
    "code": "npm install @copilotkit/react-core @copilotkit/runtime @tanstack/ai @tanstack/ai-openai"
  },
  {
    "filename": ".env.local (React)",
    "language": "bash",
    "code": "OPENAI_API_KEY=sk-..."
  },
  {
    "filename": "app/api/copilotkit/[[...slug]]/route.ts (React)",
    "language": "ts",
    "code": "import { chat } from \"@tanstack/ai\";\nimport { openaiText } from \"@tanstack/ai-openai\";\nimport {\n  BuiltInAgent,\n  convertInputToTanStackAI,\n  CopilotRuntime,\n  createCopilotRuntimeHandler,\n  InMemoryAgentRunner,\n} from \"@copilotkit/runtime/v2\";\n\nconst agent = new BuiltInAgent({\n  type: \"tanstack\",\n  factory: ({ input, abortController }) => {\n    const { messages, systemPrompts, tools } = convertInputToTanStackAI(input);\n    return chat({\n      adapter: openaiText(\"gpt-6-luna\"),\n      messages,\n      systemPrompts: [\n        \"You are a helpful assistant. When a visual answer helps, render it with generative UI.\",\n        ...systemPrompts,\n      ],\n      tools,\n      abortController,\n    });\n  },\n});\n\nconst runtime = new CopilotRuntime({\n  agents: { default: agent },\n  runner: new InMemoryAgentRunner(),\n});\n\nconst handler = createCopilotRuntimeHandler({ runtime, basePath: \"/api/copilotkit\" });\n\nexport const GET = handler;\nexport const POST = handler;"
  },
  {
    "filename": "app/providers.tsx (React)",
    "language": "tsx",
    "code": "\"use client\";\nimport { CopilotKitProvider } from \"@copilotkit/react-core/v2\";\nimport { standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\nimport \"@copilotkit/react-core/v2/styles.css\";\n\nexport function Providers({ children }: { children: React.ReactNode }) {\n  return (\n    <CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI }}>\n      {children}\n    </CopilotKitProvider>\n  );\n}"
  },
  {
    "filename": "app/layout.tsx (React)",
    "language": "tsx",
    "code": "import { Providers } from \"./providers\";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        <Providers>{children}</Providers>\n      </body>\n    </html>\n  );\n}"
  },
  {
    "filename": "app/page.tsx (React)",
    "language": "tsx",
    "code": "\"use client\";\nimport { CopilotChat } from \"@copilotkit/react-core/v2\";\n\nexport default function Page() {\n  return <CopilotChat />;\n}"
  },
  {
    "filename": "text",
    "language": "text",
    "code": "Compare the Starter, Team, and Enterprise plans in a table"
  }
];
