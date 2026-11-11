/**
 * Code from https://docs.copilotkit.ai/llamaindex/generative-ui/components/state-and-actions, verbatim, kept as text (not compiled or run here).
 * React-tab and untabbed blocks only; the page's 6 Angular-tab
 * block(s) are left out because this harness is a Next.js app.
 */
import type { DocSnippet } from "../_shared/reference-page";

export const SNIPPETS: DocSnippet[] = [
  {
    "filename": "app/catalog.tsx (React)",
    "language": "tsx",
    "code": "const cartSchema = z.object({\n  items: z.array(z.object({ productId: z.string(), quantity: z.number() })),\n});\n\nexport const shopUI = createGenerativeUI({\n  id: \"acme/shop@1\",\n  state: { cart: cartSchema },\n  components: {\n    ProductCard: {\n      component: ProductCard,\n      props: z.object({ productId: z.string(), name: z.string(), inCart: z.number() }),\n      bind: {\n        inCart: (state, { productId }) =>\n          state.cart.items.find((item) => item.productId === productId)?.quantity ?? 0,\n      },\n    },\n  },\n});"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "import { useGenerativeUIState } from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction CartState({ cart }: { cart: Cart }) {\n  useGenerativeUIState(shopUI, \"cart\", { items: cart.items });\n  return null;\n}"
  },
  {
    "filename": "app/catalog.tsx (React)",
    "language": "tsx",
    "code": "export const shopUI = createGenerativeUI({\n  id: \"acme/shop@1\",\n  functions: {\n    addToCart: {\n      description: \"Add a product to the cart\",\n      parameters: z.object({ productId: z.string(), quantity: z.number().default(1) }),\n    },\n  },\n  components: {\n    ProductCard: {\n      component: ProductCard,\n      props: z.object({ productId: z.string(), name: z.string() }),\n      events: { onAddToCart: {} },\n    },\n  },\n});"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "import { useGenerativeUIFunction } from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction CartActions({ cart }: { cart: Cart }) {\n  useGenerativeUIFunction(shopUI, \"addToCart\", ({ productId, quantity }) => {\n    cart.addItem(productId, quantity);\n    return { added: productId };\n  });\n  return null;\n}"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "import { useState } from \"react\";\nimport type { GenerativeUIComponentProps } from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction ProductCard({ productId, name, onAddToCart }: GenerativeUIComponentProps<typeof shopUI, \"ProductCard\">) {\n  const [error, setError] = useState<string>();\n  return (\n    <article>\n      <h4>{name}</h4>\n      <button\n        onClick={async () => {\n          const result = await onAddToCart?.({ productId });\n          if (result && !result.ok) setError(result.error.message);\n        }}\n      >\n        Add to cart\n      </button>\n      {error ? <p role=\"alert\">{error}</p> : null}\n    </article>\n  );\n}"
  },
  {
    "filename": "ts",
    "language": "ts",
    "code": "functions: {\n  addToCart: { parameters: z.object({ productId: z.string() }), allowedCallers: \"rendererOrAgent\", returnType: \"object\" },\n  track: { parameters: z.object({ event: z.string() }), returnType: \"void\" },\n  reload: { parameters: z.object({}), allowedCallers: \"agentOnly\" },\n},"
  },
  {
    "filename": "ts",
    "language": "ts",
    "code": "events: {\n  onChoose: {\n    description: \"The user picked a plan\",\n    parameters: z.object({ plan: z.string() }),\n  },\n},"
  },
  {
    "filename": "tsx",
    "language": "tsx",
    "code": "CheckoutForm: {\n  component: CheckoutForm,\n  props: z.object({ email: z.string().optional() }),\n  writable: [\"email\"],\n},"
  },
  {
    "filename": "tsx (React)",
    "language": "tsx",
    "code": "function CheckoutForm({ email, setEmail }: GenerativeUIComponentProps<typeof shopUI, \"CheckoutForm\">) {\n  return <input value={email ?? \"\"} onChange={(event) => setEmail(event.target.value)} />;\n}"
  }
];
