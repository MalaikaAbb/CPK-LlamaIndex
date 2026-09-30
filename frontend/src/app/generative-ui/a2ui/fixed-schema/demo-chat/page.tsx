"use client";

import { DemoFrame } from "@/components/demo-frame";

import A2UIFixedSchemaDemo from "../a2ui-fixed-schema";

/**
 * The page's demo, as its "Code" tab publishes it, inside the harness chrome.
 *
 * `a2ui-fixed-schema.tsx` is the demo's `page.tsx` byte-for-byte: its own
 * `<CopilotKit runtimeUrl="/api/copilotkit-a2ui-fixed-schema"
 * a2ui={{ catalog }}>`. This path is in `NESTED_PROVIDER_ROUTES`
 * (`lib/inspector.ts`) so the root provider's inspector stands down.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/a2ui/fixed-schema"
      subtitle="agent: a2ui-fixed-schema · /api/copilotkit-a2ui-fixed-schema"
    >
      <div className="h-full overflow-auto">
        <A2UIFixedSchemaDemo />
      </div>
    </DemoFrame>
  );
}
