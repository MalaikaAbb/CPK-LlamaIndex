// Byte-exact copy of the "WebMCP only, with no agent" snippet on
// https://docs.copilotkit.ai/llamaindex/webmcp (title webmcp.ts). Type-checked,
// never run: `_doc` is a private folder and nothing imports it.
// `@copilotkit/core` is not a direct dependency of this repo; it resolves as
// the copy @copilotkit/react-core installs.
import { CopilotKitCore } from "@copilotkit/core";
import { z } from "zod";

export const copilotkit = new CopilotKitCore({
  tools: [
    {
      name: "searchOrders",
      description: "Search the signed-in user's orders by status",
      parameters: z.object({
        status: z.enum(["open", "shipped", "delivered"]),
      }),
      handler: async ({ status }) => {
        // @ts-expect-error verbatim doc code: `searchOrders` is never defined or imported on the page (TS2304)
        const orders = await searchOrders(status);
        return JSON.stringify(orders);
      },
      webmcp: {
        annotations: {
          readOnlyHint: true,
        },
      },
    },
  ],
});
