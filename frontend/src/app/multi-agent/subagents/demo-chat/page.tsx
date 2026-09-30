"use client";

import { DemoFrame } from "@/components/demo-frame";

import SubagentsDemo from "../subagents-demo";

/**
 * The page's demo, as its "Code" tab publishes it, inside the harness chrome.
 *
 * `subagents-demo.tsx` is the demo's `page.tsx` byte-for-byte, including its
 * own `<CopilotKit runtimeUrl="/api/copilotkit" agent="subagents">`. That
 * points at this harness's main runtime, where `subagents` is registered
 * against the supervisor router at `/subagents/run`. This path is in
 * `NESTED_PROVIDER_ROUTES` (`lib/inspector.ts`) so the root provider's
 * inspector stands down.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/multi-agent/subagents" subtitle="agent: subagents">
      <div className="h-full overflow-auto">
        <SubagentsDemo />
      </div>
    </DemoFrame>
  );
}
