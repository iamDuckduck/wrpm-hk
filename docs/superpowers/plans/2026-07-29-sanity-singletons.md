# Sanity Singleton Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose exactly one Site Settings document and one Home Page document through direct Studio navigation, then let the editor publish temporary zh-HK homepage content.

**Architecture:** Add a focused Structure resolver that opens `siteSettings` and `homePage` with fixed document IDs. Filter those schema types from the generic document list and from normal new-document actions, while leaving ordinary document types such as `integrationTest` unchanged.

**Tech Stack:** Sanity Studio 6, TypeScript, `sanity/structure`.

## Global Constraints

- Fixed IDs are `siteSettings` and `homePage`.
- Do not delete the temporary `integrationTest` schema or document.
- Do not create homepage content through a randomly generated document ID.
- Keep publishing and image entry as manual editor actions in Studio.
- Preserve the existing Sanity 6.7 dependency update.

---

### Task 1: Add the singleton Structure resolver

**Files:**
- Create: `apps/studio/structure.ts`
- Modify: `apps/studio/sanity.config.ts`

**Interfaces:**
- Produces `structure`, a `StructureResolver` passed to `structureTool`.
- Opens fixed documents `siteSettings` and `homePage`.

- [ ] Create direct Site Settings and Home Page list items.
- [ ] Filter both schema types from `documentTypeListItems()`.
- [ ] Pass the resolver to `structureTool({structure})`.
- [ ] Filter singleton templates from normal new-document options.
- [ ] Run `pnpm run build:studio` and require exit code 0.

### Task 2: Verify editor behavior and publish sample content

**Files:**
- Modify: none unless Studio verification exposes a structure defect.

**Interfaces:**
- Consumes the direct singleton entries.
- Produces published `siteSettings` and `homePage` documents in the production dataset.

- [ ] Confirm direct singleton entries appear after Studio refresh.
- [ ] Confirm no duplicate Site Settings or Home Page creation option appears.
- [ ] Enter `WRPM 香港分部` in Site Settings zh-HK organization name.
- [ ] Add at least one Home Page hero slide with image, alt text, zh-HK title, and zh-HK description.
- [ ] Enter zh-HK About heading and About text.
- [ ] Confirm required-field validation blocks incomplete content.
- [ ] Publish both documents.
- [ ] Record fixed IDs and sample values in WRPM-11.

## Self-review

- The plan changes only Studio structure and document creation behavior.
- It preserves ordinary documents and existing schema work.
- It separates code verification from manual content publishing.
