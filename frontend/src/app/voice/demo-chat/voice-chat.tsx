"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useCallback } from "react";

import { SampleAudioButton } from "./sample-audio-button";

const SAMPLE_TEXT = "What can you help me with?";

export function VoiceChat() {
  const onTranscribed = useCallback((text: string) => {
    const textarea = document.querySelector<HTMLTextAreaElement>(
      '[data-testid="copilot-chat-textarea"]',
    );
    if (!textarea) {
      throw new Error("CopilotChat textarea was not found.");
    }

    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    if (!setter) {
      throw new Error("CopilotChat textarea value setter was not found.");
    }

    setter.call(textarea, text);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-3 dark:border-slate-800">
        <SampleAudioButton
          onTranscribed={onTranscribed}
          sampleText={SAMPLE_TEXT}
        />
      </div>
      <div className="min-h-0 flex-1">
        <CopilotChat
          labels={{
            welcomeMessageText:
              "Use the microphone to speak, or try the sample audio button.",
          }}
        />
      </div>
    </div>
  );
}
