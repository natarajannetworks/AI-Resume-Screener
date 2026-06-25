import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useApp } from "../context/AppContext";
import { getHistory, getHistoryDetail, deleteHistory } from "../api/client";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { setActiveAnalysis, setCandidates, setJobDescription, setJobTitle } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch {
      setError("Could not load history. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const reopen = async (id) => {
    try {
      const detail = await getHistoryDetail(id);
      setActiveAnalysis(id);
      setJobTitle(detail.jobTitle);
      setJobDescription(detail.jobDescription);
      setCandidates(detail.candidates);
      navigate("/candidates");
    } catch {
      setError("Could not reopen this analysis.");
    }
  };

  const remove = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this analysis and all its candidates? This cannot be undone.")) return;
    await deleteHistory(id);
    load();
  };

  if (loading) {
    return (
      <AppShell title="History">
        <div className="text-slate-400 text-sm py-20 text-center">Loading history…</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="History">
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-[13px] rounded-lg px-4 py-3">{error}</div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-sm">No past analyses yet.</p>
        </div>
      ) : (
        <div className="bg-[#10162a] border border-[#1c2333] rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_100px_100px_90px] gap-3 px-5 py-3 border-b border-[#1c2333] text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            <span>Job Title</span><span>Date</span><span>Candidates</span><span>Top Score</span><span></span>
          </div>
          <div className="divide-y divide-[#1c2333]">
            {history.map((h) => (
              <div
                key={h.id}
                onClick={() => reopen(h.id)}
                className="grid grid-cols-[1fr_140px_100px_100px_90px] gap-3 px-5 py-4 items-center hover:bg-[#161b28] transition-colors cursor-pointer"
              >
                <span className="text-[13px] font-medium text-white truncate">{h.jobTitle}</span>
                <span className="text-[12px] text-slate-400">{new Date(h.createdAt).toLocaleString()}</span>
                <span className="text-[12px] text-slate-400">{h.scoredCount}/{h.candidateCount} scored</span>
                <span className="text-[12px] text-amber-400 font-semibold">{h.topScore}%</span>
                <button
                  onClick={(e) => remove(h.id, e)}
                  className="text-[11px] text-slate-500 hover:text-red-400 text-right"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
