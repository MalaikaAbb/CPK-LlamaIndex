"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { rootInspectorSetting } from "@/lib/inspector";

/**
 * One provider for the whole app, so chat state survives navigation between
 * test routes.
 *
 * The Quickstart wraps the app in `<CopilotKit runtimeUrl agent="my_agent">`,
 * which locks every surface to one agent. This repo registers several, so the
 * provider names none of them and each route passes the `agentId` it wants —
 * see the Multi-Agent Flows route for what that trade-off means.
 *
 * Three props worth explaining:
 *
 * `useSingleEndpoint` is deliberately absent. On `<CopilotKitProvider>` an
 * omitted flag means `auto`: the client probes `GET /api/copilotkit/info` and
 * matches whichever transport the runtime serves. The Quickstart passes
 * `useSingleEndpoint={false}` on `<CopilotKit>`. Older releases of that wrapper
 * pinned the flag to `true`, which 404s against the multi-route handler; in
 * 1.75.1 it forwards the prop untouched, so an omitted flag is `auto` there
 * too — which is why the doc samples that mount their own `<CopilotKit>`
 * without the flag still connect.
 *
 * `headers` carries the identity `identifyUser` reads on the runtime. Threads
 * are per-user, so without it every visitor of a deployed copy would share one
 * history. A real app would derive this from a verified session; a local test
 * harness has no session, so it sends a fixed demo identity that you can
 * override with NEXT_PUBLIC_DEMO_USER_ID to watch thread lists diverge.
 *
 * `showDevConsole` mounts the Inspector on localhost. It is needed because
 * `CopilotKitProvider` defaults it to false — `<CopilotKit>` is the component
 * that takes `enableInspector` and defaults to on. On routes that render a doc
 * sample with its own `<CopilotKit>`, this provider stands down so only one
 * inspector mounts (see `lib/inspector.ts`). Never mount
 * `<CopilotKitInspector />` by hand: it forwards `core ?? null`, so a bare
 * instance reports "CopilotKit core not attached".
 */

const RUNTIME_URL = "/api/copilotkit";

const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "harness-local";
const DEMO_USER_NAME = process.env.NEXT_PUBLIC_DEMO_USER_NAME ?? "Harness User";

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <CopilotKitProvider
      runtimeUrl={RUNTIME_URL}
      headers={{
        "x-user-id": DEMO_USER_ID,
        "x-user-name": DEMO_USER_NAME,
      }}
      showDevConsole={rootInspectorSetting(pathname)}
      onError={(event) => {
        console.error(`[CopilotKit ${event.code}]`, event.error);
      }}
    >
      {children}
    </CopilotKitProvider>
  );
}
