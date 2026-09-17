# Visual design — September 2026

The design keeps the site's original personality: Inconsolata, blue links,
plain white background, a thin black portrait border, and blue triangle toggles
beside the section headings. The improvements concentrate on alignment,
readability, and a brighter highlight color.

## Design decisions

- **Keep the familiar typography.** Inconsolata appears throughout. The name
  stays light, section headings and paper titles are bold, and authors keep
  their blue links. Size and weight establish hierarchy without changing the
  site's character. The original 16px body text and 600px content column keep
  the page compact; the 50px gap below the name restores the original header
  proportions.
- **Keep the portrait beside the biography.** The name sits above the
  introduction, with the 140px portrait floated to the right of the opening
  paragraph, as in the original layout. Text uses the full width below the
  photo. On phones, its width is capped at 40% of the column to leave room for
  the text, including when text is enlarged.
- **Add just enough breathing room.** Publication metadata has a 1.3 line height with 1px gaps;
  publications are separated by 18px. The small internal gaps keep each paper
  together, while the larger gap separates it from the next entry.
  Intro paragraphs and profile links share a 12px gap. A nonbreaking space
  keeps Henry Yuen's name together when the introduction wraps.
- **Keep the profile links together.** `[CV]`, `[Google Scholar]`, and `[Email]`
  share one compact row using the same bracket notation as publication links.
  Clicking `[Email]` replaces it with the address and a small `[copy]` button;
  the row wraps naturally on narrow screens. This replaces the homepage's
  bottom Contact section; the old `/contact/` URL remains usable.
- **Make special mentions stand out.** Coverage and awards use raspberry
  (`#c2185b`) alongside the original blue (`#1a0dab`).
- **Keep the LLM era marker quiet.** A pale lavender-gray dashed line separates
  the quantum oracle separation paper from the low-degree tests paper, with a
  small muted label at the right edge. It adds minimal space between the papers
  and keeps the publication numbering continuous.
- **Retain useful interaction improvements.** Native disclosures work with
  the keyboard and without JavaScript. Focus outlines remain visible, hover
  underlines do not shift the page, and the email controls support keyboard
  activation, copy feedback, and manual selection when clipboard access fails.
  Without JavaScript, email is shown in readable `[at]` / `[dot]` form.

The email reveal takes inspiration from
[Chris Donahue's click-to-unscramble interaction](https://chrisdonahue.com/),
using an immediate reveal to keep the interaction small and predictable.
The address is lightly obfuscated in the page source, not kept secret.

These choices apply the grouping and hierarchy principles described by
[Nielsen Norman Group](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)
and the readability considerations in
[web.dev's typography guide](https://web.dev/learn/design/typography/).
[moree.win](https://moree.win/) and [ewintang.com](https://ewintang.com/) were
reviewed as visual references; this design retains this site's own typography
and layout conventions.

## Maintenance

All styles live in `assets/css/main.css`; palette and font variables are at the
beginning. `_layouts/default.html` loads the original Inconsolata family from
Google Fonts with `display=swap`. Local monospace fallbacks keep text readable
if the font cannot load. There is no new frontend framework or build step.

Publication rows use named paragraphs in `_includes/publication.html`, so
spacing is controlled in CSS rather than with line breaks. Content remains in
`_data/publications.yml` and author URLs in `_data/people.yml`.

## Validation

- `bundle exec ruby script/check.rb` checks publication data and all seven pages.
- Browser checks cover widths from 320 to 1280px, enlarged text, font loading,
  portrait alignment, and the restored border and left-side toggles.
- Biography, publication text, ordering, and publication destinations are
  compared against a build saved immediately before the styling revision.
- Keyboard disclosure/reveal controls, no-JavaScript behavior, and clipboard success/fallback
  paths are exercised in Chrome.
- Text colors exceed the 4.5:1 threshold in
  [W3C's contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

The historical standalone PGP document retains its preformatted presentation
and horizontal scrolling, as recorded in `docs/audit.md`.
