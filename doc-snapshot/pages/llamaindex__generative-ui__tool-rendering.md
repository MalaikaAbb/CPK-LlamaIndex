# Tool Rendering

> Render your agent's tool calls with custom UI components.
<IframeSwitcher
  id="backend-tools-example"
  exampleUrl="https://feature-viewer.copilotkit.ai/llama-index/feature/backend_tool_rendering?sidebar=false&chatDefaultOpen=false"
  codeUrl="https://feature-viewer.copilotkit.ai/llama-index/feature/backend_tool_rendering?view=code&sidebar=false&codeLayout=tabs"
  exampleLabel="Demo"
  codeLabel="Code"
  height="700px"
/>

<Callout>
  This example demonstrates the [implementation](#implementation) section applied in the <a href="https://feature-viewer.copilotkit.ai/llama-index/feature/agentic_chat" target="_blank">CopilotKit feature viewer</a>.
</Callout>

## What is this?

Tools are a way for the LLM to call predefined, typically, deterministic functions. CopilotKit allows you to render these tools in the UI
as a custom component, which we call **Generative UI**.

## When should I use this?

Rendering tools in the UI is useful when you want to provide the user with feedback about what your agent is doing, specifically
when your agent is calling tools. CopilotKit allows you to fully customize how these tools are rendered in the chat.

## Implementation

<Steps>
<Step>
### Run and connect your agent
You'll need to run your agent and connect it to CopilotKit before proceeding. If you haven't done so already,
you can follow the instructions in the [Getting Started](/langgraph/quickstart) guide.

If you don't already have an agent, you can use the [coagent starter](https://github.com/copilotkit/copilotkit/tree/main/examples/coagents-starter) as a starting point
as this guide uses it as a starting point.

</Step>
<Step>
### Give your agent a tool to call

Add a new tool definition and pass the tool to the agent:

```python title="agent.py"
from fastapi import FastAPI
from llama_index.llms.openai import OpenAI
from llama_index.protocols.ag_ui.router import get_ag_ui_workflow_router

def getWeather(location: str) -> str:
    """Get the weather for a given location."""
    return f"The weather in {location} is sunny and 70 degrees."

# Initialize the LLM
llm = OpenAI(model="gpt-5.4")

# Create the AG-UI workflow router
agentic_chat_router = get_ag_ui_workflow_router(
    llm=llm,
    # These are the tools that only have a render function in the frontend
    backend_tools=[getWeather],
    system_prompt="You are a helpful AI assistant with access to various tools and capabilities.",
)

# Create FastAPI app
app = FastAPI(
    title="LlamaIndex Agent",
    description="A LlamaIndex agent integrated with CopilotKit",
    version="1.0.0"
)

# Include the router
app.include_router(agentic_chat_router)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "agent": "llamaindex"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
```

</Step>
<Step>
### Render the tool call in your frontend
At this point, your agent will be able to call the `get_weather` tool. Now
we just need to add a `useRenderTool` hook to render the tool call in
the UI.

<Callout type="info" title="Important">
  In order to render a tool call in the UI, the name of the action must match
  the name of the tool.
</Callout>

```tsx title="app/page.tsx"
import { useRenderTool } from "@copilotkit/react-core/v2"; // [!code highlight]
// ...

const YourMainContent = () => {
  // ...
  // [!code highlight:12]
  useRenderTool({
    name: "getWeather",
    render: ({status, args}) => {
      return (
        <p className="text-gray-500 mt-2">
          {status !== "complete" && "Calling weather API..."}
          {status === "complete" && `Called the weather API for ${args.location}.`}
        </p>
      );
    },
  });
  // ...
};
```

</Step>
<Step>
### Give it a try!

Try asking the agent to get the weather for a location. You should see the custom UI component that we added
render the tool call and display the arguments that were passed to the tool.

</Step>
</Steps>

## Default Tool Rendering

`useDefaultRenderTool` provides a catch-all renderer for **any tool** that doesn't have a specific `useRenderToolCall` defined. This is useful for:

- Displaying all tool calls during development
- Rendering MCP (Model Context Protocol) tools
- Providing a generic fallback UI for unexpected tools

```tsx title="app/page.tsx"
import { useDefaultRenderTool } from "@copilotkit/react-core/v2"; // [!code highlight]
// ...

const YourMainContent = () => {
  // ...
  // [!code highlight:15]
  useDefaultRenderTool({
    render: ({ name, args, status, result }) => {
      return (
        <div style={{ color: "black" }}>
          <span>
            {status === "complete" ? "✓" : "⏳"}
            {name}
          </span>
          {status === "complete" && result && (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      );
    },
  });
  // ...
};
```

<Callout type="info">
  Unlike `useRenderToolCall`, which targets a specific tool by name,
  `useDefaultRenderTool` catches **all** tools that don't have a dedicated
  renderer.
</Callout>

<Callout type="info">
  In v2, use [`useDefaultRenderTool`](/reference/v2/hooks/useDefaultRenderTool)
  for wildcard fallback rendering, and
  [`useRenderTool`](/reference/v2/hooks/useRenderTool) for named or wildcard
  renderer registration.
</Callout>
