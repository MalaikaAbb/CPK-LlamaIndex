import { Callout, Panel, TryIt } from "@/components/ui";
import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";

export default function Page() {
  return (
    <>
      <RouteHeader path="/voice" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The dedicated runtime advertises audio transcription so CopilotChat
          adds a microphone control. Recorded speech is transcribed by OpenAI
          and sent to the LlamaIndex agent as a chat message.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Use the microphone and ask: What can you help me with?",
              "Try the sample audio button if microphone access is unavailable.",
            ]}
            expect="The spoken or sample phrase appears in the chat and the agent responds."
            fail="The microphone control is missing or transcription fails — check the voice runtime /info response and OPENAI_API_KEY in frontend/.env.local."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Voice requires an OpenAI API key in Next.js">
        The transcription service runs inside the Next.js runtime, so it reads
        <code> OPENAI_API_KEY</code> from <code>frontend/.env.local</code>. The
        Python backend also needs its own key for agent responses.
      </Callout>

      <Panel title="Source">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/voice/demo-chat/page.tsx" },
            { file: "frontend/src/app/voice/demo-chat/voice-chat.tsx" },
            { file: "frontend/src/app/voice/demo-chat/sample-audio-button.tsx" },
            { file: "frontend/src/app/api/copilotkit-voice/[[...slug]]/route.ts" },
            { file: "backend/demos/voice_agent.py" },
          ]}
        />
      </Panel>
    </>
  );
}
