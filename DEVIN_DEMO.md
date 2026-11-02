# Devin demo: Build a small web app from a description

**What it shows:** You describe a small team PTO tracker in plain words. Devin builds it in this near-empty Vite + React repo, writes tests, tests the app in its own browser, and adds a screen recording to the pull request.

**Needs:** GitHub only

More demos: [devin-advanced-demos](https://github.com/thequantexplorer/devin-advanced-demos)

## Starting state

The repo only has a Vite + React setup and a page with a heading. There are no tests yet:

```text
$ npm test
No test files found, exiting with code 1
```

## Set it up

1. Click **Use this template → Create a new repository**, choose your GitHub account or org as the owner, and keep the name `devin-demo-web-app-from-description`. The prompt below assumes that name. Use the template rather than a fork: pull requests on a fork go to the original repo by default.
2. In Devin, open [**Settings → Connections → GitHub**](https://app.devin.ai/settings/connections/github) and make sure Devin can access the new repository.

## Prompt

Start a new Devin session at [app.devin.ai](https://app.devin.ai) and paste this. Replace `<you>` with your GitHub user or org.

```text
Build a team PTO (time off) tracker in https://github.com/<you>/devin-demo-web-app-from-description. The repo is a near-empty Vite + React app. Read README.md first and follow its rules.

The app should do this:
1. A form to add a time-off request: person's name, start date, end date, and an optional note. If the name is empty or the end date is before the start date, show an error and don't save it.
2. A new request shows as "Pending" with the number of weekdays it covers (Monday to Friday, both dates included).
3. Each pending request has an Approve button and a Deny button.
4. A calendar list shows approved time off grouped by month (for example "March 2027"), earliest first. Denied requests are not in it.
5. Everything is saved in localStorage, so it is still there after a page reload.

Write Vitest tests for the weekday count, the month grouping and the localStorage save and load, plus one component test that adds a request and approves it. Make npm test and npm run build pass, then open a PR.

Then run the app, test it in your browser and record your screen: add two requests, try one invalid request, approve one, deny the other, show the approved one in the calendar list, reload the page and show the data is still there. Add the recording to the PR, with a short list of what you tested.
```

## What to watch

- Devin turns the description into a short plan before it writes code.
- It runs the app and clicks through it in its own browser, not only the tests.

## Done when

- The PR has the app, passing tests and a green CI check.
- The PR has a screen recording of the whole flow, including the reload.
