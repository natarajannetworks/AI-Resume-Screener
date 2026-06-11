import React, { useEffect, useState } from "react";

const STAGES = [
  { icon: "📄", label: "Parsing PDF files", detail: "Extracting text from resumes…" },
  { icon: "🧹", label: "Cleaning text", detail: "Normalizing and preprocessing…" },
  { icon: "🤖", label: "Sending to Claude AI", detail: "Analyzing each resume against JD…" },
  { icon: "📊", label: "Scoring candidates", detail: "Calculating match scores (0–100)…" },
  { icon: "🏆", label: "Ranking results", detail: "Sorting by score, assigning ranks…" },
];

export default function AnalyzingPage({ fileCount, files }) {
  const [activeStage, setActiveStage] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [currentFile, setCurrentFile] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => {
        if (prev < STAGES.length - 1) {
          setCompleted((c) => [...c, prev]);
          if (prev === 2) {
            setCurrentFile((f) => Math.min(f + 1, fileCount - 1));
          }
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [fileCount]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10">
      {}
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
        <h2 className="text-xl font-semibold text-[#e6edf3]">Analyzing {fileCount} resume{fileCount !== 1 ? "s" : ""}…</h2>
        <p className="text-sm text-[#8b949e] mt-1">Claude AI is reviewing each candidate against your job description</p>
      </div>

      {}
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
        {STAGES.map((stage, idx) => {
          const isDone = completed.includes(idx);
          const isActive = activeStage === idx;
          return (
            <div
              key={idx}
              className={`flex items-center gap-4 px-5 py-3.5 border-b last:border-b-0 border-[#21262d] transition-colors duration-300
                ${isActive ? "bg-violet-500/5" : ""}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm transition-all
                ${isDone ? "bg-emerald-500/20 text-emerald-400" : isActive ? "bg-violet-500/20 text-violet-400" : "bg-[#21262d] text-[#484f58]"}`}>
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
              <div className="flex-1">
                <p className={`text-[13px] font-medium ${isDone ? "text-[#8b949e]" : isActive ? "text-[#e6edf3]" : "text-[#484f58]"}`}>
                  {stage.icon} {stage.label}
                </p>
                {isActive && (
                  <p className="text-[11px] text-violet-400/80 mt-0.5">
                    {idx === 2 && files?.length > 0
                      ? `Processing: ${files[Math.min(currentFile, files.length - 1)]?.name}`
                      : stage.detail}
                  </p>
                )}
              </div>
              {isDone && (
                <span className="text-[10px] text-emerald-500/70 font-medium">Done</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#484f58]">This may take 15–60 seconds depending on resume count</p>
    </div>
  );
}
