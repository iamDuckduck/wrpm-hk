# Homepage Sanity Schemas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add typed, validated Sanity schemas for the global site settings and CMS-powered homepage while keeping Traditional Chinese required and English/Japanese ready for later.

**Architecture:** Add reusable `localizedString` and `localizedText` object types with required `zhHk` values and optional `en`/`ja` values. Add a `siteSettings` document for global organization data and a `homePage` document containing ordered hero slides and About content. Singleton enforcement and fixed document IDs remain in WRPM-11 Studio structure work.

**Tech Stack:** Sanity 6, TypeScript, `defineType`, `defineField`, and `defineArrayMember`.

## Global Constraints

- Use the existing TypeScript Sanity Studio in `apps/studio`.
- Preserve the disposable `integrationTest` schema until the final Phase 2 verification task.
- Keep the Phase 2 scope limited to settings, hero slides, About content, navigation, and footer data.
- Require Traditional Chinese (`zhHk`) values for content needed by the current MVP.
- Keep English (`en`) and Japanese (`ja`) optional so later localization does not require a schema rewrite.
- Do not add singleton navigation or fixed document IDs in this task; that belongs to WRPM-11.

---

### Task 1: Add reusable localized object types

**Files:**
- Create: `apps/studio/schemaTypes/objects/localized-string.ts`
- Create: `apps/studio/schemaTypes/objects/localized-text.ts`
- Modify: `apps/studio/schemaTypes/index.ts`

**Interfaces:**
- Produces Sanity object types named `localizedString` and `localizedText`.
- Each object exposes `zhHk` as required and `en`/`ja` as optional.

- [ ] **Step 1: Define the expected schema contract**

Confirm the object names, field names, and required-language rule before implementation:

```text
localizedString: zhHk (string, required), en (string, optional), ja (string, optional)
localizedText:   zhHk (text, required),   en (text, optional),   ja (text, optional)
```

- [ ] **Step 2: Implement the two object types**

Use `defineType` and `defineField`; make `zhHk` required and the other language fields optional.

- [ ] **Step 3: Register both object types**

Add both exports to the existing `schemaTypes` array without removing `integrationTest`.

- [ ] **Step 4: Run the Studio build**

Run `pnpm run build:studio` from the repository root. Expected: the schema compiles successfully.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/schemaTypes/objects apps/studio/schemaTypes/index.ts
git commit -m "feat: add localized Sanity field types"
```

### Task 2: Add the Site Settings document schema

**Files:**
- Create: `apps/studio/schemaTypes/documents/site-settings.ts`
- Modify: `apps/studio/schemaTypes/index.ts`

**Interfaces:**
- Produces document type `siteSettings` with `organizationName` using `localizedString` and `logo` using an image field.

- [ ] **Step 1: Define the expected document contract**

```text
siteSettings.organizationName: localizedString, required
siteSettings.logo: image with alt text, optional for the placeholder phase
```

- [ ] **Step 2: Implement the schema**

Use `defineType`, `defineField`, and an image field with an `alt` string field. Require the localized organization name; keep the logo optional because the final asset is not available yet.

- [ ] **Step 3: Register the document type**

Add `siteSettings` to `schemaTypes` while leaving singleton enforcement to WRPM-11.

- [ ] **Step 4: Run the Studio build**

Run `pnpm run build:studio`. Expected: the document schema compiles successfully.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/schemaTypes/documents/site-settings.ts apps/studio/schemaTypes/index.ts
git commit -m "feat: add site settings schema"
```

### Task 3: Add the Home Page document and hero slide schema

**Files:**
- Create: `apps/studio/schemaTypes/objects/hero-slide.ts`
- Create: `apps/studio/schemaTypes/documents/home-page.ts`
- Modify: `apps/studio/schemaTypes/index.ts`

**Interfaces:**
- Produces object type `heroSlide` with image, localized title, localized description, and image alt text.
- Produces document type `homePage` with `heroSlides`, `aboutHeading`, and `aboutText`.

- [ ] **Step 1: Define the expected document contract**

```text
heroSlide.image: image, required
heroSlide.title: localizedString, required
heroSlide.description: localizedText, required
heroSlide.alt: string, required
homePage.heroSlides: array of heroSlide, 1–5 items
homePage.aboutHeading: localizedString, required
homePage.aboutText: localizedText, required
```

- [ ] **Step 2: Implement the hero slide object**

Use `defineType` and `defineField`; require an image, localized title, localized description, and meaningful alt text.

- [ ] **Step 3: Implement the home page document**

Use `defineArrayMember({type: 'heroSlide'})` for the ordered slide array. Require at least one slide and cap the MVP at five slides. Require both About fields.

- [ ] **Step 4: Register the hero slide and home page types**

Add both exports to `schemaTypes` without removing any existing type.

- [ ] **Step 5: Run the Studio build**

Run `pnpm run build:studio`. Expected: all four new types and the existing integration type compile successfully.

- [ ] **Step 6: Commit**

```bash
git add apps/studio/schemaTypes/objects apps/studio/schemaTypes/documents/home-page.ts apps/studio/schemaTypes/index.ts
git commit -m "feat: add homepage and hero slide schemas"
```

### Task 4: Verify schema behavior in Studio

**Files:**
- Modify: none unless validation or labels need correction after inspection.

**Interfaces:**
- Consumes the registered `siteSettings`, `homePage`, and `heroSlide` schemas.
- Produces verified Studio forms ready for WRPM-11 singleton configuration.

- [ ] **Step 1: Start Studio**

Run `pnpm run dev:studio` and open `http://localhost:3333`.

- [ ] **Step 2: Confirm all types appear**

Confirm Studio shows Site Settings, Home Page, and the existing Integration Test type.

- [ ] **Step 3: Verify required-field validation**

Open a Home Page form and confirm empty zh-HK About fields and an empty hero slide are rejected.

- [ ] **Step 4: Verify optional translations**

Confirm `en` and `ja` fields can remain empty without blocking the document.

- [ ] **Step 5: Record the result**

Record schema names, validation behavior, and any labels or descriptions adjusted during inspection in the WRPM-10 Notion task.

---

## Self-review

- Covers reusable localization fields, site settings, hero slides, home page content, registration, and verification.
- Keeps singleton structure and fixed IDs explicitly deferred to WRPM-11.
- Preserves the disposable integration schema for later removal.
- Uses no placeholder implementation steps; every file and command is named.
