import { ComponentsReferencePage } from "../_shared/reference-page";

import { SNIPPETS } from "./doc-snippets";

export default function Page() {
  return (
    <ComponentsReferencePage
      path="/generative-ui/components/catalogs"
      summary="Declaring the components the agent may use, with typed props, schema libraries, combined catalogs and an A2UI export."
      snippets={SNIPPETS}
      live
    />
  );
}
