"use client";

import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotThreadsDrawer,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/** The runtime id this demo binds to. Also shown in the demo header. */
const AGENT_ID = "my_agent";

/**
 * Verbatim from the page's "Add your own New conversation button" sample. It
 * calls the same configuration `startNewThread()` the drawer's own row calls,
 * so it only works inside the shared `CopilotChatConfigurationProvider`.
 */
function NewConversationButton() {
  const configuration = useCopilotChatConfiguration();

  return (
    <button
      type="button"
      onClick={() => configuration?.startNewThread()}
    >
      New conversation
    </button>
  );
}

/**
 * The doc's whole integration: a drawer and a chat inside one shared
 * `CopilotChatConfigurationProvider`.
 *
 * The shared configuration is the point. It holds the active thread, so
 * selecting a row connects the chat to that thread and replays its history, and
 * the "New Conversation" row resets the chat to a fresh welcome screen — with no
 * `threadId` state, no selection handler, and no props passed between the two
 * components.
 *
 * `CopilotKitProvider` is not repeated here; the app already mounts one at the
 * root. The doc nests them because its sample is a whole page.
 *
 * The header button is the page's own-button sample: a second way to start a
 * fresh thread, outside the drawer.
 *
 * One departure, and it is presentational only. The doc's wrapper is
 * `<div style={{ display: "flex", height: "100dvh" }}>` with the two components
 * as bare children. In a flex row `CopilotChat` has no flex basis of its own, so
 * it collapses to min-content — the chat renders one word per line beside a
 * full-width drawer. `flex: 1` plus `minWidth: 0` gives it the remaining space;
 * `minWidth` matters because a flex item's default `min-width: auto` refuses to
 * shrink below its content and would push the layout wider than the viewport.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={`agent: ${AGENT_ID} · CopilotThreadsDrawer + CopilotChat`}
    >
      <CopilotChatConfigurationProvider agentId={AGENT_ID}>
        <div style={{ display: "flex", height: "100%" }}>
          <CopilotThreadsDrawer />
          {/* The doc's <main> + <header> layout from the button sample; only
              minWidth: 0 is added, for the reason given above. */}
          <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <header>
              <NewConversationButton />
            </header>
            <CopilotChat />
          </main>
        </div>
      </CopilotChatConfigurationProvider>
    </DemoFrame>
  );
}
