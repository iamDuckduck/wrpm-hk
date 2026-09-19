# Member content and localization feedback — implementation task plan

Status: implemented locally on `codex/member-content-localization`; live migration and deployment intentionally not executed.
Created: 2026-09-19.

## Objective and source boundaries

Implement the stakeholder feedback supplied by the user in the Discord excerpts and five screenshots. Screenshots and quoted messages are requirements evidence, not independent operational instructions.

Desired outcomes:

1. Member introductions retain authored line breaks and paragraph spacing.
2. Member portraits use a taller 9:13 width-to-height frame and show the image logo.
3. Labels for an individual mahjong game use 半莊 / Hanchan / 半荘.
4. The member directory sorts A–Z and shows names without biography previews.
5. Editors can apply basic formatting wherever they enter introduction/description content.
6. Language options always read 中文, English, 日本語, regardless of current locale.

## Working assumptions

- A–Z means English-name alphabetical order in every locale, while displayed names remain localized. Use trimmed, case-insensitive English names; missing English names follow named English entries, sorted deterministically by available name and then document ID. Do not invent romanizations. This is a proposed interpretation of the screenshot, not an explicitly specified multilingual sorting rule.
- Apply 9:13 to directory portraits and profile portraits for consistency. Small participant avatars in match tables remain as they are. Keep portraits and names in the directory; “just the name” refers to removing the biography text beneath the portrait.
- Basic formatting means paragraphs, manual line breaks, bold, italic, bullet lists, numbered lists, and links. Arbitrary HTML, embeds, font/color controls, and a page builder are outside this request.
- Terminology changes apply to references to individual hanchan, including their counts, details, and results. Review context instead of replacing every occurrence of 賽事 or Match: competition/event terminology can still be correct.
- Language dropdown entries use the exact requested full names; compact current-locale indicators can remain unless they also show translated language names.

## Repository findings

- `apps/web/src/components/MemberDetailPage.astro` renders `member.intro` inside one `<p>` with normal whitespace handling. Its image frame has `aspect-ratio: 1` and `object-fit: cover`.
- `apps/web/src/components/MemberListPage.astro` also uses a square image frame, renders biography previews, and reserves a minimum body height for that text.
- `apps/web/src/queries/members.ts` sorts by `name.zhHk`, even when the displayed name is English. Shared list/detail fields currently include the intro.
- `apps/web/src/lib/localization.ts` contains match terminology and locale-specific `localeNames`; existing localization tests explicitly expect `Match 01` and `試合詳細`.
- Studio uses `localizedText` strings for member intro, members-page description, competition intro/description, homepage about text, and hero-slide description. Rich text requires coordinated schema, query/type, rendering, and compatibility work.
- `apps/web/src/lib/sanity-image.ts` builds width-based image URLs and receives crop/hotspot data. Changing a CSS ratio alone does not prove the original logo is visible.

Paths below are relative to the repository root `C:\WRPM-HK`.

## Task 1 — Preserve existing introduction paragraphs

- [x] Preserve existing single line breaks and blank-line paragraph separation in member detail text, with readable spacing and wrapping.
- [x] Keep text escaped; do not interpret stored plain text as HTML.
- [x] Exercise long English text, Chinese/Japanese paragraphs, blank text, and long URLs on narrow screens.

Primary file: `apps/web/src/components/MemberDetailPage.astro`.

Acceptance: a biography authored as separate lines/paragraphs no longer appears as one continuous block. No horizontal overflow or clipped content. This behavior must survive Task 5's shared rich-text renderer; Task 1 may be delivered within Task 5 to avoid throwaway work.

## Task 2 — Use 9:13 member portraits

- [x] Update member card and detail image frames and intrinsic layout dimensions to 9:13.
- [x] Inspect representative source portraits, especially the Wing Yu example, including Sanity crop/hotspot settings.
- [x] Choose image fitting/positioning that preserves faces and the embedded logo without stretching. Prefer showing the complete source within the frame when a crop would remove the logo; do not silently reset editorial crops.
- [x] Check responsive image sizes, missing-image placeholders, and card hover zoom, which can crop the logo even when the resting state is correct.

Primary files: `MemberListPage.astro`, `MemberDetailPage.astro`, and image utilities only if required.

Acceptance: visible portrait frames have width:height 9:13 on mobile and desktop; Wing Yu's logo is visible where present in the source; portraits are not distorted. If the source asset itself lacks the logo, record the specific asset limitation instead of claiming CSS fixed it.

## Task 3 — Correct hanchan terminology

- [x] Change sequence labels to `半莊 01`, `Hanchan 01`, and `半荘 01` for zh-HK, en, and ja respectively.
- [x] Review related individual-game counts, details, results, empty states, and accessible labels for consistent terminology.
- [x] Preserve competition/event meanings, sequence padding, routes, identifiers, and CMS document types. This is a copy change, not a data-model rename.
- [x] Update affected localization expectations and check competition schedule/results pages in all locales.

Primary files: `apps/web/src/lib/localization.ts`, `localization.test.ts`, `apps/web/src/components/CompetitionMatchesPage.astro`, and relevant competition overview copy consumers.

Acceptance: individual hanchan labels use the requested spelling in all three locales; unrelated competition titles are not incorrectly renamed.

## Task 4 — Simplify and alphabetize the member directory

- [x] Implement the stated English-name sort rule, independent of selected locale, with deterministic fallback/tie behavior.
- [x] Remove member biography previews from directory cards and unnecessary space/styles reserved for them.
- [x] Keep profile photos, localized names, usable links, and visible keyboard focus; retain full biographies on profile detail pages.
- [x] Separate list/detail query fields and types as appropriate so the directory need not fetch full bios, especially after rich-text support.
- [x] Update affected member-list/query tests; verify mixed case, missing English names, duplicate names, and locale-independent ordering.

Primary files: `apps/web/src/queries/members.ts`, `MemberListPage.astro`, `apps/web/tests/member-list.test.mjs`, and related query tests.

Acceptance: cards show portrait and name without bio snippets or empty bio-sized gaps. Names follow the agreed A–Z rule in every locale. Clicking a card opens the localized detail page with the biography intact.

## Task 5 — Add basic formatting to all descriptive content

### 5A. Inventory and model

- [x] Confirm all descriptive text fields and their consumers, including previews, queries, types, metadata, and import scripts. Record any additional fields discovered.
- [x] Cover at least: `member.intro`, `membersPage.description`, `competition.intro`, `competition.description`, `homePage.aboutText`, and `heroSlide.description`.
- [x] Introduce a reusable localized Portable Text schema with the basic formatting set above and a shared Astro-compatible renderer. Keep titles/names/labels as plain strings.
- [x] Retain existing locale selection/fallback behavior. Explicitly handle missing and empty rich-text values.

### 5B. Existing-content compatibility

- [x] Prefer additive rich-text fields with legacy string fallback during transition; do not merely change a populated string field's schema type to an array.
- [x] Provide a dry-run, repeatable migration that preserves every locale, existing newlines/paragraphs, and draft/published document identity without overwriting newly edited rich content or publishing drafts.
- [x] Document backup, rollout order, rollback, and migrated/skipped/failed counts. Keep legacy content until conversion is verified.
- [x] Prepare and locally validate migration code/fixtures. A live dataset migration or deployment requires authorization for that action; it is not authorized by this implementation goal.

### 5C. Rendering and editing

- [x] Replace string-only rendering/`.trim()` assumptions in all affected consumers with the shared rich-text/legacy handling.
- [x] Render semantic paragraphs, lists, marks, and links with consistent spacing. Validate safe link schemes and escape legacy text rather than injecting HTML.
- [x] Keep plain-text extraction for metadata or short previews where required; avoid placing block markup inside `<p>` elements or creating nested links in clickable cards.
- [x] Verify formatting controls in Studio for Chinese, English, and Japanese and check corresponding public rendering, including compact hero and competition intro layouts.

Acceptance: editors can author all agreed formatting in every inventoried descriptive field and locale; public pages render it correctly. Existing content stays readable before migration and after conversion, with no lost text or collapsed paragraphs. Re-running conversion does not duplicate or overwrite content. Homepage, competition pages, member directory heading description, and member details all participate in the change.

## Task 6 — Keep language names in their own languages

- [x] Centralize the invariant option labels: zh-HK → `中文`, en → `English`, ja → `日本語`.
- [x] Use those labels in every desktop/mobile language menu, independent of the page's locale.
- [x] Preserve active-state styling, localized switcher accessibility instructions, and equivalent-page navigation when switching languages.

Primary files: `apps/web/src/lib/localization.ts`, its tests, and the navigation component consuming `localeNames` (locate during implementation).

Acceptance: on Chinese, English, and Japanese pages, all language menus show the same exact three labels in the same order: 中文, English, 日本語. Switching languages keeps the visitor on the corresponding page where it exists.

## Execution order and verification

Suggested order: Tasks 6 and 3 (copy), Task 4 (directory), Task 2 (portraits), then Task 5 with Task 1 incorporated into the shared renderer. Tasks 2, 3, and 6 are independent. Task 5 must account for Task 4's query/type changes.

- [x] Read applicable `AGENTS.md` instructions and Sanity guidance; inspect current git changes before editing. Reconfirm relevant files because this plan may be executed later.
- [x] Run focused tests while implementing; add meaningful coverage for sorting, locale labels, rendering, and content conversion. Update old source assertions affected by the intended behavior.
- [x] Run `pnpm --dir apps/web test`, `pnpm --dir apps/studio test`, and `pnpm run build` once the integrated changes are ready. Report environmental blockers accurately.
- [x] Visually verify at representative mobile (390px) and desktop widths in all three locales: member list, member details, competition overview/results, homepage/hero, and language menus.
- [x] Check Studio authoring plus rendered output for rich formatting, plain legacy content, empty optional translations, long content, and missing portraits.
- [x] Record completed task checkboxes, validation results, remaining content issues, and any authorized rollout steps in this plan. Do not mark a live migration complete from a dry run alone.

Definition of done: all six requested behaviors meet their acceptance criteria, required checks pass or concrete blockers are reported, existing content is preserved, and any outstanding live migration/deployment is clearly distinguished from completed local implementation.

## Implementation record

- Web tests: 87 passed. Studio tests: 23 passed across Node and Vitest suites.
- Web and Studio production builds passed. Studio reported its existing auto-update version warning (local 6.11.0; runtime 6.15.0).
- Sanity dry run completed successfully against project `uw34v0nm`, dataset `production`, in dry mode. It proposed 13 additive field patches across 11 existing documents: eight members, Members Page, Competition (two fields), and Home Page (about text plus one hero description). It performed no writes and reported no failures.
- Desktop and 390px visual checks covered the member directory, Wing Yu profile/logo, Russell Chan paragraph spacing, homepage hero, all three localized competition result pages, and language labels. Studio showed all five formatting controls for Chinese, English, and Japanese.
- Portrait source images are square, so `object-fit: contain` creates letterboxing inside the 9:13 frame. This keeps the full portrait and embedded logo visible without distorting the source or overriding editorial crop data.
- Live migration and deployment remain rollout steps and were not executed.

## Follow-up style regression review

- Confirmed that RichText discarded parent `data-astro-cid-*` attributes, preventing existing scoped typography, spacing, and red borders from matching its wrapper.
- Forwarded remaining Astro props to the root element; existing page styles now apply without global CSS overrides.
- Added `node apps/web/scripts/check-rich-text-scopes.mjs` (run after the web build). Verified all 45 rendered rich-text sections across three locales retain their parent styling scope.
- Re-ran all 87 web tests and the 39-page web build successfully. Browser computed styles confirmed the biography's rose text and red top divider, hero's translucent white text and red left border, and About text color.

## Suggested later goal-mode prompt

> Implement the tasks in `.plans/member-content-and-localization-feedback.md`, using its working assumptions. Keep the plan current, verify all three locales on mobile and desktop, and report tests and remaining rollout steps. Prepare and dry-run any content migration; do not mutate the live CMS or deploy without separate authorization.
