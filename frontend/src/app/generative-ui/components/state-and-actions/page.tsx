import { ComponentsReferencePage } from "../_shared/reference-page";

import { SNIPPETS } from "./doc-snippets";

export default function Page() {
  return (
    <ComponentsReferencePage
      path="/generative-ui/components/state-and-actions"
      summary="Binding live app state into generated UI, running your functions on click, sending clicks to the agent, and keeping user input."
      snippets={SNIPPETS}
    />
  );
}
