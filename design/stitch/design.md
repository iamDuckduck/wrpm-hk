---
name: Apex Mahjong Pro
colors:
  surface: "#131313"
  surface-dim: "#131313"
  surface-bright: "#393939"
  surface-container-lowest: "#0e0e0e"
  surface-container-low: "#1b1b1b"
  surface-container: "#1f1f1f"
  surface-container-high: "#2a2a2a"
  surface-container-highest: "#353535"
  on-surface: "#e2e2e2"
  on-surface-variant: "#e9bcb6"
  inverse-surface: "#e2e2e2"
  inverse-on-surface: "#303030"
  outline: "#af8782"
  outline-variant: "#5f3f3b"
  surface-tint: "#ffb4aa"
  primary: "#ffb4aa"
  on-primary: "#690003"
  primary-container: "#e60012"
  on-primary-container: "#fff7f6"
  inverse-primary: "#c0000d"
  secondary: "#c8c6c5"
  on-secondary: "#313030"
  secondary-container: "#474746"
  on-secondary-container: "#b7b5b4"
  tertiary: "#ffb3b0"
  on-tertiary: "#68000f"
  tertiary-container: "#e11732"
  on-tertiary-container: "#fff7f6"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#ffdad5"
  primary-fixed-dim: "#ffb4aa"
  on-primary-fixed: "#410001"
  on-primary-fixed-variant: "#930007"
  secondary-fixed: "#e5e2e1"
  secondary-fixed-dim: "#c8c6c5"
  on-secondary-fixed: "#1c1b1b"
  on-secondary-fixed-variant: "#474746"
  tertiary-fixed: "#ffdad8"
  tertiary-fixed-dim: "#ffb3b0"
  on-tertiary-fixed: "#410006"
  on-tertiary-fixed-variant: "#93001a"
  background: "#131313"
  on-background: "#e2e2e2"
  surface-variant: "#353535"
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 64px
    fontWeight: "800"
    lineHeight: "1.1"
    letterSpacing: -0.04em
  headline-xl:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: "700"
    lineHeight: "1.2"
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: "700"
    lineHeight: "1.2"
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: "1.6"
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: "1.5"
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: "600"
    lineHeight: "1.4"
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: "500"
    lineHeight: "1.4"
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-padding: 80px
---

## Brand & Style

This design system is built for the high-stakes environment of professional Mahjong leagues. It adopts a **High-Contrast / Bold** style with a dark cinematic foundation. The visual language is aggressive yet disciplined, mirroring the precision required in the game.

Key attributes include:

- **Tension & Energy:** High-value reds against deep blacks create a sense of immediate competitive urgency.
- **Modern Precision:** Sharp edges and geometric layouts emphasize the technical nature of professional play.
- **Subtle Depth:** Utilizing glassmorphism for overlays to maintain a modern, "broadcast-style" aesthetic reminiscent of premium sports coverage.
- **Dynamic Movement:** Subtle red-to-black gradients are used to guide the eye toward primary actions and championship standings.

## Colors

The palette is dominated by "Championship Red" and "Obsidian Black."

- **Primary Red (#E60012):** Used for critical calls to action, active states, and brand-defining accents. It symbolizes the intensity of the "Reach" or "Winning Hand."
- **Deep Black & Charcoal:** The background levels are tiered to create depth. Pure black (#000000) is the base, while Dark Charcoal (#1A1A1A) defines containers and interactive surfaces.
- **Glass / Frost:** A semi-transparent dark tint is used for floating navigation and information cards to allow background textures (like the dot-pattern in reference images) to bleed through.
- **Pure White:** Reserved strictly for text and iconography to ensure maximum legibility against dark backgrounds.

## Typography

The typography system prioritizes impact and technical clarity.

- **Sora (Headlines):** A geometric sans-serif with a technical, modern edge. Headlines should use heavy weights (Bold/ExtraBold) to convey authority.
- **Inter (Body):** Used for all long-form content and player bios. It remains neutral and highly legible against dark backgrounds.
- **JetBrains Mono (Labels/Stats):** Used for technical data, scores, and table headers. The monospaced nature reflects the calculated, mathematical side of Mahjong.
- **All-Caps Treatment:** Navigation items and section headers should use uppercase styling with increased letter-spacing to enhance the "Pro League" broadcast feel.

## Layout & Spacing

The layout follows a rigid **12-column fluid grid** for desktop and a **4-column grid** for mobile.

- **Grid Alignment:** Elements should feel "locked" into the grid. Use 1px borders between columns in data-heavy views to simulate a high-tech interface.
- **Information Density:** Keep player lists and tournament brackets dense but organized. Use consistent 8px/16px/32px increments for internal padding.
- **Cinematic Margins:** Use generous vertical section padding (80px+) to allow the "Hero" content (like championship player photos) to breathe.
- **Mobile Reflow:** For the member list, shift from a 4-card row to a single-column stack with horizontal scrolling for "media links."

## Elevation & Depth

Hierarchy is established through tonal layering and light-based effects rather than traditional shadows.

- **Tonal Tiers:** Level 0 is #000000 (Background). Level 1 is #1A1A1A (Cards). Level 2 is the Glassmorphic overlay (Backdrop blur 12px, 20% opacity white border).
- **Glassmorphism:** Use for navigation bars and modal popups. Apply a 1px border with a subtle gradient (top-left: white 10% to bottom-right: white 0%) to give the glass a "blade" edge.
- **Inner Glows:** For primary buttons and active player cards, use a very subtle inner red glow (2px blur) to simulate an illuminated physical panel.
- **No Shadows:** Avoid soft ambient shadows. Use high-contrast borders (1px) to define space instead.

## Shapes

The shape language is "Soft-Industrial."

- **Corner Radius:** A consistent 4px (Soft) radius is used across most UI components to prevent the design from feeling too "sharp" or "hostile," while maintaining a professional edge.
- **The "Card" Motif:** Player profiles and stats should be housed in containers with 4px or 8px corners.
- **Geometric Accents:** Use 45-degree angled corners (clipped corners) sparingly for decorative elements or "Live" badges to evoke a futuristic, competitive vibe.

## Components

- **Buttons:**
  - _Primary:_ Solid #E60012 with white bold text. Square corners or 4px radius.
  - _Secondary:_ Ghost style with a 1px white or red border and glass background.
- **Cards (Player/Match):**
  - Dark charcoal background (#1A1A1A).
  - Hover state: The 1px border changes from grey to Primary Red, and the player image scales slightly (1.05x).
- **Status Chips:**
  - "Live" or "Final" status indicators. High-contrast white text on a Primary Red background. Use JetBrains Mono for the text.
- **Input Fields:**
  - Dark background with a bottom-only 2px border. Border turns Primary Red on focus.
- **Tables (League Standings):**
  - Zebra striping using #000000 and #1A1A1A.
  - Header row should be Primary Red with white monospaced text.
- **Breadcrumbs:**
  - Minimalist, separated by forward slashes (/). Use Label-sm styling in grey.
