# CLAUDE.md

## Project layout

Two independent apps — always treat them separately.

```
client/   React frontend   → http://localhost:5173
server/   Node backend     → http://localhost:3001
```

Run server first, then client. Client proxies `/api/*` to port 3001 via Vite config.

## Running

```bash
# server
cd server && npm run dev

# client
cd client && npm run dev
```

## Server

- Express + TypeScript + `better-sqlite3`
- SQLite file auto-created at `server/data/profiles.db` on first run
- 4 endpoints: `GET /api/profiles`, `POST /api/profiles`, `PUT /api/profiles/:id`, `DELETE /api/profiles/:id`
- Profile `id` is `login.uuid` from randomuser.me — used as primary key everywhere
- POST returns `201 + full profile object` including `created_at`
- POST returns `409` if profile already exists (duplicate guard)
- No auth, no pagination

## Client — state model

There is no Zustand. Do not add it.

| Data | Where |
|------|-------|
| 10 random users | TanStack Query cache, `queryKey: ['randomUsers']`, `staleTime: Infinity`, `gcTime: Infinity` |
| Saved profiles | TanStack Query cache, `queryKey: ['profiles']`, `staleTime: Infinity` |
| In-memory name edits (unsaved profile) | `queryClient.setQueryData(['randomUsers'], ...)` patches the cache directly |
| Profile + navigation origin passed to Screen 3 | `location.state` via React Router |
| Name being typed | Local `useState` in `screens/ProfileDetailScreen.tsx` |
| Last-committed name (post-update baseline) | Local `useState` (`committedName`) in `screens/ProfileDetailScreen.tsx` |

`staleTime: Infinity` on both queries means no automatic background refetches. The profiles cache is invalidated explicitly via `invalidateQueries` in every mutation's `onSettled`.

## Client — Screen 3 (`screens/ProfileDetailScreen.tsx`)

Screen 3 is split across three locations — do not collapse them:
- `hooks/useProfileDetail.ts` — all state, mutations, derived values, handlers
- `components/ProfileCard.tsx` — RTL form card (`Section`, `FormRow`, `NameInput` are private helpers inside this file)
- `components/ProfileActions.tsx` — conditional buttons
- `screens/ProfileDetailScreen.tsx` — layout only, composes the above

`source` in `location.state` carries where the user navigated from (`'list'` or `'history'`). It is **not** used for any logic in Screen 3.

Button visibility and Update behaviour are both driven by `isSaved`:

```ts
const { data: savedProfiles = [] } = useProfiles();
const isSaved = savedProfiles.some((p) => p.id === profile.id);
```

- `!isSaved` → show Save
- `isSaved` → show Delete
- Update → calls backend if `isSaved` (then also patches `RANDOM_USERS_KEY` to keep both caches in sync), patches `RANDOM_USERS_KEY` directly if not saved

`handleUpdate` in `useProfileDetail.ts` returns `Promise<boolean>` (true = success, false = error). On success the screen updates `committedName` to the submitted values, which makes `hasChanges` false and disables the Update button without a page reload. On error the button stays enabled.

`hasChanges` compares current inputs against `committedName`, **not** against the frozen `profile` from `location.state`. This is intentional — `location.state` never updates after navigation.

This correctly handles the edge case where a Screen 1 profile has already been saved and the user navigates back to it.

## Client — optimistic updates pattern

All three mutations (Save, Delete, Update) follow the same pattern for **saved** profiles:

```
onMutate  → snapshot cache, apply optimistic change
onError   → restore snapshot, show Hebrew error toast
onSettled → invalidateQueries (triggers real refetch to sync with server)
onSuccess → show Hebrew success toast
```

Do not move the toast to `onSettled`. Success and error toasts are separate.

After a saved-profile update mutation succeeds, `handleUpdate` also calls `updateRandomUser` to patch `RANDOM_USERS_KEY`. This keeps the random list in sync without an extra network request. If the profile isn't in the random users cache, the patch is a no-op.

## Client — BiDi (Screen 3 only)

Form container: `dir="rtl"`. Labels are in Hebrew.

These fields get explicit `dir="ltr"` + `text-align: left`:
- Email display
- Phone display
- Street number display
- Name inputs (title select, first input, last input)

Button row overrides back to `dir="ltr"`.

Do not use `dir="auto"` on any editable input — it causes cursor jumps during editing.

## Conventions

- Profile type is defined in `client/src/types/user.ts` and mirrored in `server/src/types/profile.ts` — keep them in sync
- Query keys are exported constants (`PROFILES_KEY`, `RANDOM_USERS_KEY`) — always use them, never inline strings
- Tailwind only — no inline styles, no CSS modules
- Disabled buttons use `disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:*` — no hover bleed on disabled state
