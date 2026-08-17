# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-08-17

### 13:43 UTC — 1 page, highest severity low

**Low — Multi-Agent Flows** · _local snapshot edit, not an upstream change_

`/llamaindex/multi-agent-flows` · route `/multi-agent-flows` · under “Router Mode (default)”

2 prose lines changed.

````diff
- 
+ In router mode, CopilotKit acts as a central hub, dynamically selecting and _routing_ requests between different agents or actions based on the user's input. This mode can be good for chat-first experiences where an LLM chatbot is the entry point for a range of interactions, which can stay in the chat UI or expand to include native React UI widgets.
````

### 13:39 UTC — 1 page, highest severity high

**High — Workflow Execution** · _local snapshot edit, not an upstream change_

`/llamaindex/shared-state/workflow-execution` · route `/shared-state/workflow-execution` · under “Organize state by purpose” · in a `python` block

3 code lines changed.

````diff
- 
+ from typing import Annotated, List
+ from fastapi import FastAPI
````
