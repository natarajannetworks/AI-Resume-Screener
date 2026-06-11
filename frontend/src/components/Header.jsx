import React from "react";

export default function Header() {
  return (
    <header className="border-b border-[#21262d] bg-[#161b22]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path d="M9 12h6M9 16h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        <span className="text-[#e6edf3] font-semibold text-[15px] tracking-tight">
          ResumeAI
        </span>
        <span className="text-[11px] font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
          Screener
        </span>

        <div className="ml-auto flex items-center gap-2 text-xs text-[#8b949e]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Powered by ResumeAI
        </div>
      </div>
    </header>
  );
}
