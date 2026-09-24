from __future__ import annotations

import os
from collections.abc import Callable
from typing import Any, Protocol

import httpx

from evv_workers.redact import redact

Validator = Callable[[dict[str, Any]], tuple[bool, dict[str, Any] | None, str | None]]


class ToolClient(Protocol):
    def tool_call(
        self,
        *,
        system: str,
        user: str,
        tool_name: str,
        tool_schema: dict[str, Any],
    ) -> dict[str, Any]: ...


class LlmValidationError(RuntimeError):
    def __init__(self, reason: str) -> None:
        super().__init__(reason)
        self.reason = reason


class AnthropicClient:
    """Claude messages API with a single structured tool call.

    The API key is read from ANTHROPIC_API_KEY and is never logged.
    """

    def __init__(
        self,
        api_key: str | None = None,
        *,
        model: str = "claude-sonnet-4-6",
        base_url: str = "https://api.anthropic.com",
        client: httpx.Client | None = None,
    ) -> None:
        key = api_key if api_key is not None else os.environ.get("ANTHROPIC_API_KEY", "")
        if not key:
            raise RuntimeError("ANTHROPIC_API_KEY is not set")
        self._key = key
        self.model = model
        self._base = base_url.rstrip("/")
        self._client = client or httpx.Client(timeout=60)

    def tool_call(
        self,
        *,
        system: str,
        user: str,
        tool_name: str,
        tool_schema: dict[str, Any],
    ) -> dict[str, Any]:
        response = self._client.post(
            f"{self._base}/v1/messages",
            headers={
                "x-api-key": self._key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": self.model,
                "max_tokens": 4096,
                "system": system,
                "tools": [
                    {
                        "name": tool_name,
                        "description": tool_name,
                        "input_schema": tool_schema,
                    }
                ],
                "tool_choice": {"type": "tool", "name": tool_name},
                "messages": [{"role": "user", "content": user}],
            },
        )
        response.raise_for_status()
        body = response.json()
        content = body.get("content")
        if not isinstance(content, list):
            raise LlmValidationError("response missing content")
        for block in content:
            if isinstance(block, dict) and block.get("type") == "tool_use":
                tool_input = block.get("input")
                if isinstance(tool_input, dict):
                    return tool_input
        raise LlmValidationError("response missing tool_use input")


def validated_tool_call(
    client: ToolClient,
    *,
    system: str,
    user: str,
    tool_name: str,
    tool_schema: dict[str, Any],
    validate: Validator,
) -> dict[str, Any]:
    """Call once, retry once with the validation reason, then fail closed."""
    reason: str | None = None
    prompt = user
    for _attempt in range(2):
        raw = client.tool_call(
            system=system,
            user=prompt,
            tool_name=tool_name,
            tool_schema=tool_schema,
        )
        ok, parsed, reason = validate(raw)
        if ok and parsed is not None:
            return parsed
        prompt = user + "\n\nThe previous tool output was rejected: " + (reason or "invalid")
    raise LlmValidationError(redact(reason or "invalid tool output"))
