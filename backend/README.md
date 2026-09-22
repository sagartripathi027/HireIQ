# HireIQ Backend

FastAPI backend for the HireIQ frontend (`index.html`, `login.html`, `signup.html`,
`dashboard.html`, `jobs.html`, `resume.html`, `profile.html`). Built to match the
exact data shapes `js/app.js`'s API-ready functions already expect
(`registerUser`, `loginUser`, `fetchJobs`, `applyToJob`, `saveJob`, `uploadResume`,
`fetchProfile`, `updateProfile`).

## 1. Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

`.env` defaults to SQLite (`sqlite:///./hireiq.db`) — zero extra setup needed for
local development. To use PostgreSQL instead, edit `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://hireiq_user:hireiq_pass@localhost:5432/hireiq_db
```

(create that database/user first with `createdb hireiq_db` or your usual tooling —
tables are created automatically on first run either way).

## 2. Seed demo data

Loads the same 8 jobs that were hardcoded in the original frontend prototype,
plus the demo login referenced in `login.html`'s hint text:

```bash
python seed.py
```

This creates:
- 8 jobs (Frontend Developer @ Nimbus Labs, Backend Engineer (Python) @ Orbital
  Systems, etc.)
- Demo user: **demo@hireiq.io** / **demo1234**

Safe to re-run — it skips seeding if jobs/the demo user already exist.

## 3. Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

- API base: `http://127.0.0.1:8000/api`
- Interactive docs (Swagger UI): `http://127.0.0.1:8000/docs`

CORS is open to whatever origins you list in `.env`'s `CORS_ORIGINS` — add
wherever you're serving the static frontend from (e.g. VS Code Live Server on
`http://127.0.0.1:5500`).

## 4. Endpoint reference

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account, returns JWT |
| POST | `/api/auth/login` | – | Log in, returns JWT |
| GET | `/api/auth/me` | ✓ | Current user info |
| GET | `/api/profile` | ✓ | Full profile (personal info, skills, education, experience, preferences) |
| PUT | `/api/profile` | ✓ | Partial update — accepts any subset of profile fields |
| GET | `/api/jobs` | ✓ | List jobs; query params: `query, location, experience, type, skill, sort, limit` |
| GET | `/api/jobs/{id}` | ✓ | Single job |
| POST | `/api/jobs/{id}/apply` | ✓ | Apply (idempotent) |
| POST | `/api/jobs/{id}/save` | ✓ | Toggle save/unsave |
| DELETE | `/api/jobs/{id}/save` | ✓ | Explicit unsave |
| POST | `/api/resume/upload` | ✓ | Multipart upload (`resume` field), returns analysis |
| GET | `/api/resume` | ✓ | List uploaded resumes |
| GET | `/api/resume/analysis` | ✓ | Latest resume's analysis |
| GET | `/api/dashboard` | ✓ | All dashboard.html stat cards + recommended jobs + activity in one call |
| GET | `/api/recommendations` | ✓ | Top 6 jobs by match score |
| GET | `/api/skill-gaps` | ✓ | Gaps between profile skills and target-role requirements |

All `✓` endpoints require `Authorization: Bearer <token>`.

## 5. Testing the flow manually

```bash
# 1. Log in as the demo user
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@hireiq.io","password":"demo1234"}'
# -> copy the access_token from the response

TOKEN="paste-token-here"

# 2. Current user
curl http://127.0.0.1:8000/api/auth/me -H "Authorization: Bearer $TOKEN"

# 3. Profile
curl http://127.0.0.1:8000/api/profile -H "Authorization: Bearer $TOKEN"

# 4. Jobs, sorted by match, filtered by location
curl "http://127.0.0.1:8000/api/jobs?sort=match&location=Remote" -H "Authorization: Bearer $TOKEN"

# 5. Apply / save
curl -X POST http://127.0.0.1:8000/api/jobs/1/apply -H "Authorization: Bearer $TOKEN"
curl -X POST http://127.0.0.1:8000/api/jobs/3/save -H "Authorization: Bearer $TOKEN"

# 6. Upload resume
curl -X POST http://127.0.0.1:8000/api/resume/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "resume=@/path/to/resume.pdf"

# 7. Dashboard (all stat cards in one call)
curl http://127.0.0.1:8000/api/dashboard -H "Authorization: Bearer $TOKEN"
```

Or skip curl entirely and use the Swagger UI at `/docs` — click **Authorize**,
paste the token, and every endpoint becomes clickable.

Registering a new account works the same way, just via `/api/auth/register`
with `{name, email, password, skills[], targetRole, experience}`.

## 6. Architecture notes

- **`app/services/`** is intentionally decoupled from the rest of the app:
  `resume_service.py`, `matching_service.py`, and `career_service.py` are all
  rule-based right now (keyword extraction, skill-overlap %, static
  role→skill maps) but every function takes plain data in and returns plain
  data out — swapping in an LLM/embedding provider later only touches these
  three files, never the routers.
- **Profile completion** is recalculated server-side on every `PUT
  /api/profile` (mirrors `computeCompletion()` in the original
  `profile.html` script exactly) rather than trusting whatever the client
  sends.
- **Job "match %"** is *not* stored on the `Job` row — it's computed live per
  request against the requesting user's profile skills, since match is
  inherently a function of (user, job), not a static job property.

## 7. Frontend integration (next step)

`js/app.js` already isolates every future API call behind named functions
with `// FUTURE: fetch(...)` comments. To wire it up:

1. Replace the body of each function (`registerUser`, `loginUser`,
   `fetchJobs`, `applyToJob`, `saveJob`, `uploadResume`, `fetchProfile`,
   `updateProfile`) with the corresponding `fetch()` call shown in its
   comment, adding `Authorization: Bearer <token>` once a token exists.
2. Store the JWT (e.g. in `localStorage` under a new `hireiq_token` key)
   instead of the current `hireiq_session` object, returned from
   `/api/auth/login` and `/api/auth/register`.
3. Two spots read `localStorage` **directly**, bypassing `app.js`'s helpers,
   and need to switch to reading from API responses instead:
   - `dashboard.html`: replace the two lines reading
     `hireiq_applied_jobs` / `hireiq_saved_jobs` with the counts already
     included in the `GET /api/dashboard` response
     (`totalApplications`, `savedJobsCount`).
   - `jobs.html`: replace `getSavedIds()` / `getAppliedIds()` (which read
     localStorage) with the `saved` / `applied` booleans already included on
     each job object returned by `GET /api/jobs`.
4. `logoutUser()` just needs to clear the token key instead of
   `hireiq_session` — no backend endpoint needed for logout with JWTs.

Everything else in `app.js` (toasts, modals, nav toggles, `renderMatchMeter`,
validation helpers) is pure UI and needs no changes.
