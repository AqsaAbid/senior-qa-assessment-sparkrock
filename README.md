# Senior QA Engineer Assessment — SauceDemo

## Tech stack
Playwright Test + JavaScript (Node.js). POM-based UI tests for [SauceDemo](https://www.saucedemo.com/).

## Prerequisites
- Node.js 20+ and npm
- Internet access to SauceDemo

## Setup and execution
```bash
npm install
npx playwright install chromium
npm test
npm run test:headed
npm run report
```

## Coverage demonstrated in live coding
- TC-02 — Invalid login error and access rejection
- TC-10 — Valid login → add backpack → cart verification → checkout → completion

The written design is in `docs/test-design.md`, and the executable test IDs match the documented test cases. Run tests locally and confirm selectors/behavior before recording; the supplied code has not been executed in this environment.

## Project structure
```
├── docs/test-design.md
├── pages/LoginPage.js
├── pages/InventoryPage.js
├── pages/CheckoutPage.js
├── tests/assessment.spec.js
├── playwright.config.js
└── package.json
```

## Design rationale
- Prioritize key revenue and authentication flows.
- Use stable `data-test` selectors to reduce brittleness.
- Use independent browser contexts for each test (Playwright fixture).
- Encapsulate page-specific interactions in Page Objects.
- Use auto-retrying assertions rather than fixed sleeps.
- Capture traces and screenshots on failure and generate HTML reports.

## Submission checklist
- [ ] Review written test plan before recording.
- [ ] Execute both tests successfully on your machine.
- [ ] Record coding process, explanation, and actual test execution.
- [ ] Publish this code and `docs/test-design.md` to a public GitHub repository.
- [ ] Upload video to a viewable platform and verify permission in an incognito window.
- [ ] Submit public repository URL and accessible video URL.

## Submission and recording materials
- `docs/live-recording-script.md` — full spoken narration and exact cues for coding/execution.
- `docs/start-to-finish-guide.md` — macOS setup and submission checklist.
