"""Tool-free LlamaIndex agent endpoint used by the Voice runtime."""

from llama_index.llms.openai import OpenAI
from llama_index.protocols.ag_ui.router import get_ag_ui_workflow_router

# Step 4: Provide the tool-free /voice/run agent that the Voice runtime targets.
voice_router = get_ag_ui_workflow_router(
    llm=OpenAI(model="gpt-5-mini"),
    system_prompt="You are a helpful assistant. Respond clearly and concisely.",
    initial_state={},
)
