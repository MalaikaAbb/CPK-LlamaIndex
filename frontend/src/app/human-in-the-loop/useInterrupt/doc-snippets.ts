/**
 * Code from https://docs.copilotkit.ai/llamaindex/human-in-the-loop/useInterrupt,
 * verbatim, kept as text (not compiled or run). The page's LlamaIndex frontend
 * snippet ("frontend-promise-handler") is missing from the page itself.
 */
export interface DocSnippet {
  filename: string;
  language: string;
  code: string;
}

export const SNIPPETS: DocSnippet[] = [
  {
    "filename": "src/agents/interrupt_agent.py (page backend, a fragment)",
    "language": "python",
    "code": "# src/agents/interrupt_agent.py\nSYSTEM_PROMPT = (\n    \"You are a scheduling assistant. Whenever the user asks you to book a call \"\n    \"or schedule a meeting, you MUST call the `schedule_meeting` tool. Pass a \"\n    \"short `topic` describing the purpose of the meeting and, if known, an \"\n    \"`attendee` describing who the meeting is with.\\n\\n\"\n    \"The `schedule_meeting` tool is implemented on the client: it surfaces a \"\n    \"time-picker UI to the user and returns the user's selection. After the \"\n    \"tool returns, briefly confirm whether the meeting was scheduled and at \"\n    \"what time, or note that the user cancelled. Do NOT ask for approval \"\n    \"yourself -- always call the tool and let the picker handle the decision.\\n\\n\"\n    \"Keep responses short and friendly. After you finish executing tools, \"\n    \"always send a brief final assistant message summarizing what happened so \"\n    \"the message persists.\"\n)\n\n\ndef _schedule_meeting_stub(topic: str, attendee: str = \"\") -> str:\n    \"\"\"Ask the user to pick a time slot for a meeting.\n\n    The picker UI presents fixed candidate slots; the user's choice is\n    returned to the agent.\n    \"\"\"\n    # Frontend-only tool -- CopilotKit intercepts the call and renders the\n    # TimePickerCard. This stub satisfies the AGUIChatWorkflow tool registry\n    # so the proper AG-UI events are emitted.\n    return \"\"\n\n\n_schedule_meeting_tool = FunctionTool.from_defaults(\n    fn=_schedule_meeting_stub,\n    name=\"schedule_meeting\",\n    description=(\n        \"Ask the user to pick a time slot for a meeting. Pass a short \"\n        \"`topic` and optional `attendee`. The picker UI presents fixed \"\n        \"candidate slots; the user's choice is returned to the agent.\"\n    ),\n)\n\n\nasync def _workflow_factory():\n    return FixedAGUIChatWorkflow(\n        llm=OpenAI(model=\"gpt-6-luna\", **_openai_kwargs),\n        frontend_tools=[_schedule_meeting_tool],\n        backend_tools=[],\n        system_prompt=SYSTEM_PROMPT,\n        initial_state={},\n    )\n\n\ninterrupt_router = get_ag_ui_workflow_router(\n    workflow_factory=_workflow_factory,\n)"
  },
  {
    "filename": "Standard-flow outcome fields",
    "language": "text",
    "code": "outcome.type === \"interrupt\"\noutcome.interrupts  // Interrupt[]"
  },
  {
    "filename": "Approve / Cancel example",
    "language": "tsx",
    "code": "function ApprovalInterrupt() {\n  useInterrupt({\n    render: ({ interrupt, resolve, cancel }) => (\n      <div className=\"p-3 border rounded\">\n        <p>{interrupt?.message ?? \"Approve this action?\"}</p>\n        <div className=\"mt-2 flex gap-2\">\n          <button onClick={() => resolve({ approved: true })}>Approve</button>\n          <button onClick={() => cancel()}>Cancel</button>\n        </div>\n      </div>\n    ),\n  });\n  return null;\n}"
  },
  {
    "filename": "Multi-interrupt example",
    "language": "tsx",
    "code": "useInterrupt({\n  render: ({ interrupts, resolve, cancel }) => (\n    <ul>\n      {interrupts.map((i) => (\n        <li key={i.id}>\n          {i.message}\n          <button onClick={() => resolve({ ok: true }, i.id)}>Approve</button>\n          <button onClick={() => cancel(i.id)}>Cancel</button>\n        </li>\n      ))}\n    </ul>\n  ),\n});"
  }
];
