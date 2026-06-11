import React from "react";
import ScoreRing from "./ScoreRing";

function Bar({ value }) {
  const color =
    value >= 80 ? "bg-emerald-500" : value >= 65 ? "bg-violet-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-1.5 bg-[#21262d] rounded-full overflow-hidden mt-1">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

const recColor = {
  Shortlist: "text-emerald-400",
  Consider: "text-amber-400",
  Reject: "text-red-400",
};

export default function CompareView({ candidates, selectedIds, onClose }) {
  const [a, b] = selectedIds.map((id) => candidates.find((c) => c.rank === id));
  if (!a || !b) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#161b22]/95 backdrop-blur border-b border-[#21262d] px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-[#e6edf3]">Compare Candidates</h2>
          <button onClick={onClose} className="text-[#8b949e] hover:text-[#e6edf3]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Names */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[a, b].map((c) => (
              <div key={c.rank} className="bg-[#0d1117] rounded-xl p-4 border border-[#21262d] flex items-center gap-4">
                <ScoreRing score={c.score} size={60} stroke={5} />
                <div>
                  <p className="font-semibold text-[#e6edf3] text-sm">{c.name}</p>
                  <p className="text-xs text-[#8b949e]">{c.currentRole}</p>
                  <p className={`text-xs font-medium mt-0.5 ${recColor[c.recommendation]}`}>
                    {c.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Score breakdown */}
          <CompareSection label="Overall Score" aVal={a.score} bVal={b.score} isScore />
          <CompareSection label="Skill Match" aVal={a.skillMatch} bVal={b.skillMatch} isScore />
          <CompareSection label="Experience Match" aVal={a.experienceMatch} bVal={b.experienceMatch} isScore />
          <CompareSection label="Education Match" aVal={a.educationMatch} bVal={b.educationMatch} isScore />

          {/* Text rows */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-4 mt-6">
            <TextRow a={a.totalExperience} b={b.totalExperience} label="Experience" />
            <TextRow a={a.education} b={b.education} label="Education" />
          </div>

          {/* Skills */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[a, b].map((c) => (
              <div key={c.rank}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#484f58] mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {(c.skills || []).map((s) => (
                    <span key={s} className="text-[11px] bg-[#21262d] border border-[#30363d] text-[#c9d1d9] px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summaries */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[a, b].map((c) => (
              <div key={c.rank}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#484f58] mb-2">AI Summary</p>
                <p className="text-xs text-[#8b949e] leading-relaxed">{c.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareSection({ label, aVal, bVal }) {
  const aWins = aVal > bVal;
  const bWins = bVal > aVal;
  return (
    <div className="grid grid-cols-[1fr_80px_1fr] items-center gap-2 mb-3">
      <div>
        <div className="flex justify-between text-xs mb-0.5">
          <span className={`font-semibold ${aWins ? "text-emerald-400" : "text-[#c9d1d9]"}`}>{aVal}%</span>
        </div>
        <Bar value={aVal} />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#484f58] text-center">{label}</p>
      <div>
        <div className="flex justify-end text-xs mb-0.5">
          <span className={`font-semibold ${bWins ? "text-emerald-400" : "text-[#c9d1d9]"}`}>{bVal}%</span>
        </div>
        <Bar value={bVal} />
      </div>
    </div>
  );
}

function TextRow({ a, b, label }) {
  return (
    <>
      <p className="text-[13px] text-[#c9d1d9] text-right">{a || "—"}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#484f58] text-center self-center">{label}</p>
      <p className="text-[13px] text-[#c9d1d9]">{b || "—"}</p>
    </>
  );
}
