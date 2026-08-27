# Agent workflow

- Work directly on clear, bounded, low-risk requests.
- For complex, ambiguous, risky, or multi-step work, create a Markdown plan under `.plans/` with a descriptive name such as `.plans/competition-import.md`.
- Share a concise summary of the plan with the user so they have the relevant context, then normally continue with implementation.
- Pause before implementation only when unresolved choices could materially change the result, the action requires additional authorization, or the user explicitly asks to review the plan first.
- Keep the plan current when implementation materially changes direction.
- Do not require specific models, reasoning levels, subagents, or delegation.
