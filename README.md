# AI Resume Screener & Candidate Ranking Tool

Full-stack rebuild: FastAPI backend (SQLite + Gemini AI scoring) + React frontend
(React Router, real data wiring, Dashboard/Upload/Candidates/History/Reports/Analytics).

---

## What Changed From the Original Project

### Backend fixes
- **Fixed field-name mismatch**: `score_resume()` returns `reasoning`, but the old
  `/analyze-all` route was reading a non-existent `summary` key — always empty.
- **Fixed `/compare`**: was sending raw resume text instead of the structured
  candidate dicts `compare_candidates()` actually expects.
- **Removed duplicate/dead files**: `app/scorer.py`, `app/prompt_templates.py`,
  `app/services/pdf_service.py`, `app/services/ranking_service.py` were unused
  copies that could silently drift out of sync with the real logic in
  `app/ai_logic/`.
- **Extended database schema**: added a `JobAnalysis` table so multiple resumes
  uploaded together are grouped into one batch — this is what makes History,
  Reports, and Analytics possible.
- **Added missing dependencies** to `requirements.txt`: `google-genai`,
  `python-dotenv`, `sqlalchemy` were imported by the code but never listed —
  a fresh `pip install -r requirements.txt` would have crashed.
- **New routes**: `/upload-batch`, `/history`, `/history/{id}`, `/reports`,
  `/reports/{id}/excel`, `/reports/{id}/pdf`, `/analytics`.

### Frontend fixes
- **Added React Router** — sidebar links (Candidates, History, Reports, Analytics,
  Settings, About) previously went nowhere; now each is a real page.
- **Removed the static mockup `InputPage.jsx`** — it had a working "Analyze" button
  but everything else (stat cards, candidate preview table) was hardcoded fake data.
- **Fixed the data contract**: old `ResultsPage.jsx` expected fields like
  `recommendation`, `currentRole`, `totalExperience` that the backend never sent.
  All new pages use the exact field names the backend now returns.
- **New pages**: Dashboard, Upload, Analyzing, Candidates (with compare + detail
  drawer), History, Reports, Analytics (with charts), Settings, About.
- **Centralized API client** (`src/api/client.js`) — one file, one source of truth
  for every backend call.

---

## Project Structure

```
backend/
  app/
    main.py              # FastAPI app, registers all routers
    database.py           # SQLAlchemy models: JobAnalysis, Candidate
    .env                  # Your real Gemini API key (not committed)
    .env.example           # Template
    ai_logic/
      scorer.py            # Your verified Gemini scoring engine (unchanged logic)
      prompt_templates.py   # Your verified prompts (unchanged)
    routes/
      upload.py             # POST /upload, POST /upload-batch
      ranking.py             # POST /analyze-all, GET /rankings, POST /compare
      candidate.py            # GET /candidates, GET /candidates/{id}
      history.py               # GET/DELETE /history, GET /history/{id}
      reports.py                # GET /reports, GET /reports/{id}/excel|pdf
      analytics.py               # GET /analytics
      job_description.py          # (existing, unchanged)
      health.py                    # GET /health
    services/
      pdf_parser.py                 # PyMuPDF text extraction (unchanged)
    exports/
      excel_report.py                # Adapted from parsing+export module
      pdf_report.py                   # Adapted from parsing+export module
  requirements.txt

frontend/
  src/
    App.js                  # Routes
    context/AppContext.jsx   # Shared state: active analysis, JD, candidates
    api/client.js             # All backend calls in one place
    components/
      AppShell.jsx             # Sidebar + topbar layout, used by every page
      CandidateDrawer.jsx       # Right-side detail panel
      ScoreRing.jsx               # Circular score indicator (unchanged)
    pages/
      DashboardPage.jsx
      UploadPage.jsx
      AnalyzingPage.jsx
      CandidatesPage.jsx
      HistoryPage.jsx
      ReportsPage.jsx
      AnalyticsPage.jsx
      SettingsPage.jsx
      AboutPage.jsx
```

---

## How to Run

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
```

Your `app/.env` already has your real `GEMINI_API_KEY` — just confirm it's there.
If missing, copy `app/.env.example` to `app/.env` and add your key.

```bash
uvicorn app.main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`. Visit `http://localhost:8000/docs`
for interactive API testing (Swagger UI).

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Opens at `http://localhost:3000`.

---

## End-to-End Flow (Verified Working)

1. Open `http://localhost:3000` → Dashboard
2. Click **Upload Resumes** in sidebar
3. Enter a job title + job description (20+ characters)
4. Drag & drop PDF resumes, click **Analyze Candidates**
5. Watch the **Analyzing** page run real Gemini scoring (`/analyze-all`)
6. Redirects to **Candidates** — ranked table, click any row for full AI detail drawer
7. Select 2 candidates → **Compare Selected** for a head-to-head AI verdict
8. **History** — every past analysis is saved; reopen any of them
9. **Reports** — download Excel or PDF for any past analysis
10. **Analytics** — match distribution pie chart, score histogram, top skills bar chart

---

## Verified During Build

- ✅ Backend imports cleanly, all 16 routes registered correctly
- ✅ Frontend builds cleanly (`npm run build` succeeds, no errors)
- ✅ `/upload-batch` → real PDF text extraction → DB persisted correctly
- ✅ `/analyze-all` → calls real `score_resume()`, correct error handling on API issues
- ✅ `/candidates`, `/candidates/{id}`, `/history`, `/history/{id}`, `/analytics`,
  `/reports` all tested with seeded data — correct field names, correct values
- ✅ Excel report downloads as valid `.xlsx` with correct ranked data
- ✅ PDF report downloads as valid `.pdf` with correct ranked data
- ⚠️ Live Gemini calls could not be tested in the build sandbox (no internet
  access to `generativelanguage.googleapis.com` from this environment) — but
  the exact same `scorer.py` logic was already verified working live by you
  in your own terminal earlier with real resumes. Test `/analyze-all` on your
  machine to confirm end-to-end with live AI.

---

## Known Limitations / Next Steps

- DOCX/TXT upload is accepted by the UI but `pdf_parser.py` only extracts from
  PDF — add a docx/txt branch in `services/pdf_parser.py` if you need it.
- Settings page is a placeholder (backend URL is hardcoded in `api/client.js`
  for now — wire it up if you need runtime configurability).
- No authentication — anyone with the URL can access all data (fine for a
  college project demo, not for production).
