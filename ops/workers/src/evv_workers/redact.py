from __future__ import annotations

import re

_SECRET = re.compile(
    r"(sk-ant-[A-Za-z0-9_\-]+|Bearer\s+\S+|ASSEMBLYAI_API_KEY=\S+|ANTHROPIC_API_KEY=\S+)",
    re.IGNORECASE,
)


def redact(message: str) -> str:
    """Strip credential-shaped substrings before anything is stored or logged."""
    return _SECRET.sub("[redacted]", message)
