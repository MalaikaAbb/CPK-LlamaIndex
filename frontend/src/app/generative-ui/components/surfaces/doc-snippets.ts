/**
 * Code from https://docs.copilotkit.ai/llamaindex/generative-ui/components/surfaces, verbatim, kept as text (not compiled or run here).
 * React-tab and untabbed blocks only; the page's 5 Angular-tab
 * block(s) are left out because this harness is a Next.js app.
 */
import type { DocSnippet } from "../_shared/reference-page";

export const SNIPPETS: DocSnippet[] = [
  {
    "filename": "app/page.tsx (React)",
    "language": "tsx",
    "code": "import { GenerativeUISurface } from \"@copilotkit/react-core/v2/generative-ui\";\nimport { shopUI } from \"./catalog\";\n\nexport function FeaturedProducts({ products }: { products: Product[] }) {\n  return (\n    <GenerativeUISurface\n      id=\"featured\"\n      ui={shopUI}\n      description=\"The Featured Products row of the home page. When the customer asks to see products here, show them as a ProductGrid with one ProductCard for each product. When they ask for the featured products again, delete this surface.\"\n      components={[\"ProductGrid\", \"ProductCard\"]}\n      fallback={<ProductRow products={products} />}\n    />\n  );\n}"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "<GenerativeUISurface id=\"featured\" ui={shopUI} components={[\"ProductGrid\", \"ProductCard\"]} />"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "<GenerativeUISurface id=\"sidebar-notes\" autoScroll={false} />"
  },
  {
    "filename": "css",
    "language": "css",
    "code": "[data-generative-ui-surface] {\n  scroll-margin-top: 6rem;\n}"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "<GenerativeUISurface\n  key={product.id}\n  id={`recommendations-${product.id}`}\n  description={`The \"You might also like\" row under ${product.name}. Show related products here. Never include ${product.name} itself.`}\n/>"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "<CopilotKitProvider\n  runtimeUrl=\"/api/copilotkit\"\n  generativeUI={{\n    ui: shopUI,\n    errorBoundary: {\n      onError: (info) => console.warn(info.kind, info.surfaceId, info.error.message),\n      fallback: ({ retry }) => <button onClick={retry}>Try again</button>,\n    },\n  }}\n>"
  }
];
