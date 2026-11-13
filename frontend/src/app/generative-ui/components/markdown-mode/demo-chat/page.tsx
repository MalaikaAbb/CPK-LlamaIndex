"use client";

import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";

const WELCOME = "Try: give me a seat-count slider that shows the monthly price at $29 per seat.";

/**
 * Markdown mode: the `generativeUI` value of the page's two providers,
 * verbatim. With `sendContext: false` the catalog travels only in
 * `forwardedProps.copilotkit.ui`; the page's "build your own prompt" backend
 * is a Python fragment with no LlamaIndex agent around it, not filled in.
 *
 * Expected today: no UI on either variant. Markdown mode sends the schema and
 * the fence guide as context entries, and the LlamaIndex AG-UI adapter drops
 * the run's context, so the model never learns the a2ui format (README §9).
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/markdown-mode" subtitle="a2ui code blocks · agent: /components (LlamaIndex)">
      <GenUIDemo
        variants={[
          {
            id: "markdown",
            label: 'transport: "markdown"',
            note: "The provider sends the schema and the fence guide as context; the LlamaIndex adapter drops context, so expect no UI.",
            generativeUI: { ui: standardUI, transport: "markdown" },
            welcome: WELCOME,
          },
          {
            id: "own-prompt",
            label: "sendContext: false",
            note: "No context entries. The catalog is only in forwardedProps.copilotkit.ui, which this agent never reads — expect no UI.",
            generativeUI: { ui: standardUI, transport: "markdown", sendContext: false },
            welcome: WELCOME,
          },
        ]}
      />
    </DemoFrame>
  );
}
