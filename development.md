# Generate the site of AS Info

Use [Astro](https://astro.build/).

## Preparation

First, install node.js. And then, do

    cd astro-migration
    npm install

## Launch a local server

Run `dev` to start the development server.

    cd astro-migration
    npm run dev

The site will be available at `http://localhost:4321`.

## Generate a static site

Run `build` to generate a static site.

    cd astro-migration
    npm run build

The static site will be generated in the `./dist/` directory.

## Preview the built site

Run `preview` to preview the built site locally.

    cd astro-migration
    npm run preview

## Sort data files

Run `sort-data` to sort data files. (Run from the project root)

    node scripts/sort-data.js
