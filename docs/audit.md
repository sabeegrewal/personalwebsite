# Site audit and refactor — September 2026

This pass reviewed every source page, layout, stylesheet, script, data file,
build setting, and local asset reference. Its scope was maintainability and
functional correctness, while retaining the current visual design, publication
content, and public page URLs.

These notes describe the initial refactor. The subsequent visual update is
documented in [the design notes](design.md); the screenshot comparisons below
apply to the refactor before that visual update.

## Changes

| Finding | Resolution |
| --- | --- |
| The homepage mixed 17 publications with repeated markup and old commented-out sections. | Moved publication records into `_data/publications.yml` and rendering into one include. The homepage is now 35 lines. |
| Author URLs were duplicated and sometimes inconsistent. | Centralized them in `_data/people.yml`; corrected redundant trailing slashes and the remaining HTTP arXiv link. |
| Contact markup and email addresses were duplicated. | Added one contact include and one email setting in `_config.yml`. |
| Inline JavaScript and numeric IDs controlled section visibility. | Replaced them with native `<details>`/`<summary>` disclosures, including keyboard and no-JavaScript support. |
| An old minified clipboard library was initialized before its button existed. | Replaced it with a deferred script using the browser clipboard API, accessible status messages, and a selectable-email fallback. |
| Most Sass rules styled unused blog, music, and employment sections. | Replaced Sass with one plain CSS file containing the active styles and shared color variables. Removed unused selectors and build warnings. |
| The profile photo had conflicting heights and a nonexistent background image. | Kept its effective dimensions and moved styling into CSS; removed the placeholder request. |
| Markup included a list inside a paragraph, a stray closing list item, obsolete font tags, and a broken unused post layout. | Replaced malformed markup, escaped data in templates, and removed unused layouts. |
| Shared layouts duplicated headings, and the microscope page used the Contact heading. | Added one configurable page layout and restored the microscope heading. |
| Page language, zoom support, descriptive titles, input labels, and photo descriptions were missing. | Added these while retaining the site's typography and spacing. |
| Internal asset links depended on page depth; the PGP link relied on an external keyserver despite a local copy. | Used Jekyll URL filters, linked to the existing public key, and checked local targets. |
| Verification metadata referenced the wrong setting; the sitemap gem was installed but inactive. | Corrected the setting, configured the canonical domain, added canonical URLs, and enabled the existing sitemap plugin. |
| Old data appeared in commented HTML, where Jekyll still evaluated it. | Moved historical records to an excluded `_archive/`; removed the inactive navigation list and commented markup. |
| There was no repeatable content-integrity check. | Added `bundle exec ruby script/check.rb` for data validation, builds, local references, metadata, and duplicate IDs. |

## Validation

- Built with the locked Ruby/Jekyll dependencies without Sass warnings.
- Checked all seven HTML pages and their local asset/link targets.
- Compared saved before/after browser renders at 1280px and 390px widths.
  All 17 publications retain their text, order, bounding boxes, font, and color.
  The desktop homepage, mobile homepage, and desktop contact-page screenshots
  are pixel-identical to their baselines.
- Tested Enter/Space disclosure controls and behavior with JavaScript disabled.
- Tested both contact controls with simulated clipboard success, denied access,
  and unavailable APIs, without changing the system clipboard.
- Checked for browser exceptions, duplicate IDs, and missing images across all
  public pages in Chrome. No exceptions, duplicate IDs, or missing images were found.
- Retained existing PDFs and image files, and checked that development material
  is excluded from the published output.

## Remaining content decisions

- `/projects/` still contains the original placeholder text. Decide whether to
  populate it, redirect it, or retire it in a later content update.
- The microscope pages and public PGP key remain reachable at their existing
  URLs. Confirm whether they should stay public and whether the key is still
  the one you want to share. The key text itself has not been changed.
- Biography, publication status labels, and the CV have been preserved. Their
  factual currency and third-party link availability were not part of this
  source-code refactor.
- The standalone PGP document keeps its original preformatted presentation;
  its long lines require horizontal scrolling on narrow screens.

The site retains its original Inconsolata font from Google Fonts, with local
monospace fallbacks. No new frontend framework or deployment workflow was
introduced. See the design notes for the current visual treatment.
