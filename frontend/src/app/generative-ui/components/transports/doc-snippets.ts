/**
 * Code from https://docs.copilotkit.ai/llamaindex/generative-ui/components/transports, verbatim, kept as text (not compiled or run here).
 * React-tab and untabbed blocks only; the page's 3 Angular-tab
 * block(s) are left out because this harness is a Next.js app.
 */
import type { DocSnippet } from "../_shared/reference-page";

export const SNIPPETS: DocSnippet[] = [
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI }}>"
  },
  {
    "filename": "app/api/copilotkit/route.ts",
    "language": "ts",
    "code": "const runtime = new CopilotRuntime({\n  agents: { default: agent },\n  generativeUI: true,\n});"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI, transport: \"markdown\" }}>"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "<CopilotKitProvider\n  runtimeUrl=\"/api/copilotkit\"\n  generativeUI={{ ui: standardUI, agentIds: [\"shop\"] }}\n>"
  }
];
