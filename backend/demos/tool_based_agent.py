"""Backend agent for the tool-based Generative UI guide."""

from llama_index.llms.openai import OpenAI
from llama_index.protocols.ag_ui.router import get_ag_ui_workflow_router

# Step 1: Initialize the LLM as shown in the guide.
llm = OpenAI(model="gpt-5-mini")

# Step 2: Tell the model when to call the chart component.
SYSTEM_PROMPT = """You are a data visualization assistant.

When the user asks for a chart, call `render_bar_chart` with a concise
title and a `data` array of `{label, value}` items."""

tool_based_router = get_ag_ui_workflow_router(
    llm=llm,
    system_prompt=SYSTEM_PROMPT,
    initial_state={},
)
