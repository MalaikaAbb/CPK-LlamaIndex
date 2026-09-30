"""
LlamaIndex agent for the Declarative Generative UI (A2UI — Dynamic Schema) demo.

A plain AG-UI workflow router with no backend tools. The runtime route
`src/app/api/copilotkit-declarative-gen-ui/route.ts` sets
`a2ui.injectA2UITool: true`, so the A2UI middleware injects its `render_a2ui`
tool into each run. The stock router forwards that tool to the model, and the
model's streamed `render_a2ui` call is what the middleware mounts as a surface.
"""

import os

from llama_index.llms.openai import OpenAI
from llama_index.protocols.ag_ui.router import get_ag_ui_workflow_router


CUSTOM_CATALOG_ID = "declarative-gen-ui-catalog"


SYSTEM_PROMPT = (
    "You are a demo assistant for Declarative Generative UI (A2UI — Dynamic "
    "Schema). Whenever a response would benefit from a rich visual — a "
    "dashboard, status report, KPI summary, card layout, info grid, a "
    "pie/donut chart of part-of-whole breakdowns, a bar chart comparing "
    "values across categories, or anything more structured than plain text — "
    "call `render_a2ui` to render an A2UI v0.9 surface. "
    f"Use catalogId '{CUSTOM_CATALOG_ID}'. Components: Card (title, "
    "subtitle?, child?), StatusBadge (text, variant: "
    "success|warning|error|info), Metric (label, value, "
    "trend: up|down|neutral), InfoRow (label, value), "
    "PrimaryButton (label, action?), PieChart (title, "
    "description, data: [{label, value}]), BarChart (title, "
    "description, data: [{label, value}]), DataTable (columns: "
    "[{key, label}], rows: [{<key>: string|number}]; row keys "
    "must match columns[].key — ideal for rankings and "
    "per-person/per-item breakdowns like rep performance vs "
    "quota). Basic primitives "
    "(Column, Row, Text, Image, Card, Button) are also "
    "available. The root component id must be 'root'. "
    "Keep chat replies to one short sentence; let the UI do the talking."
)


_openai_kwargs = {}
if os.environ.get("OPENAI_BASE_URL"):
    _openai_kwargs["api_base"] = os.environ["OPENAI_BASE_URL"]


a2ui_dynamic_router = get_ag_ui_workflow_router(
    llm=OpenAI(model="gpt-5-mini", **_openai_kwargs),
    system_prompt=SYSTEM_PROMPT,
    initial_state={},
)
