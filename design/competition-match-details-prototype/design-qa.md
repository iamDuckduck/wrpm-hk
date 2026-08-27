# Competition Match Prototype Design QA

## Evidence

- Source of truth: the approved competition match mock supplied for the Product Design checkpoint.
- Comparison: `design-qa-comparison.jpg` places the source and the 1440×1024 implementation capture side by side.
- Responsive captures: `prototype-desktop-1440.jpg` and `prototype-mobile-390.jpg`.
- Automated evidence: `npm test`, `npm run build`, and `npm run test:sites` all pass.

## Checked states

- Desktop at 1440×1024: WRPM shell, vertical Stage timeline, Stage-owned dates, Match Type sections, two-card row, and four-player 2×2 cards.
- Mobile at 390×844: navigation, Stage timeline, stacked cards, and readable four-player layout without horizontal overflow.
- Completed matches: placements, scores, and external match-details action are visible.
- Scheduled and cancelled matches: four player identities remain visible; placement, score, and details action are absent.
- Navigation menu and match-details links were exercised in the local preview; no browser console errors were observed.

## Decisions applied during review

- The source mock showed example per-match times, but the approved product rule is that dates belong only to the Stage. The prototype intentionally omits match-level date/time.
- Every Match is constrained to exactly four Mahjong players.
- Cancelled-match mock data uses realistic names rather than placeholder labels.

## Findings

- P0: none.
- P1: none.
- P2: none.
- P3: none blocking the checkpoint.

## Final result

**passed**
