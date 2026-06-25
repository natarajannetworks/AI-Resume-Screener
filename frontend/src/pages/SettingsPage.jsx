import React, { useState, useEffect } from "react";
import AppShell from "../components/AppShell";

export default function SettingsPage() {
  const [backendUrl, setBackendUrl] = useState(localStorage.getItem("resumeai_backend_url") || "https://ai-resume-screener-1bmz.onrender.com");
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [aiMode, setAiMode] = useState("deep");
  const [notifs, setNotifs] = useState(true);

  // --- THEME ENGINE ---
  useEffect(() => {
    const root = window.document.documentElement;
    const styleId = "theme-system-override";
    let styleTag = document.getElementById(styleId);

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    if (theme === 'light') {
      root.classList.remove('dark');
      styleTag.innerHTML = `
        /* 1. Global Backgrounds */
        body, html, #root { background-color: #f8fafc !important; color: #0f172a !important; }
        
        /* 2. Sidebar & Header */
        aside { background-color: #ffffff !important; border-right: 1px solid #e2e8f0 !important; }
        aside h1, aside p, aside button { color: #0f172a !important; }
        aside .text-slate-400, aside .text-slate-500 { color: #64748b !important; }
        header { background-color: rgba(255, 255, 255, 0.8) !important; border-bottom: 1px solid #e2e8f0 !important; }
        header h1, header h2, header p, header span { color: #0f172a !important; }

        /* 3. Card Styling */
        .bg-\\[\\#10162a\\], .bg-\\[\\#0d1320\\], .bg-white { 
          background-color: #ffffff !important; 
          border-color: #e2e8f0 !important; 
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05) !important;
        }

        /* 4. Text Contrast */
        .text-white, h1, h2, h3, h4, .text-slate-100, .text-slate-200 { color: #0f172a !important; }
        .text-slate-400, .text-slate-500 { color: #64748b !important; }
        .text-violet-400, .text-violet-300 { color: #7c3aed !important; }

        /* 5. Inputs & Buttons */
        input { background-color: #ffffff !important; color: #0f172a !important; border: 1px solid #cbd5e1 !important; }
        .bg-violet-600 { background-color: #7c3aed !important; color: #ffffff !important; }

        /* 6. THE CRITICAL FIX: Sidebar AI Badge Visibility */
        .bg-violet-100\\/50, .bg-violet-900\\/20 { 
          background-color: #ede9fe !important; 
          border: 1px solid #ddd6fe !important; 
        }
        .bg-violet-100\\/50 p, .bg-violet-900\\/20 p { 
          color: #4c1d95 !important; 
          opacity: 1 !important;
          font-weight: 800 !important;
        }

        /* 7. Footer Fix */
        footer { background-color: #ffffff !important; border-top: 1px solid #e2e8f0 !important; }
      `;
    } else {
      root.classList.add('dark');
      styleTag.innerHTML = ""; // Revert to original Dark CSS
      root.style.backgroundColor = "#020617";
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSave = () => {
    localStorage.setItem("resumeai_backend_url", backendUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell title="Settings">
      <div className="max-w-2xl space-y-6 pb-12">
        
        {/* SECTION: AI ENGINE */}
        <div className="bg-[#10162a] border border-[#1c2333] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">🧠</span>
            <h3 className="text-white font-bold text-[15px]">AI Analysis Engine</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setAiMode("fast")}
              className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                aiMode === 'fast' ? 'border-violet-500 bg-violet-500/10 ring-1 ring-violet-500' : 'border-[#1c2333] bg-[#0d1320]'
              }`}
            >
              <p className={`text-[13px] font-black ${aiMode === 'fast' ? 'text-violet-400' : 'text-white'}`}>⚡ Fast Mode</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Quick screening using Mistral Small.</p>
            </button>
            <button 
              onClick={() => setAiMode("deep")}
              className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                aiMode === 'deep' ? 'border-violet-500 bg-violet-500/10 ring-1 ring-violet-500' : 'border-[#1c2333] bg-[#0d1320]'
              }`}
            >
              <p className={`text-[13px] font-black ${aiMode === 'deep' ? 'text-violet-400' : 'text-white'}`}>🎯 Deep Analysis</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Highest accuracy with Mistral Large.</p>
            </button>
          </div>
        </div>

        {/* SECTION: APPEARANCE */}
        <div className="bg-[#10162a] border border-[#1c2333] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">✨</span>
            <h3 className="text-white font-bold text-[15px]">Appearance & Experience</h3>
          </div>
          
          <div className="space-y-8">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3 block">Theme Selection</label>
              <div className="flex p-1 bg-[#0d1320] rounded-xl border border-[#1c2333] w-fit">
                {['light', 'dark'].map((m) => (
                  <button 
                    key={m}
                    onClick={() => setTheme(m)}
                    className={`px-10 py-2.5 rounded-lg text-[12px] font-bold capitalize transition-all ${
                      theme === m 
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#1c2333]">
              <div>
                <p className="text-white text-sm font-bold">Desktop Notifications</p>
                <p className="text-[11px] text-slate-500 font-medium">Get alerted when processing completes</p>
              </div>
              <button 
                onClick={() => setNotifs(!notifs)}
                className={`w-12 h-6 rounded-full transition-all relative ${notifs ? 'bg-violet-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifs ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION: CONNECTION */}
        <div className="bg-[#10162a] border border-[#1c2333] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">🔌</span>
            <h3 className="text-white font-bold text-[15px]">System Connection</h3>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Backend API Endpoint</label>
            <div className="flex gap-3">
              <input
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                className="flex-1 bg-[#0d1320] border border-[#252d45] rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-violet-500 outline-none transition-all"
                placeholder="http://localhost:8000"
              />
              <button
                onClick={handleSave}
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-black px-8 py-3 rounded-xl shadow-lg shadow-violet-900/20 transition-all active:scale-95"
              >
                SAVE
              </button>
            </div>
            {saved && <p className="text-emerald-400 text-[11px] font-bold animate-bounce mt-2">✓ Configuration updated successfully</p>}
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-tighter">
          ResumeAI v2.5.0 • Powered by Mistral Large 2411
        </p>
      </div>
    </AppShell>
  );
}