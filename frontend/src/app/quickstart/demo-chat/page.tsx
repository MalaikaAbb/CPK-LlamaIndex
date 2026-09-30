"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Quickstart's `app/page.tsx`: a heading and a bare `<CopilotSidebar />`.
 *
 * The doc names the agent once, on the provider (`agent="my_agent"`), so the
 * sidebar carries no `agentId`. That works because this route renders the
 * doc's own `providers.tsx` via `layout.tsx` rather than relying on the
 * app-wide provider. The `DemoFrame` around it is the harness's.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/quickstart" subtitle="agent: my_agent · doc Providers">
      <main>
        <h1>Your App</h1>
        <CopilotSidebar />
      </main>
    </DemoFrame>
  );
}
