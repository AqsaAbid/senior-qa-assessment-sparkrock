# UI Test Design and Strategy — SauceDemo

**Application:** https://www.saucedemo.com/  
**Framework:** Playwright Test + JavaScript  
**Assessment focus:** Risk-based UI coverage, precise test cases, maintainable automation, and demonstrable execution.

## 1. Scope and rationale

The application simulates an e-commerce purchasing journey. The highest business risks are inability to authenticate, inaccurate cart contents, broken checkout validation, and orders that do not complete. Therefore the test suite emphasizes authentication (TC-01/02), cart interactions (TC-07/08), and purchase completion (TC-10/11). Inventory presentation and price sorting are secondary but important to shopping accuracy. Logout and access control check session handling.

### In scope
Login/negative authentication, product listing, sorting, add/remove cart, checkout information, order confirmation, and logout.

### Out of scope
Real payment processing, APIs/back-end persistence, production load/performance, accessibility audit, and external integrations. This is a demo shopping application and these are not represented as verified features.

## 2. Approach

- **Types:** Functional E2E, negative, boundary, UI state, and regression checks.
- **Priorities:** P0 = prevents shopping or authenticating; P1 = important secondary logic/security; P2 = cosmetic enhancements.
- **Design techniques:** Equivalence partitioning for credentials, boundary-value thinking for missing required fields, state transition checks for cart, and end-to-end user journey coverage.
- **Isolation:** Each test starts with a fresh browser context and establishes its own prerequisite state.
- **Selectors:** Prefer application `data-test` attributes, with accessibility-role or visible-text locators where stable.
- **Reliability:** Use Playwright auto-retrying assertions, no fixed delays, clear expected values.
- **Observability:** HTML report, traces and screenshots retained upon failure.
- **Future scaling:** Data-drive credential tests and expand browsers in Playwright config; add CI workflow if required.

## 3. Preconditions and test data

- Base URL: `https://www.saucedemo.com/`
- Valid account: `standard_user` / `secret_sauce` (public demo credentials)
- Locked account: `locked_out_user` / `secret_sauce` (public demo credentials)
- Product: `Sauce Labs Backpack`
- Checkout information: `QA` / `Candidate` / `10001` (synthetic data)
- Assumption: Demo application content, selectors, and wording remain as described; confirm manually before execution.

## 4. Test cases

### TC-01 — Successful login [P0, Positive]
**Precondition:** Login page is open.  
**Steps:** 1. Enter `standard_user`. 2. Enter `secret_sauce`. 3. Click Login.  
**Expected:** User navigates to inventory page and Products heading is visible.

### TC-02 — Invalid password is rejected [P0, Negative, LIVE CODED]
**Precondition:** Login page is open.  
**Steps:** 1. Enter `standard_user`. 2. Enter `incorrect_password`. 3. Click Login.  
**Expected:** Login error appears containing `Username and password do not match`, and user remains on the login page.

### TC-03 — Required login credentials [P1, Negative/Boundary]
**Precondition:** Login page is open.  
**Steps:** 1. Leave username/password empty. 2. Click Login.  
**Expected:** A required-username error displays; no inventory access is granted. Repeat with only username populated to check required password.

### TC-04 — Locked-out account [P1, Negative]
**Precondition:** Login page is open.  
**Steps:** 1. Enter `locked_out_user` and `secret_sauce`. 2. Click Login.  
**Expected:** Locked-out error is shown and access denied.

### TC-05 — Inventory information [P1, Positive]
**Precondition:** Logged in.  
**Steps:** 1. Inspect the Products page. 2. Locate the backpack product card.  
**Expected:** Product name, description, price, and add-to-cart control are displayed.

### TC-06 — Sort products by ascending price [P1, Positive]
**Precondition:** Logged in; inventory page open.  
**Steps:** 1. Select Price (low to high) in product sort menu. 2. Read all displayed prices in order.  
**Expected:** Every consecutive price is greater than or equal to the preceding price.

### TC-07 — Add item to cart [P0, Positive]
**Precondition:** Logged in; inventory page open; cart is empty.  
**Steps:** 1. Add Sauce Labs Backpack. 2. Open cart.  
**Expected:** Cart badge shows `1`; correct product is listed in cart.

### TC-08 — Remove item from cart [P1, State transition]
**Precondition:** Backpack is in cart.  
**Steps:** 1. Remove backpack. 2. Review cart and badge.  
**Expected:** Item disappears from cart, and no item-count badge remains.

### TC-09 — Multiple distinct cart items [P1, Positive]
**Precondition:** Logged in; cart is empty.  
**Steps:** 1. Add backpack and bike light. 2. Open cart.  
**Expected:** Badge shows `2`; both items are present once, with quantity `1` each.

### TC-10 — Complete purchase [P0, End-to-end, LIVE CODED]
**Precondition:** User is on login page and starts with a fresh cart.  
**Steps and expected results:**
1. Enter `standard_user` / `secret_sauce`, click Login → inventory page and Products heading appear.
2. Add Sauce Labs Backpack → cart badge shows `1`.
3. Open cart → cart URL is displayed and Sauce Labs Backpack appears.
4. Click Checkout → checkout information page opens.
5. Enter first name `QA`, last name `Candidate`, postal code `10001`; click Continue → order overview page opens and backpack is shown.
6. Click Finish → checkout completion page appears with `Thank you for your order!`.

### TC-11 — Mandatory checkout information [P0, Negative/Boundary]
**Precondition:** Logged in with a product in cart; checkout information page open.  
**Steps:** 1. Leave first name blank. 2. Populate last name and postal code. 3. Click Continue.  
**Expected:** Required first-name error displays, and user stays on checkout information page. Repeat for last name and postal code separately.

### TC-12 — Checkout financial summary [P1, Calculation]
**Precondition:** Checkout overview page contains one or more known products.  
**Steps:** 1. Capture displayed line-item prices. 2. Compare subtotal against sum of line items. 3. Compare displayed total against displayed subtotal plus tax.  
**Expected:** Monetary values reconcile to the displayed currency precision; rounding is consistent.

### TC-13 — Logout [P1, Session]
**Precondition:** Logged in.  
**Steps:** 1. Open application menu. 2. Click Logout.  
**Expected:** Login page is displayed and product inventory is no longer directly accessible in the current session.

### TC-14 — Unauthorized inventory access [P1, Security-related]
**Precondition:** Fresh unauthenticated session.  
**Steps:** 1. Navigate directly to `/inventory.html`.  
**Expected:** Inventory access is denied and user is returned to login or a clear authentication-required state.

## 5. Traceability and selection rationale

| Business risk / user capability | Covered by | Why included |
|---|---|---|
| Authorized entry / access restriction | TC-01, TC-02, TC-03, TC-04, TC-14 | Prevents inappropriate access, verifies essential entry |
| Accurate product discovery | TC-05, TC-06 | Supports informed product selection |
| Cart state correctness | TC-07, TC-08, TC-09 | Avoids unintended/missing purchases |
| Successful order | TC-10 | Covers main end-to-end business journey |
| Valid customer data | TC-11 | Prevents proceeding with incomplete required details |
| Financial correctness | TC-12 | Identifies misleading totals |
| Session termination | TC-13 | Verifies logout path |

**Why these two live tests:** TC-02 demonstrates a compact negative-path login check and precise error validation; TC-10 validates the highest-value E2E user journey across several pages. The tests are independent and use Page Objects with failure artifacts and deterministic, synthetic inputs.

## 6. Exit criteria

A passing automation run requires that both implemented tests pass without unhandled errors. Record actual execution evidence, browser version, test date, and any known deviations after local execution. Any failure must be documented rather than reported as a pass.
