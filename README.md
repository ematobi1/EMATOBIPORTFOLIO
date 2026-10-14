# Emmanuel Tobi — Developer Portfolio

[![CI](https://github.com/ematobi1/EMATOBIPORTFOLIO/actions/workflows/ci.yml/badge.svg)](https://github.com/ematobi1/EMATOBIPORTFOLIO/actions/workflows/ci.yml)

Full-stack portfolio site with a content-managed backend: projects, skills, experience, and contact messages are stored in MongoDB and edited through an authenticated admin dashboard.

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 19, Tailwind CSS, shadcn/ui (Radix), CRACO |
| Backend  | FastAPI, Motor (async MongoDB), JWT auth with bcrypt |
| Data     | MongoDB |
| CI       | GitHub Actions: backend tests + frontend production build |

## Features

- Projects, skills, experience, and about sections loaded live from the API
- Admin dashboard (CRUD for all content, contact inbox, visitor analytics)
- Contact form with optional SMTP notifications
- Dark/light theme, SEO meta tags, Open Graph, and JSON-LD structured data
- Environment-based CORS allow-list

## Run locally

**Backend** (Python 3.11+, MongoDB running locally):

```bash
cd backend
cp .env.example .env          # set MONGO_URL, DB_NAME, JWT_SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

On first start the admin account is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. API docs: http://localhost:8001/docs

**Frontend** (Node 20, Yarn 1):

```bash
cd frontend
cp .env.example .env          # REACT_APP_BACKEND_URL=http://localhost:8001
yarn install
yarn start                    # http://localhost:3000
```

## Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

## Project structure

```
backend/
  server.py          FastAPI app, CORS, startup/shutdown
  auth.py, auth_api.py   JWT auth and admin user bootstrap
  portfolio_api.py   content, contact, and analytics endpoints
  database.py        Mongo collections and indexes
  tests/             API and auth tests
frontend/
  src/components/    page sections and admin dashboard
  src/services/api.js  API client
```
