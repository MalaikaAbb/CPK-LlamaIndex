"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

export const ORDER_STATUSES = ["open", "shipped", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function OrderSearch() {
  useFrontendTool({
    name: "searchOrders",
    description: "Search the sample orders by status",
    parameters: z.object({
      status: z.enum(ORDER_STATUSES),
    }),
    handler: async ({ status }) => {
      const orders = await searchOrders(status);
      return JSON.stringify(orders);
    },
    webmcp: {
      annotations: {
        readOnlyHint: true,
      },
    },
  });

  return null;
}

export function searchOrders(status: OrderStatus) {
  const orders = [
    { id: "ORD-001", status: "open" },
    { id: "ORD-002", status: "shipped" },
    { id: "ORD-003", status: "delivered" },
  ];

  return orders.filter((order) => order.status === status);
}