import { ComponentsReferencePage } from "../_shared/reference-page";

import { SNIPPETS } from "./doc-snippets";

export default function Page() {
  return (
    <ComponentsReferencePage
      path="/generative-ui/components/standard-catalog"
      summary="The 69 ready-made components, and how to add, drop or replace entries."
      snippets={SNIPPETS}
      live
    />
  );
}
