import type { ReactNode } from "react";

import { Providers } from "./providers";

/**
 * The Quickstart's `app/layout.tsx`, scoped to this demo route.
 *
 * The doc's layout is a server component that renders its client `Providers`
 * file around the page; that part is reproduced as-is. The `<html>`/`<body>`
 * shell and the `@copilotkit/react-core/v2/styles.css` import it also shows
 * already live in the harness's root layout, and a nested layout cannot
 * re-declare them.
 *
 * `providers.tsx` is the doc's sample, copied verbatim — so no `x-user-id`
 * headers and no inspector prop. On this route `identifyUser` resolves to
 * "anonymous" in Intelligence mode, and the inspector follows the package
 * default (localhost only), exactly as in a fresh Quickstart app. The root
 * provider stands down here via `NESTED_PROVIDER_ROUTES` in `lib/inspector.ts`,
 * so only this provider's inspector mounts.
 */
export default function QuickstartLayout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
