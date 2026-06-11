import React, { useState, useMemo } from "react";
import ScoreRing from "../components/ScoreRing";
import CandidateDetail from "../components/CandidateDetail";
import CompareView from "../components/CompareView";

const recStyle = {
  Shortlist: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Consider: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Reject: "text-red-400 bg-red-400/10 border-red-400/20",
};

const rankBadge = {
  1: "bg-amber-400 text-black",
  2: "bg-[#c0c0c0] text-black",
  3: "bg-[#cd7f32] text-black",
};

export default function ResultsPage({ results, onReset, jobDescription }) {
  const [selected, setSelected] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [sortKey, setSortKey] = useState("rank");
  const [filterRec, setFilterRec] = useState("All");
  const [search, setSearch] = useState("");
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (rank) => {
    setCompareIds((prev) =>
      prev.includes(rank)
        ? prev.filter((r) => r !== rank)
        : prev.length < 2
        ? [...prev, rank]
        : prev
    );
  };

  const sorted = useMemo(() => {
    let list = [...results];
    if (filterRec !== "All") list = list.filter((c) => c.recommendation === filterRec);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.currentRole?.toLowerCase().includes(q) ||
          c.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (sortKey === "score") list.sort((a, b) => b.score - a.score);
    else if (sortKey === "rank") list.sort((a, b) => a.rank - b.rank);
    else if (sortKey === "name") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return list;
  }, [results, filterRec, search, sortKey]);

  const shortlisted = results.filter((c) => c.recommendation === "Shortlist").length;
  const avgScore = Math.round(results.reduce((a, c) => a + c.score, 0) / results.length);

  // ── Export helpers ──────────────────────────────────────────────────────────
  const exportCSV = () => {
    const header = ["Rank", "Name", "Score", "Recommendation", "Role", "Experience", "Education", "Skills", "Summary"];
    const rows = results.map((c) => [
      c.rank, c.name, c.score, c.recommendation, c.currentRole,
      c.totalExperience, c.education, (c.skills || []).join("; "), c.summary,
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v || ""}"`).join(",")).join("\n");
    download("resumeai_results.csv", "text/csv", csv);
  };

  const exportJSON = () => {
    download("resumeai_results.json", "application/json", JSON.stringify(results, null, 2));
  };

  const download = (name, type, content) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Candidates" value={results.length} icon="👥" />
        <StatCard label="Shortlisted" value={shortlisted} icon="✅" accent="emerald" />
        <StatCard label="Average Score" value={`${avgScore}/100`} icon="📊" accent="violet" />
        <StatCard label="Top Score" value={`${results[0]?.score}/100`} icon="🏆" accent="amber" />
      </div>

      {}
      <div className="flex flex-wrap items-center gap-3">
        {}
        <div className="relative flex-1 min-w-[180px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484f58]">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role, skill…"
            className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-9 pr-3 py-2 text-[13px] text-[#c9d1d9] placeholder-[#484f58] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
          />
        </div>

        {}
        <div className="flex items-center gap-1 bg-[#161b22] border border-[#30363d] rounded-lg p-1">
          {["All", "Shortlist", "Consider", "Reject"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterRec(f)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                filterRec === f ? "bg-violet-600 text-white" : "text-[#8b949e] hover:text-[#c9d1d9]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-[13px] text-[#c9d1d9] focus:outline-none focus:border-violet-500"
        >
          <option value="rank">Sort: Rank</option>
          <option value="score">Sort: Score</option>
          <option value="name">Sort: Name</option>
        </select>

        {}
        {compareIds.length === 2 && (
          <button
            onClick={() => setShowCompare(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            ⚖️ Compare 2
          </button>
        )}

        {}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#161b22] border border-[#30363d] hover:border-violet-500/50 rounded-lg text-[12px] text-[#c9d1d9] transition-colors"
          >
            📊 CSV
          </button>
          <button
            onClick={exportJSON}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#161b22] border border-[#30363d] hover:border-violet-500/50 rounded-lg text-[12px] text-[#c9d1d9] transition-colors"
          >
            📋 JSON
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600/20 border border-violet-500/30 hover:bg-violet-600/30 rounded-lg text-[12px] text-violet-300 transition-colors"
          >
            ↺ New Screen
          </button>
        </div>
      </div>

      {}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[40px_44px_1fr_80px_100px_100px_120px_36px] gap-3 px-5 py-3 border-b border-[#21262d] text-[10px] font-semibold uppercase tracking-widest text-[#484f58]">
          <span>Cmp</span>
          <span>Rank</span>
          <span>Candidate</span>
          <span className="text-center">Score</span>
          <span>Experience</span>
          <span className="hidden sm:block">Skills</span>
          <span>Status</span>
          <span></span>
        </div>

        {sorted.length === 0 ? (
          <div className="py-16 text-center text-[#484f58] text-sm">No candidates match your filter.</div>
        ) : (
          <div className="divide-y divide-[#21262d]">
            {sorted.map((c) => (
              <div
                key={c.rank}
                className="grid grid-cols-[40px_44px_1fr_80px_100px_100px_120px_36px] gap-3 px-5 py-4 items-center hover:bg-[#21262d]/40 transition-colors cursor-pointer group"
                onClick={() => setSelected(c)}
              >
                {/* Compare checkbox */}
                <div onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={compareIds.includes(c.rank)}
                    onChange={() => toggleCompare(c.rank)}
                    disabled={!compareIds.includes(c.rank) && compareIds.length >= 2}
                    className="w-3.5 h-3.5 rounded accent-violet-500 cursor-pointer"
                  />
                </div>

                {}
                <div className="flex items-center justify-center">
                  <span
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                      rankBadge[c.rank] || "bg-[#21262d] text-[#8b949e]"
                    }`}
                  >
                    {c.rank}
                  </span>
                </div>

                {}
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#e6edf3] truncate group-hover:text-violet-300 transition-colors">
                    {c.name}
                  </p>
                  <p className="text-[11px] text-[#8b949e] truncate">{c.currentRole}</p>
                </div>

                {}
                <div className="flex justify-center">
                  <ScoreRing score={c.score} size={44} stroke={4} />
                </div>

                {}
                <span className="text-[12px] text-[#8b949e] truncate">{c.totalExperience || "—"}</span>

                {}
                <div className="hidden sm:flex flex-wrap gap-1">
                  {(c.skills || []).slice(0, 2).map((s) => (
                    <span key={s} className="text-[10px] bg-[#21262d] text-[#8b949e] px-1.5 py-0.5 rounded-full border border-[#30363d]">
                      {s}
                    </span>
                  ))}
                  {(c.skills || []).length > 2 && (
                    <span className="text-[10px] text-[#484f58]">+{c.skills.length - 2}</span>
                  )}
                </div>

                {}
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-full border inline-flex items-center justify-center ${recStyle[c.recommendation] || recStyle.Consider}`}>
                  {c.recommendation}
                </span>

                {}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#484f58] group-hover:text-violet-400 transition-colors">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-[#484f58] text-center">
        Click any row to view full candidate profile · Select 2 checkboxes to compare side-by-side
      </p>

      {}
      {selected && (
        <CandidateDetail candidate={selected} onClose={() => setSelected(null)} />
      )}
      {showCompare && compareIds.length === 2 && (
        <CompareView
          candidates={results}
          selectedIds={compareIds}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon, accent }) {
  const accentMap = {
    emerald: "text-emerald-400",
    violet: "text-violet-400",
    amber: "text-amber-400",
  };
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-[11px] text-[#8b949e]">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${accentMap[accent] || "text-[#e6edf3]"}`}>{value}</p>
    </div>
  );
}
