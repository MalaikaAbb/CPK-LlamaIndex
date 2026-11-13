import { ComponentsReferencePage } from "../_shared/reference-page";

import { SNIPPETS } from "./doc-snippets";

export default function Page() {
  return (
    <ComponentsReferencePage
      path="/generative-ui/components/from-a2ui"
      summary="Migrating from the a2ui renderer (A2UI v0.9) to components and surfaces (A2UI 1.0), with the mapping and support matrix."
      snippets={SNIPPETS}
      live
    />
  );
}
