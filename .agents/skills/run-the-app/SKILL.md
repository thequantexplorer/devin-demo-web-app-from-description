---
name: run-the-app
description: Set up, run and test the Team PTO web app, and check it in the browser before opening or updating a pull request.
---

## Stack

- Vite + React, plain JavaScript (`npm create vite@latest . -- --template react`, then remove the demo content).
- Frontend only. There is no server. Save data in the browser with `localStorage`.
- Plain React and CSS. Do not add other runtime dependencies.
- Tests: Vitest with jsdom and Testing Library (`vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` as dev dependencies). `npm test` runs `vitest run`.
- Put date and storage logic in small functions under `src/` so they can be tested on their own.

## Run

1. Run `npm install`.
2. Run `npm run dev`. Wait for `Local: http://localhost:5173/`.

## Check

1. Run `npm test` and `npm run build`. Both must pass.
2. Open http://localhost:5173 in the browser.
3. Data is saved in `localStorage`. To start from an empty app, run `localStorage.clear()` in the browser console and reload the page.
4. Reload the page once after making changes in the UI, and check that the data is still there.
