# Torre Engineering Frontend

React/Vite frontend for the Torre Engineering technical test.

## Features

- Search jobs by keyword.
- Search people and open genome profiles.
- Save and remove job/profile favorites.
- View most searched terms as a simple analytics chart.
- Cache and invalidate server state with TanStack Query.
- Validate core user journeys with Playwright E2E tests.
- Responsive navigation, dark mode, loading states, empty states, error states, and an app-level error boundary.

## Setup

Create `torre-frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3001
```

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Scripts

```bash
npm run lint
npm run build
npm run test:e2e
npm run preview
```

## Main Pages

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | `HomePage.jsx` | App entry point with quick actions |
| `/jobs` | `JobsPage.jsx` | Job search, pagination, and job favorites |
| `/job/:id` | `JobDetailsPage.jsx` | Job detail view from search state |
| `/search` | `SearchPeople.jsx` | People search, genome links, and profile favorites |
| `/people` | `PeoplePage.jsx` | Favorites dashboard for people and jobs |
| `/genome/:username?` | `GenomePage.jsx` | Public genome lookup |
| `/analytics` | `AnalyticsPage.jsx` | Most searched terms chart |

## API Configuration

All frontend API calls go through `src/services/api.js`, which reads:

```js
import.meta.env.VITE_BACKEND_URL
```

If the variable is missing, it falls back to `http://localhost:3001`.
