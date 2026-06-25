from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime

DATABASE_URL = "sqlite:///./resume.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


class JobAnalysis(Base):
    """One 'run' of the screener - a job description + the batch of candidates
    analyzed against it. This is what powers the History and Reports pages."""
    __tablename__ = "job_analyses"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String, default="Untitled Role")
    job_description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    candidate_count = Column(Integer, default=0)

    candidates = relationship(
        "Candidate", back_populates="analysis", cascade="all, delete-orphan"
    )


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("job_analyses.id"), nullable=True)

    filename = Column(String, index=True)
    resume_text = Column(Text)

    candidate_name = Column(String, default="")
    email = Column(String, default="")
    phone = Column(String, default="")
    experience_years = Column(Integer, default=0)

    score = Column(Integer, default=0)
    rating = Column(String, default="")          # Strong Match / Partial Match / Weak Match
    rating_color = Column(String, default="")    # GREEN / YELLOW / RED
    skills_matched = Column(Text, default="")    # comma-separated
    skills_missing = Column(Text, default="")    # comma-separated
    strengths = Column(Text, default="")
    weaknesses = Column(Text, default="")
    reasoning = Column(Text, default="")
    hire_recommendation = Column(String, default="")

    rank = Column(Integer, default=0)
    analyzed = Column(Integer, default=0)  # 0 = uploaded only, 1 = AI-scored

    created_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("JobAnalysis", back_populates="candidates")


Base.metadata.create_all(bind=engine)
