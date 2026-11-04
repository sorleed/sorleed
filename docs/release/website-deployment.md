# Website deployment

The documentation site is static and dependency-free. It lives in `website/`.

## Local preview

From the repository root:

```sh
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/website/`.

## GitHub Pages

1. Push `main` to GitHub.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**.
4. Select `main` and folder `/website`.
5. Save.

`website/.nojekyll` disables Jekyll processing.

If the site is served from a subpath, all internal links remain relative and
continue to work.

## Netlify or Cloudflare Pages

- Build command: none.
- Output directory: `website`.
- Node: not required.

## Custom host

Copy `website/` plus the stylesheets it references:

```text
tokens/dist/tokens.css
components/button/button.css
components/input/input.css
components/password-input/password-input.css
components/phone-input/phone-input.css
```

The HTML links use `../tokens/...` and `../components/...`, so either preserve
that directory layout or update the links.

## Post-deployment checks

- Open every page in the navigation.
- Confirm the token and component styles load.
- Tab through the page; focus must be visible.
- Check the site at 320px, 768px and 1280px widths.
- Confirm no mixed-content or missing-asset errors.
- Confirm no analytics or third-party requests.

## What this site is not

- No search index.
- No versioned docs switcher.
- No blog or CMS.
- No server-side rendering.
