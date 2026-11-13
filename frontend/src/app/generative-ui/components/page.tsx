import { ComponentsReferencePage } from "./_shared/reference-page";

import { SNIPPETS } from "./doc-snippets";

export default function Page() {
  return (
    <ComponentsReferencePage
      path="/generative-ui/components"
      summary="Overview and setup: a catalog on the provider lets the agent render real components in the chat or in page areas."
      extra="The page's setup runs a CopilotKit BuiltInAgent (TanStack factory) as the agent; here it is the /components LlamaIndex router (backend/agents.py: create_components_router), and the provider config is the page's."
      snippets={SNIPPETS}
      live
    />
  );
}
