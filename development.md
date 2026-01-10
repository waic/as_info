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

## Preview the built site

Run `preview` to preview the built site locally.

    npm run preview

## Sort data files

Run `sort-data` to sort data files. (Run from the project root)

    npx tsx scripts/sort-data.ts
