---
name: design
description: Visual design for the Team PTO app. Read before building or changing any screen.
---

## Direction: calm calendar app

It should feel like a small, well made calendar app (think Apple Calendar or Linear), not a stack of form boxes.

- Font: Geist from Google Fonts (`<link>` in index.html), with `font-variant-numeric: tabular-nums` for dates and counts.
- Colors: page `#F7F7F5`, surfaces `#FFFFFF`, text `#18181B`, secondary `#71717A`, hairlines `#E7E7E3`. Primary button black `#18181B` with white text; secondary buttons white with a hairline border. Error text `#C2410C`.
- People get a color each from this muted set, picked by name so it stays the same: `#5B8DEF`, `#3FA27A`, `#D49A3A`, `#D2694A`, `#5E8C9A`, `#7A8B5A`.
- Layout on desktop (1024 px and wider): a 360 px left column with the "New request" form at the top and the Requests list under it, and the calendar filling the right side. On phones everything stacks: form, requests, calendar.
- The calendar is a real month grid: month name and year as the title with previous / next buttons, a weekday header row, 7 columns, today marked with a thin ring. Approved time off shows as a soft bar in the person's color across the days it covers, with the name on the bar. Weekends are slightly shaded. Under the grid keep the plain "grouped by month" list the spec asks for, styled as a quiet list.
- Requests list: each row has the person's name, the dates and the weekday count, and a status label as small text in a neutral pill ("Pending", "Approved", "Denied"). Approve is a small black button, Deny a small outline button. Denied rows are dimmed.
- Form: labels above fields, 40 px tall fields with 8 px radius and a hairline border, a 2 px focus ring. Errors show under the field they belong to.
- Empty states: "No requests yet" in the list, and an empty calendar grid with "Approved time off shows here" under it.
- Radius 12 px for panels, 1 px hairline borders, no heavy shadows.

States to screenshot: empty app, an invalid request with errors, three requests with one approved, one pending and one denied, the calendar month with the approved bar, phone width.

## Rules for every screen

- One clear visual direction, used everywhere. No default framework or browser look (no unstyled inputs, no default blue links, no stock Material purple).
- Sans-serif type only. Use a real type scale with a few sizes, not many. Large, confident headings; quiet secondary text.
- Mostly neutral colors plus one accent. Use color for meaning (selected, done, error), not decoration. No purple or pink.
- Even spacing on an 8 px grid. Generous margins. Line up edges.
- Every interactive element has hover (or pressed), focus and disabled states.
- Design the empty state, the error state and the full state, not just one.
- Small, quick motion (150 to 250 ms) when things appear, change or finish.
- Support light and dark appearance if the platform has it, and check both.

## Check before you open the pull request

1. Take screenshots of every screen and state in the list above.
2. Look at each one at full size. Fix anything that is misaligned, cramped, clipped, low contrast or looks unfinished.
3. Put the final screenshots in the pull request description.
