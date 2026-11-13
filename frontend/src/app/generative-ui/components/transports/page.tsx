import { ComponentsReferencePage } from "../_shared/reference-page";

import { SNIPPETS } from "./doc-snippets";

export default function Page() {
  return (
    <ComponentsReferencePage
      path="/generative-ui/components/transports"
      summary="Choosing between the render_ui tool and UI written inside the agent's markdown reply, per agent."
      extra="Both transports need the agent to pass the run's tools and context entries to its model; the page names CopilotKitMiddleware for LangGraph and says nothing for LlamaIndex."
      snippets={SNIPPETS}
      live
    />
  );
}
