# Visual Explorer — Part 2: Fetch & Render

A plain HTML, CSS and JavaScript image-search app using the Wikimedia Commons API.

## Run locally
1. Extract the ZIP file.
2. Open `index.html` in a browser, or use VS Code Live Server.
3. Search for `cats`, `ocean`, or a two-word phrase such as `new york`.

## Part 2 requirements included
- Form `submit` listener with `event.preventDefault()`
- Reads and trims `input.value`
- Ignores blank searches
- Encodes the search query with `encodeURIComponent(query)`
- Uses `await fetch(url)`, checks `response.ok`, and parses JSON
- Creates an image card per returned result using `document.createElement`
- Appends cards with `appendChild`
- Clears previous results before rendering
- Enhancement: result count, image dimensions, clickable full-size images, and quick-pick chips

## API
Wikimedia Commons API: https://commons.wikimedia.org/w/api.php

No API key is required. The request uses `origin=*` for browser cross-origin access.

## Git feature branch and pull request
From the project folder, after creating your GitHub repository or cloning your Part 1 repository:

```bash
git switch -c part-2-fetch-render
git add .
git commit -m "Add Wikimedia image search and result rendering"
git push -u origin part-2-fetch-render
```

Then open GitHub and create a pull request from `part-2-fetch-render` into `main`.

**Important:** This ZIP is a complete standalone Part 2 example. To satisfy the instruction to continue your exact Part 1 repository, copy these changes into your Part 1 project (or share its files so the original theme/layout and repository structure can be preserved). The ZIP does not create or submit a GitHub pull request for you.
