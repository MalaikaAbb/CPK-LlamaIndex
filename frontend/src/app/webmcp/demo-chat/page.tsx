"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useEffect, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import { OrderSearch } from "../OrderSearch";

/** The runtime id this demo binds to. Also shown in the demo header. */
const AGENT_ID = "my_agent";

/**
 * Harness glue around the page's `OrderSearch` (which is verbatim): the page
 * says it must run inside an existing provider, so it is mounted here under
 * the app-wide one, next to a chat on the Quickstart agent so the CopilotKit
 * path can call the tool too. The `document.modelContext` line is a harness
 * diagnostic, not page code.
 */
export default function Page() {
  const [hasModelContext, setHasModelContext] = useState<boolean | null>(null);

  useEffect(() => {
    setHasModelContext("modelContext" in document);
  }, []);

  return (
    <DemoFrame
      parentPath="/webmcp"
      subtitle={`agent: ${AGENT_ID} · document.modelContext: ${
        hasModelContext === null ? "…" : hasModelContext ? "present" : "absent (WebMCP no-ops)"
      }`}
    >
      <OrderSearch />
      <CopilotChat
        agentId={AGENT_ID}
        labels={{
          welcomeMessageText:
            'Try "Show my shipped orders" — the agent calls searchOrders, whose handler throws (searchOrders is undefined on the page).',
        }}
      />
    </DemoFrame>
  );
}
