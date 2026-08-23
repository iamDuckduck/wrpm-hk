# Codex model routing

- Use the primary agent, configured as GPT-5.6 Sol with high reasoning, for requirements, planning, architecture, investigation, review, and final verification.
- Delegate substantial code implementation to a subagent configured as GPT-5.6 Luna with max reasoning. Substantial implementation includes multi-file features, non-trivial refactors, complex bug fixes, and execution of longer implementation plans.
- Keep explanations, read-only checks, planning-only work, and small local edits with the primary agent unless delegation would materially improve the result.
- An explicit model or reasoning-effort request from the user overrides these defaults.
