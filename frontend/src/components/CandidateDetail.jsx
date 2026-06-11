import React from "react";
import ScoreRing from "./ScoreRing";

const recColor = {
  Shortlist: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Consider: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Reject: "text-red-400 bg-red-400/10 border-red-400/20",
};

function StatBar({ label, value }) {
  const color =
    value >= 80 ? "bg-emerald-500" : value >= 65 ? "bg-violet-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-[#8b949e]">{label}</span>
        <span className="text-xs font-semibold text-[#c9d1d9]">{value}%</span>
      </div>
      <div className="h-1.5 bg-[#21262d] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function CandidateDetail({ candidate, onClose }) {
  if (!candidate) return null;
  const rec = candidate.recommendation || "Consider";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg h-screen bg-[#161b22] border-l border-[#30363d] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#161b22]/95 backdrop-blur border-b border-[#21262d] px-6 py-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-[#e6edf3]">{candidate.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${recColor[rec]}`}>
                {rec}
              </span>
            </div>
            <p className="text-sm text-[#8b949e]">{candidate.currentRole}</p>
          </div>
          <button onClick={onClose} className="text-[#8b949e] hover:text-[#e6edf3] transition-colors mt-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Score overview */}
          <div className="flex items-center gap-5 bg-[#0d1117] rounded-xl p-4 border border-[#21262d]">
            <ScoreRing score={candidate.score} size={72} stroke={6} />
            <div className="flex-1 space-y-2.5">
              <StatBar label="Skill Match" value={Math.min(100, candidate.skillMatch || 0)} />
              <StatBar label="Experience Match" value={Math.min(100, candidate.experienceMatch || 0)} />
              <StatBar label="Education Match" value={Math.min(100, candidate.educationMatch || 0)} />
            </div>
          </div>

          {/* Contact info */}
          <Section title="Contact">
            <InfoRow icon="✉️" value={candidate.email || "—"} />
            <InfoRow icon="📞" value={candidate.phone || "—"} />
            <InfoRow icon="📍" value={candidate.location || "—"} />
          </Section>

          {/* Profile */}
          <Section title="Profile">
            <InfoRow icon="💼" label="Experience" value={candidate.totalExperience || "—"} />
            <InfoRow icon="🎓" label="Education" value={candidate.education || "—"} />
          </Section>

          {/* Summary */}
          {candidate.summary && (
            <Section title="AI Summary">
              <p className="text-[13px] text-[#8b949e] leading-relaxed">{candidate.summary}</p>
            </Section>
          )}

          {/* Skills */}
          {candidate.skills?.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s) => (
                  <span key={s} className="text-[12px] bg-[#21262d] border border-[#30363d] text-[#c9d1d9] px-2.5 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Strengths */}
          {candidate.strengths?.length > 0 && (
            <Section title="Strengths">
              <ul className="space-y-1.5">
                {candidate.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[13px] text-[#8b949e]">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Gaps */}
          {candidate.gaps?.length > 0 && (
            <Section title="Gaps / Concerns">
              <ul className="space-y-1.5">
                {candidate.gaps.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-[13px] text-[#8b949e]">
                    <span className="text-amber-400 mt-0.5">⚠</span>
                    {g}
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

function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#484f58] mb-3">{title}</h4>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <span className="w-5 text-center text-sm">{icon}</span>
      {label && <span className="text-[12px] text-[#484f58] w-20 flex-shrink-0">{label}</span>}
      <span className="text-[13px] text-[#c9d1d9] truncate">{value}</span>
    </div>
  );
}
