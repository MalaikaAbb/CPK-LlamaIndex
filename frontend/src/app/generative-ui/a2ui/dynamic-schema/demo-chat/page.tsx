"use client";

import { DemoFrame } from "@/components/demo-frame";

import DeclarativeGenUIDemo from "../declarative-gen-ui";

/**
 * The page's demo, as its "Code" tab publishes it, inside the harness chrome.
 *
 * `declarative-gen-ui.tsx` is the demo's `page.tsx` byte-for-byte: its own
 * `<CopilotKit runtimeUrl="/api/copilotkit-declarative-gen-ui"
 * a2ui={{ catalog: myCatalog }}>`. This path is in `NESTED_PROVIDER_ROUTES`
 * (`lib/inspector.ts`) so the root provider's inspector stands down.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/a2ui/dynamic-schema"
      subtitle="agent: declarative-gen-ui · /api/copilotkit-declarative-gen-ui"
    >
      <div className="h-full overflow-auto">
        <DeclarativeGenUIDemo />
      </div>
    </DemoFrame>
  );
}
