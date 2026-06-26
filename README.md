# 🚀 AI Resume Screener & Candidate Ranking Tool

An advanced **AI-powered recruitment platform** that automates resume parsing, intelligent candidate scoring, and ranking using **Mistral AI** and **FastAPI**. The platform transforms multiple PDF resumes into structured candidate rankings within seconds, helping recruiters identify the most suitable candidates efficiently.

---

# 🌐 Live Demo

| Service                  | Link                                            |
| ------------------------ | ------------------------------------------------|
| 🌍 Live Application      | https://ai-resume-screener-fawn-two.vercel.app |
| 📘 Backend API (Swagger) | https://ai-resume-screener-1bmz.onrender.com   |


# 🛠️ Tech Stack
### Frontend
* React.js
* Tailwind CSS
* Vite
* Recharts
### Backend
* FastAPI
* Python
* SQLAlchemy
* SQLite
* PyMuPDF
### AI Engine
* Mistral AI (`mistral-small-latest`)
### Deployment
* Vercel
* Render

# ✨ Features

## 🧠 Intelligent Resume Scoring

* AI-powered candidate evaluation using Mistral AI
* Context-aware skill matching
* Hidden skill inference
* 100-point weighted scoring framework

## 📄 Resume Parsing

* Accurate PDF text extraction using PyMuPDF
* Supports multiple resume formats
* Clean text preprocessing for AI analysis

## 📊 Analytics Dashboard

* Candidate score visualization
* Skill-gap analysis
* Ranking insights
* Interactive charts

## 🗄️ Database Management

* SQLAlchemy ORM
* SQLite database
* Candidate history tracking
* Batch processing support

## 📑 Report Generation

* Export ranked candidates to Excel
* Generate professional PDF reports
* Download candidate summaries

---

# 👥 Team Contributions

## 👨‍💻 Natarajan – AI Integration

* Developed the AI-powered resume scoring engine using Mistral AI
* Implemented retry-and-backoff logic for API rate-limit handling
* Built safe JSON parsing for reliable AI responses
* Integrated the AI engine with the backend and frontend
* Managed deployment on Render and Vercel
* Configured Git workflows and secured API credentials

---

## 🎨 Harshini – Frontend & UI/UX

* Designed and developed the React.js user interface
* Built the Job Description input module
* Developed the Multi Resume Upload interface
* Created recruiter workflow navigation
* Implemented responsive UI using Tailwind CSS

---

## 📄 Madduri Sai Mythili – Resume Parsing & Validation

* Developed the PDF extraction module using PyMuPDF
* Validated the candidate ranking pipeline
* Created automated testing scripts
* Verified extraction accuracy for Skills, Education, and Experience

---

## ⚙️ Konda Yashas Sree – Backend & Database

* Developed REST APIs using FastAPI
* Designed the SQLite database schema
* Integrated SQLAlchemy ORM
* Configured Swagger documentation
* Connected backend services with the frontend and AI engine

---

# 📂 Project Structure

```text
backend/
│
├── app/
│   ├── main.py                 # FastAPI entry point
│   ├── database.py             # Database configuration
│   │
│   ├── ai_logic/
│   │   ├── scorer.py           # AI scoring engine
│   │   └── prompt_templates/   # AI prompts
│   │
│   ├── routes/                 # API endpoints
│   ├── services/
│   │   └── pdf_parser.py       # PDF extraction
│   │
│   └── exports/                # Excel & PDF generators
│
frontend/
│
├── src/
│   ├── App.js
│   ├── context/
│   ├── api/
│   │   └── client.js
│   └── pages/
```

---

# 🚀 Local Installation

## Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔒 Security & Optimization

### Security

* Environment variables managed using `.env`
* API credentials excluded with `.gitignore`
* Secure CORS configuration

### Performance

* Optimized PDF extraction pipeline
* Efficient database operations
* Handles simultaneous processing of 20+ resumes
* Retry-and-backoff mechanism for stable AI API communication

---

# 📌 Project Highlights

* ✅ AI-powered Resume Screening
* ✅ Intelligent Candidate Ranking
* ✅ Hidden Skill Inference
* ✅ Multi Resume Upload
* ✅ Analytics Dashboard
* ✅ Excel & PDF Report Export
* ✅ FastAPI REST APIs
* ✅ React + Tailwind CSS Frontend
* ✅ Cloud Deployment on Render & Vercel

---

# 📜 License

This project was developed as an academic project for educational purposes.

---

# 👨‍💻 Developed By

* Natarajan S
* Harshini
* Madduri Sai Mythili
* Konda Yashas Sree

**Year:** 2026
