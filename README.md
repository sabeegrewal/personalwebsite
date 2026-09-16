# Sabee Grewal's website

This is a static site built with Jekyll. Local development uses Ruby 3.4 and
Bundler; no Node.js installation is needed.

## One-time setup on macOS

Use a separate Ruby installation, not macOS's built-in `/usr/bin/ruby`.
The project pins its Ruby version in `.ruby-version` and its gem versions in
`Gemfile.lock`.

1. Install the Xcode Command Line Tools if needed:

   ```sh
   xcode-select --install
   ```

   If the tools are already installed, continue to the next step.

2. Install [Homebrew](https://brew.sh/) if needed. Follow its installer’s
   “Next steps” instructions so that `brew` works in your terminal. Then install
   a Ruby version manager:

   ```sh
   brew install rbenv ruby-build
   rbenv init
   ```

   Close and reopen your terminal after `rbenv init` so its shell setup takes
   effect. If you already use another Ruby version manager, use it to install
   and select the version in `.ruby-version` instead.

3. From the root of this repository (the folder containing `Gemfile`), install
   the project's Ruby and Bundler:

   ```sh
   cd /path/to/personalwebsite
   rbenv install -s "$(cat .ruby-version)"
   eval "$(rbenv init - zsh)"
   rbenv rehash
   ruby --version
   which gem
   ```

   Replace `/path/to/personalwebsite` with your checkout's location.
   Initializing rbenv after Ruby is installed and running `rbenv rehash` refreshes
   the shell's command lookup, which can otherwise still select macOS's Ruby.
   These commands assume macOS's default zsh shell; use `bash` instead of `zsh`
   in the `rbenv init` command if you use Bash.

   Before continuing, confirm that `ruby --version` reports `3.4.10` and
   `which gem` points to your `.rbenv/shims/gem`, not `/usr/bin/gem`.
   Then install Bundler:

   ```sh
   gem install bundler -v 4.0.20 --no-document
   ```

4. Install the website's dependencies into this checkout:

   ```sh
   bundle config set --local path vendor/bundle
   bundle install
   ```

   Do not use `sudo` for `gem install` or `bundle install`. The `.bundle/` and
   `vendor/` folders are local, ignored by Git, and excluded from the site.

For Linux or Windows, install Ruby 3.4 with the development tools described in
[Jekyll's installation guide](https://jekyllrb.com/docs/installation/), then run
the Bundler installation and dependency commands above from the repository root.
On Windows, WSL can use the Linux instructions.

## View the site locally

From the repository root, run:

```sh
bundle exec jekyll serve
```

Wait for the server to start, then open **http://127.0.0.1:4000/** in your browser.
Leave the terminal running while you preview the site; press **Ctrl+C** to stop.
Jekyll rebuilds when you save a page, layout, or stylesheet; refresh the browser
to see the change. Restart the server after changing `_config.yml`.

To also refresh the browser automatically:

```sh
bundle exec jekyll serve --livereload
```

## Build without starting a server

```sh
bundle exec jekyll build
```

The generated site goes into `_site/` (ignored by Git). Use the local server to
preview it; opening the generated HTML as a file does not resolve the site's
root-relative asset links correctly.

## Editing the site

The site uses Jekyll templates, YAML data, plain CSS, and a small JavaScript file.
There is no frontend framework or separate asset build step.

The palette and font stacks are defined at the top of `assets/css/main.css`.
The design uses Inconsolata from Google Fonts, with local monospace fallbacks. See the
[design notes](docs/design.md) for the visual choices and their references.

| What you want to change | File |
| --- | --- |
| Bio, profile photo, and homepage links | `index.html` |
| Publications, in display order | `_data/publications.yml` |
| Author website URLs | `_data/people.yml` |
| Name, email, domain, and site description | `_config.yml` |
| Fonts, colors, spacing, and responsive styles | `assets/css/main.css` |
| Shared document structure | `_layouts/default.html` |
| Interior-page heading and back link | `_layouts/page.html` |
| Publication and contact markup | `_includes/` |
| Copy-email behavior | `assets/js/main.js` |
| Contact, microscope, and project pages | `contact/`, `microscope/`, `projects/` |
| CV | `cv.pdf` |

To add a publication, add an entry to the top of `_data/publications.yml`:

```yaml
- title: "A new paper title"
  authors:
    - Sabee Grewal
    - A Coauthor
  venue: "To appear in Conference 2027"
  links:
    - label: arXiv
      url: https://arxiv.org/abs/your-paper-id
```

The list is numbered automatically. Keep authors in publication order. An author
is linked if their exact name appears in `_data/people.yml`; otherwise their
name is rendered as plain text. Add or update their URL there once, and every
publication uses it.

`venue` is optional plain text. Journal papers can also have `journal` and a
numeric `year`; `venue` can then name a conference appearance. Optional `award`
text displays with a trophy. Optional `coverage` uses the same `label`/`url`
entries as `links`. Quote text containing a colon so it remains valid YAML.

The expandable sections use native HTML `<details>` elements. They work without
JavaScript; the `open` attribute determines which sections start expanded.
JavaScript only handles the copy-email button. If clipboard access is blocked,
it selects the email so it can be copied manually.

Historical work, research, teaching, and project data lives in `_archive/`.
It is preserved for reference and excluded from the generated site. See
[the audit notes](docs/audit.md) for the cleanup decisions and remaining content
questions.

## Check changes

```sh
bundle exec ruby script/check.rb
```

This validates publication data, builds the site, and checks every generated
HTML page for duplicate IDs, missing titles, and broken local links or assets.
It also checks that development files and the archive are not published. It
does not request external websites or check whether publication details are current.

Before finishing a visual change, preview both a wide and a narrow browser
window, toggle Research and Contact with the keyboard, and try copying the
email on both the homepage and `/contact/`.

## Troubleshooting

- **Ruby version errors or permission errors under `/Library/Ruby`:** Run
  `which ruby` and `ruby --version` from this folder. With rbenv, Ruby should come
  from its shims and report the version in `.ruby-version`. If Ruby installed
  successfully but commands still use Ruby 2.6, refresh the current shell:

  ```sh
  eval "$(rbenv init - zsh)"
  rbenv rehash
  ruby --version
  which gem
  ```

  Once these select the project's Ruby, repeat the Bundler and dependency
  installation commands. A Bundler error mentioning `/System/Library` or
  `/usr/bin/bundle` has the same cause; do not use `sudo` or change the lockfile
  to work around it. If `rbenv` is not found, complete Homebrew's shell setup
  from step 2 first.
- **Missing gems or Bundler:** Select the project's Ruby, then repeat the
  Bundler and dependency installation commands above. Run `bundle install`
  again after pulling changes to `Gemfile` or `Gemfile.lock`.
- **Port 4000 is already in use:** Run `bundle exec jekyll serve --port 4001`
  and open http://127.0.0.1:4001/ instead.
- **Stale output:** Stop the server, run `bundle exec jekyll clean`, then restart
  it with `bundle exec jekyll serve`.
- **Missing styles after pulling the CSS cleanup:** Stop Jekyll, run
  `bundle exec jekyll clean`, then restart it. The stylesheet is now
  `assets/css/main.css`; the old Sass files are no longer used.

Keep `Gemfile.lock` in version control so subsequent installs use the same
dependency versions. Use `bundle update` only when intentionally updating them.
