import React from "react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "home" },
  { to: "/upload", label: "Upload Resumes", icon: "upload" },
  { to: "/candidates", label: "Candidates", icon: "users" },
  { to: "/history", label: "History", icon: "history" },
  { to: "/reports", label: "Reports", icon: "file" },
  { to: "/analytics", label: "Analytics", icon: "chart" },
  { to: "/settings", label: "Settings", icon: "settings" },
  { to: "/about", label: "About Us", icon: "info" },
];

const ICONS = {
  home: "M3 11.5L12 4l9 7.5M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9",
  upload: "M12 4v12m0-12l-4 4m4-4l4 4M4 18h16",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6zm9 0a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 7-5s7 2 7 5M14 20c0-2.2 1.5-4 4-4.5",
  history: "M12 7v5l3 2M21 12a9 9 0 11-3-6.7M21 4v5h-5",
  file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6",
  chart: "M4 19h16M7 19V9m5 10V5m5 14v-7",
  settings: "M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  info: "M12 16v-4m0-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z",
};

function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d={ICONS[name]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-[#0a0e1a] border-r border-slate-200 dark:border-[#1c2333] flex flex-col h-screen sticky top-0 flex-shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200 dark:border-[#1c2333]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="6" width="16" height="13" rx="3" stroke="white" strokeWidth="1.6" />
            <circle cx="9" cy="12" r="1.3" fill="white" />
            <circle cx="15" cy="12" r="1.3" fill="white" />
            <path d="M9 16h6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 6V3" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-slate-900 dark:text-white font-bold text-[15px] leading-tight">ResumeAI</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Smart Hiring, Better Future</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium shadow-md shadow-violet-600/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161b28] hover:text-slate-900 dark:hover:text-slate-200"
              }`
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

<div className="mt-auto p-4">
  <div className="rounded-2xl p-4 bg-violet-100/50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-500/20 shadow-sm">
    <p className="text-[12px] font-black text-violet-900 dark:text-violet-300 mb-1 leading-none">
      AI Powered Recruitment
    </p>
    <p className="text-[11px] font-bold text-violet-700/70 dark:text-slate-400">
      Powered by Mistral Large 2411
    </p>
  </div>
</div>
    </aside>
  );
}

function TopBar({ title }) {
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white dark:bg-[#0a0e1a] border-b border-slate-200 dark:border-[#1c2333] sticky top-0 z-10 transition-colors duration-300">
      <h1 className="text-slate-900 dark:text-white font-bold text-[18px]">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 8a6 6 0 1112 0c0 3 1 4.5 1.5 5.5a1 1 0 01-.9 1.5H5.4a1 1 0 01-.9-1.5C5 12.5 6 11 6 8z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M9.5 17a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-[#1c2333]">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-bold text-slate-900 dark:text-slate-300">HR Manager</p>
            <p className="text-[10px] text-slate-500">Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shadow-md shadow-blue-500/20">HR</div>
        </div>
      </div>
    </div>
  );
}

export default function AppShell({ title, children }) {
  return (
    <div className="flex bg-[#f8fafc] dark:bg-[#0a0e1a] min-h-screen transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} />
        
        {/* Main Page Content */}
        <div className="px-8 py-8 flex-1">
          {children}
        </div>

        {/* --- GLOBAL FOOTER --- */}
        <footer className="px-8 py-6 border-t border-slate-200 dark:border-[#1c2333] bg-white dark:bg-[#0a0e1a] transition-colors duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">📞</span>
                <p className="text-[12px] font-medium text-slate-600 dark:text-slate-400">+91 90259 30340</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">✉️</span>
                <p className="text-[12px] font-medium text-slate-600 dark:text-slate-400">airesumescreener.team@gmail.com</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[11px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-widest">
                © 2024 ResumeAI • Next-Gen Recruitment
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}