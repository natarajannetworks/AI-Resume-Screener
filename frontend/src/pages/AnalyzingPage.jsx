import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useApp } from "../context/AppContext";
import { analyzeAll } from "../api/client";

const STAGES = [
  { icon: "📄", label: "Parsing Resumes" },
  { icon: "🧠", label: "Extracting Information" },
  { icon: "🎯", label: "Matching Skills" },
  { icon: "📊", label: "Calculating Scores" },
  { icon: "🏆", label: "Ranking Candidates" },
  { icon: "📥", label: "Generating Reports" },
];

export default function AnalyzingPage() {
  const navigate = useNavigate();
  const { activeAnalysisId, jobDescription, setCandidates } = useApp();
  const [activeStage, setActiveStage] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [error, setError] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (!activeAnalysisId) {
      navigate("/upload");
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    const interval = setInterval(() => {
      setActiveStage((prev) => {
        if (prev < STAGES.length - 1) {
          setCompleted((c) => [...c, prev]);
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    analyzeAll(activeAnalysisId, jobDescription)
      .then((results) => {
        setCandidates(results);
        setCompleted(STAGES.map((_, i) => i));
        clearInterval(interval);
        setTimeout(() => navigate("/candidates"), 600);
      })
      .catch((err) => {
        clearInterval(interval);
        setError(
          err?.response?.data?.detail ||
          "AI analysis failed. The Mistral AI API may be temporarily busy — please try again."
        );
      });

    return () => clearInterval(interval);
  }, [activeAnalysisId, jobDescription, navigate, setCandidates]);

  return (
    <AppShell title="Analyzing">
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-violet-600/10 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute w-24 h-24 rounded-full bg-violet-600/15 animate-pulse" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-violet-600/40">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-white animate-spin" style={{ animationDuration: "3s" }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">AI is analyzing your resumes…</h2>
          {/* UPDATED TEXT BELOW */}
          <p className="text-sm text-slate-400 mt-1">Mistral AI is reviewing each candidate against your job description</p>
        </div>

        <div className="w-full max-w-md bg-[#10162a] border border-[#1c2333] rounded-2xl overflow-hidden">
          {STAGES.map((stage, idx) => {
            const isDone = completed.includes(idx);
            const isActive = activeStage === idx && !isDone;
            return (
              <div
                key={idx}
                className={`flex items-center gap-4 px-5 py-3.5 border-b last:border-b-0 border-[#1c2333] transition-colors duration-300 ${
                  isActive ? "bg-violet-500/5" : ""
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm transition-all ${
                  isDone ? "bg-emerald-500/20 text-emerald-400" : isActive ? "bg-violet-500/20 text-violet-400" : "bg-[#1c2440] text-slate-500"
                }`}>
                  {isDone ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#30363d]" />
                  )}
                </div>
                <p className={`text-[13px] font-medium ${isDone ? "text-slate-400" : isActive ? "text-white" : "text-slate-600"}`}>
                  {stage.icon} {stage.label}
                </p>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="w-full max-w-md bg-red-500/10 border border-red-500/30 text-red-300 text-[13px] rounded-lg px-4 py-3">
            {error}
            <button onClick={() => navigate("/upload")} className="block mt-2 text-violet-400 hover:underline">
              ← Back to upload
            </button>
          </div>
        )}

        <p className="text-xs text-slate-500">This may take 15–60 seconds depending on resume count</p>
      </div>
    </AppShell>
  );
}