"use client";

import { DemoFrame } from "@/components/demo-frame";

import HitlInChatDemo from "../hitl-in-chat";

/**
 * The page's `hitl-in-chat` demo, as its "Code" tab publishes it.
 *
 * `hitl-in-chat.tsx` is the demo's `page.tsx` byte-for-byte, including its own
 * `<CopilotKit runtimeUrl="/api/copilotkit" agent="hitl-in-chat">`. That points
 * at this harness's main runtime, where `hitl-in-chat` is registered against
 * the Quickstart router. This path is in `NESTED_PROVIDER_ROUTES`
 * (`lib/inspector.ts`) so the root provider's inspector stands down.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/human-in-the-loop/index" subtitle="agent: hitl-in-chat">
      <div className="h-full overflow-auto">
        <HitlInChatDemo />
      </div>
    </DemoFrame>
  );
}
