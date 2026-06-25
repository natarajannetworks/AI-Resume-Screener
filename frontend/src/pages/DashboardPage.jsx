import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import ScoreRing from "../components/ScoreRing";
import { useApp } from "../context/AppContext";
import { getAnalytics, getCandidates } from "../api/client";

function StatCard({ icon, label, value, valueColor = "text-slate-900 dark:text-white" }) {
  return (
    <div className="bg-white dark:bg-[#10162a] border border-slate-200 dark:border-[#1c2333] rounded-2xl px-5 py-5 flex items-center gap-5 shadow-sm transition-all hover:shadow-md">
      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-[#1c2440] flex items-center justify-center text-xl flex-shrink-0 border border-slate-100 dark:border-transparent">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-2xl font-black ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}

const RANK_BADGE = {
  1: "bg-amber-400 text-amber-950 shadow-lg shadow-amber-500/20",
  2: "bg-slate-300 text-slate-900 shadow-lg shadow-slate-500/10",
  3: "bg-orange-400 text-orange-950 shadow-lg shadow-orange-500/20",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { activeAnalysisId } = useApp();
  const [stats, setStats] = useState(null);
  const [topCandidates, setTopCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [analytics, candidates] = await Promise.all([
          getAnalytics(activeAnalysisId || undefined),
          getCandidates(activeAnalysisId || undefined),
        ]);
        if (!cancelled) {
          setStats(analytics);
          setTopCandidates(candidates.slice(0, 5));
        }
      } catch {
        if (!cancelled) {
          setStats(null);
          setTopCandidates([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeAnalysisId]);

  return (
    <AppShell title="Dashboard">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0f172a] dark:bg-gradient-to-br dark:from-[#0d1430] dark:via-[#1a1640] dark:to-[#241848] px-10 py-12 mb-8 shadow-2xl shadow-blue-900/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black text-white leading-tight">
            Next-Gen AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Recruitment Intelligence</span>
          </h1>
          <p className="text-slate-400 text-base mt-4 leading-relaxed max-w-lg">
            Smarter screening. Faster hiring. Deep analysis powered by Mistral Large 2411.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="mt-8 inline-flex items-center gap-3 bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-black/20"
          >
            🚀 Start New Analysis
          </button>
        </div>
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] -mr-20 -mt-20"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="📄" label="Total Candidates" value={loading ? "—" : stats?.totalCandidates ?? 0} />
        <StatCard icon="📊" label="Avg Match Score" value={loading ? "—" : `${stats?.averageScore ?? 0}%`} valueColor="text-violet-600 dark:text-violet-400" />
        <StatCard icon="🏆" label="Highest Score" value={loading ? "—" : `${stats?.topScore ?? 0}%`} valueColor="text-amber-600 dark:text-amber-400" />
        <StatCard icon="🟢" label="Strong Fits" value={loading ? "—" : stats?.matchDistribution?.strong ?? 0} valueColor="text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Top Candidate List */}
      <div className="bg-white dark:bg-[#10162a] border border-slate-200 dark:border-[#1c2333] rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-[#1c2333]">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <span>🏅</span> Recommended Candidates
          </div>
          <button onClick={() => navigate("/candidates")} className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 hover:opacity-80 transition-opacity">
            Full Leaderboard →
          </button>
        </div>

        {topCandidates.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-500 text-sm">
            Ready to hire?{" "}
            <button onClick={() => navigate("/upload")} className="text-violet-600 dark:text-violet-400 font-bold hover:underline">
              Upload your first batch
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-[#1c2333]">
            {topCandidates.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate("/candidates")}
                className="grid grid-cols-[44px_1fr_60px_1fr_120px] gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-[#161b28] transition-colors cursor-pointer"
              >
                <span className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center ${
                  RANK_BADGE[c.rank] || "bg-slate-100 dark:bg-[#1c2440] text-slate-600 dark:text-slate-400"
                }`}>
                  {c.rank}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{c.name}</p>
                  <p className="text-[11px] font-medium text-slate-500">{c.totalExperience || "No exp info"}</p>
                </div>
                <div className="flex justify-center">
                  <ScoreRing score={c.score} size={36} stroke={3.5} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(c.skills || []).slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] font-bold bg-slate-100 dark:bg-[#1c2440] text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-transparent">{s}</span>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 text-right uppercase tracking-tighter italic opacity-80">{c.recommendation || "Reviewed"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}