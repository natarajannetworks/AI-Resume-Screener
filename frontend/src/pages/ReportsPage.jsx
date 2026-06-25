import React, { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { getReportableAnalyses, getExcelReportUrl, getPdfReportUrl } from "../api/client";

export default function ReportsPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReportableAnalyses()
      .then(setAnalyses)
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppShell title="Reports">
        <div className="text-slate-400 text-sm py-20 text-center">Loading reports…</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Reports">
      {analyses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-sm">No scored analyses yet. Run an analysis first to generate reports.</p>
        </div>
      ) : (
        <div className="bg-[#10162a] border border-[#1c2333] rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_100px_180px] gap-3 px-5 py-3 border-b border-[#1c2333] text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            <span>Job Title</span><span>Date</span><span>Scored</span><span>Export</span>
          </div>
          <div className="divide-y divide-[#1c2333]">
            {analyses.map((a) => (
              <div key={a.id} className="grid grid-cols-[1fr_140px_100px_180px] gap-3 px-5 py-4 items-center">
                <span className="text-[13px] font-medium text-white truncate">{a.jobTitle}</span>
                <span className="text-[12px] text-slate-400">{new Date(a.createdAt).toLocaleString()}</span>
                <span className="text-[12px] text-slate-400">{a.scoredCount} candidates</span>
                <div className="flex items-center gap-2">
                  <a
                    href={getExcelReportUrl(a.id)}
                    className="text-[12px] bg-emerald-600/15 text-emerald-300 border border-emerald-600/30 px-3 py-1.5 rounded-lg hover:bg-emerald-600/25 transition-colors"
                  >
                    📊 Excel
                  </a>
                  <a
                    href={getPdfReportUrl(a.id)}
                    className="text-[12px] bg-red-600/15 text-red-300 border border-red-600/30 px-3 py-1.5 rounded-lg hover:bg-red-600/25 transition-colors"
                  >
                    📄 PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
