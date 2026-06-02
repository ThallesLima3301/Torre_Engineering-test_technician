# Torre Engineering Backend

Express API for the Torre Engineering technical test. It proxies Torre public data, stores favorites, and tracks search analytics.

## Main Responsibilities

- Search Torre opportunities.
- Search Torre people/profiles.
- Fetch public genome data by username.
- Save, list, and delete job/profile favorites.
- Aggregate most searched terms with MongoDB.
- Cache repeated Torre API responses in memory.

## Setup

Create `backend/.env`:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
TORRE_CACHE_TTL_MS=300000
TORRE_CACHE_MAX_ITEMS=100
```

Install and run:

```bash
npm install
npm run dev
```

Production start command:

```bash
npm start
```

Render setup:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI`, `FRONTEND_URL` or `FRONTEND_URLS`

Run tests:

```bash
npm test
```

## Security

`MONGO_URI` is required for favorites and analytics persistence, but it must be supplied as an environment variable. Never commit a real MongoDB URI to the repository.

For local development, set it in `backend/.env`. For Render, set the same key in the Render service environment variables. Use a strong MongoDB Atlas password and keep Atlas Network Access as narrow as practical.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/torre/jobs` | Searches jobs. Body: `{ "term": "developer", "offset": 0, "limit": 10 }` |
| `POST` | `/api/torre/search` | Searches people by text. Body: `{ "text": "developer" }` |
| `GET` | `/api/torre/genome/:username` | Fetches public genome data |
| `POST` | `/api/torre/favorites` | Saves a favorite job or profile |
| `GET` | `/api/torre/favorites?userId=guest&type=profile` | Lists favorites |
| `DELETE` | `/api/torre/favorites/:id` | Deletes a favorite |
| `GET` | `/api/torre/analytics?limit=10` | Returns top searched terms |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/version` | App metadata |

## Architecture

- `src/routes`: HTTP route definitions and validation middleware.
- `src/controllers`: Request orchestration and response shaping.
- `src/services`: Torre API, in-memory cache, favorites, and search analytics logic.
- `src/models`: Mongoose schemas.
- `src/validators`: Express Validator request contracts.
- `__tests__`: Supertest coverage for route contracts.

Security middleware includes rate limiting, controlled CORS origins, request validation, and Helmet security headers.
Torre upstream requests use a bounded in-memory TTL cache. Tune it with `TORRE_CACHE_TTL_MS` and `TORRE_CACHE_MAX_ITEMS`.

## Tests Covered

- Job search contract and validation.
- Torre service filtering and cache reuse.
- Favorite creation and validation.
- Search analytics response shape.
- Health and version routes.
