/**
 * Code from https://docs.copilotkit.ai/llamaindex/generative-ui/components/markdown-mode, verbatim, kept as text (not compiled or run here).
 * React-tab and untabbed blocks only; the page's 2 Angular-tab
 * block(s) are left out because this harness is a Next.js app.
 */
import type { DocSnippet } from "../_shared/reference-page";

export const SNIPPETS: DocSnippet[] = [
  {
    "filename": "markdown",
    "language": "markdown",
    "code": "Here is an estimate you can play with:\n\n```a2ui\n{\"version\":\"1.0\",\"createSurface\":{\"surfaceId\":\"plan-estimator\",\"dataModel\":{\"seats\":10,\"price\":\"$290 / month\"},\"components\":[{\"id\":\"root\",\"component\":\"Card\",\"children\":[\"seats\",\"price\"]}]}}\n{\"version\":\"1.0\",\"updateComponents\":{\"surfaceId\":\"plan-estimator\",\"components\":[{\"id\":\"seats\",\"component\":\"Slider\",\"label\":\"Seats\",\"min\":1,\"max\":50,\"value\":{\"@path\":\"/seats\"}},{\"id\":\"price\",\"component\":\"Text\",\"text\":{\"@path\":\"/price\"}}]}}\n```\n\nMove the slider to change the seat count."
  },
  {
    "filename": "app/providers.tsx (React)",
    "language": "tsx",
    "code": "import { CopilotKitProvider } from \"@copilotkit/react-core/v2\";\nimport { standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\n<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI, transport: \"markdown\" }}>\n  {children}\n</CopilotKitProvider>;"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "<CopilotKitProvider\n  runtimeUrl=\"/api/copilotkit\"\n  generativeUI={{ ui: standardUI, transport: \"markdown\", sendContext: false }}\n>"
  },
  {
    "filename": "json",
    "language": "json",
    "code": "{\n  \"1.0\": {\n    \"supportedCatalogIds\": [\"copilotkit/standard@1\"],\n    \"inlineCatalogs\": [\n      {\n        \"catalogId\": \"copilotkit/standard@1\",\n        \"protocolVersion\": \"1.0\",\n        \"components\": { \"Card\": { \"props\": { \"type\": \"object\" } } },\n        \"functions\": {},\n        \"instructions\": \"You can show interactive UI in your reply ...\"\n      }\n    ]\n  },\n  \"metadata\": {\n    \"extensions\": {\n      \"copilotkit_format\": 3,\n      \"copilotkit_transport\": \"markdown\",\n      \"copilotkit_targets\": [{ \"id\": \"chat\", \"kind\": \"chat\" }],\n      \"copilotkit_surfaces\": {},\n      \"copilotkit_contextSent\": false\n    }\n  }\n}"
  },
  {
    "filename": "python",
    "language": "python",
    "code": "ui = input.forwarded_props[\"copilotkit\"][\"ui\"]\ncatalog = ui[\"1.0\"][\"inlineCatalogs\"][0]\nsystem = f\"{MY_PROMPT}\\n\\n{catalog['instructions']}\\n\\nComponents:\\n{json.dumps(catalog['components'])}\""
  }
];
