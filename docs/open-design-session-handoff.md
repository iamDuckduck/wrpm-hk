# WRPM Open Design — Session Handoff

**Updated:** 2026-08-23
**Repository:** `C:\WRPM-HK`

Use this file as the starting context for the next session.

## Project context

WRPM HK is an Astro/Sanity project. Open Design is being used as a planning and refinement aid, not as the source of production code. The production app remains the implementation source of truth.

The wireframe is intentionally low-fidelity. It documents information architecture, page flow, responsive structure, component boundaries, and behavior notes. It is not expected to match the final colors, typography, imagery, or polished homepage styling.

## Current design sources

- **Canonical Open Design artifact:** `design/refined-wireframe/wireframe-v3.html`
- **Polished homepage reference:** `design/figma/home_desktop.png` and `design/figma/home_mobile.png`
- **Figma handoff notes:** `design/figma/README.md`
- **Google Stitch design notes:** `design/stitch/design.md` and `design/stitch/README.md`
- **Existing production UI/code:** `apps/web/` — use this to preserve behavior and existing visual decisions unless a new implementation request explicitly changes them.

The homepage in the existing code is visually different from the Open Design wireframe. That is expected. Before implementing a page, compare the wireframe’s structure with the current production page and use the Figma/home reference for visual direction. Verify that the homepage reference area in `wireframe-v3.html` is detailed enough before treating it as an implementation specification.

## Decisions captured in wireframe v3

### Shared navigation popup

- Desktop: a header row with a popup anchored to the menu control.
- Mobile: a compact header and full-width popup.
- Production routes currently exposed in the shared navigation are Home, Members, and League.
- The active route must be page-aware. For example, Members is highlighted on `/members` and League on `/league`; Home must not be hard-coded as active on every route.
- Existing language-switcher behavior remains unchanged unless localization routing is approved later.

### Members list

- The page has an explicit `MEMBERS — section label`.
- The blank/outlined area previously visible near the page header was treated as a wireframe placeholder/overflow issue, not a requested production control. Keep the section label and page header readable without horizontal overflow.

### Member detail

The layout is intentionally vertical, not a two-column content row:

1. Centered profile image or fallback icon.
2. Left-aligned identity stack below it.
3. Biography as a full-width section.
4. Media/links as a full-width section.

Do not place the profile image beside the identity stack unless the user explicitly changes this decision.

### League overview

Use a vertical section sequence rather than placing unrelated content side by side:

1. Page heading/intro.
2. Full-width description.
3. Full-width ranking section.
4. Full-width season links/selector.

### Season route / match results

- Each round is shown as a separate section.
- Each round contains two example game cards on desktop.
- Each game card contains four result/member tiles with a circular member-icon placeholder, member name, score, and placement.
- On mobile, game cards stack one per row.
- The circular icons are placeholders for the member profile image.
- **Later code/query adjustment:** current league participant/result data does not include `profileImage`; update the query/data model before implementing real member icons.

### Wireframe theme control

`wireframe-v3.html` has a small accessible light/dark toggle:

- Light mode is the default.
- Button: `#theme-toggle`.
- The script toggles `html[data-theme="dark"]` and updates button text, `aria-pressed`, and `aria-label`.
- This is only for reviewing the wireframe; it does not automatically change the production app theme.

## Approved design cleanup

The following old design assets were removed because they were outdated or redundant:

- `design/home design.html`
- `design/style_reference.JPG`
- `design/web_reference/`
- `design/wireframe/`
- `design/wireframe_v1.JPG`
- `design/WRPM-DESIGN-BRIEF.md`
- Old v2/refinement support files under `design/refined-wireframe/` (`wireframe-v2.html`, `assumptions.md`, `component-map.md`, `page-flow.md`, and `responsive-states.md`)

The current v3 wireframe, Figma references, and Stitch notes were retained.

## Git and verification state

Approved Open Design files were committed in:

```text
f56e9ec chore: add Open Design references and wireframe
```

The commit includes the current wireframe, Figma/Stitch references, model-routing files, and approved obsolete-design deletions.

The working tree currently contains unrelated, unstaged Sanity Studio work. Do not stage or commit these as part of an Open Design task unless the user explicitly asks:

```text
M  apps/studio/schemaTypes/documents/league-season.ts
M  apps/studio/schemaTypes/documents/league.ts
M  apps/studio/schemaTypes/documents/match.ts
M  apps/studio/schemaTypes/documents/member.ts
?? apps/studio/schemaTypes/utils/
```

`.od-skills/` is local and ignored. It should remain out of Git unless the user explicitly changes that decision.

Verification already completed for the approved Open Design change:

```text
pnpm --dir apps/web test
14 test files passed / 49 tests passed
git diff --cached --check  # clean before commit
```

## Codex model routing

Repository defaults are in `.codex/config.toml` and the workflow guidance is in `AGENTS.md`:

- Planning, requirements, architecture, investigation, review, and final verification: GPT-5.6 Sol, high reasoning.
- Substantial implementation: GPT-5.6 Luna, max reasoning.
- Small edits and read-only checks can stay with the primary agent.
- An explicit model selection in the current chat overrides these defaults. `AGENTS.md` is guidance; it does not forcibly switch an already selected model.

If the user has explicitly selected Luna Max in the current session, continue using it for that session. If no explicit selection is present, follow the repository defaults.

## Launching Open Design for another session

The local Open Design source checkout is:

```text
C:\open design\open-design
```

It requires Node `~24` and pnpm `10.33.x`. The checkout currently has its dependencies installed.

From a normal PowerShell window, start the managed runtime in the background:

```powershell
Set-Location 'C:\open design\open-design'
pnpm tools-dev
pnpm tools-dev status
```

This starts the daemon, web app, and (when available) desktop shell. Open the web URL printed by `tools-dev`. To run only the web app in the foreground, use:

```powershell
pnpm tools-dev run web
```

Useful lifecycle commands:

```powershell
pnpm tools-dev status
pnpm tools-dev logs
pnpm tools-dev restart
pnpm tools-dev stop
```

Source-dev ports are normally allocated dynamically. The `http://127.0.0.1:7456` address is the Docker/production-mode default; do not assume the source-dev web app uses `7456` unless the terminal or `tools-dev status` reports it.

The current Codex sandbox can read `C:\open design\open-design` but cannot write its `.tmp\tools-dev` log directory, so launching `pnpm tools-dev` from this session may fail with `EPERM`. Run it from your regular PowerShell, or explicitly grant this session access if you want Codex to start it.

### Handoff to a second Codex session

The Open Design runtime is shared by the machine, not by a specific chat. Start it once, then give the second session:

1. Read `C:\WRPM-HK\docs\open-design-session-handoff.md`.
2. Use the already-running URL printed by `pnpm tools-dev`.
3. Use `C:\WRPM-HK` for WRPM implementation work and `C:\open design\open-design` only for Open Design source/tooling work.
4. Do not start a second `tools-dev` instance if one is already running; use `pnpm tools-dev status` first.
5. Do not treat the low-fidelity wireframe as the final visual design; compare it with the existing app and the Figma homepage references.

If the second session needs Open Design as a Codex MCP integration rather than through the browser UI, build the local daemon CLI once and install the Codex adapter:

```powershell
Set-Location 'C:\open design\open-design'
pnpm --filter @open-design/daemon build
node apps/daemon/bin/od.mjs mcp install codex
```

Restart the Codex client after changing its MCP configuration. This installation is separate from launching the local web/desktop runtime.

## Recommended next-session workflow

1. Read this handoff, then inspect `git status --short`.
2. Keep the unrelated Studio changes untouched.
3. Open/read `design/refined-wireframe/wireframe-v3.html` and compare the relevant route with the existing `apps/web/` implementation.
4. Confirm the intended page structure with the user before changing production UI. Treat v3 as a structural specification, not a pixel-perfect visual spec.
5. For production implementation, first read the applicable skills: brainstorming, test-driven development, verification-before-completion, and Sanity best practices when schemas/GROQ are involved.
6. Use Luna Max for multi-file or non-trivial implementation, per the routing above.
7. For season result icons, update the data query/model for `profileImage` before wiring real images; keep a safe fallback for missing images.
8. Run the relevant web tests after implementation, inspect the diff, and commit only files explicitly in scope.
9. Do not push to a remote unless the user separately asks for a push.

## Useful starting commands

```powershell
Set-Location C:\WRPM-HK
git status --short
Get-Content -Raw design\refined-wireframe\wireframe-v3.html
Get-Content -Raw AGENTS.md
Get-Content -Raw .codex\config.toml
```
