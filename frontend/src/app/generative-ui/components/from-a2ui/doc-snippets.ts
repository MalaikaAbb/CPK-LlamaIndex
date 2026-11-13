/**
 * Code from https://docs.copilotkit.ai/llamaindex/generative-ui/components/from-a2ui, verbatim, kept as text (not compiled or run here).
 * React-tab and untabbed blocks only; the page's 4 Angular-tab
 * block(s) are left out because this harness is a Next.js app.
 */
import type { DocSnippet } from "../_shared/reference-page";

export const SNIPPETS: DocSnippet[] = [
  {
    "filename": "Before (React)",
    "language": "tsx",
    "code": "<CopilotKit runtimeUrl=\"/api/copilotkit\" a2ui={{ catalog: myCatalog }}>"
  },
  {
    "filename": "After (React)",
    "language": "tsx",
    "code": "<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: appUI }}>"
  },
  {
    "filename": "Runtime, before",
    "language": "ts",
    "code": "const runtime = new CopilotRuntime({\n  agents,\n  a2ui: { injectA2UITool: false, agents: [\"shop\"] },\n});"
  },
  {
    "filename": "Runtime, after",
    "language": "ts",
    "code": "// Nothing: a run that carries a catalog gets the render_ui tool and the guide.\n// To force or limit it: generativeUI: true, or generativeUI: { agents: [\"shop\"] }.\nconst runtime = new CopilotRuntime({ agents });"
  },
  {
    "filename": "Before (React)",
    "language": "ts",
    "code": "import { createCatalog, DynamicStringSchema } from \"@copilotkit/a2ui-renderer\";\n\nconst definitions = {\n  Airport: {\n    props: z.object({ code: DynamicStringSchema, city: DynamicStringSchema }),\n  },\n  Arrow: { props: z.object({}) },\n};\nconst renderers = { Airport, Arrow };\nexport const myCatalog = createCatalog(definitions, renderers, {\n  catalogId: \"acme/flights\",\n  includeBasicCatalog: true,\n});"
  },
  {
    "filename": "After (React)",
    "language": "ts",
    "code": "import {\n  createGenerativeUI,\n  standardUI,\n} from \"@copilotkit/react-core/v2/generative-ui\";\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/flights@1\",\n  extends: [standardUI],\n  components: {\n    Airport: {\n      component: Airport,\n      description: \"An airport by IATA code, with its city under it.\",\n      props: z.object({ code: z.string(), city: z.string() }),\n    },\n    Arrow: { component: Arrow, description: \"An arrow between two airports.\" },\n  },\n});"
  }
];
