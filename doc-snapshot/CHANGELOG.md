# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-11

### 14:10 UTC — 21 pages, highest severity high

**High — Slots**

`/llamaindex/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “Reshaping the Message List”

52 code lines, 2 headings, 13 prose lines changed. The number of fenced code blocks changed.

````diff
- If you pass the message view a `children` render function to lay out the rendered messages yourself, virtualization turns off and every message is mounted. Prefer `transformMessages` for list-level changes; in development the chat warns when `children` is what turned virtualization off.
+ ### Grouping messages into one row
+ To render several messages together — a run of tool calls collapsed into one block, say — pass `groupMessages`. It receives the list (after `transformMessages`, if you use both) and returns rows: `messageRow(message)` for a message on its own, `messageGroup({ key, messages, wrapper })` for messages rendered together inside your `wrapper`.
+ 
+ ```tsx title="page.tsx"
+ import { useCallback } from "react";
+ import {
+ CopilotChat,
````

**High — State Rendering**

`/llamaindex/generative-ui/state-rendering` · route `/generative-ui/state-rendering` · under “Set up your agent with state” · in a `python` block

2 code lines changed.

````diff
- llm = OpenAI(model="gpt-5.4")
+ llm = OpenAI(model="gpt-6-luna")
````

**High — Tool Rendering**

`/llamaindex/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “Give your agent a tool to call” · in a `python` block

2 code lines changed.

````diff
- llm = OpenAI(model="gpt-5.4")
+ llm = OpenAI(model="gpt-6-luna")
````

**High — Inspector**

`/llamaindex/inspector` · route `/inspector` · under “Follow and reproduce a run”

4 code lines, 20 prose lines changed. The number of fenced code blocks changed.

````diff
- [Thread](/llamaindex/threads) and choose **Try from here**. Inspector copies its
+ [Thread](/llamaindex/AG-UI-Streams) and choose **Try from here**. Inspector copies its
- | Goal                                      | Action                                                                                                    |
- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
- | Close the current view                    | Use the close control; reopen it from the Inspector button                                                |
- | See your application without an overlay   | Use the pop-out control in the Inspector header                                                           |
- | Hide Inspector temporarily on this domain | Choose **Hide Inspector for a day** from the launcher HUD, or **Hide Inspector for one week** in settings |
- | Disable Inspector for the development app | Set `enableInspector` to `false`                                                                          |
````

**High — Threads Drawer**

`/llamaindex/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer` · under “Add your own "New conversation" button”

41 code lines, 1 heading, 19 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Add your own "New conversation" button
+ 
+ The Drawer has its own "New Conversation" row. Your app can also keep its own
+ button, for example in a toolbar or a page header. To start a new conversation
+ from that button, call `startNewThread()` from
+ [`useCopilotChatConfiguration`](/reference/hooks/useCopilotChatConfiguration).
+ This is the same function the Drawer calls for its own row.
+ 
````

**High — Quickstart**

`/llamaindex/quickstart` · route `/quickstart` · under “Configure your environment”

12 code lines, 4 prose lines changed.

````diff
- The starter template is configured to use OpenAI's GPT-4o by default, but you can modify it to use any language model supported by LlamaIndex.
+ The starter template is configured to use OpenAI's GPT-6 Luna by default, but you can modify it to use any language model supported by LlamaIndex.
- uv add llama-index llama-index-llms-openai llama-index-protocols-ag-ui fastapi uvicorn
+ uv add llama-index llama-index-llms-openai-like llama-index-protocols-ag-ui fastapi uvicorn
- This example uses OpenAI's GPT-4o, but you can modify it to use any language model supported by LlamaIndex.
+ This example uses OpenAI's GPT-6 Luna, but you can modify it to use any language model supported by LlamaIndex.
- from llama_index.llms.openai import OpenAI
+ from llama_index.llms.openai_like import OpenAILike
````

**High — Reading agent state**

`/llamaindex/shared-state/in-app-agent-read` · route `/shared-state/in-app-agent-read` · under “Define the Agent State” · in a `python` block

2 code lines changed.

````diff
- llm = OpenAI(model="gpt-5.4")
+ llm = OpenAI(model="gpt-6-luna")
````

**High — Writing agent state**

`/llamaindex/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Define the Agent State” · in a `python` block

2 code lines changed.

````diff
- llm = OpenAI(model="gpt-5.4")
+ llm = OpenAI(model="gpt-6-luna")
````

**High — Predictive State Updates**

`/llamaindex/shared-state/predictive-state-updates` · route `/shared-state/predictive-state-updates` · under “Emit the intermediate state” · in a `python` block

2 code lines changed.

````diff
- llm = OpenAI(model="gpt-5.4")
+ llm = OpenAI(model="gpt-6-luna")
````

**High — Workflow Execution**

`/llamaindex/shared-state/workflow-execution` · route `/shared-state/workflow-execution` · under “Organize state by purpose” · in a `python` block

2 code lines changed.

````diff
- llm = OpenAI(model="gpt-5.4")
+ llm = OpenAI(model="gpt-6-luna")
````

**High — Synchronize Thread History**

`/llamaindex/threads-import` · route `/threads-import` · under “Add Intelligence to your existing app”

5 code lines, 34 prose lines changed. The number of fenced code blocks changed.

````diff
+ For a concrete example without historical import, see [keep an existing LangGraph conversation](/llamaindex/intelligence/bring-your-own-thread-system#example-keep-an-existing-langgraph-conversation).
+ 
- If you also want users to reopen history recorded before Intelligence was connected, copy supported history into Intelligence using the steps below. The importer currently supports Google ADK and LangGraph stores. It copies historical content; it does not enable live delivery, recover past execution, or establish ongoing database replication.
+ If you also want users to reopen history recorded before Intelligence was connected, copy supported history into Intelligence using the steps below. This guide covers Google ADK, LangGraph, Mastra, and AWS Strands stores. It copies historical content; it does not enable live delivery, recover past execution, or establish ongoing database replication.
- | LangGraph | [Add AG-UI streams to LangGraph threads](/langgraph-python/threads-import) | LangGraph Server, LangGraph Platform, or LangSmith Deployment threads exposed through the LangGraph SDK thread/run APIs. |
+ | LangGraph | [Add AG-UI streams to LangGraph threads](/langgraph-python/threads-import) | Saved conversations from LangGraph Server / LangSmith deployments or Python FastAPI apps with durable persistence. |
+ | Mastra | [Add AG-UI streams to Mastra conversations](/mastra/threads-import) | Saved conversations from a local LibSQL database or a Mastra server. |
+ | AWS Strands | [Python](/strands/threads-import) · [TypeScript](/strands-typescript/threads-import) | Saved single-agent conversations from local session files or S3; Python also supports AgentCore Memory native sessions. |
````

**Medium — Copilot Runtime**

`/llamaindex/copilot-runtime` · route `/copilot-runtime` · under “Runtime languages”

1 heading, 28 prose lines changed.

````diff
+ ## Runtime languages
+ 
+ **TypeScript is the default and most fully featured runtime. It is the only runtime that can run without CopilotKit Intelligence.** Use it for an open-source setup, or connect it to Intelligence when you need its services.
+ 
+ Python, Go, Ruby, and C#/.NET runtimes require an Intelligence project and server-side API key. They work with both [cloud-hosted](/llamaindex/intelligence/managed-intelligence-platform) and [self-hosted](/llamaindex/intelligence/self-hosting) Intelligence; they do not provide an in-memory or SQLite runner.
+ 
+ | Language | Host | Without Intelligence |
+ | --- | --- | --- |
````

**Medium — Thread & History Lifecycle**

`/llamaindex/threads-lifecycle` · route `/threads-lifecycle` · under “Future runs can remain durable in both places”

1 heading, 7 prose lines changed.

````diff
- After historical import, future conversations that run through CopilotKit are
- written to CopilotKit Intelligence as threads. If your LangGraph agent
+ Once Intelligence is connected, conversations that run through that runtime are
+ recorded automatically in Intelligence. Historical import is optional. If your LangGraph agent
+ 
+ ## Example: keep an existing LangGraph conversation
+ 
+ Follow [Bring your own thread system](/llamaindex/intelligence/bring-your-own-thread-system#example-keep-an-existing-langgraph-conversation) for an example that keeps native persistence and continues the same conversation.
````

**Low — AG-UI**

`/llamaindex/ag-ui` · route `/ag-ui` · under “How agents slot into the runtime”

3 prose lines changed.

````diff
+ To write the custom implementation yourself, and keep its own fields through
+ the clone in step 2, see [Write your own AG-UI agent](/llamaindex/backend/custom-ag-ui-agent).
+ 
````

**Low — Programmatic Control**

`/llamaindex/programmatic-control` · route `/programmatic-control` · under “`copilotkit.runAgent()` vs `agent.runAgent()`”

2 prose lines changed.

````diff
- - **`agent.runAgent()`** — Low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or handle follow-ups. Use this only when you need direct control over the agent execution (e.g., resuming from an interrupt with `forwardedProps`).
+ - **`agent.runAgent()`** — Low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or handle follow-ups. Use this only when you need direct control over the agent execution. To resume from an interrupt, use `copilotkit.runAgent({ agent, resume })` for standard AG-UI interrupts, or `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` for legacy `on_interrupt` custom events, so that the subscriber lifecycle still wraps the resumed run.
````

**Info — A2UI · Dynamic Schema**

`/llamaindex/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema`

Now tracked for the first time.

**Info — A2UI · Fixed Schema**

`/llamaindex/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema`

Now tracked for the first time.

**Info — Open Generative UI**

`/llamaindex/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui`

Now tracked for the first time.

**Info — Governed Action Approval UI**

`/llamaindex/human-in-the-loop/governed-actions` · route `/human-in-the-loop/governed-actions`

Now tracked for the first time.

**Info — HITL Overview**

`/llamaindex/human-in-the-loop/index` · route `/human-in-the-loop/index`

Now tracked for the first time.

**Info — Sub-Agents**

`/llamaindex/multi-agent/subagents` · route `/multi-agent/subagents`

Now tracked for the first time.

---

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
