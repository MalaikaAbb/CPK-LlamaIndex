# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-09-30

### 12:49 UTC — 13 pages, highest severity high

**High — Introduction**

`/llamaindex` · routes `/`, `/doc-sync` · under “Introduction”

48 prose lines changed. The number of fenced code blocks changed.

````diff
- frameworkIcon={<LlamaIndexIcon className="h-10 w-10 text-foreground" />}
+ frameworkIcon={<LlamaIndexIcon className="h-12 w-12" />}
- subheader="Give your LlamaIndex agents real user-interactivity using CopilotKit and AG-UI. Build rich, interactive, agent-powered applications."
- bannerVideo="https://cdn.copilotkit.ai/docs/copilotkit/videos/coagents/overview.mp4"
+ subheader="LlamaIndex runs your agents. CopilotKit gives them a surface your users can see, interrupt and steer."
- featuresLink="https://feature-viewer.copilotkit.ai/llama-index/feature/agentic_chat"
+ lede="LlamaIndex gives you the agent and everything it reads: indexes, retrievers and the workflow around them. What it does not give you is the surface. Somewhere for the conversation to happen, a way to show the run while it is running, and a moment for a person to step in. Each capability below builds on something your agent already does."
- // TODO: Re-add once the dojo example is updated and works
````

**High — Copilot Runtime**

`/llamaindex/copilot-runtime` · route `/copilot-runtime` · under “Setting Up the Runtime” · in a `ts` block

15 code lines, 1 heading, 37 prose lines changed. The number of fenced code blocks changed.

````diff
+ export const PATCH = handler;
+ export const DELETE = handler;
+ 
+ ## Which name identifies an agent
+ 
+ The name you use to address an agent from the frontend must equal a **key of the
+ runtime's `agents` map**. That key is the only name the frontend can ask for. An
+ agent's own `name`, `id`, or class name is never used for routing, and the two are
````

**High — Slots**

`/llamaindex/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “Reshaping the Message List”

14 code lines, 1 heading, 15 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Reshaping the Message List
+ 
+ Slots change how each message renders. To change _which_ messages render — hide some, replace them, reorder them — pass `transformMessages` to the message view. It receives the whole list and returns the list to render.
+ 
+ ```tsx title="page.tsx"
+ import { useCallback } from "react";
+ import { CopilotChat, type Message } from "@copilotkit/react-core/v2";
+ 
````

**High — Headless Threads**

`/llamaindex/headless-threads` · route `/headless-threads` · under “Headless Threads”

9 code lines, 1 heading, 61 prose lines changed. The number of fenced code blocks changed.

````diff
+ Intelligence’s AG-UI streams power the history and delivery behind this custom UI. Use `useThreads` to list and manage conversations, and pass their `threadId` to your chat.
+ 
- CopilotKit Rich Threads enable persistent, resumable multi-turn conversations. The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
+ The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
- [scope Rich Threads to the signed-in user](/llamaindex/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
+ [scope AG-UI Streams to the signed-in user](/llamaindex/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
- <Callout type="info" title="Migrating existing history?">
- Threads capture new CopilotKit conversations once your app is connected to
````

**High — Inspector**

`/llamaindex/inspector` · route `/inspector` · under “Inspector”

5 headings, 85 prose lines changed.

````diff
- > Inspector for debugging actions, readables, agent status, messages, and context.
+ > Verify your setup, debug agent runs, reproduce issues, and review Threads and Learning.
+ 
- ## What it shows
+ The CopilotKit Inspector overlays your development application so you can
+ verify the connection, investigate a run, and work with Threads and Learning
+ without leaving the page.
- The CopilotKit Inspector is a built-in debugging tool that overlays on your app.
````

**High — Threads Drawer**

`/llamaindex/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer` · under “When should I use this?”

27 code lines, 3 headings, 54 prose lines changed. The number of fenced code blocks changed.

````diff
- server-side). <SignupLink surface="docs_drawer">Get a free developer account</SignupLink> to set that up.
+ server-side). <SignupLink surface="docs_drawer">Start cloud-hosted setup</SignupLink> to create or select a project.
- [scope Rich Threads to the signed-in user](/llamaindex/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
+ [scope AG-UI Streams to the signed-in user](/llamaindex/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
- body="Get persistent threads and realtime sync on the free Developer tier."
+ body="Connect a cloud-hosted project to get persistent threads and realtime sync."
+ <Callout type="warn">
+ **The Drawer ships only in `@copilotkit/react-core/v2`.** There is no v1
````

**High — Quickstart**

`/llamaindex/quickstart` · route `/quickstart` · under “Quickstart”

30 code lines, 3 headings, 26 prose lines changed. The number of fenced code blocks changed.

````diff
- <IntelligenceOnboardingPrompt
- feature="learning"
- surface="docs_llamaindex_quickstart"
- />
+ ## Start with your coding agent
+ Use this prompt to connect your LlamaIndex agent to CopilotKit and verify a working conversation. Your coding agent will follow this guide in your project, or you can work through the manual steps below.
+ 
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
````

**High — Reading agent state**

`/llamaindex/shared-state/in-app-agent-read` · route `/shared-state/in-app-agent-read` · under “Use the `useAgent` Hook”

26 code lines, 2 headings, 7 prose lines changed.

````diff
- optionally provide an initial state.
+ initialize missing UI-owned state after the connected agent is ready.
+ import { useEffect } from "react";
- const { agent } = useAgent({
+ const { agent, isReady } = useAgent({
- initialState: { language: "english" }  // optionally provide an initial state
+ const state = (agent.state ?? {}) as Partial<AgentState>;
+ useEffect(() => {
````

**High — Writing agent state**

`/llamaindex/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Use the `useAgent` Hook” · in a `tsx` block

12 code lines changed.

````diff
+ import { useEffect } from "react";
- const { agent } = useAgent({ // [!code highlight]
+ const { agent, isReady } = useAgent({
- initialState: { language: "english" }  // optionally provide an initial state
+ const state = (agent.state ?? {}) as Partial<AgentState>;
+ useEffect(() => {
+ if (!isReady || state.language !== undefined) return;
+ agent.setState({ ...(agent.state ?? {}), language: "english" });
````

**High — Synchronize Thread History**

`/llamaindex/threads-import` · route `/threads-import` · under “Import & Synchronize Thread History”

2 code lines, 7 headings, 31 prose lines changed.

````diff
- # Import & Synchronize Thread History
+ # Add AG-UI Streams to Existing Threads
- > Import historical conversations into CopilotKit Intelligence, then keep future CopilotKit runs synchronized with Rich Threads.
+ > Add Intelligence’s AG-UI streams to your existing agent conversations, with optional historical import for supported stores.
- ## What is this?
+ <span id="what-is-this" />
- Import and synchronization bring existing conversations into CopilotKit Intelligence as Rich Threads without replacing the native storage or analytics you already use. Import supported history once, then continue running those conversations through CopilotKit so users can resume them through the same thread UI as new conversations.
+ ## Add Intelligence to your existing app
````

**High — Thread & History Lifecycle**

`/llamaindex/threads-lifecycle` · route `/threads-lifecycle` · under “The lifecycle at a glance”

2 code lines, 2 headings, 14 prose lines changed.

````diff
- 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [Threads & Persistence Architecture](/llamaindex/premium/threads-explained) for the full server-side model.
+ 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [AG-UI Streams & Framework Threads](/llamaindex/intelligence/threads-explained) for the full server-side model.
- Replay requires a **server-side store to replay from**: CopilotKit Intelligence, or a persisting `AgentRunner` (e.g. the SQLite runner). A self-hosted runtime with no persistence layer has nothing to replay, so `connectAgent()` returns an empty stream and the conversation starts blank. If history isn't restoring, check that a store is configured, not the client code. The [Persistence Architecture](/llamaindex/premium/threads-explained) page covers how replay works server-side.
+ Replay requires a **server-side store to replay from**: CopilotKit Intelligence, or a persisting `AgentRunner` (e.g. the SQLite runner). A self-hosted runtime with no persistence layer has nothing to replay, so `connectAgent()` returns an empty stream and the conversation starts blank. If history isn't restoring, check that a store is configured, not the client code. The [Persistence Architecture](/llamaindex/intelligence/threads-explained) page covers how replay works server-side.
- ## Scope Rich Threads to the signed-in user
+ <span id="scope-rich-threads-to-the-signed-in-user" />
+ ## Scope AG-UI Streams to the signed-in user
+ 
````

**Medium — Headless UI**

`/llamaindex/custom-look-and-feel/headless-ui` · route `/custom-look-and-feel/headless-ui` · under “Fully Headless UI”

2 headings changed.

````diff
- # Fully Headless UI
+ # Headless UI
````

**Low — Programmatic Control**

`/llamaindex/programmatic-control` · route `/programmatic-control` · under “Overview”

2 prose lines changed.

````diff
- title="Fully Headless UI"
+ title="Headless UI"
````

---

## 2026-08-31

### 12:05 UTC — 5 pages, highest severity low

**Low — Quickstart**

`/llamaindex/quickstart` · route `/quickstart` · under “Quickstart”

7 prose lines changed.

````diff
- <OpsPlatformCTA
- variant="card"
- title="Ship LlamaIndex to production"
- body="Add persistent threads and the inspector with CopilotKit Intelligence."
- ctaLabel="Create a free account"
+ <IntelligenceOnboardingPrompt
+ feature="learning"
````

**Info — Headless Threads**

`/llamaindex/headless-threads` · route `/headless-threads`

Now tracked for the first time.

**Info — Threads Drawer**

`/llamaindex/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer`

Now tracked for the first time.

**Info — Synchronize Thread History**

`/llamaindex/threads-import` · route `/threads-import`

Now tracked for the first time.

**Info — Thread & History Lifecycle**

`/llamaindex/threads-lifecycle` · route `/threads-lifecycle`

Now tracked for the first time.

---

---

## 2026-08-26

### 10:32 UTC — 4 pages, highest severity high

**High — Copilot Runtime**

`/llamaindex/copilot-runtime` · route `/copilot-runtime` · under “Setting Up the Runtime”

41 code lines, 2 headings, 15 prose lines changed. The number of fenced code blocks changed.

````diff
- The runtime is a lightweight server endpoint that you add to your backend. Here's a minimal example using Next.js:
+ The runtime is a lightweight server endpoint that you add to your backend:
- ```ts title="app/api/copilotkit/route.ts"
+ ```npm
+ npm install @copilotkit/runtime
+ ```
+ 
+ Here's a minimal example using Next.js. `createCopilotRuntimeHandler` returns a
````

**High — Quickstart**

`/llamaindex/quickstart` · route `/quickstart` · under “Quickstart”

41 code lines, 2 headings, 48 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
- body="Add persistent threads and the inspector with the Enterprise Intelligence Platform."
+ body="Add persistent threads and the inspector with CopilotKit Intelligence."
- <SignupLink surface="docs_llamaindex_quickstart_step1">Sign up for a free developer account</SignupLink> on our Enterprise Intelligence Platform to get a license key. You'll use it later to enable persistent threads and the inspector.
+ <SignupLink surface="docs_llamaindex_quickstart_step1">Sign up for a free developer account</SignupLink> for CopilotKit Intelligence to get a license key. You'll use it later to enable persistent threads and the inspector.
- - **Enterprise Intelligence Platform** — persistent threads and the inspector. Choose **Yes** to scaffold a project pre-wired for the platform (the CLI walks you through sign-up, or you can [create an account](https://dashboard.operations.copilotkit.ai/?utm_source=docs&utm_medium=cta&utm_campaign=intelligence&utm_content=docs_cli_prompt) first), or **No** for a standard LlamaIndex setup.
+ - **CopilotKit Intelligence** — persistent threads and the inspector. Choose **Yes** to scaffold a project pre-wired for the platform (the CLI walks you through sign-up, or you can [create an account](https://dashboard.operations.copilotkit.ai/?utm_source=docs&utm_medium=cta&utm_campaign=intelligence&utm_content=docs_cli_prompt) first), or **No** for a standard LlamaIndex setup.
+ 
````

**Low — AG-UI**

`/llamaindex/ag-ui` · route `/ag-ui` · under “The proxy pattern”

2 prose lines changed.

````diff
- routing, and CopilotKit Enterprise Intelligence without changing how the
+ routing, and CopilotKit Intelligence without changing how the
````

**Low — Inspector**

`/llamaindex/inspector` · route `/inspector` · under “What it shows”

21 prose lines changed.

````diff
- The CopilotKit Inspector is a built-in debugging tool that overlays on your app, giving you full visibility into what's happening between your frontend and your agents in real time.
+ The CopilotKit Inspector is a built-in debugging tool that overlays on your app.
+ The first open lands on **Home**. Later opens return to the last pane you used.
+ | **Home** | Project, runtime, services, and CopilotKit news. |
+ | **Memory** | Inspect long-term memory when Intelligence exposes it. |
- The primary navigation groups the Inspector into **Threads**, **Agents**, and
- **Learning**. Threads is the default. Open a real Thread to inspect its
+ The sidebar has three groups: **Home**, **Workbench** (Threads, Memory), and
````

---

---
