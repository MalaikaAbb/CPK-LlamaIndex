"""Agents copied from the docs' "Code" tabs for the newer LlamaIndex pages.

Each module here is the file the docs site shows under a page's interactive
demo (the `DemoSource` panel), reproduced byte-for-byte. The only edit is in
the two Open Generative UI agents, where an import of an unpublished module is
swapped for the stock router — each swap is marked `DOC GAP` in place — and
`a2ui_dynamic.py`, which was replaced by request with a plain router whose
only page-specific part is its system prompt.

  a2ui_dynamic.py                →  /generative-ui/a2ui/dynamic-schema
  a2ui_fixed.py (+ a2ui_schemas) →  /generative-ui/a2ui/fixed-schema
  open_gen_ui_agent.py           →  /generative-ui/open-generative-ui (minimal)
  open_gen_ui_advanced_agent.py  →  /generative-ui/open-generative-ui (advanced)
  subagents_agent.py             →  /multi-agent/subagents

The docs never show the server that mounts these routers. `main.py` mounts
each at the prefix its runtime route's `HttpAgent` URL points at.
"""
