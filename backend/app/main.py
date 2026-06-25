from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal

# --- SAFE MODEL IMPORT ---
User = None
try:
    # We try to find where your User/Manager model might be hidden
    from app.database import User 
except ImportError:
    try:
        from app.models import User
    except ImportError:
        User = None # If it's not found, we set it to None

# --- ROUTER IMPORTS ---
from app.routes.upload import router as upload_router
from app.routes.candidate import router as candidate_router
from app.routes.ranking import router as ranking_router
from app.routes.job_description import router as job_router
from app.routes.health import router as health_router
from app.routes.history import router as history_router
from app.routes.reports import router as reports_router
from app.routes.analytics import router as analytics_router

# 1. CREATE TABLES
# This creates all tables defined in your database.py (like Candidates)
Base.metadata.create_all(bind=engine)

def seed_database():
    """Only seeds if a User model was actually found."""
    if User is None:
        print("ℹ️ SKIP SEEDING: No User model found in database.py or models.py")
        return

    db = SessionLocal()
    try:
        # Check if the admin account is already there
        admin_user = db.query(User).filter(User.email == "admin@gmail.com").first()
        if not admin_user:
            print("🌱 SEEDING: Creating default admin account...")
            new_admin = User(
                email="admin@gmail.com", 
                password="password123" 
            )
            db.add(new_admin)
            db.commit()
            print("✅ SEEDING COMPLETE: Login with admin@gmail.com / password123")
    except Exception as e:
        print(f"⚠️ Seeding skipped: {e}")
    finally:
        db.close()

# Execute seeding safely
seed_database()

# 2. APP INITIALIZATION
app = FastAPI(title="AI Resume Screener Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. INCLUDE ROUTERS
app.include_router(health_router)
app.include_router(upload_router)
app.include_router(candidate_router)
app.include_router(ranking_router)
app.include_router(job_router)
app.include_router(history_router)
app.include_router(reports_router)
app.include_router(analytics_router)