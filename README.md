# Team PTO

A small team time-off tracker. Add a request, approve or deny it, and see approved time off on a month calendar. Data is kept in the browser's `localStorage`.

Built with Vite + React (plain JavaScript, no other runtime dependencies).

## Run

```sh
npm install
npm run dev     # http://localhost:5173
```

## Check

```sh
npm test        # Vitest (jsdom + Testing Library)
npm run build
npm run lint
```

## Layout

- `src/lib/dates.js` – weekday count, month grouping, validation, calendar helpers
- `src/lib/storage.js` – `localStorage` save and load
- `src/lib/colors.js` – stable per-person colors
- `src/components/` – form, requests list, month calendar, month list

To start from an empty app, run `localStorage.clear()` in the browser console and reload.
