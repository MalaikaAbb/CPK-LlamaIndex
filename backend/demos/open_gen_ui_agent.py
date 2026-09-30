"""Minimal LlamaIndex agent for the Open-Ended Generative UI demo.

The simplest possible example that exercises the open-ended generative UI
pipeline. The LLM receives the `generateSandboxedUi` frontend tool (injected
automatically by the runtime's `OpenGenerativeUIMiddleware` when the
`openGenerativeUI` option is enabled on the runtime) and calls it once per
turn. The runtime converts that streaming tool call into
`open-generative-ui` activity events that the built-in renderer mounts
inside a sandboxed iframe.

Mirrors `langgraph-python/src/agents/open_gen_ui_agent.py`.
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


SYSTEM_PROMPT = """You are a UI-generating assistant for an Open Generative UI demo
focused on intricate, educational visualisations (3D axes / rotations,
neural-network activations, sorting-algorithm walkthroughs, Fourier
series, wave interference, planetary orbits, etc.).

On every user turn you MUST call the `generateSandboxedUi` frontend tool
exactly once. Design a visually polished, self-contained HTML + CSS +
SVG widget that *teaches* the requested concept.

Key invariants:
- Use inline SVG (or <canvas>) for geometric content, not stacks of <div>s.
- Every axis is labelled; every colour-coded series has a legend.
- Prefer CSS @keyframes / transitions over setInterval; loop cyclical
  concepts with animation-iteration-count: infinite.
- Motion must teach — animate the actual step of the concept, not decoration.
- No fetch / XHR / localStorage — the sandbox has no same-origin access.

Output order:
- `initialHeight` (typically 480-560 for visualisations) first.
- A short `placeholderMessages` array (2-3 lines describing the build).
- `css` (complete).
- `html` (streams live — keep it tidy). CDN <script> tags for Chart.js /
  D3 / etc. go inside the html.

Keep your own chat message brief (1 sentence) — the real output is the
rendered visualisation.
"""


_openai_kwargs = {}
if os.environ.get("OPENAI_BASE_URL"):
    _openai_kwargs["api_base"] = os.environ["OPENAI_BASE_URL"]

# The runtime's OpenGenerativeUIMiddleware injects the `generateSandboxedUi`
# frontend tool at request time. The request-aware router forwards it to the
# LLM so the request matches the recorded aimock fixture; otherwise the run
# 404s in aimock and emits RUN_ERROR (sse-missing). See agents/_request_tools.py.
open_gen_ui_router = make_request_aware_router(
    llm=OpenAI(model="gpt-5-mini", **_openai_kwargs),
    frontend_tools=[],
    backend_tools=[],
    system_prompt=SYSTEM_PROMPT,
    initial_state={},
)


# region follow-up-remedy
# HARNESS REMEDY — not doc code. The published router above is kept verbatim.
#
# The client answers every `generateSandboxedUi` call with the tool result
# "UI generated" and re-runs the agent (`followUp: true`). The published prompt
# says to call the tool on *every* turn, so the model treats each follow-up as
# a new turn and draws the UI again, over and over. This rebinds the router
# with one extra rule that ends the turn once the UI is on screen.
FOLLOW_UP_RULE = """

Tool-result rule (overrides the above for follow-up runs):
- When the latest message is the `generateSandboxedUi` tool result
  ("UI generated"), the UI is already rendered. Do NOT call
  `generateSandboxedUi` again. Reply with at most one short sentence and stop.
- Only call `generateSandboxedUi` again when a NEW user message asks for
  something.
"""

open_gen_ui_router = make_request_aware_router(
    llm=OpenAI(model="gpt-5-mini", **_openai_kwargs),
    frontend_tools=[],
    backend_tools=[],
    system_prompt=SYSTEM_PROMPT + FOLLOW_UP_RULE,
    initial_state={},
)
# endregion
