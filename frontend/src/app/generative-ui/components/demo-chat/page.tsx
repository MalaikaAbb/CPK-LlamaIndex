"use client";

import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../_shared/genui-demo";

/**
 * The page's step 3: a provider given `generativeUI={{ ui: standardUI }}` and a
 * plain chat. Harness change: the provider's `runtimeUrl` is
 * `/api/copilotkit-genui` (the page's runtime, mounted beside the main one),
 * whose agent is this repo's `/components` LlamaIndex router standing in for
 * the page's TanStack `BuiltInAgent`, with the same prompt.
 *
 * Expected today: no UI. The LlamaIndex AG-UI adapter turns `render_ui`'s
 * `operations` array into a string parameter and drops the run's context (the
 * guide), so the runtime finds no operations to render (README §9).
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components" subtitle="standardUI · agent: /components (LlamaIndex)">
      <GenUIDemo
        variants={[
          {
            id: "overview",
            label: "standardUI",
            generativeUI: { ui: standardUI },
            welcome: "Try: Compare the Starter, Team, and Enterprise plans in a table",
          },
        ]}
      />
    </DemoFrame>
  );
}
