"use client";

import { DemoFrame } from "@/components/demo-frame";
import { OrderSearch } from "@/components/OrderSearch";

export default function Page() {
  return (
    <DemoFrame parentPath="/webmcp" subtitle="searchOrders frontend tool">
      <main className="mx-auto flex h-full w-full max-w-3xl flex-col gap-4 p-6">
        <OrderSearch />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This page registers the documented <code>searchOrders</code> frontend
          tool. In a WebMCP-enabled browser, use the Model Context Tool
          Inspector to confirm the tool is discoverable, call it with
          <code> {"{ status: 'shipped' }"} </code>, and verify the returned
          result. This page does not call the handler directly.
        </p>
      </main>
    </DemoFrame>
  );
}
