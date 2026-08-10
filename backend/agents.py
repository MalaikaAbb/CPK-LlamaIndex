"""The five AG-UI workflow routers this harness serves.

Every tool, docstring, system prompt, and `initial_state` in this file is lifted
from a documentation page. Nothing here was designed for this repo — if it is
not in a doc sample, it is not here.

Why five routers instead of one: `get_ag_ui_workflow_router` takes exactly one
`initial_state` and one `backend_tools` list, and the docs define four different
state shapes plus a stateless agent. One router cannot carry all of them without
inventing a merged state that appears on no page, so each doc page's sample keeps
its own router.

  main_router    →  Quickstart, Tool Rendering, and every stateless route
  sample_router  →  Shared State read + write          (language)
  search_router  →  State Rendering                    (searches)
  qa_router      →  Workflow Execution                 (question/answer/resources)
  task_router    →  Predictive State Updates           (observed_steps)

Each is mounted at its own FastAPI prefix in `main.py`, because the router itself
always exposes `POST /run`.
"""

import asyncio
from typing import Annotated, List

from fastapi import APIRouter
from llama_index.core.workflow import Context
from llama_index.protocols.ag_ui.events import StateSnapshotWorkflowEvent
from llama_index.protocols.ag_ui.router import get_ag_ui_workflow_router
from pydantic import BaseModel

from llm import build_llm

# --------------------------------------------------------------------------
# Quickstart + Tool Rendering
# docs.copilotkit.ai/llamaindex/quickstart
# docs.copilotkit.ai/llamaindex/generative-ui/tool-rendering
# --------------------------------------------------------------------------


# region get-weather
def getWeather(location: str) -> str:
    """Get the weather for a given location."""
    return f"The weather in {location} is sunny and 70 degrees."
# endregion


def create_main_router() -> APIRouter:
    """Quickstart's router, plus the one tool the Tool Rendering page adds.

    Both pages use the same system prompt, so they share a router.
    """
    return get_ag_ui_workflow_router(
        llm=build_llm(),
        # These are the tools that only have a render function in the frontend
        backend_tools=[getWeather],
        system_prompt="You are a helpful AI assistant with access to various tools and capabilities.",
    )


# --------------------------------------------------------------------------
# Shared State — reading and writing
# docs.copilotkit.ai/llamaindex/shared-state/in-app-agent-read
# docs.copilotkit.ai/llamaindex/shared-state/in-app-agent-write
# --------------------------------------------------------------------------


# region language-router
def create_sample_router() -> APIRouter:
    """Both Shared State pages publish this exact router — no backend tools.

    The language lives entirely in `initial_state`; the model reads it from the
    state block the workflow prepends to the last user message, and writes it
    back by responding in that language.
    """
    return get_ag_ui_workflow_router(
        llm=build_llm(),
        system_prompt="""
        You are a helpful assistant for tracking the language.

        IMPORTANT:
        - ALWAYS use the lower case for the language
        - ALWAYS respond in the current language from the state
        """,
        initial_state={
            "language": "english"
        },
    )
# endregion


# --------------------------------------------------------------------------
# State Rendering
# docs.copilotkit.ai/llamaindex/generative-ui/state-rendering
# --------------------------------------------------------------------------


# region searches
async def addSearch(
    ctx: Context,
    query: Annotated[str, "The search query to add."]
) -> str:
    """Add a search to the agent's list of searches."""
    async with ctx.store.edit_state() as global_state:
        state = global_state.get("state", {})
        if state is None:
            state = {}

        if "searches" not in state:
            state["searches"] = []

        # Add new search
        new_search = {"query": query, "done": False}
        state["searches"].append(new_search)

        # Emit state snapshot to frontend
        ctx.write_event_to_stream(
            StateSnapshotWorkflowEvent(
                snapshot=state
            )
        )

        global_state["state"] = state

    return f"Added search: {query}"


async def runSearches(ctx: Context) -> str:
    """Run all the searches that have been added."""
    async with ctx.store.edit_state() as global_state:
        state = global_state.get("state", {})
        if state is None:
            state = {}

        if "searches" not in state:
            state["searches"] = []

        # Update each search to done
        for search in state["searches"]:
            if not search.get("done", False):
                await asyncio.sleep(1)  # Simulate search execution
                search["done"] = True

                # Emit state update as each search completes
                ctx.write_event_to_stream(
                    StateSnapshotWorkflowEvent(
                        snapshot=state
                    )
                )

        global_state["state"] = state

    return "All searches completed!"
# endregion


def create_search_router() -> APIRouter:
    return get_ag_ui_workflow_router(
        llm=build_llm(),
        system_prompt="""
        You are a helpful assistant for storing searches.

        IMPORTANT:
        - Use the addSearch tool to add a search to the agent's state
        - After using the addSearch tool, YOU MUST ALWAYS use the runSearches tool to run the searches
        - ONLY USE THE addSearch TOOL ONCE FOR A GIVEN QUERY

        When adding searches, update the state to track:
        - query: the search query
        - done: whether the search is complete (false initially, true after running)
        """,
        backend_tools=[addSearch, runSearches],
        initial_state={
            "searches": []
        },
    )


# --------------------------------------------------------------------------
# Workflow Execution
# docs.copilotkit.ai/llamaindex/shared-state/workflow-execution
# --------------------------------------------------------------------------


# region qa
async def answerQuestion(
    ctx: Context,
    answer: Annotated[str, "The answer to store in state."]
) -> str:
    """Stores the answer to the user's question in shared state.

    Args:
        ctx: The workflow context for state management.
        answer: The answer to store in state.

    Returns:
        str: A message indicating the answer was stored.
    """
    async with ctx.store.edit_state() as global_state:
        state = global_state.get("state", {})
        if state is None:
            state = {}

        state["answer"] = answer

        # Emit state update to frontend
        ctx.write_event_to_stream(
            StateSnapshotWorkflowEvent(snapshot=state)
        )

        global_state["state"] = state

    return f"Answer stored: {answer}"


async def addResource(
    ctx: Context,
    resource: Annotated[str, "The resource URL or reference to add."]
) -> str:
    """Adds a resource to the internal resources list in shared state.

    Args:
        ctx: The workflow context for state management.
        resource: The resource URL or reference to add.

    Returns:
        str: A message indicating the resource was added.
    """
    async with ctx.store.edit_state() as global_state:
        state = global_state.get("state", {})
        if state is None:
            state = {}

        resources = state.get("resources", [])
        resources.append(resource)
        state["resources"] = resources

        global_state["state"] = state

    return f"Resource added: {resource}"
# endregion


def create_qa_router() -> APIRouter:
    """`resources` is deliberately never snapshotted — that is the whole point.

    `answerQuestion` emits a state snapshot, so `question` and `answer` reach the
    UI. `addResource` mutates state and stops, so `resources` stays server-side.
    """
    return get_ag_ui_workflow_router(
        llm=build_llm(),
        system_prompt="""
        You are a helpful assistant. When the user asks a question:
        1. Think through your answer
        2. Optionally use addResource to track any sources you reference
        3. Use answerQuestion to provide your final answer - this stores it in state for the user to see

        Always use the answerQuestion tool to provide your response so it appears in the UI.
        """,
        backend_tools=[answerQuestion, addResource],
        initial_state={
            "question": "",       # Input: received from frontend
            "answer": "",         # Output: sent to frontend
            "resources": []       # Internal: tracking resources
        },
    )


# --------------------------------------------------------------------------
# Predictive State Updates
# docs.copilotkit.ai/llamaindex/shared-state/predictive-state-updates
# --------------------------------------------------------------------------


# region execute-task
class Step(BaseModel):
    """A single step in a task."""
    description: str


class Task(BaseModel):
    """A task with a list of steps to execute."""
    steps: List[Step]


async def execute_task(ctx: Context, task: Task) -> str:
    """Execute a list of steps for any task. Use this for any task the user wants to accomplish.

    Args:
        ctx: The workflow context for accessing and updating state.
        task: The task containing the list of steps to execute.

    Returns:
        str: Confirmation that the task was completed.
    """
    task = Task.model_validate(task)

    async with ctx.store.edit_state() as global_state:
        state = global_state.get("state", {})
        if state is None:
            state = {}

        # Initialize all steps as pending
        state["observed_steps"] = [
            {"description": step.description, "status": "pending"}
            for step in task.steps
        ]

        # Send initial state snapshot
        ctx.write_event_to_stream(
            StateSnapshotWorkflowEvent(snapshot=state)
        )

        # Simulate step execution with delays
        await asyncio.sleep(0.5)

        # Update each step to completed one by one
        for i in range(len(state["observed_steps"])):
            state["observed_steps"][i]["status"] = "completed"

            # Emit updated state after each step
            ctx.write_event_to_stream(
                StateSnapshotWorkflowEvent(snapshot=state)
            )

            # Small delay between steps for visual effect
            await asyncio.sleep(0.5)

        global_state["state"] = state

    return "Task completed successfully!"
# endregion


def create_task_router() -> APIRouter:
    return get_ag_ui_workflow_router(
        llm=build_llm(),
        system_prompt=(
            "You are a helpful assistant that can help the user with their task. "
            "When the user asks you to do any task (like creating a recipe, planning something, etc.), "
            "use the execute_task tool with a list of steps. Use your best judgment to describe the steps. "
            "Always use the tool for any actionable request."
        ),
        backend_tools=[execute_task],
        initial_state={
            "observed_steps": [],
        },
    )
