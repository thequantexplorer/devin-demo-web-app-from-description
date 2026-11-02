# Team PTO

A small web app for a team to track time off (PTO). It is built with [Vite](https://vite.dev) and [React](https://react.dev).

The app is not built yet. Right now it only shows a heading, and there are no tests.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the app at http://localhost:5173 |
| `npm test` | Run the tests with Vitest (jsdom and Testing Library are set up) |
| `npm run build` | Build the app into `dist/` |

## Rules

- Frontend only. There is no server. Save data in the browser with `localStorage`.
- Use plain React and CSS. Do not add new runtime dependencies.
- Put date and storage logic in small functions under `src/` so they can be tested.
- `npm test` and `npm run build` must pass. GitHub Actions runs both on every pull request.

## Starting state

```text
$ npm test
No test files found, exiting with code 1
```

This lab is described in [DEVIN_DEMO.md](DEVIN_DEMO.md).
