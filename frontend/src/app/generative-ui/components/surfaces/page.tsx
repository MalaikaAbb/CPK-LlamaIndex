import { ComponentsReferencePage } from "../_shared/reference-page";

import { SNIPPETS } from "./doc-snippets";

export default function Page() {
  return (
    <ComponentsReferencePage
      path="/generative-ui/components/surfaces"
      summary="Where generated UI renders: the chat, or named page targets the agent can fill, limit, scroll to, or repeat per item."
      snippets={SNIPPETS}
    />
  );
}
