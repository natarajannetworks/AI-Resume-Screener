import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import AppShell from "../components/AppShell";
import { useApp } from "../context/AppContext";
import { getAnalytics } from "../api/client";

const MATCH_COLORS = { strong: "#34d399", partial: "#fbbf24", weak: "#f87171" };

export default function AnalyticsPage() {
  const { activeAnalysisId } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Detect theme for Chart Styling
  const isLight = localStorage.getItem("theme") === "light";
  const chartTextColor = isLight ? "#475569" : "#94a3b8";
  const gridColor = isLight ? "#e2e8f0" : "#1c2333";
  const tooltipBg = isLight ? "#ffffff" : "#161b28";
  const tooltipBorder = isLight ? "#e2e8f0" : "#1c2333";

  useEffect(() => {
    let cancelled = false;
    getAnalytics(activeAnalysisId || undefined)
      .then((res) => { if (!cancelled) setData(res); })
      .catch(() => { if (!cancelled) setData(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeAnalysisId]);

  if (loading) {
    return (
      <AppShell title="Analytics">
        <div className="text-slate-500 text-sm py-20 text-center">Loading analytics…</div>
      </AppShell>
    );
  }

  if (!data || data.totalCandidates === 0) {
    return (
      <AppShell title="Analytics">
        <div className="text-center py-20">
          <p className="text-slate-500 text-sm">No analyzed candidates yet. Run an analysis to see charts.</p>
        </div>
      </AppShell>
    );
  }

  const pieData = [
    { name: "Strong Match", value: data.matchDistribution.strong, color: MATCH_COLORS.strong },
    { name: "Partial Match", value: data.matchDistribution.partial, color: MATCH_COLORS.partial },
    { name: "Weak Match", value: data.matchDistribution.weak, color: MATCH_COLORS.weak },
  ].filter((d) => d.value > 0);

  return (
    <AppShell title="Analytics">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Match Distribution */}
        <div className="bg-white dark:bg-[#10162a] border border-slate-200 dark:border-[#1c2333] rounded-2xl p-6 shadow-sm">
          <p className="text-slate-900 dark:text-white font-bold text-[15px] mb-6">Match Distribution</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={4}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: isLight ? "#0f172a" : "#fff", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} 
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12, paddingTop: 20, color: chartTextColor }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Histogram */}
        <div className="bg-white dark:bg-[#10162a] border border-slate-200 dark:border-[#1c2333] rounded-2xl p-6 shadow-sm">
          <p className="text-slate-900 dark:text-white font-bold text-[15px] mb-6">Match Score Distribution</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={data.scoreHistogram}>
                <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: chartTextColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartTextColor, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: isLight ? '#f1f5f9' : '#1c2440'}}
                  contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: isLight ? "#0f172a" : "#fff" }} 
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Skills */}
      <div className="bg-white dark:bg-[#10162a] border border-slate-200 dark:border-[#1c2333] rounded-2xl p-6 shadow-sm">
        <p className="text-slate-900 dark:text-white font-bold text-[15px] mb-6">Common Skills in Pool</p>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={data.topSkills} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="4 4" horizontal={false} />
              <XAxis type="number" tick={{ fill: chartTextColor, fontSize: 11 }} axisLine={false} tickLine={false} hide />
              <YAxis dataKey="skill" type="category" tick={{ fill: isLight ? "#1e293b" : "#94a3b8", fontSize: 12, fontWeight: 500 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: isLight ? '#f1f5f9' : '#1c2440'}}
                contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12 }} 
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}