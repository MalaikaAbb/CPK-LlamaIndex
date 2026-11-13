"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The MCP Apps page's `app/page.tsx`: a heading and a bare
 * `<CopilotSidebar />`. The `DemoFrame` around it is the harness's.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/mcp-apps" subtitle="agent: default · /api/copilotkit-mcp-apps">
      <main>
        <h1>Your App</h1>
        <CopilotSidebar />
      </main>
    </DemoFrame>
  );
}
