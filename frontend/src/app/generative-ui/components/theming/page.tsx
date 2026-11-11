import { ComponentsReferencePage } from "../_shared/reference-page";

import { SNIPPETS } from "./doc-snippets";

export default function Page() {
  return (
    <ComponentsReferencePage
      path="/generative-ui/components/theming"
      summary="Colors, fonts and dark mode for the standard components through CSS variables and a theme map."
      snippets={SNIPPETS}
    />
  );
}
