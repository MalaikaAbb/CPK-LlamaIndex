import { ComponentsReferencePage } from "../_shared/reference-page";

import { SNIPPETS } from "./doc-snippets";

export default function Page() {
  return (
    <ComponentsReferencePage
      path="/generative-ui/components/markdown-mode"
      summary="The agent writes UI in a2ui code blocks inside its reply, with no tool call; includes the forwarded-props envelope for building your own prompt."
      extra="The page's backend example reads forwarded props in a generic Python snippet; no LlamaIndex router is shown."
      snippets={SNIPPETS}
      live
    />
  );
}
