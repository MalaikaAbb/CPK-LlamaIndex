import type { ReactNode } from "react";

import { Providers } from "./providers";

/**
 * The MCP Apps page's `app/layout.tsx`, scoped to this demo route: it renders
 * the page's client `Providers` around the page. The `<html>`/`<body>` shell
 * and the styles import already live in the harness's root layout. This path
 * is in `NESTED_PROVIDER_ROUTES` (`lib/inspector.ts`), so only this
 * provider's inspector mounts.
 */
export default function McpAppsLayout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
