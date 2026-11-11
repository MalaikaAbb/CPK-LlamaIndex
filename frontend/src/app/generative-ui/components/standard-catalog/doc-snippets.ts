/**
 * Code from https://docs.copilotkit.ai/llamaindex/generative-ui/components/standard-catalog, verbatim, kept as text (not compiled or run here).
 * React-tab and untabbed blocks only; the page's 3 Angular-tab
 * block(s) are left out because this harness is a Next.js app.
 */
import type { DocSnippet } from "../_shared/reference-page";

export const SNIPPETS: DocSnippet[] = [
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "import { standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\n<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI }}>"
  },
  {
    "filename": "ts (React)",
    "language": "ts",
    "code": "import { createGenerativeUI, standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI],\n  components: {\n    ProductCard: { component: ProductCard, props: productSchema },\n  },\n});"
  },
  {
    "filename": "ts",
    "language": "ts",
    "code": "export const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI.omit([\"Map\", \"Video\", \"HtmlView\"])],\n  components: {},\n});"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "import {\n  createGenerativeUI,\n  standardUI,\n  type GenerativeUIComponentProps,\n} from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction MyCard({ children }: GenerativeUIComponentProps<typeof standardUI, \"Card\">) {\n  return <div className=\"rounded-2xl border p-6 shadow-sm\">{children}</div>;\n}\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI],\n  overrides: { Card: { component: MyCard } },\n  components: {},\n});"
  }
];
