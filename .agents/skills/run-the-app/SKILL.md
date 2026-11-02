---
name: run-the-app
description: Install, run and test the Team PTO app, and check it in the browser before opening or updating a pull request.
---

## Setup

1. Run `npm install`.
2. Run `npm run dev`. Wait for `Local: http://localhost:5173/`.

## Check

1. Run `npm test` and `npm run build`. Both must pass.
2. Open http://localhost:5173 in the browser.
3. Data is saved in `localStorage`. To start from an empty app, run `localStorage.clear()` in the browser console and reload the page.
4. Reload the page once after making changes in the UI, and check that the data is still there.
