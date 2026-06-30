# Server

Node + TypeScript + Express + SQLite backend.

## Prerequisites

- Node 18+
- npm 9+

## Install

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Server starts on `http://localhost:3001`.

The SQLite database file is created automatically at `data/profiles.db` on first run.

## Build + Run (production)

```bash
npm run build
npm start
```

## Environment variables

| Variable        | Default                    | Description              |
|-----------------|----------------------------|--------------------------|
| `PORT`          | `3001`                     | Port to listen on        |
| `CLIENT_ORIGIN` | `http://localhost:5173`    | Allowed CORS origin      |

## API

| Method | Path                  | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/profiles`       | List all saved profiles  |
| POST   | `/api/profiles`       | Save a new profile       |
| PUT    | `/api/profiles/:id`   | Update name fields       |
| DELETE | `/api/profiles/:id`   | Delete a profile         |

## Project structure

```
src/
├── index.ts          # Express entry point
├── db/
│   └── database.ts   # SQLite init + singleton
├── routes/
│   └── profiles.ts   # Route handlers
└── types/
    └── profile.ts    # Shared types
```
