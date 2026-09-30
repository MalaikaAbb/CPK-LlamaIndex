"""Serves the LlamaIndex AG-UI workflow routers over FastAPI.

The Quickstart's "use an existing agent" path builds exactly this: one
`get_ag_ui_workflow_router(...)`, `app.include_router(...)`, and a `/health`
endpoint. This harness includes five routers instead of one, because the doc
pages define five different agent configurations (see `agents.py`).

`AGUIWorkflowRouter` always registers `POST /run` on the router it returns, so
the only way to serve more than one is FastAPI's `prefix=`. That gives:

    POST /run                    →  my_agent      (Quickstart, Tool Rendering, …)
    POST /sample_agent/run       →  sample_agent  (Shared State read + write)
    POST /search_agent/run       →  search_agent  (State Rendering)
    POST /qa_agent/run           →  qa_agent      (Workflow Execution)
    POST /task_agent/run         →  task_agent    (Predictive State Updates)

Those paths are what `frontend/src/app/api/copilotkit/[[...slug]]/route.ts`
binds to.

The routers in `demos/` come from the docs' demo "Code" tabs and bring their
own runtime routes. Their prefixes are the paths those routes' `HttpAgent`
URLs name — the docs never show the mounting server itself:

    POST /a2ui-dynamic/run          →  api/copilotkit-declarative-gen-ui
    POST /a2ui-fixed/run            →  api/copilotkit-a2ui-fixed-schema
    POST /open-gen-ui/run           →  api/copilotkit-ogui
    POST /open-gen-ui-advanced/run  →  api/copilotkit-ogui
    POST /subagents/run             →  api/copilotkit (agent "subagents")
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI

# Prefer backend/.env (what the Quickstart calls agent/.env), then fall back to
# a repo-root .env so a single top-level file also works.
_BACKEND_ENV = Path(__file__).parent / ".env"
_ROOT_ENV = Path(__file__).parent.parent / ".env"
load_dotenv(_BACKEND_ENV)
load_dotenv(_ROOT_ENV, override=False)

from agents import (  # noqa: E402 - must follow load_dotenv
    create_main_router,
    create_qa_router,
    create_sample_router,
    create_search_router,
    create_task_router,
)
from demos.a2ui_dynamic import a2ui_dynamic_router  # noqa: E402
from demos.a2ui_fixed import a2ui_fixed_router  # noqa: E402
from demos.open_gen_ui_advanced_agent import open_gen_ui_advanced_router  # noqa: E402
from demos.open_gen_ui_agent import open_gen_ui_router  # noqa: E402
from demos.subagents_agent import subagents_router  # noqa: E402

PORT = int(os.getenv("AGENT_PORT", "8000"))

if not os.getenv("OPENAI_API_KEY"):
    raise SystemExit(
        "OPENAI_API_KEY is not set.\n"
        f"Create {_BACKEND_ENV} (or a repo-root .env) from .env.example and set it."
    )

# Create FastAPI app
app = FastAPI(
    title="LlamaIndex Agent",
    description="A LlamaIndex agent integrated with CopilotKit",
    version="1.0.0"
)

# Include the routers. The first one keeps the doc's bare mount at `/run`; the
# rest are namespaced so each doc page's `initial_state` stays intact.
app.include_router(create_main_router())
app.include_router(create_sample_router(), prefix="/sample_agent")
app.include_router(create_search_router(), prefix="/search_agent")
app.include_router(create_qa_router(), prefix="/qa_agent")
app.include_router(create_task_router(), prefix="/task_agent")

# Routers copied from the docs' demo "Code" tabs (see demos/__init__.py).
app.include_router(a2ui_dynamic_router, prefix="/a2ui-dynamic")
app.include_router(a2ui_fixed_router, prefix="/a2ui-fixed")
app.include_router(open_gen_ui_router, prefix="/open-gen-ui")
app.include_router(open_gen_ui_advanced_router, prefix="/open-gen-ui-advanced")
app.include_router(subagents_router, prefix="/subagents")


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "agent": "llamaindex"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=PORT)
