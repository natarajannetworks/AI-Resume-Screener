import React from "react";
import AppShell from "../components/AppShell";

const TEAM = [
  {
    name: "Konda Yashas Sree",
    role: "Backend Architect",
    desc: "Backend Development, API Development, Database Management, Ranking Logic, FastAPI Integration.",
    icon: "⚙️"
  },
  {
    name: "Harshini S",
    role: "Frontend Engineer",
    desc: "Frontend Development, UI Design, Interface Ranking, Dashboard Visualization.",
    icon: "🎨"
  },
  {
    name: "Natarajan S",
    role: "AI Module Developer",
    desc: "AI Processing, Mistral AI Integration, Deep Resume Analysis, Candidate Scoring Logic.",
    icon: "🧠"
  },
  {
    name: "Madduri Sai Mythili",
    role: "Document Intelligence Developer",
    desc: "PDF Parsing, Resume Text Extraction, Export Features, Documentation, Project Integration.",
    icon: "📄"
  }
];

export default function AboutPage() {
  return (
    <AppShell title="About Project">
      <div className="max-w-4xl space-y-8 pb-10">
        {/* Project Overview */}
        <div className="bg-[#10162a] border border-[#1c2333] rounded-2xl p-8 shadow-xl">
          <h2 className="text-white font-bold text-2xl mb-4">AI Resume Screener & Ranking Tool</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            A next-generation recruitment platform designed to automate candidate screening. 
            Using **Mistral Large 2411**, our system performs deep-context analysis to match candidates 
            accurately against complex job descriptions, saving hours of manual review.
          </p>
        </div>

        {/* Team Section */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm">👥</span>
            Meet the Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEAM.map((member, i) => (
              <div key={i} className="bg-[#10162a]/50 border border-[#1c2333] p-5 rounded-xl hover:border-violet-500/50 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{member.icon}</div>
                  <div>
                    <h4 className="text-white font-medium text-[15px] group-hover:text-violet-400 transition-colors">{member.name}</h4>
                    <p className="text-violet-500 text-[11px] uppercase tracking-wider font-bold mb-2">{member.role}</p>
                    <p className="text-slate-500 text-[12px] leading-snug">{member.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-violet-600/10 to-blue-600/10 border border-violet-500/20 rounded-2xl p-8">
          <h3 className="text-white font-semibold mb-4 text-center">Get in Touch</h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <span className="text-xl">📞</span>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Call Us</p>
                <p className="text-slate-200 text-sm font-medium">+91 90259 30340</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">✉️</span>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Email Support</p>
                <p className="text-slate-200 text-sm font-medium">airesumescreener.team@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}