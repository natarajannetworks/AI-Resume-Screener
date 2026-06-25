import React from "react";
import ScoreRing from "./ScoreRing";

const REC_STYLE = {
  "Strongly Recommend": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Recommend": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Consider": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Not Recommended": "text-red-400 bg-red-400/10 border-red-400/20",
};

function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#484f58] mb-3">{title}</h4>
      {children}
    </div>
  );
}

function SkillChip({ label, tone = "neutral" }) {
  const toneClasses = {
    neutral: "bg-[#21262d] border-[#30363d] text-[#c9d1d9]",
    matched: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    missing: "bg-red-500/10 border-red-500/20 text-red-300",
  };
  return (
    <span className={`text-[12px] border px-2.5 py-1 rounded-full ${toneClasses[tone]}`}>
      {label}
    </span>
  );
}

export default function CandidateDrawer({ candidate, onClose }) {
  if (!candidate) return null;

  const recStyle = REC_STYLE[candidate.recommendation] || REC_STYLE["Consider"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg h-screen bg-[#10162a] border-l border-[#1c2333] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-[#10162a]/95 backdrop-blur border-b border-[#1c2333] px-6 py-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-white">{candidate.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${recStyle}`}>
                {candidate.recommendation || "Pending"}
              </span>
            </div>
            <p className="text-sm text-slate-400">{candidate.fileName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors mt-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Score overview */}
          <div className="flex items-center gap-5 bg-[#0d1320] rounded-xl p-4 border border-[#1c2333]">
            <ScoreRing score={candidate.score} size={72} stroke={6} />
            <div className="flex-1">
              <p className="text-[13px] text-slate-300">
                Rank <span className="font-semibold text-white">#{candidate.rank}</span>
              </p>
              <p className="text-[13px] text-slate-300 mt-1">
                Rating: <span className="font-semibold text-white">{candidate.rating || "—"}</span>
              </p>
              <p className="text-[13px] text-slate-300 mt-1">
                Experience: <span className="font-semibold text-white">{candidate.totalExperience}</span>
              </p>
            </div>
          </div>

          {/* Contact */}
          <Section title="Contact">
            <p className="text-[13px] text-slate-300 py-1">✉️ {candidate.email || "—"}</p>
            <p className="text-[13px] text-slate-300 py-1">📞 {candidate.phone || "—"}</p>
          </Section>

          {/* AI Summary */}
          {candidate.summary && (
            <Section title="AI Summary">
              <p className="text-[13px] text-slate-400 leading-relaxed">{candidate.summary}</p>
            </Section>
          )}

          {/* Matched Skills */}
          {candidate.skills?.length > 0 && (
            <Section title="Matched Skills">
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s) => (
                  <SkillChip key={s} label={s} tone="matched" />
                ))}
              </div>
            </Section>
          )}

          {/* Missing Skills */}
          {candidate.missingSkills?.length > 0 && (
            <Section title="Missing Skills">
              <div className="flex flex-wrap gap-2">
                {candidate.missingSkills.map((s) => (
                  <SkillChip key={s} label={s} tone="missing" />
                ))}
              </div>
            </Section>
          )}

          {/* Strengths */}
          {candidate.strengths?.length > 0 && (
            <Section title="Strengths">
              <ul className="space-y-1.5">
                {candidate.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[13px] text-slate-400">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Weaknesses */}
          {candidate.weaknesses?.length > 0 && (
            <Section title="Weaknesses">
              <ul className="space-y-1.5">
                {candidate.weaknesses.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-[13px] text-slate-400">
                    <span className="text-amber-400 mt-0.5">⚠</span>
                    {w}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
