"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/** The runtime id this demo binds to. Also shown in the demo header. */
const AGENT_ID = "my_agent";

/**
 * The Quickstart's own UI: a `CopilotSidebar` beside your app content.
 *
 * `agentId={AGENT_ID}` matches the id the runtime registers for the AG-UI
 * router mounted at `/run`. The doc sets that id once on the provider via
 * `<CopilotKit agent="my_agent">`; this harness serves five agents, so each
 * route names the one it wants instead.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/quickstart" subtitle={`agent: ${AGENT_ID} · CopilotSidebar`}>
      <main className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Your App
        </h1>
        <p className="max-w-md text-sm text-slate-500">
          The sidebar is docked at the right edge of the window. Ask it
          something to confirm the whole stack is connected.
        </p>
      </main>

      <CopilotSidebar
        agentId={AGENT_ID}
        labels={{
          modalHeaderTitle: "Your Assistant",
          welcomeMessageText: "Hi! How can I help you today?",
        }}
      />
    </DemoFrame>
  );
}
