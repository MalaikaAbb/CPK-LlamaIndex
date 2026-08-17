# CopilotKit + LlamaIndex Test Suite

A navigable, working test harness for the CopilotKit ↔ LlamaIndex integration — one route per doc page, each running against a real agent and showing the exact source that makes it work.

| | |
| --- | --- |
| **Doc sync date** | Machine-maintained — `doc-snapshot/manifest.json` → `syncedAt`, rewritten on every sync |
| **Docs tracked** | <https://docs.copilotkit.ai/llamaindex> |
| **CopilotKit** | `@copilotkit/react-core` ^1.66.2 (v2 surface) · `@copilotkit/runtime` ^1.66.2 |
| **AG-UI** | `@ag-ui/llamaindex` ^0.1.5 · `@ag-ui/client` ^0.0.57 · `llama-index-protocols-ag-ui` ≥0.3.4 |
| **Build** | `next build` ✅ · `tsc --noEmit` ✅ · `eslint` ✅ · backend imports and mounts all five routers ✅ |
| **CI** | none |

---

## Overview

LlamaIndex agents speak [AG-UI](https://ag-ui.com) through `llama-index-protocols-ag-ui`, which wraps a `Workflow` in a FastAPI router exposing a single streaming `POST /run` endpoint. CopilotKit's runtime binds that endpoint with a `LlamaIndexAgent` and gives the React app hooks and chat components on top of it.

This repo turns every page under <https://docs.copilotkit.ai/llamaindex> into a route you can actually click, type into, and watch fail or succeed. Every tool, system prompt, and state shape in `backend/agents.py` is lifted from a doc sample — nothing was designed here. Where a doc sample does not compile or does not run against the shipped packages, the route says so in an on-page callout and the discrepancy is listed in [Known issues](#9-known-issues--doc-vs-implementation-discrepancies) below.

---

## Architecture

```
Browser
  │  CopilotChat / CopilotSidebar / useAgent      (@copilotkit/react-core/v2)
  ▼
Next.js app  ──  /api/copilotkit                   (@copilotkit/runtime)
  │              CopilotRuntime resolves an agent id → LlamaIndexAgent
  ▼              (@ag-ui/llamaindex — an HttpAgent subclass)
FastAPI  ──  POST /run, /sample_agent/run, …       (llama-index-protocols-ag-ui)
  │          AGUIChatWorkflow: folds state into the last user message,
  │          streams the model, runs backend tools, emits AG-UI events as SSE
  ▼
OpenAI
```

- **Backend language:** Python 3.10+ / FastAPI. (This varies per framework — LlamaIndex is Python.)
- **The OpenAI key lives only in the Python process.** The browser never talks to the agent directly; the runtime proxies every run server-side.
- **Frontend tools need no backend registration.** `AGUIChatWorkflow` reads `RunAgentInput.tools` on every run and converts anything unknown into a pass-through tool, so `sayHello`, `showWeather`, and `humanApprovedCommand` never appear in `agents.py`.

---

## Prerequisites

| Requirement | Version | Notes |
| --- | --- | --- |
| Node.js | 20+ | The docs state 20+; this repo was built and verified on the Node bundled with `next@16.3.0`. |
| Python | 3.10+ | `backend/.python-version` pins 3.12 for `uv`. |
| `uv` | any recent | <https://docs.astral.sh/uv/> — used for the backend venv and lockfile. |
| npm | bundled with Node | Any package manager works; commands below use npm. |
| OpenAI API key | — | The only credential this repo needs. |

Not required: a CopilotKit Enterprise Intelligence license key. No route here depends on one — the Inspector runs without it.

---

## Setup

```bash
# 1. Clone
git clone <this-repo> llamaindex
cd llamaindex

# 2. Frontend dependencies
cd frontend && npm install && cd ..

# 3. Backend dependencies (creates backend/.venv)
cd backend && uv sync && cd ..

# 4. Environment
cp .env.example backend/.env
# then edit backend/.env
```

`backend/.env` variables:

| Variable | Required | What it does |
| --- | --- | --- |
| `OPENAI_API_KEY` | **yes** | The key every agent uses. `main.py` exits at startup if it is unset. |
| `OPENAI_CHAT_MODEL_ID` | no | Overrides the model. Defaults to `gpt-4o-mini`. Set it to `gpt-5.4` to reproduce the doc's literal call — see [Known issues](#9-known-issues--doc-vs-implementation-discrepancies). |
| `AGENT_PORT` | no | Uvicorn port. Defaults to `8000`. Change this and `LLAMAINDEX_AGENT_URL` together. |

Frontend variables go in `frontend/.env.local` (Next.js does not read `backend/.env`):

| Variable | Required | What it does |
| --- | --- | --- |
| `LLAMAINDEX_AGENT_URL` | no | Where the runtime reaches the agent. Defaults to `http://localhost:8000`. Use `http://127.0.0.1:8000` if `localhost` resolves to IPv6 while uvicorn binds IPv4. |
| `NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY` | no | Enterprise Intelligence public key. Unused by every route here. |

**Ports:** frontend `3000`, backend `8000`.

---

## Running the project

Two terminals — there is no combined dev script in this repo.

```bash
# Terminal 1 — agent
cd backend
uv run main.py
```

Successful startup prints:

```
INFO:     Started server process [...]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://localhost:8000 (Press CTRL+C to quit)
```

```bash
# Terminal 2 — app
cd frontend
npm run dev
```

Successful startup prints `▲ Next.js 16.3.0` and `- Local: http://localhost:3000`.

Open **<http://localhost:3000>**. The home page runs a live probe against `http://localhost:8000/health` and shows a green row when the agent is reachable. Sanity-check the backend on its own with:

```bash
curl http://localhost:8000/health
# {"status":"healthy","agent":"llamaindex"}
```

### How the app is laid out

Every doc page gets **two** routes:

- `/<path>` — notes, the discrepancies found on that page, and the implementation source read live off disk.
- `/<path>/demo-chat` — the interactive surface with no harness chrome, so it can be screen-recorded on its own. The "Open demo ↗" button on each notes page goes there.

`/status` lists every route and its status in one table.

---

## What to expect — walkthrough per section

### Getting Started

**`/` — Introduction.** Orientation, a live connection check, and the table of five agents. Press **Re-check** with the backend stopped: the "LlamaIndex AG-UI server" row turns red with the connection error. Restart it and re-check: green.

**`/quickstart` → `/quickstart/demo-chat` — Quickstart.** The bring-your-own-agent path: a `CopilotSidebar` beside your app content, bound to `my_agent`.
*Try:* `Can you tell me a joke?`
*Pass:* tokens stream in a word at a time and render as markdown.
*Fail:* nothing streams, or an error banner appears — the agent process is down, or `OPENAI_CHAT_MODEL_ID` names a model your key cannot reach.

### Basics

**`/prebuilt-components` → demo — Prebuilt Components.** `CopilotChat`, `CopilotSidebar`, and `CopilotPopup` on tabs, all driving `my_agent`. Only one mounts at a time — the sidebar and popup both use fixed positioning and would overlap.
*Try:* `What is CopilotKit?` on one tab, then switch tabs.
*Pass:* the conversation carries across tabs; only the chrome changes.
*Fail:* a tab renders blank, or the popup launcher never appears in the corner.

### Custom Look and Feel

**`/custom-look-and-feel/slots` → demo — Slots.** Three tabs, one per customization level: a Tailwind class string merged into the slot, a props object set on the default component, and a whole replacement component.
*Try:* `Hello there`, then switch tabs.
*Pass:* level 1 tints the messages and outlines the input; level 2 focuses the input on mount; level 3 shows a plainly different message layout.
*Fail:* all three tabs look identical — the slot props are not reaching the component.

**`/custom-look-and-feel/headless-ui` → demo — Headless UI.** A chat built entirely from `useAgent` + `useCopilotKit`, with no CopilotKit chrome at all.
*Try:* `Tell me a joke`, then press **Stop** mid-stream.
*Pass:* messages land in the hand-written bubbles, "Thinking..." shows while running, and Stop halts the stream.
*Fail:* Send does nothing, or the assistant reply never appears — `copilotkit.runAgent()` is not being awaited.

**`/programmatic-control` → demo — Programmatic Control.** No chat component anywhere: a state panel, a message box, Run and Stop buttons, plus the doc's `ThemeSelector` writing straight into `agent.state`.
*Try:* `What's the weather in Tokyo?` via **Run agent**; then press **Dark Mode**.
*Pass:* status flips to Running, the message count climbs, the reply streams into the transcript, and `user_theme` appears in the raw state block immediately.
*Fail:* nothing happens on Run — the `agentId` does not match a registered agent.

**`/inspector` → demo — Inspector.** The provider mounts the overlay via `showDevConsole="auto"`; the demo just gives it traffic.
*Try:* `What's the weather in San Francisco?`, then open the inspector docked at the window edge.
*Pass:* AG-UI Events fills, and Available Agents lists all five ids.
*Fail:* the overlay never appears — you are running a production build, where it is force-disabled.

### Generative UI

**`/generative-ui/your-components/display-only` → demo — Display-only.** `useComponent` registers a React component as a tool with no handler.
*Try:* `Show the weather card for Tokyo: 77 degrees, clear`
*Pass:* a bordered weather card renders inline in the chat with the values the agent chose.
*Fail:* a plain-text answer with no card — the model did not call the tool.

**`/generative-ui/your-components/interactive` → demo — Interactive.** `useHumanInTheLoop` builds an approval gate; the run suspends until you click.
*Try:* `Run the command rm -rf /tmp/cache`
*Pass:* an approval card with the command in a code block, and nothing further streams until you press Approve or Deny. The agent's next message reflects which you chose.
*Fail:* the agent describes the command in prose and carries on without waiting.

**`/generative-ui/tool-rendering` → demo — Tool Rendering.** A named renderer for the backend `getWeather` tool, plus a wildcard fallback for everything else.
*Try:* `What's the weather in Tokyo?`
*Pass:* "Calling weather API..." appears, then becomes "Called the weather API for Tokyo."
*Fail:* the tool call renders as raw JSON — the renderer name and the Python function name disagree (note the docs' prose says `get_weather`; the function is `getWeather`).

**`/generative-ui/state-rendering` → demo — State Rendering ⚠️.** `search_agent`'s `searches` list, streamed by `StateSnapshotWorkflowEvent` and rendered beside the chat.
*Try:* `Search for the tallest mountains`, then `Now also search for the deepest oceans`
*Pass:* an item appears on ❌ while `addSearch` runs, flips to ✅ about a second later when `runSearches` completes it, and the second prompt adds a row without dropping the first.
*Fail:* the list stays empty while the chat replies — the model answered without calling `addSearch`.
*Partial because:* the doc's in-chat variant uses a `render` prop that `useAgent` does not have.

### App Control

**`/frontend-tools` → demo — Frontend Tools.** The doc's `sayHello` tool, executing in the browser.
*Try:* `Say hello to Damien`
*Pass:* a browser alert reads "Hello, Damien!"; after you dismiss it the agent confirms.
*Fail:* a text reply with no alert — you are not on the demo route, so the tool was never registered.

### Shared State

**`/shared-state/in-app-agent-read` → demo — Reading agent state.** `sample_agent`'s `language`, read through `agent.state` next to the chat.
*Try:* `Hello`, then `What language are you using?`
*Pass:* the Language line reads `english` as soon as the run starts (not when it ends), and the agent answers in English.
*Fail:* the panel stays on `—` after a full reply.
*Note:* this router has no backend tools, so asking it to "switch to Spanish" changes the reply language but not the state. That is what the next route is for.

**`/shared-state/in-app-agent-write` → demo — Writing agent state.** Two buttons, showing the difference between a passive `setState` and one followed by a hint message and a re-run.
*Try:* **Toggle Language**, then ask `what language are you using?`; then press **Toggle + re-run agent**.
*Pass:* the panel flips instantly; the agent answers in Spanish on the next message. Toggle + re-run makes it answer immediately without you typing.
*Fail:* the panel changes but the agent keeps answering in English.

**`/shared-state/workflow-execution` → demo — Workflow Execution.** One state object split three ways: `question` in, `answer` out, `resources` server-side only.
*Try:* `What's the capital of France?`, then `Who wrote The Left Hand of Darkness? Track your sources.`
*Pass:* Question fills immediately, Answer fills when `answerQuestion` runs, and `resources` stays `[]` in the raw state block even on the second prompt.
*Fail:* Answer never appears — the model replied in prose instead of calling `answerQuestion`.

**`/shared-state/predictive-state-updates` → demo — Predictive State Updates ⚠️.** `execute_task` emits a snapshot after every step it finishes.
*Try:* `Teach me how to fix a tire`
*Pass:* a step list appears with everything on ⏳, then items flip to ✅ one at a time roughly half a second apart, before the chat reply finishes.
*Fail:* the whole list appears already completed in one jump.
*Partial because:* same missing `render` prop as State Rendering.

### LlamaIndex

**`/multi-agent-flows` → demo — Multi-Agent Flows ⚠️.** Agent Lock across all five ids, plus the two provider snippets side by side.
*Try:* ask `What's the weather in Oslo?` on `my_agent`, switch to `search_agent`, ask it to search for something.
*Pass:* each agent answers only with its own tools, and switching shows an empty conversation rather than the previous agent's history.
*Fail:* an agent-not-found error on one tab.
*Partial because:* Router Mode needs an LLM service adapter on the runtime, which this repo deliberately does not configure — the workflows call the model themselves.

### Backend

**`/copilot-runtime` → demo — Copilot Runtime.** The live runtime config, routing across five ids, the `default` agent, and the direct-connection tradeoff.
*Try:* `Hello` on each of the five tabs.
*Pass:* all five stream a reply; each keeps its own message list.
*Fail:* one id errors — it is missing from the runtime's `agents` map, or its router is not included in `main.py`.

**`/ag-ui` → demo — AG-UI.** A live capture of the raw event stream beside the chat producing it, with Pause and Clear.
*Try:* `What's the weather in Tokyo?`
*Pass:* `RUN_STARTED`, an early `STATE_CHANGED` from the workflow's opening snapshot, a burst of `TEXT_MESSAGE_CONTENT`, `TOOL_CALL_START`/`END` around `getWeather`, `TOOL_CALL_RESULT`, then `RUN_FINISHED`.
*Fail:* the log stays empty while the chat streams — the subscription is bound to a different agent than the chat.

---

## Testing checklist / current status

| Doc page | Route | Status | Notes |
| --- | --- | --- | --- |
| [Introduction](https://docs.copilotkit.ai/llamaindex) | `/` | ✅ Working | Reference/landing page with a live health probe. |
| [Quickstart](https://docs.copilotkit.ai/llamaindex/quickstart?agent=bring-your-own) | `/quickstart` | ✅ Working | Model id in the sample does not exist — see Known issues. |
| [Prebuilt Components](https://docs.copilotkit.ai/llamaindex/prebuilt-components) | `/prebuilt-components` | ✅ Working | Doc page renders from a component, so there is no markdown sample to diff. |
| [Slots](https://docs.copilotkit.ai/llamaindex/custom-look-and-feel/slots) | `/custom-look-and-feel/slots` | ✅ Working | Not in the doc sidebar. Custom-component sample needs a cast. |
| [Headless UI](https://docs.copilotkit.ai/llamaindex/custom-look-and-feel/headless-ui) | `/custom-look-and-feel/headless-ui` | ✅ Working | Not in the doc sidebar. |
| [Programmatic Control](https://docs.copilotkit.ai/llamaindex/programmatic-control) | `/programmatic-control` | ✅ Working | Bare `useAgent()` replaced with an explicit `agentId`. |
| [Inspector](https://docs.copilotkit.ai/llamaindex/inspector) | `/inspector` | ✅ Working | Enabled via `showDevConsole="auto"`, not `enableInspector`. |
| [Display-only](https://docs.copilotkit.ai/llamaindex/generative-ui/your-components/display-only) | `/generative-ui/your-components/display-only` | ✅ Working | Not in the doc sidebar. |
| [Interactive](https://docs.copilotkit.ai/llamaindex/generative-ui/your-components/interactive) | `/generative-ui/your-components/interactive` | ✅ Working | Not in the doc sidebar. Generic supplied explicitly. |
| [Tool Rendering](https://docs.copilotkit.ai/llamaindex/generative-ui/tool-rendering) | `/generative-ui/tool-rendering` | ✅ Working | Tool name and render props both drift from the samples. |
| [State Rendering](https://docs.copilotkit.ai/llamaindex/generative-ui/state-rendering) | `/generative-ui/state-rendering` | ⚠️ Partial | State streams; the doc's in-chat `render` prop does not exist. |
| [Frontend Tools](https://docs.copilotkit.ai/llamaindex/frontend-tools) | `/frontend-tools` | ✅ Working | |
| [Reading agent state](https://docs.copilotkit.ai/llamaindex/shared-state/in-app-agent-read) | `/shared-state/in-app-agent-read` | ✅ Working | Not in the doc sidebar. `initialState` on `useAgent` does not exist. |
| [Writing agent state](https://docs.copilotkit.ai/llamaindex/shared-state/in-app-agent-write) | `/shared-state/in-app-agent-write` | ✅ Working | Not in the doc sidebar. |
| [Workflow Execution](https://docs.copilotkit.ai/llamaindex/shared-state/workflow-execution) | `/shared-state/workflow-execution` | ✅ Working | Not in the doc sidebar. |
| [Predictive State Updates](https://docs.copilotkit.ai/llamaindex/shared-state/predictive-state-updates) | `/shared-state/predictive-state-updates` | ⚠️ Partial | Progress streams; the doc's in-chat `render` prop does not exist. |
| [Multi-Agent Flows](https://docs.copilotkit.ai/llamaindex/multi-agent-flows) | `/multi-agent-flows` | ⚠️ Partial | Agent Lock works. Router Mode needs a service adapter this repo omits. |
| [Copilot Runtime](https://docs.copilotkit.ai/llamaindex/copilot-runtime) | `/copilot-runtime` | ✅ Working | `a2ui` / `mcpApps` middleware not configured — no route needs them. |
| [AG-UI](https://docs.copilotkit.ai/llamaindex/ag-ui) | `/ag-ui` | ✅ Working | |

Pages in the LlamaIndex sidebar that this repo does **not** cover, because they were outside the requested scope: CopilotKit CLI, Build with agents, the whole Rich Threads group, MCP Apps, A2UI, the Intelligence Platform group, and Troubleshooting.

---

## 9. Known issues / doc-vs-implementation discrepancies

### `OpenAI(model="gpt-5.4")` — every Python sample

Every LlamaIndex doc page opens with this line. `gpt-5.4` is not an id the OpenAI API serves, so a verbatim copy fails on the first request with a model-not-found error. `backend/llm.py` keeps the shape of the call, defaults to `gpt-4o-mini`, and reads `OPENAI_CHAT_MODEL_ID` as the override. Set that variable to `gpt-5.4` to reproduce the published behaviour.

### `useAgent` has no `initialState` and no `render`

[Reading agent state](https://docs.copilotkit.ai/llamaindex/shared-state/in-app-agent-read), [Writing agent state](https://docs.copilotkit.ai/llamaindex/shared-state/in-app-agent-write), [State Rendering](https://docs.copilotkit.ai/llamaindex/generative-ui/state-rendering), [Predictive State Updates](https://docs.copilotkit.ai/llamaindex/shared-state/predictive-state-updates).

`UseAgentProps` in `@copilotkit/react-core` 1.66.x accepts exactly `agentId`, `threadId`, `runtimeAgentId`, `updates`, and `throttleMs`. Passing `initialState` or `render` is a type error.

- `initialState` is redundant anyway — `initial_state` on `get_ag_ui_workflow_router`, which the same pages show, is the seed that works.
- `render` has no equivalent, so this repo draws agent state beside the chat instead of inside it. That is why State Rendering and Predictive State Updates are marked ⚠️ Partial. Both routes print the doc's non-compiling snippet next to the working one.

### The weather tool is named `getWeather`, not `get_weather`

[Tool Rendering](https://docs.copilotkit.ai/llamaindex/generative-ui/tool-rendering) defines `def getWeather(location)` and then says one line below that "your agent will be able to call the `get_weather` tool". [Programmatic Control](https://docs.copilotkit.ai/llamaindex/programmatic-control) also uses `get_weather` in its `defineToolCallRenderer` example. Only the Python function name reaches the model, so renderers must use `getWeather`.

### Tool render props: `args` vs `parameters`

[Tool Rendering](https://docs.copilotkit.ai/llamaindex/generative-ui/tool-rendering). The named `useRenderTool` sample destructures `{ status, args }`, but the shipped hook derives render props from `parameters` and exposes them as `props.parameters`. The wildcard `useDefaultRenderTool` sample also destructures `args`, which its render props do not provide either — `name`, `status`, and `result` are what it gives you.

### `useHumanInTheLoop` does not infer its arg type

[Interactive](https://docs.copilotkit.ai/llamaindex/generative-ui/your-components/interactive). Unlike `useRenderTool`, this hook does not derive its render-prop type from `parameters`; it defaults to `Record<string, unknown>`, which makes `args.command` unusable in JSX. The demo supplies the generic explicitly: `useHumanInTheLoop<{ command: string }>({ ... })`.

### The custom `messageView` slot needs a cast

[Slots](https://docs.copilotkit.ai/llamaindex/custom-look-and-feel/slots). The sample passes a bare function component. The slot's type is `typeof CopilotChatMessageView`, which also carries a static `Cursor` sub-component, so a plain function is not assignable. The sample's props are also unannotated, which is an implicit-any error under `strict`.

### `@copilotkit/react-ui` is listed but never used

[Quickstart](https://docs.copilotkit.ai/llamaindex/quickstart?agent=bring-your-own) installs `@copilotkit/react-ui`, but every sample below it imports from `@copilotkit/react-core/v2`. [Predictive State Updates](https://docs.copilotkit.ai/llamaindex/shared-state/predictive-state-updates) goes further and imports `CopilotSidebar` from `@copilotkit/react-ui` while importing hooks and the stylesheet from v2. `react-ui` is the v1 package; this repo does not depend on it and takes the sidebar from v2.

### `stepProgress` does not exist

[Predictive State Updates](https://docs.copilotkit.ai/llamaindex/shared-state/predictive-state-updates). The callout under the Python sample says state is emitted "each time the agent calls the `stepProgress` tool". There is no such tool on the page — it is `execute_task`.

### Shared State pages link to the LangGraph quickstart

[Reading](https://docs.copilotkit.ai/llamaindex/shared-state/in-app-agent-read), [Writing](https://docs.copilotkit.ai/llamaindex/shared-state/in-app-agent-write), [State Rendering](https://docs.copilotkit.ai/llamaindex/generative-ui/state-rendering), [Tool Rendering](https://docs.copilotkit.ai/llamaindex/generative-ui/tool-rendering). Every "Run and connect your agent" step points at `/langgraph/quickstart` and the LangGraph coagents-starter, not the LlamaIndex ones. Harmless, but it sends you to the wrong framework.

### Prebuilt Components has no readable source

<https://docs.copilotkit.ai/llamaindex/prebuilt-components> renders entirely from a `<PrebuiltComponents />` React component, so its markdown carries no code to diff against. This route was built from the component names and the props the Quickstart and Slots pages use.

### One router serves one state shape

Not a doc error, but the reason this repo departs structurally from every sample. `get_ag_ui_workflow_router` takes exactly one `initial_state` and one `backend_tools` list, and the doc pages define four different state shapes plus a stateless agent. Serving them all means five routers behind five FastAPI prefixes, and five ids in the runtime — where each doc page shows one called `my_agent`.

---

## Troubleshooting

The LlamaIndex Troubleshooting doc pages were outside the requested scope, so this section records what actually goes wrong in this repo.

**`ModuleNotFoundError` or an unexpected model error at backend startup.**
`main.py` exits immediately with a message if `OPENAI_API_KEY` is missing. If it starts but every chat errors, `OPENAI_CHAT_MODEL_ID` probably names a model your key cannot reach — including the docs' own `gpt-5.4`.

**`PydanticUserError: 'addSearch' is not fully defined; you should define 'Context'`.**
Adding `from __future__ import annotations` to `backend/agents.py` breaks every tool that takes `ctx: Context`. With postponed annotations the parameter type stays a string that Pydantic cannot resolve when it builds the tool schema, and the failure surfaces on the first model call rather than at import. The doc samples have no such import, and neither does this repo — do not add one to that file.

**Chat sends but nothing streams; the agent process logs nothing.**
The runtime cannot reach the backend. Check `curl http://localhost:8000/health` first. If that works but the app still cannot, set `LLAMAINDEX_AGENT_URL=http://127.0.0.1:8000` in `frontend/.env.local` — `localhost` resolving to IPv6 while uvicorn binds IPv4 is the usual cause, and it is the first item in the docs' own troubleshooting accordion.

**A route errors with an agent-not-found style message.**
The `agentId` on that page is not in the runtime's `agents` map, or its router is not included in `main.py`. This repo registers no `default` agent on purpose, so a missing id fails loudly instead of quietly answering from somewhere else.

**The Inspector never appears.**
It is force-disabled in production builds — run `npm run dev`. Do not mount `<CopilotKitInspector />` by hand either: it forwards `core ?? null` and reports "CopilotKit core not attached". `showDevConsole="auto"` on the provider is what mounts it correctly.

**A search sits on ❌ forever.**
`runSearches` was never called. The system prompt insists on it after every `addSearch`; a weaker model sometimes skips it. Ask the agent to run the searches.

**`npx tsc --noEmit` fails with `Cannot find name 'LayoutProps'`.**
That type is generated into `.next/types` by Next.js. Run `npm run build` (or `npm run dev`) once first.

---

## Doc drift detection

`/doc-sync` keeps this repo honest about the docs it mirrors. Press **Sync docs now** (on the landing page or on `/doc-sync`) and it fetches the markdown source behind all 19 tracked doc pages, diffs each against the copy stored in `doc-snapshot/`, replaces that copy, and reports what moved — ranked by whether the change can actually break an implementation.

Doc pages are fetched by appending `.md` to their URL, which returns the authored MDX rather than 250 KB of rendered HTML. Every response is checked for `text/markdown` before it is allowed near the snapshot: a URL that misses the markdown handler still answers `200` with the HTML app shell, and writing that in would destroy the baseline and report the whole corpus as rewritten on the next run. A run commits all pages or none.

**Severity is decided by where the edit landed**, not how big it was:

| Level | Trigger |
|---|---|
| **High** | a changed line inside a fenced code block, a changed fence count, or a page that now 404s and is gone from the sitemap |
| **Medium** | a changed heading, changed frontmatter `title`/`description`, or prose in the same section as changed code |
| **Low** | other prose |

**Sections checked** lists every tracked page in nav order with a mark — `✓` unchanged, `!` changed, `+` stored, `✗` 404, `~` unstable, `·` not checked. Expanding a row shows the comparison: for a changed page the diff (`−` existing snapshot, `+` newly fetched), and for an unchanged one the two matching hashes, which is the evidence the check ran.

**`doc-snapshot/CHANGELOG.md`** is the record that survives a re-sync. Because syncing replaces the copy it just compared against, the run *after* a change reports nothing — so the changelog is written at the moment of discovery and never rewritten later. Only changed pages are recorded; a clean run does not touch the file. It keeps the three most recent dated entries, counted rather than aged, so a change from six weeks ago still shows if nothing has happened since.

**One sync date.** `syncedAt` in `doc-snapshot/manifest.json`, rewritten on every run and shown on `/`, `/status` and `/doc-sync`. There is no hand-maintained date to keep in step with it.

**To test it**, edit any `doc-snapshot/pages/*.md` file and press the button — a line inside a code fence for High, a `##` heading for Medium, a sentence for Low. The comparison reads the stored file itself, so nothing else needs changing. Both `/doc-sync` and the changelog label the result as a local snapshot edit rather than upstream drift.

Commit `doc-snapshot/` — `pages/`, `manifest.json` and `CHANGELOG.md` are the baseline every diff is taken against. `reports/` is gitignored derived data.

---

## Project structure

```
llamaindex/
├── README.md
├── CLAUDE.md                      build instructions this repo follows
├── .env.example                   every variable, annotated
├── backend/
│   ├── main.py                    FastAPI app; includes the five routers, /health
│   ├── agents.py                  every tool, system prompt, and initial_state — all from docs
│   ├── llm.py                     the shared OpenAI client and the model-id override
│   └── pyproject.toml             llama-index, llama-index-protocols-ag-ui, fastapi, uvicorn
└── frontend/
    ├── package.json               @copilotkit/react-core (v2 surface), @ag-ui/llamaindex
    └── src/
        ├── app/
        │   ├── layout.tsx                 root layout; one provider for the whole app
        │   ├── page.tsx                   Introduction + health probe
        │   ├── status/page.tsx            the status table
        │   ├── api/copilotkit/route.ts    the Copilot Runtime — five agent bindings
        │   └── <doc-path>/
        │       ├── page.tsx               notes, discrepancies, live source
        │       └── demo-chat/page.tsx     the chrome-free interactive demo
        ├── components/
        │   ├── providers.tsx              CopilotKitProvider config
        │   ├── nav-sidebar.tsx            nav, driven by nav-config
        │   ├── route-header.tsx           title, status badge, doc link
        │   ├── demo-frame.tsx             the thin bar on /demo-chat routes
        │   ├── source-code.tsx            renders files read off disk
        │   ├── code-figure.tsx            the one code block in the app
        │   ├── backend-health.tsx         the connection panel
        │   └── ui.tsx                     Panel, Callout, TryIt, KeyValue, CodeBlock
        └── lib/
            ├── nav-config.ts              single source of truth: routes, docs, statuses
            ├── source.ts                  reads repo files for the source panels
            ├── health.ts                  the /health probe
            └── highlight.ts               server-side Shiki
```

`lib/nav-config.ts` is where a route's title, doc URL, summary, and status live. The nav, every route header, and the `/status` table all read from it, so the status table above and the app can only disagree if this README goes stale.

---

## References

Every doc page this repo tests against, grouped as the LlamaIndex sidebar groups them. Pages marked *(off-sidebar)* resolve but are absent from that nav as of 2026-08-10.

**Getting Started**
- [Introduction](https://docs.copilotkit.ai/llamaindex)
- [Quickstart — bring your own agent](https://docs.copilotkit.ai/llamaindex/quickstart?agent=bring-your-own)

**Basics**
- [Prebuilt Components](https://docs.copilotkit.ai/llamaindex/prebuilt-components)

**Custom Look and Feel**
- [Programmatic Control](https://docs.copilotkit.ai/llamaindex/programmatic-control)
- [Inspector](https://docs.copilotkit.ai/llamaindex/inspector)
- [Slots](https://docs.copilotkit.ai/llamaindex/custom-look-and-feel/slots) *(off-sidebar)*
- [Headless UI](https://docs.copilotkit.ai/llamaindex/custom-look-and-feel/headless-ui) *(off-sidebar)*

**Generative UI**
- [Tool Rendering](https://docs.copilotkit.ai/llamaindex/generative-ui/tool-rendering)
- [State Rendering](https://docs.copilotkit.ai/llamaindex/generative-ui/state-rendering)
- [Your Components — Display-only](https://docs.copilotkit.ai/llamaindex/generative-ui/your-components/display-only) *(off-sidebar)*
- [Your Components — Interactive](https://docs.copilotkit.ai/llamaindex/generative-ui/your-components/interactive) *(off-sidebar)*

**App Control**
- [Frontend Tools](https://docs.copilotkit.ai/llamaindex/frontend-tools)

**Shared State** *(the whole group is off-sidebar)*
- [Reading agent state](https://docs.copilotkit.ai/llamaindex/shared-state/in-app-agent-read)
- [Writing agent state](https://docs.copilotkit.ai/llamaindex/shared-state/in-app-agent-write)
- [Workflow Execution](https://docs.copilotkit.ai/llamaindex/shared-state/workflow-execution)
- [Predictive State Updates](https://docs.copilotkit.ai/llamaindex/shared-state/predictive-state-updates)

**LlamaIndex**
- [Multi-Agent Flows](https://docs.copilotkit.ai/llamaindex/multi-agent-flows)

**Backend**
- [Copilot Runtime](https://docs.copilotkit.ai/llamaindex/copilot-runtime)
- [AG-UI](https://docs.copilotkit.ai/llamaindex/ag-ui)
