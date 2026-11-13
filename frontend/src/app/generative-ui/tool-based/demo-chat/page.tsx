"use client";

import { DemoFrame } from "@/components/demo-frame";

import ControlledGenUiDemo from "../tool-based-demo";

/**
 * The page's demo, as its "Code" tab publishes it.
 *
 * `tool-based-demo.tsx` is the demo's `page.tsx` byte-for-byte except for the
 * unpublished `./suggestions` import and call, which are commented out. It
 * mounts its own `<CopilotKit runtimeUrl="/api/copilotkit"
 * agent="gen-ui-tool-based">`, which points at this harness's main runtime;
 * `gen-ui-tool-based` is registered there against the router `backend/main.py`
 * mounts at `/gen-ui-tool-based`. This path is in `NESTED_PROVIDER_ROUTES`
 * (`lib/inspector.ts`) so the root provider's inspector stands down.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/tool-based" subtitle="agent: gen-ui-tool-based">
      <div className="h-full overflow-auto">
        <ControlledGenUiDemo />
      </div>
    </DemoFrame>
  );
}
