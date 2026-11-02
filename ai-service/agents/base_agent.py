import os
import json
from typing import Dict, Any, Optional
from openai import OpenAI

class BaseAgent:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        self.api_key = os.getenv("OPENAI_API_KEY", "").strip()
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    def call_llm_json(self, system_prompt: str, user_prompt: str, fallback_func) -> Dict[str, Any]:
        """Calls OpenAI LLM with JSON response format; falls back cleanly if no key or error occurs."""
        if not self.client:
            return fallback_func()
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                timeout=12.0
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"[{self.name}] LLM invocation failed ({e}). Executing high-fidelity rule-based engine.")
            return fallback_func()

    def call_llm_text(self, system_prompt: str, user_prompt: str, fallback_func) -> str:
        """Calls OpenAI LLM for text generation with graceful fallback."""
        if not self.client:
            return fallback_func()
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                timeout=12.0
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"[{self.name}] LLM invocation failed ({e}). Returning fallback text.")
            return fallback_func()
