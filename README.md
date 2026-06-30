# User Profiles — Full Stack App

A full-stack app that fetches random user profiles from [randomuser.me](https://randomuser.me/) and lets you browse, filter, edit, and persist a subset of them.

---

## Project structure

```
finq/
├── client/          # React frontend
├── server/          # Node backend
├── DECISIONS.md     # Architecture & tradeoff notes
├── AI_USAGE.md      # AI tool disclosure
└── README.md        # This file
```

---

## Prerequisites

- **Node 18+**
- **npm 9+**

---

## Running the app

Both sides must run at the same time. Open two terminal tabs.

### Terminal 1 — Server

```bash
cd server
npm install
npm run dev
```

The server starts on **http://localhost:3001**.  
A SQLite database file is created automatically at `server/data/profiles.db` on first run — no setup required.

### Terminal 2 — Client

```bash
cd client
npm install
npm run dev
```

The client starts on **http://localhost:5173**.  
All `/api/*` requests are proxied to the server automatically in development — no environment variables needed.

---

## What the app does

### Screen 0 — Home
Entry point with two buttons:
- **Fetch** — loads 10 random profiles from randomuser.me and opens the list
- **History** — opens the list of profiles you have saved to the database

### Screen 1 — Random Profiles
Displays the 10 fetched profiles. Each row shows a thumbnail, full name, gender, country, and phone.  
Filter by name and country using the two inputs at the top (instant, client-side).  
Click any row to open the profile detail.

### Screen 2 — Saved Profiles
Same layout as Screen 1, but data comes from the backend database.  
Shows an empty state with a shortcut to fetch profiles when nothing has been saved yet.

### Screen 3 — Profile Detail
Full profile view with:
- Large photo
- Editable name field (title + first + last)
- Age and year of birth
- Full address (street, city, state, country)
- Email and phone

**Buttons (conditional on where you navigated from):**

| Button | When visible | What it does |
|--------|-------------|--------------|
| Save   | Profile not in saved cache (`!isSaved`) | Persists profile to the backend |
| Delete | Profile in saved cache (`isSaved`) | Removes profile from the backend |
| Update | Always (enabled only when name changed) | If saved: updates the backend. If not: updates the in-memory list |
| Back   | Always | Returns to the previous screen |

All mutations use **optimistic updates** — the UI changes immediately and rolls back with an error toast if the server call fails.

**BiDi (bidirectional text):** The form layout is RTL with Hebrew labels. Email, phone, street number, and the name input are explicitly forced LTR so editing behaviour is predictable for Latin/numeric data inside an RTL container.

---

## Backend

### Stack
Node + TypeScript + Express + SQLite (`better-sqlite3`)

### API surface

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/api/profiles`       | Returns all saved profiles         |
| POST   | `/api/profiles`       | Saves a new profile (409 if exists)|
| PUT    | `/api/profiles/:id`   | Updates title, first, last name    |
| DELETE | `/api/profiles/:id`   | Deletes a profile                  |

The profile `id` is the `login.uuid` provided by randomuser.me — stable, unique, and already available on the frontend when making PUT/DELETE calls.

### Project structure

```
server/
├── src/
│   ├── index.ts          # Express entry point, CORS, JSON middleware
│   ├── db/
│   │   └── database.ts   # SQLite singleton, schema init
│   ├── routes/
│   │   └── profiles.ts   # Route handlers for all 4 endpoints
│   └── types/
│       └── profile.ts    # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

---

## Frontend

### Stack
React 18 + TypeScript + Vite + TanStack Query v5 + React Router v6 + Tailwind CSS

### State model

| What | Where |
|------|-------|
| 10 random users | TanStack Query cache (`staleTime: Infinity`) |
| Saved profiles from backend | TanStack Query (server state) |
| In-memory name edits | `queryClient.setQueryData` patches the cache |
| Navigation source for Screen 3 | React Router `location.state` |
| Name being typed | Local `useState` in Screen 3 |

No Zustand — the data model doesn't need a separate client store once server state and navigation state are handled by the right tools.

### Project structure

```
client/
├── src/
│   ├── main.tsx                         # Entry point
│   ├── App.tsx                          # Router + QueryClient provider + Toaster
│   ├── index.css                        # Tailwind base
│   ├── types/
│   │   └── user.ts                      # Profile, RandomApiUser, Source, mapper
│   ├── api/
│   │   └── profiles.ts                  # Axios calls to the backend
│   ├── hooks/
│   │   ├── useRandomUsers.ts            # Fetch + cache random profiles
│   │   ├── useProfiles.ts               # CRUD mutations with optimistic updates
│   │   └── useProfileDetail.ts          # Screen 3 state, mutations, derived values
│   ├── components/
│   │   ├── FilterBar.tsx                # Name + country filter inputs
│   │   ├── UserRow.tsx                  # Single list row
│   │   ├── UserList.tsx                 # Filtered list, loading skeleton, error state
│   │   ├── ProfileCard.tsx              # Screen 3 RTL form card
│   │   └── ProfileActions.tsx           # Screen 3 conditional action buttons
│   └── screens/
│       ├── HomeScreen.tsx
│       ├── RandomListScreen.tsx
│       ├── SavedProfilesScreen.tsx
│       └── ProfileDetailScreen.tsx      # Layout only — composes hook + components
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Design decisions

See [DECISIONS.md](./DECISIONS.md) for the full rationale on every architectural choice made during development.
