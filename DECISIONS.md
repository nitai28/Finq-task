# DECISIONS.md

## 1. No Zustand — React Query cache + location.state instead

Zustand was considered for cross-screen state but was dropped entirely once the data model was reasoned through.
Random user profiles are fetched once and cached by TanStack Query with `staleTime: Infinity` — they don't need a separate client store.
Navigation context (did this profile come from Screen 1 or Screen 2?) is passed via React Router's `location.state`, which is the idiomatic mechanism for exactly this: data scoped to a single navigation event.
`queryClient.setQueryData` is used to patch the random users cache when a name is edited in Screen 3, keeping the update co-located with the data it mutates.
**Tradeoff:** `location.state` is lost on hard refresh — the profile data lives in session memory only. In production I'd persist the random user list to `sessionStorage` or fetch the profile by ID from the backend as a fallback.

## 2. SQLite over Postgres

SQLite (via `better-sqlite3`) is zero-config, file-based, and has a synchronous API that keeps the route handlers straightforward without async DB calls.
Postgres setup (Docker, connection string, migrations, connection pool) would consume a significant chunk of the 4-hour budget without demonstrating anything the spec is actually evaluating.
**Tradeoff in production:** SQLite does not support multiple concurrent writers or horizontal scaling. I'd swap it for Postgres with a connection pool (pg + node-postgres) in a real service. The schema and query layer are thin enough that migration is a small lift.

## 3. login.uuid as primary key

randomuser.me returns a stable `login.uuid` per user. Using it as the DB primary key means the frontend always has the ID it needs for `PUT /api/profiles/:id` and `DELETE /api/profiles/:id` without an extra round-trip after `POST`.
Side benefit: the backend returns `409 Conflict` on a duplicate `POST`, which is a natural guard against the edge case where a user tries to save the same profile twice from Screen 1.

## 4. Two instant filter inputs (name + country)

Two separate inputs — one for name, one for country — are clearer than a single combined input for two independent dimensions.
No debounce: the filter runs client-side against a list of 10 items. There is no network call to throttle, so debouncing adds latency with no benefit.

## 5. BiDi — RTL container with per-element LTR overrides

Screen 3 has `dir="rtl"` on the form container. Hebrew labels align right, layout flows right-to-left.
Email, phone, street number, and the editable name fields get explicit `dir="ltr"` + `text-align: left` so caret movement, placeholder rendering, and pasted content behave predictably for Latin/numeric data inside an RTL form.
Fixed direction is used instead of `dir="auto"` on all editable inputs — auto-detection can cause visual jumps mid-edit when the browser changes direction on a keystroke.
The button row overrides back to `dir="ltr"` because action buttons follow a left-to-right visual convention regardless of page language.
**Documented tradeoff:** layout is RTL as specified; pixel-perfect typography for deeply mixed strings (e.g. a name with both Hebrew and Latin characters) is out of scope.

## 6. POST returns the full persisted profile (201 + body)

The backend returns the complete saved profile from the DB after `INSERT`, including `created_at`. The frontend gets back exactly what was stored — no state reconstruction needed from two separate pieces, and any future server-added fields come through automatically.

## 7. Extension — Optimistic updates with snapshot rollback

All three mutations (Save, Delete, Update) apply optimistic updates: the UI changes immediately before the server responds.
On error, state is restored from a pre-mutation snapshot and an error toast is shown in Hebrew.
Chosen over a loading skeleton because a skeleton only improves perceived performance during fetch states. Optimistic updates improve the actual interaction — the happy path (which is the common case for low-risk mutations) feels instant.
**What I'd build next:** retry logic on the failed mutation before rolling back, so a transient network error doesn't immediately surface as a failure to the user.

## Corners cut deliberately

- Hard refresh on Screen 3 is unsupported — profile data and navigation source live in session memory only.
- The edge case where a Screen 1 profile has already been saved: the spec uses "came from Screen 1" as a proxy for "not yet in DB" — that proxy breaks after a save-and-back flow. Screen 3 separates the two concerns: `source` carries navigation origin, while `isSaved` is independently derived from the live profiles cache. All button visibility and Update behaviour are driven by `isSaved`, not `source`. As a result `source` is unused in Screen 3's logic — the correct outcome once the two concerns are properly separated.
- No pagination — the spec specifies 10 profiles and makes no mention of loading more.
- No auth, no input sanitisation beyond TypeScript types at the boundary.
