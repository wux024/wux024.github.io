# Xin Wu's Academic Homepage

This repository contains the source code for Xin Wu's academic homepage, published with GitHub Pages at `https://wux024.github.io`.

The site is based on [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io), with content customized for a personal academic profile.

## Project Structure

- `_config.yml`: site title, author profile, social links, SEO description, and global Jekyll settings.
- `_pages/about.md`: homepage entry point and section order.
- `_pages/includes/intro.md`: short biography.
- `_pages/includes/research.md`: research interests.
- `_pages/includes/pub.md`: selected publications and full publication list.
- `_pages/includes/others.md`: education history.
- `_data/navigation.yml`: top navigation links.
- `assets/css/main.scss`: main style entry and local custom styles.

## Local Development

Install Ruby, RubyGems, Bundler, and the Jekyll dependencies first. Then run:

```bash
bundle install
bundle exec jekyll serve
```

Open `http://127.0.0.1:4000` in a browser.

The helper script `run_server.sh` runs the live-reload server:

```bash
bash run_server.sh
```

## Updating Content

Most homepage edits should be made in `_pages/includes/`:

- Edit `intro.md` for the biography paragraph.
- Edit `research.md` for research interests.
- Edit `pub.md` for selected and full publications.
- Edit `others.md` for education information.

When adding a new homepage section, include it from `_pages/about.md` and add a matching anchor in `_data/navigation.yml` if it should appear in the top navigation.

## Acknowledgements

This site uses AcadHomepage, which incorporates work and assets from Font Awesome, Minimal Mistakes, and Academic Pages under their respective licenses.
