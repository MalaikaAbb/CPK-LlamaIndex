"use client";

import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/mcp-apps"
      subtitle="agent: default · local MCP server"
    >
      <CopilotKit runtimeUrl="/api/copilotkit-mcp" useSingleEndpoint={false}>
        <main>
          <h1>Your App</h1>
          <CopilotSidebar />
        </main>
      </CopilotKit>
    </DemoFrame>
  );
}
