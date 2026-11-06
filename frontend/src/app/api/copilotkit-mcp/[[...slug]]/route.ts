import {
  BuiltInAgent,
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

const agent = new BuiltInAgent({
  model: "openai/gpt-5.4",
  prompt: "You are a helpful assistant.",
});

const runtime = new CopilotRuntime({
  agents: {
    default: agent,
  },
  mcpApps: {
    servers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "my-server",
      },
    ],
  },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-mcp",
});

export const GET = handler;
export const POST = handler;
