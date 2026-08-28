"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";

/**
 * One provider for the whole app, so chat state survives navigation between
 * test routes.
 *
 * The Quickstart wraps the app in `<CopilotKit runtimeUrl agent="my_agent">`,
 * which locks every surface to one agent. This repo registers five, so the
 * provider names none of them and each route passes the `agentId` it wants —
 * see the Multi-Agent Flows route for what that trade-off means.
 *
 * Three props worth explaining:
 *
 * `useSingleEndpoint` is deliberately absent. On `<CopilotKitProvider>` an
 * omitted flag means `auto`: the client probes `GET /api/copilotkit/info` and
 * matches whichever transport the runtime serves. The Quickstart passes
 * `useSingleEndpoint={false}` because it uses `<CopilotKit>`, and every
 * released version of that wrapper pins the flag to `true` internally — which
 * 404s against the multi-route handler while `/info` still returns 200, so the
 * app looks connected. This provider has no such pin.
 *
 * `headers` carries the identity `identifyUser` reads on the runtime. Threads
 * are per-user, so without it every visitor of a deployed copy would share one
 * history. A real app would derive this from a verified session; a local test
 * harness has no session, so it sends a fixed demo identity that you can
 * override with NEXT_PUBLIC_DEMO_USER_ID to watch thread lists diverge.
 *
 * `showDevConsole="auto"` mounts the Inspector on localhost. It is needed
 * because `CopilotKitProvider` defaults it to false — `<CopilotKit>` is the
 * component that takes `enableInspector` and defaults to on. Never mount
 * `<CopilotKitInspector />` by hand: it forwards `core ?? null`, so a bare
 * instance reports "CopilotKit core not attached".
 */

const RUNTIME_URL = "/api/copilotkit";

const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "harness-local";
const DEMO_USER_NAME = process.env.NEXT_PUBLIC_DEMO_USER_NAME ?? "Harness User";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CopilotKitProvider
      runtimeUrl={RUNTIME_URL}
      headers={{
        "x-user-id": DEMO_USER_ID,
        "x-user-name": DEMO_USER_NAME,
      }}
      showDevConsole="auto"
      onError={(event) => {
        console.error(`[CopilotKit ${event.code}]`, event.error);
      }}
    >
      {children}
    </CopilotKitProvider>
  );
}
