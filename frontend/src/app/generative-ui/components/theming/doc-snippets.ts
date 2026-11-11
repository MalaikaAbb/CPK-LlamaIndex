/**
 * Code from https://docs.copilotkit.ai/llamaindex/generative-ui/components/theming, verbatim, kept as text (not compiled or run here).
 * React-tab and untabbed blocks only; the page's 3 Angular-tab
 * block(s) are left out because this harness is a Next.js app.
 */
import type { DocSnippet } from "../_shared/reference-page";

export const SNIPPETS: DocSnippet[] = [
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "<CopilotKitProvider\n  runtimeUrl=\"/api/copilotkit\"\n  generativeUI={{\n    ui: standardUI,\n    theme: {\n      \"--a2ui-color-accent\": \"#d97706\",\n      \"--a2ui-font-family\": \"Inter, sans-serif\",\n      \"--a2ui-radius-md\": \"10px\",\n    },\n  }}\n>"
  },
  {
    "filename": "ts (React)",
    "language": "ts",
    "code": "import type { GenerativeUITheme } from \"@copilotkit/react-core/v2/generative-ui\";\n\nexport const theme: GenerativeUITheme = { \"--a2ui-color-accent\": \"#d97706\" };"
  },
  {
    "filename": "html",
    "language": "html",
    "code": "<html class=\"dark\">"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "const colorSchemeScript = `(() => {\n  const media = matchMedia(\"(prefers-color-scheme: dark)\");\n  const apply = () => document.documentElement.classList.toggle(\"dark\", media.matches);\n  apply();\n  media.addEventListener(\"change\", apply);\n})();`;\n\n<head>\n  <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />\n</head>;"
  },
  {
    "filename": "tsx",
    "language": "tsx",
    "code": "theme: {\n  \"--a2ui-color-accent\": \"#d97706\",\n  dark: {\n    \"--a2ui-color-panel\": \"#1f2937\",\n    \"--a2ui-color-surface\": \"#111827\",\n  },\n},"
  },
  {
    "filename": "tsx",
    "language": "tsx",
    "code": "theme: {\n  mapStyle: \"https://tiles.example.com/light.json\",\n  dark: { mapStyle: \"https://tiles.example.com/dark.json\" },\n},"
  },
  {
    "filename": "css",
    "language": "css",
    "code": ".a2ui-surface {\n  --a2ui-color-accent: #d97706;\n}"
  }
];
