import React, { useState, useEffect, useMemo, useCallback } from "react";
import AppShell from "../components/AppShell";
import ScoreRing from "../components/ScoreRing";
import CandidateDrawer from "../components/CandidateDrawer";
import { useApp } from "../context/AppContext";
import { getCandidates, getCandidateDetail, compareCandidates } from "../api/client";

const RANK_BADGE = {
  1: "bg-amber-400 text-amber-950",
  2: "bg-slate-300 text-slate-900",
  3: "bg-orange-400 text-orange-950",
};

const REC_STYLE = {
  "Strongly Recommend": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Recommend": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Consider": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Not Recommended": "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function CandidatesPage() {
  const { activeAnalysisId, jobDescription, candidates, setCandidates } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [compareResult, setCompareResult] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRec, setFilterRec] = useState("All");

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCandidates(activeAnalysisId || undefined);
      setCandidates(data);
    } catch (err) {
      setError("Could not load candidates. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [activeAnalysisId]);

  useEffect(() => {
    // If we already have candidates from a just-finished analysis, use them;
    // otherwise fetch from backend (covers direct navigation / refresh).
    if (candidates.length === 0) {
      loadCandidates();
    } else {
      setLoading(false);
    }
  }, [loadCandidates, candidates.length]);

  const openCandidate = async (candidateId) => {
    try {
      const detail = await getCandidateDetail(candidateId);
      setSelected(detail);
    } catch {
      setSelected(candidates.find((c) => c.id === candidateId) || null);
    }
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const runComparison = async () => {
    if (compareIds.length !== 2) return;
    setComparing(true);
    try {
      const res = await compareCandidates(compareIds[0], compareIds[1], jobDescription);
      setCompareResult(res.data);
    } catch (err) {
      setCompareResult({ error: err?.response?.data?.detail || "Comparison failed" });
    } finally {
      setComparing(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...candidates];
    if (filterRec !== "All") list = list.filter((c) => c.recommendation === filterRec);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [candidates, filterRec, search]);

  if (loading) {
    return (
      <AppShell title="Candidates">
        <div className="text-slate-400 text-sm py-20 text-center">Loading candidates…</div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Candidates">
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-[13px] rounded-lg px-4 py-3">{error}</div>
      </AppShell>
    );
  }

  if (candidates.length === 0) {
    return (
      <AppShell title="Candidates">
        <div className="text-center py-20">
          <p className="text-slate-400 text-sm">No candidates yet. Upload resumes to get started.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Candidates">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or skill…"
          className="flex-1 min-w-[180px] bg-[#10162a] border border-[#1c2333] rounded-lg px-3 py-2 text-[13px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
        />
        <div className="flex items-center gap-1 bg-[#10162a] border border-[#1c2333] rounded-lg p-1">
          {["All", "Strongly Recommend", "Recommend", "Consider", "Not Recommended"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterRec(f)}
              className={`px-3 py-1 rounded text-[12px] font-medium transition-colors ${
                filterRec === f ? "bg-violet-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {compareIds.length === 2 && (
          <button
            onClick={runComparison}
            disabled={comparing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-semibold rounded-lg transition-colors"
          >
            {comparing ? "Comparing…" : "⚖️ Compare Selected"}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#10162a] border border-[#1c2333] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[36px_44px_1fr_80px_100px_1fr_140px_36px] gap-3 px-5 py-3 border-b border-[#1c2333] text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          <span>Cmp</span><span>Rank</span><span>Candidate</span><span className="text-center">Score</span>
          <span>Experience</span><span>Skills</span><span>Status</span><span></span>
        </div>

        <div className="divide-y divide-[#1c2333]">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[36px_44px_1fr_80px_100px_1fr_140px_36px] gap-3 px-5 py-4 items-center hover:bg-[#161b28] transition-colors cursor-pointer group"
              onClick={() => openCandidate(c.id)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={compareIds.includes(c.id)}
                  onChange={() => toggleCompare(c.id)}
                  disabled={!compareIds.includes(c.id) && compareIds.length >= 2}
                  className="w-3.5 h-3.5 rounded accent-violet-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-center">
                <span className={`w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center ${
                  RANK_BADGE[c.rank] || "bg-[#1c2440] text-slate-300"
                }`}>
                  {c.rank}
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-white truncate group-hover:text-violet-300 transition-colors">{c.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{c.fileName}</p>
              </div>

              <div className="flex justify-center">
                <ScoreRing score={c.score} size={44} stroke={4} />
              </div>

              <span className="text-[12px] text-slate-400">{c.totalExperience}</span>

              <div className="flex flex-wrap gap-1">
                {(c.skills || []).slice(0, 2).map((s) => (
                  <span key={s} className="text-[10px] bg-[#1c2440] text-slate-300 px-1.5 py-0.5 rounded-full">{s}</span>
                ))}
                {(c.skills || []).length > 2 && (
                  <span className="text-[10px] text-slate-500">+{c.skills.length - 2}</span>
                )}
              </div>

              <span className={`text-[11px] font-semibold px-2 py-1 rounded-full border text-center ${
                REC_STYLE[c.recommendation] || REC_STYLE["Consider"]
              }`}>
                {c.recommendation || "Pending"}
              </span>

              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-500 group-hover:text-violet-400 transition-colors">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {selected && <CandidateDrawer candidate={selected} onClose={() => setSelected(null)} />}

      {compareResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCompareResult(null)} />
          <div className="relative bg-[#10162a] border border-[#1c2333] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-[16px]">Comparison Result</h3>
              <button onClick={() => setCompareResult(null)} className="text-slate-400 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
            {compareResult.error ? (
              <p className="text-red-300 text-[13px]">{compareResult.error}</p>
            ) : (
              <div className="space-y-3 text-[13px] text-slate-300">
                <p><span className="text-slate-500">Better candidate:</span> <span className="text-white font-semibold">{compareResult.better_candidate}</span></p>
                <p><span className="text-slate-500">Confidence:</span> {compareResult.decision_confidence}</p>
                <p><span className="text-slate-500">Reason:</span> {compareResult.reason}</p>
                <p><span className="text-slate-500">Final recommendation:</span> {compareResult.final_recommendation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
