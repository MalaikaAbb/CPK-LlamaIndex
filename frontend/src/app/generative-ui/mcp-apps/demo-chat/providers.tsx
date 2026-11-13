"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

// The MCP Apps page's app/providers.tsx. Only `runtimeUrl` differs: it points
// at this route's own runtime (`/api/copilotkit-mcp-apps`) instead of the
// page's `/api/copilotkit` (harness glue; see the runtime route's header).
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-mcp-apps" useSingleEndpoint={false}>
      {children}
    </CopilotKit>
  );
}
