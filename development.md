# Generate the site of AS Info

Use [Astro](https://astro.build/).

## Preparation

First, install node.js. And then, do

    npm install

## Launch a local server

Run `dev` to start the development server.

    npm run dev

The site will be available at `http://localhost:4321`.

## Generate a static site

Run `build` to generate a static site.

    npm run build

The static site will be generated in the `./docs/` directory.

## Generate a static site with relative links

Set `PUBLIC_RELATIVE_LINKS=1` to output relative links for the site.

    PUBLIC_RELATIVE_LINKS=1 npm run build

## Preview the built site

Run `preview` to preview the built site locally.

    npm run preview

## Share a preview of a pull request

Cloudflare Pages hosts a review environment for this repository. Each pull request
gets its own URL, and production (waic.jp and GitHub Pages) is not affected.

Ask a WG2 maintainer for access to the Cloudflare account that owns the
`as-info-preview` project, then sign in once:

    npx wrangler login

Set `PUBLIC_RELATIVE_LINKS=1` before building. Without it, `NODE_ENV=production`
makes links relative to `/docs/as/info/` and every internal link breaks.

    PUBLIC_RELATIVE_LINKS=1 npm run build
    npx wrangler pages deploy docs --project-name=as-info-preview --branch=preview/<slug>

Always prefix the branch with `preview/`. Deploying to the production branch replaces
`https://as-info-preview.pages.dev/`. The URL of a preview deployment is:

    https://preview-<slug>.as-info-preview.pages.dev/

The branch alias is limited to 28 characters of the subdomain, so keep `<slug>` short
(about 20 characters). A deployment is public by default; enable Cloudflare Access on
the project to restrict it.

## Sort data files

Run `sort-data` to sort data files. (Run from the project root)

    npx tsx scripts/sort-data.ts
