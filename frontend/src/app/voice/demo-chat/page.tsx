"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { VoiceChat } from "./voice-chat";

export default function Page() {
  return (
    <DemoFrame parentPath="/voice" subtitle="agent: voice-demo · transcription">
      {/* Step 1: Mount the chat on the dedicated voice-enabled runtime. */}
      <CopilotKit
        runtimeUrl="/api/copilotkit-voice"
        agent="voice-demo"
        useSingleEndpoint={false}
        enableInspector={false}
      >
        <VoiceChat />
      </CopilotKit>
    </DemoFrame>
  );
}
