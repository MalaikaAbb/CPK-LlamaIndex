"""LlamaIndex agent for the Open-Ended Generative UI (Advanced) demo.

The "advanced" variant: the agent-authored sandboxed UI can invoke
frontend-registered sandbox functions from inside the iframe via
`await Websandbox.connection.remote.<name>(args)`.

Mirrors `langgraph-python/src/agents/open_gen_ui_advanced_agent.py`.
"""

from __future__ import annotations

import os

from llama_index.llms.openai import OpenAI

# DOC GAP — the published line is
#     from agents._request_tools import make_request_aware_router
# and `agents/_request_tools.py` is published nowhere. Swapped for the stock
# router (same kwargs); llama-index-protocols-ag-ui 0.5.0 already forwards
# runtime-injected tools such as `generateSandboxedUi`. See README §9.
from llama_index.protocols.ag_ui.router import (
    get_ag_ui_workflow_router as make_request_aware_router,
)


SYSTEM_PROMPT = """You are a UI-generating assistant for the Open Generative UI (Advanced) demo.

On every user turn you MUST call the `generateSandboxedUi` frontend tool
exactly once. The generated UI must be INTERACTIVE and must invoke the
available host-side sandbox functions described in your agent context
in response to user interactions.

Sandbox-function calling contract (inside the generated iframe):
- Call a host function with:
      await Websandbox.connection.remote.<functionName>(args)
  The call returns a Promise; await it.
- Each handler returns a plain object. Read the return shape from the
  function's description in your context and use the EXACT field names
  it returns.

Sandbox iframe restrictions (CRITICAL):
- The iframe runs with `sandbox="allow-scripts"` ONLY. Forms are NOT
  allowed. You MUST NOT use `<form>` elements or `<button type="submit">`.
- Use plain `<button type="button">` elements and wire them with
  `addEventListener('click', ...)` or an inline click handler. Do the same
  for "Enter" keypresses on inputs.

Generation guidance:
- Emit `initialHeight` and `placeholderMessages` first, then CSS, then HTML.
- Always include a visible result element that you UPDATE after the sandbox
  function resolves, so the user can see the round-trip.
- Use CDN scripts (Chart.js, D3, etc.) via <script> tags when needed.
- Do NOT use fetch/XHR, localStorage, or document.cookie — only use
  `Websandbox.connection.remote.*` for host-page interactions.
- Keep your own chat message brief (1 sentence max).
"""


_openai_kwargs = {}
if os.environ.get("OPENAI_BASE_URL"):
    _openai_kwargs["api_base"] = os.environ["OPENAI_BASE_URL"]

# The runtime injects the `generateSandboxedUi` frontend tool (plus the page's
# registered sandbox functions) at request time. The request-aware router
# forwards them to the LLM so the request matches the recorded aimock fixture;
# otherwise the run 404s in aimock and emits RUN_ERROR (sse-missing). See
# agents/_request_tools.py.
open_gen_ui_advanced_router = make_request_aware_router(
    llm=OpenAI(model="gpt-5-mini", **_openai_kwargs),
    frontend_tools=[],
    backend_tools=[],
    system_prompt=SYSTEM_PROMPT,
    initial_state={},
)


# region follow-up-remedy
# HARNESS REMEDY — not doc code. The published router above is kept verbatim.
#
# 1. The client answers every `generateSandboxedUi` call with the tool result
#    "UI generated" and re-runs the agent (`followUp: true`). The published
#    prompt says to call the tool on *every* turn, so the model treats each
#    follow-up as a new turn and draws the UI again, over and over.
# 2. The iframe only auto-sizes if its sandbox has loaded when generation is
#    marked done. The LlamaIndex adapter sends the whole tool call in one chunk,
#    so that signal arrives before the sandbox's async import finishes and the
#    iframe stays at `initialHeight` — 200px when the model omits it, which the
#    published advanced prompt never tells it not to. Asking for an explicit
#    height keeps the widget visible.
# 3. The provider advertises the page's sandbox functions (names, parameter
#    schemas, return shapes) as `RunAgentInput.context`, and the published
#    prompt tells the model to read them "from your agent context".
#    llama-index-protocols-ag-ui 0.5.0 never reads `context`, so the model has
#    to guess the call shape and the widget's buttons do nothing. The contracts
#    below are copied from the page's `sandbox-functions.ts` — keep them in sync.
# 4. The same one-chunk delivery means `jsFunctions` / `jsExpressions` can be
#    queued before the renderer rebuilds the sandbox for the finished HTML,
#    and that rebuild clears the queue — so the event wiring may never run.
#    The generated HTML goes into the iframe's `srcdoc`, so an inline
#    `<script>` in the HTML always runs; the rule below asks for that instead.
FOLLOW_UP_RULE = """

Tool-result rule (overrides the above for follow-up runs):
- When the latest message is the `generateSandboxedUi` tool result
  ("UI generated"), the UI is already rendered. Do NOT call
  `generateSandboxedUi` again. Reply with at most one short sentence and stop.
- Only call `generateSandboxedUi` again when a NEW user message asks for
  something.

Sizing rule:
- Always set `initialHeight` explicitly, large enough for the whole widget
  (typically 420-560). The iframe does not grow after rendering.

Available host functions (your context does not list them — use exactly these):
- evaluateExpression({ expression: string })
    Evaluates a basic arithmetic expression (+, -, *, /, parentheses,
    decimals only — no function names like sqrt or sin).
    Returns { ok: true, value: number } or { ok: false, error: string }.
- notifyHost({ message: string })
    Sends a short status message to the host page.
    Returns { ok: true, receivedAt: string, message: string }.
Always pass ONE object argument with exactly those keys, e.g.
  const r = await Websandbox.connection.remote.evaluateExpression({ expression: "2+2" });
  if (r.ok) show(r.value); else show(r.error);

Script placement rule:
- Put ALL JavaScript (event listeners, helpers, calls to
  Websandbox.connection.remote.*) in a single inline <script> at the end of
  the `html` body. Leave `jsFunctions` and `jsExpressions` empty — they can be
  dropped before they run.
"""

open_gen_ui_advanced_router = make_request_aware_router(
    llm=OpenAI(model="gpt-5-mini", **_openai_kwargs),
    frontend_tools=[],
    backend_tools=[],
    system_prompt=SYSTEM_PROMPT + FOLLOW_UP_RULE,
    initial_state={},
)
# endregion
