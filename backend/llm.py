"""LLM construction, factored out of the doc samples.

Every Python sample on the LlamaIndex pages opens with the same two lines:

    from llama_index.llms.openai import OpenAI
    llm = OpenAI(model="gpt-5.4")

This harness serves five routers, so that line lives here once instead of five
times. The only change is the model id — see the note below.

`gpt-5.4` is what the docs publish, verbatim, on every page. It is not an id the
OpenAI API serves, so a literal copy makes every route in this repo fail with a
model-not-found error. The default here is `gpt-4o-mini` and
`OPENAI_CHAT_MODEL_ID` overrides it, so the harness runs out of the box and you
can still reproduce the doc's exact call by setting that variable to `gpt-5.4`.
The discrepancy is recorded in the README's known-issues section and on the
Quickstart route.
"""

from __future__ import annotations

import os

from llama_index.core.llms.function_calling import FunctionCallingLLM
from llama_index.llms.openai import OpenAI

DEFAULT_MODEL = "gpt-4o-mini"

# What every LlamaIndex doc page prints. Surfaced so the app can show the gap.
DOCUMENTED_MODEL = "gpt-5.4"


def build_llm() -> FunctionCallingLLM:
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Copy .env.example to backend/.env and fill it in."
        )
    return OpenAI(model=os.getenv("OPENAI_CHAT_MODEL_ID", DEFAULT_MODEL))
