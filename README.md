AI Resume Screener & Candidate Ranking Tool 🚀
An advanced, full-stack recruitment platform that automates resume parsing, scoring, and ranking using Mistral AI and FastAPI.
🌐 Live Links
Live Application: https://ai-resume-screener-fawn-two.vercel.app/
Backend API (Swagger): https://ai-resume-screener-1bmz.onrender.com/docs
🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Recharts (Analytics), Vite
Backend: FastAPI (Python), SQLAlchemy (SQLite), PyMuPDF
AI Engine: Mistral AI (mistral-small-latest)
Deployment: Vercel (Frontend) & Render (Backend)
✨ Key Features & "The Rebuild"
This project is a high-performance integration of four specialized modules into one production-ready system.
🧠 Intelligent Scoring: Powered by Mistral-small-latest for high-speed, accurate candidate evaluation.
📂 PDF Extraction: High-fidelity text extraction from complex PDF layouts using PyMuPDF.
📊 Analytics Dashboard: Real-time visualization of candidate match distributions and skill gaps.
🗄️ Relational Persistence: Full history tracking using SQLAlchemy and SQLite for batch analysis.
📑 Professional Export: Instant generation of ranked candidate reports in Excel and PDF formats.
👥 Team Contributions
Natarajan – AI Integration & Project Lead
Mistral AI Core: Implemented the core screening engine using the Mistral-small model, featuring robust 429 rate-limit handling and safe JSON parsing.
System Integration: Spearheaded the "clubbing" of all modules (Parsing, Backend, AI, Frontend) into a unified, high-performance repository.
DevOps & Cloud: Managed the full deployment lifecycle on Render and Vercel, optimized Git workflows, and secured sensitive API credentials.
Harshini – Frontend & UI/UX Lead
Core UI Development: Architected the complete interface using React.js and Tailwind CSS, creating a responsive and component-based design.
Recruiter Modules: Developed the Job Description input system and the multi-resume drag-and-drop upload interface.
Workflow Visualization: Engineered the multi-stage navigation flow (Input → Analysis → Results) to enhance user awareness and usability.
Madduri Sai Mythili – Parsing & Validation Specialist
Extraction Pipeline: Developed the PDF parsing module using PyMuPDF, ensuring clean text extraction from diverse resume formats.
Validation Suite: Designed the candidate ranking pipeline validation and created automated test scripts (main_ai_test.py, run_demo.py).
Data Quality: Verified extraction accuracy for critical sections like Education, Skills, and Experience to ensure high-quality AI input.
Konda – Backend & Database Architect
REST API Development: Built the backend infrastructure using FastAPI, managing all REST endpoints for candidates, rankings, and JD handling.
Database Engineering: Designed the SQLite/SQLAlchemy schema, implementing the JobAnalysis and Candidate models for long-term data persistence.
API Orchestration: Configured Swagger UI and managed the data communication between the AI scoring engine and the frontend dashboard.
📂 Project Structure
code
Text
backend/
  app/
    main.py              # FastAPI app & CORS configuration
    database.py          # SQLAlchemy models (SQLite)
    ai_logic/
      scorer.py          # Mistral-small scoring & Rate-limit handling
      prompt_templates.py # Specialized AI HR prompts
    routes/              # Ranking, History, Reports, and Analytics routes
    services/
      pdf_parser.py       # PyMuPDF extraction engine
    exports/             # Excel & PDF report generators

frontend/
  src/
    App.js               # React Router & Page Routing
    context/             # Centralized AppState (AppContext)
    api/client.js        # Axios production client
    pages/               # Dashboard, Upload, Candidates, History, Analytics
🚀 Local Installation
1. Backend Setup
code
Bash
cd backend
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
2. Frontend Setup
code
Bash
cd frontend
npm install
npm start
🔒 Security & Optimization
Credential Security: Secured via .env files and .gitignore to prevent API key leakage.
CORS Management: Backend restricted to verified frontend origins for secure cross-origin resource sharing.
Performance: Optimized Python I/O operations for simultaneous processing of 20+ candidate resumes.