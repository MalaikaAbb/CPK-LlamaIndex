/**
 * Code from https://docs.copilotkit.ai/llamaindex/generative-ui/components/catalogs, verbatim, kept as text (not compiled or run here).
 * React-tab and untabbed blocks only; the page's 5 Angular-tab
 * block(s) are left out because this harness is a Next.js app.
 */
import type { DocSnippet } from "../_shared/reference-page";

export const SNIPPETS: DocSnippet[] = [
  {
    "filename": "app/catalog.tsx (React)",
    "language": "tsx",
    "code": "import { z } from \"zod\";\nimport {\n  createGenerativeUI,\n  type GenerativeUIComponentProps,\n} from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction ProductGrid({ title, children }: GenerativeUIComponentProps<typeof shopUI, \"ProductGrid\">) {\n  return (\n    <section>\n      {title ? <h3>{title}</h3> : null}\n      <div className=\"grid grid-cols-2 gap-4\">{children}</div>\n    </section>\n  );\n}\n\nfunction ProductCard({ name, price, imageUrl }: GenerativeUIComponentProps<typeof shopUI, \"ProductCard\">) {\n  return (\n    <article>\n      <img src={imageUrl} alt={name} />\n      <h4>{name}</h4>\n      <p>${price}</p>\n    </article>\n  );\n}\n\nexport const shopUI = createGenerativeUI({\n  id: \"acme/shop@1\",\n  components: {\n    ProductGrid: {\n      component: ProductGrid,\n      description: \"A grid of products. Put the ids of ProductCard components in children.\",\n      props: z.object({ title: z.string().optional() }),\n      slots: { children: \"multiple\" },\n    },\n    ProductCard: {\n      component: ProductCard,\n      description: \"One product. Copy every value from a product of a tool result.\",\n      props: z.object({ name: z.string(), price: z.number(), imageUrl: z.string() }),\n    },\n  },\n});"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: shopUI }}>"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "function ProductCard(props: GenerativeUIComponentProps<typeof shopUI, \"ProductCard\">) {\n  props.price; // number\n  props.color; // type error: not a prop of ProductCard\n}"
  },
  {
    "filename": "ts (zod)",
    "language": "ts",
    "code": "import { z } from \"zod\";\n\nprops: z.object({ name: z.string(), price: z.number() }),"
  },
  {
    "filename": "ts (Valibot)",
    "language": "ts",
    "code": "import * as v from \"valibot\";\nimport { toStandardJsonSchema } from \"@valibot/to-json-schema\";\n\nprops: toStandardJsonSchema(v.object({ name: v.string(), price: v.number() })),"
  },
  {
    "filename": "ts (React)",
    "language": "ts",
    "code": "import { createGenerativeUI, standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI, cartUI],\n  components: { Hero: { component: Hero, props: z.object({ title: z.string() }) } },\n});"
  },
  {
    "filename": "ts (React)",
    "language": "ts",
    "code": "import { exportA2UICatalog } from \"@copilotkit/react-core/v2/generative-ui\";\n\nconst catalog = exportA2UICatalog(appUI, { title: \"Acme app\" });\nfs.writeFileSync(\"acme-catalog.json\", JSON.stringify(catalog, null, 2));"
  },
  {
    "filename": "tsx",
    "language": "tsx",
    "code": "const ui = createGenerativeUI({\n  id: \"acme/panel@1\",\n  components: {\n    Panel: {\n      component: Panel,\n      props: z.object({ title: z.string(), color: z.string().optional() }),\n      slots: { children: \"multiple\" },\n      parameterOrder: [\"title\", \"children\"],\n    },\n  },\n});"
  }
];
