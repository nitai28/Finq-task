# Client

React + TypeScript + TanStack Query + React Router + Tailwind CSS frontend.

## Prerequisites

- Node 18+
- npm 9+
- Server running on `http://localhost:3001`

## Install

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

App starts on `http://localhost:5173`. API requests to `/api/*` are proxied to `http://localhost:3001`.

## Build

```bash
npm run build
```

## Project structure

```
src/
├── main.tsx                           # React entry point
├── App.tsx                            # Router + QueryClient provider
├── index.css                          # Tailwind base styles
├── types/
│   └── user.ts                        # Profile, RandomApiUser, Source, mapper
├── api/
│   └── profiles.ts                    # Axios calls to backend
├── hooks/
│   ├── useRandomUsers.ts              # TanStack Query: randomuser.me fetch
│   ├── useProfiles.ts                 # TanStack Query: backend CRUD + optimistic updates
│   └── useProfileDetail.ts            # Screen 3: state, mutations, derived values
├── components/
│   ├── FilterBar.tsx                  # Name + country filter inputs
│   ├── UserRow.tsx                    # Single profile list item
│   ├── UserList.tsx                   # Filtered list with loading/error states
│   ├── ProfileCard.tsx                # Screen 3: RTL form card
│   └── ProfileActions.tsx             # Screen 3: conditional action buttons
└── screens/
    ├── HomeScreen.tsx                 # Screen 0: Fetch / History buttons
    ├── RandomListScreen.tsx           # Screen 1: Random profiles from randomuser.me
    ├── SavedProfilesScreen.tsx        # Screen 2: Saved profiles from backend
    └── ProfileDetailScreen.tsx        # Screen 3: layout only, composes hook + components
```

## Screens

| Route          | Screen                |
|----------------|-----------------------|
| `/`            | Home                  |
| `/list`        | Random profiles       |
| `/history`     | Saved profiles        |
| `/profile/:id` | Profile detail        |
