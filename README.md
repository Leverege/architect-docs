# doc-gen-i

This is a doc generator for interace routes. With a proper .env (`npm run decrypt`), upon running `npm run docs` in this repo, the interface docs will dynamically generate in docs/index.html.

### How it generates

When npm run docs executes it uses the script `scripts/genDocs.js` to run through various directories in the `/assets`. `assets/routes` contains all of the base routes to be applied to the found relationships in the project being analyzed. `assets/schemas`, `/assets/responses`, and `/assets/body` are all strucutures referenced by the routes that are built. To add routes add entries to `assets/routes`. To reference new parameters, request bodys, and schemas you will currently need to edit the genDocs.js script to include these (around Line 100).


