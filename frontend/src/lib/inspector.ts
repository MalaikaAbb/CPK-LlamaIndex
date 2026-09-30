/**
 * Who owns the Inspector, decided in exactly one place.
 *
 * Two facts about `CopilotKitInspector` drive everything here:
 *
 *  1. **It is bound to one core.** A provider renders it against *its own*
 *     CopilotKit instance, so an inspector on the root provider is blind to a
 *     nested provider's traffic — a working inspector showing an empty event
 *     list, which reads like a broken one.
 *  2. **Two on one page is fatal.** Both are lit custom elements; mounting two
 *     spins lit-html into an unbounded assert loop that Next mirrors to the dev
 *     server, taking out the tab and the server with it.
 *
 * So: exactly one inspector per page, attached to the provider the page's chat
 * actually runs on. The demo routes below render a doc sample that mounts its
 * own `<CopilotKit>`, so on those the root provider stands down.
 */

/**
 * Routes whose page mounts its own `<CopilotKit>`.
 *
 * Add to this list if you add another nested provider, or its inspector will
 * be the second one on the page.
 */
export const NESTED_PROVIDER_ROUTES = [
  "/quickstart/demo-chat",
  "/generative-ui/a2ui/dynamic-schema/demo-chat",
  "/generative-ui/a2ui/fixed-schema/demo-chat",
  "/generative-ui/open-generative-ui/demo-chat",
  "/human-in-the-loop/index/demo-chat",
  "/multi-agent/subagents/demo-chat",
] as const;

/**
 * What the app-wide provider should pass as `showDevConsole`.
 *
 * `"auto"` means localhost-only; `false` means "a nested provider owns the
 * inspector on this route". The nested doc samples pass no inspector prop, so
 * they fall back to the package default, which is the same localhost rule.
 */
export function rootInspectorSetting(pathname: string | null): "auto" | false {
  if (pathname && (NESTED_PROVIDER_ROUTES as readonly string[]).includes(pathname)) {
    return false;
  }
  return "auto";
}
