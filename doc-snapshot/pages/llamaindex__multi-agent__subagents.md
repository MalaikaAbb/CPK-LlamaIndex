# Sub-Agents

> Decompose work across multiple specialized agents with a visible delegation log.


<!-- interactive demo: subagents -->


## What is this?

Sub-agents are the canonical multi-agent pattern: a top-level
**supervisor** LLM orchestrates one or more specialized **sub-agents**
by exposing each of them as a tool. The supervisor decides what to
delegate, the sub-agents do their narrow job, and their results flow
back up to the supervisor's next step.

This is fundamentally the same shape as tool-calling, but each "tool"
is itself a full-blown agent with its own system prompt and (often) its
own tools, memory, and model.

## When should I use this?

Reach for sub-agents when a task has distinct specialized sub-tasks
that each benefit from their own focus:

- **Research → Write → Critique** pipelines, where each stage needs a
  different system prompt and temperature.
- **Router + specialists**, where one agent classifies the request and
  dispatches to the right expert.
- **Divide-and-conquer** — any problem that fits cleanly into parallel
  or sequential sub-problems.

The example below uses the Research → Write → Critique shape as the
canonical example.

## Setting up sub-agents

<!-- setup skipped: subagents-setup is not bundled for llamaindex -->

Each sub-agent is an isolated agent call with its own model, system
prompt, and optional tools. They don't share memory or tools with the
supervisor; the supervisor only ever sees what the sub-agent returns.

```python
# src/agents/subagents_agent.py
import logging
import os
import uuid
from typing import Annotated, Any

from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.workflow import Context
from agents._openai_models import OpenAI
from llama_index.protocols.ag_ui.router import get_ag_ui_workflow_router

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Sub-agents — one FunctionAgent per role, each with its own system prompt.
# These are stand-alone agents the supervisor cannot share memory with;
# the supervisor only sees the final text the sub-agent returns.
# ---------------------------------------------------------------------------

_openai_kwargs = {}
if os.environ.get("OPENAI_BASE_URL"):
    _openai_kwargs["api_base"] = os.environ["OPENAI_BASE_URL"]

_SUB_LLM = OpenAI(model="gpt-6-luna", **_openai_kwargs)

_RESEARCH_SYSTEM = (
    "You are a research sub-agent. Given a topic, produce a concise "
    "bulleted list of 3-5 key facts. No preamble, no closing."
)
_WRITING_SYSTEM = (
    "You are a writing sub-agent. Given a brief and optional source "
    "facts, produce a polished 1-paragraph draft. Be clear and concrete. "
    "No preamble."
)
_CRITIQUE_SYSTEM = (
    "You are an editorial critique sub-agent. Given a draft, give 2-3 "
    "crisp, actionable critiques. No preamble."
)


def _build_sub_agent(system_prompt: str, name: str) -> FunctionAgent:
    # `timeout=60` so a stalled sub-agent run can never wedge the
    # supervisor's tool call indefinitely.
    return FunctionAgent(
        name=name,
        description=system_prompt,
        llm=_SUB_LLM,
        tools=[],
        system_prompt=system_prompt,
        timeout=60,
    )


_research_sub = _build_sub_agent(_RESEARCH_SYSTEM, "research_sub")
_writing_sub = _build_sub_agent(_WRITING_SYSTEM, "writing_sub")
_critique_sub = _build_sub_agent(_CRITIQUE_SYSTEM, "critique_sub")
```

Keep sub-agent system prompts narrow and focused. The point of this pattern
is that each one does one thing well. If a sub-agent needs to know
the whole user context to do its job, that's a signal the boundary is
wrong.

## Exposing sub-agents as tools

The supervisor delegates by calling tools. Each delegation tool is a thin
wrapper around a specialized agent call that:

1. Runs the sub-agent on the supplied `task` string.
2. Records the delegation into a `delegations` slot in shared agent
   state (so the UI can render a live log).
3. Returns the sub-agent's final message as the tool result, which the
   supervisor sees on its next turn.

```python
# src/agents/subagents_agent.py
import logging
import os
import uuid
from typing import Annotated, Any

from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.workflow import Context
from agents._openai_models import OpenAI
from llama_index.protocols.ag_ui.router import get_ag_ui_workflow_router

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Sub-agents — one FunctionAgent per role, each with its own system prompt.
# These are stand-alone agents the supervisor cannot share memory with;
# the supervisor only sees the final text the sub-agent returns.
# ---------------------------------------------------------------------------

_openai_kwargs = {}
if os.environ.get("OPENAI_BASE_URL"):
    _openai_kwargs["api_base"] = os.environ["OPENAI_BASE_URL"]

_SUB_LLM = OpenAI(model="gpt-6-luna", **_openai_kwargs)

_RESEARCH_SYSTEM = (
    "You are a research sub-agent. Given a topic, produce a concise "
    "bulleted list of 3-5 key facts. No preamble, no closing."
)
_WRITING_SYSTEM = (
    "You are a writing sub-agent. Given a brief and optional source "
    "facts, produce a polished 1-paragraph draft. Be clear and concrete. "
    "No preamble."
)
_CRITIQUE_SYSTEM = (
    "You are an editorial critique sub-agent. Given a draft, give 2-3 "
    "crisp, actionable critiques. No preamble."
)


def _build_sub_agent(system_prompt: str, name: str) -> FunctionAgent:
    # `timeout=60` so a stalled sub-agent run can never wedge the
    # supervisor's tool call indefinitely.
    return FunctionAgent(
        name=name,
        description=system_prompt,
        llm=_SUB_LLM,
        tools=[],
        system_prompt=system_prompt,
        timeout=60,
    )


_research_sub = _build_sub_agent(_RESEARCH_SYSTEM, "research_sub")
_writing_sub = _build_sub_agent(_WRITING_SYSTEM, "writing_sub")
_critique_sub = _build_sub_agent(_CRITIQUE_SYSTEM, "critique_sub")


class _SubAgentError(Exception):
    """Raised when a sub-agent invocation fails.

    Carries a user-facing message safe to surface in the delegation log.
    """


async def _invoke_sub_agent(agent: FunctionAgent, task: str) -> str:
    """Run a sub-agent on `task` and return its final response text."""
    try:
        response = await agent.run(user_msg=task)
    except Exception as exc:  # noqa: BLE001 - we re-raise with safe message
        logger.exception("subagent: FunctionAgent.run failed")
        raise _SubAgentError(
            f"sub-agent call failed: {exc.__class__.__name__} "
            "(see server logs for details)"
        ) from exc

    text = str(response).strip()
    if not text:
        raise _SubAgentError("sub-agent returned empty text")
    return text


# ---------------------------------------------------------------------------
# Delegation log helpers (mutate state["delegations"] in place)
# ---------------------------------------------------------------------------


async def _append_running_delegation(ctx: Context, *, sub_agent: str, task: str) -> str:
    """Append a `running` delegation entry; return its id."""
    state: dict[str, Any] = await ctx.store.get("state", default={})
    delegations = list(state.get("delegations") or [])
    entry_id = str(uuid.uuid4())
    delegations.append(
        {
            "id": entry_id,
            "sub_agent": sub_agent,
            "task": task,
            "status": "running",
            "result": "",
        }
    )
    state["delegations"] = delegations
    await ctx.store.set("state", state)
    return entry_id


async def _finalize_delegation(
    ctx: Context, *, entry_id: str, status: str, result: str
) -> None:
    """Replace the matching entry's status + result.

    If the entry has gone missing (e.g. another writer replaced
    `state['delegations']` mid-turn) we log loudly and skip — slipping in
    a synthetic entry with `sub_agent='unknown'` would render as
    undefined badge text in `delegation-log.tsx`.
    """
    state: dict[str, Any] = await ctx.store.get("state", default={})
    delegations = list(state.get("delegations") or [])
    for entry in delegations:
        if entry.get("id") == entry_id:
            entry["status"] = status
            entry["result"] = result
            state["delegations"] = delegations
            await ctx.store.set("state", state)
            return
    logger.warning(
        "subagent: delegation entry %s missing on update — final %s "
        "state will not be rendered",
        entry_id,
        status,
    )


async def _delegate(
    ctx: Context, *, sub_agent_name: str, agent: FunctionAgent, task: str
) -> dict[str, Any]:
    """Append a running entry, run the sub-agent, finalize the entry."""
    entry_id = await _append_running_delegation(
        ctx, sub_agent=sub_agent_name, task=task
    )
    try:
        result = await _invoke_sub_agent(agent, task)
    except _SubAgentError as exc:
        await _finalize_delegation(
            ctx, entry_id=entry_id, status="failed", result=str(exc)
        )
        return {"status": "failed", "error": str(exc)}

    await _finalize_delegation(
        ctx, entry_id=entry_id, status="completed", result=result
    )
    return {"status": "completed", "result": result}


# ---------------------------------------------------------------------------
# Supervisor tools — each delegates to one sub-agent.
# ---------------------------------------------------------------------------


async def research_agent(
    ctx: Context,
    task: Annotated[
        str,
        "Research brief — the topic / question to gather facts on.",
    ],
) -> str:
    """Delegate a research task to the research sub-agent.

    Use for: gathering facts, background, definitions, statistics.
    Returns a JSON-ish string of {status, result|error}.
    """
    outcome = await _delegate(
        ctx,
        sub_agent_name="research_agent",
        agent=_research_sub,
        task=task,
    )
    return _stringify_outcome(outcome)


async def writing_agent(
    ctx: Context,
    task: Annotated[
        str,
        "Writing brief — include relevant facts from prior research.",
    ],
) -> str:
    """Delegate a drafting task to the writing sub-agent.

    Use for: producing a polished paragraph, draft, or summary. Pass
    relevant facts from prior research inside `task`.
    """
    outcome = await _delegate(
        ctx,
        sub_agent_name="writing_agent",
        agent=_writing_sub,
        task=task,
    )
    return _stringify_outcome(outcome)


async def critique_agent(
    ctx: Context,
    task: Annotated[str, "The draft to critique."],
) -> str:
    """Delegate a critique task to the critique sub-agent.

    Use for: reviewing a draft and suggesting concrete improvements.
    """
    outcome = await _delegate(
        ctx,
        sub_agent_name="critique_agent",
        agent=_critique_sub,
        task=task,
    )
    return _stringify_outcome(outcome)


```

This is where CopilotKit's shared-state channel earns its keep: the
supervisor's tool calls mutate `delegations` as they happen, and the
frontend renders every new entry live.

<Callout type="warn">
  Give every delegation a stable `id` and merge new entries by that `id`. The
  client sends its copy of shared state back as run input on every run, so a
  slot that blindly appends whatever it receives — a LangGraph
  `Annotated[list, operator.add]` reducer, for example — concatenates the
  entries the client just echoed onto the ones the agent already has, and the
  log doubles when a thread is continued.
</Callout>

## Rendering a live delegation log

On the frontend, the delegation log is a reactive render of the
`delegations` slot.


Subscribe with `useAgent({ updates:
[UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged] })`,
read `agent.state.delegations`, and render one card per entry.

```typescript
// src/app/demos/subagents/delegation-log.tsx
/**
 * Live delegation log — renders the `delegations` slot of agent state.
 *
 * Each entry corresponds to one invocation of a sub-agent. The list
 * grows in real time as the supervisor fans work out to its children.
 * The parent header shows how many sub-agents have been called and
 * whether the supervisor is still running.
 */
// Fixed list of the three sub-agent roles the supervisor can call.
// Rendered as always-visible indicator chips at the top of the log
// (regardless of whether the supervisor has delegated yet) so the user
// — and the e2e suite — can see at a glance which sub-agents exist and
// which are currently active.
const INDICATOR_ROLES: ReadonlyArray<{
  role: "researcher" | "writer" | "critic";
  subAgent: SubAgentName;
}> = [
  { role: "researcher", subAgent: "research_agent" },
  { role: "writer", subAgent: "writing_agent" },
  { role: "critic", subAgent: "critique_agent" },
];

export function DelegationLog({ delegations, isRunning }: DelegationLogProps) {
  const calledRoles = new Set<SubAgentName>(
    delegations.map((d) => d.sub_agent),
  );

  return (
    <div
      data-testid="delegation-log"
      className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-[#DBDBE5] overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#E9E9EF] bg-[#FAFAFC]">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-[#010507]">
            Sub-agent delegations
          </span>
          {isRunning && (
            <span
              data-testid="supervisor-running"
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#BEC2FF] bg-[#BEC2FF1A] text-[#010507] text-[10px] font-semibold uppercase tracking-[0.12em]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#010507] animate-pulse" />
              Supervisor running
            </span>
          )}
        </div>
        <span
          data-testid="delegation-count"
          className="text-xs font-mono text-[#838389]"
        >
          {delegations.length} calls
        </span>
      </div>

      <div
        data-testid="subagent-indicators"
        className="flex items-center gap-2 border-b border-[#E9E9EF] bg-white px-6 py-2"
      >
        {INDICATOR_ROLES.map(({ role, subAgent }) => {
          const style = SUB_AGENT_STYLE[subAgent];
          const fired = calledRoles.has(subAgent);
          return (
            <span
              key={role}
              data-testid={`subagent-indicator-${role}`}
              data-role={role}
              data-fired={fired ? "true" : "false"}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] border ${style.color} ${
                fired ? "" : "opacity-60"
              }`}
            >
              <span aria-hidden>{style.emoji}</span>
              <span>{style.label}</span>
            </span>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {delegations.length === 0 ? (
          <p className="text-[#838389] italic text-sm">
            Ask the supervisor to complete a task. Every sub-agent it calls will
            appear here.
          </p>
        ) : (
          delegations.map((d, idx) => {
            const style = SUB_AGENT_STYLE[d.sub_agent];
            return (
              <div
                key={d.id}
                data-testid="delegation-entry"
                className="border border-[#E9E9EF] rounded-xl p-3 bg-[#FAFAFC]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#AFAFB7]">
                      #{idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] border ${style.color}`}
                    >
                      <span>{style.emoji}</span>
                      <span>{style.label}</span>
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#189370]">
                    {d.status}
                  </span>
                </div>
                <div className="text-xs text-[#57575B] mb-2">
                  <span className="font-semibold text-[#010507]">Task: </span>
                  {d.task}
                </div>
                <div className="text-sm text-[#010507] whitespace-pre-wrap bg-white rounded-lg p-2.5 border border-[#E9E9EF]">
                  {d.result}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
```




The result: as the supervisor fans work out to its sub-agents, the log
grows in real time, giving the user visibility into a process that
would otherwise be a long opaque spinner.

## Related

- **[Shared State](/llamaindex/shared-state)** — the channel that makes the
  delegation log live.
- **[State streaming](/llamaindex/shared-state/streaming)** — stream
  *individual* sub-agent outputs token-by-token inside each log entry.
