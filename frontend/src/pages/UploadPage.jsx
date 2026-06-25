import React, { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useApp } from "../context/AppContext";
import { uploadResumeBatch } from "../api/client";

export default function UploadPage() {
  const navigate = useNavigate();
  const { setActiveAnalysis, setJobDescription, jobDescription, jobTitle, setJobTitle } = useApp();

  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".docx") || f.name.endsWith(".txt")
    );
    setUploadedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...dropped.filter((f) => !existing.has(f.name))];
    });
  }, []);

  const handleFileInput = (e) => {
    const selected = Array.from(e.target.files);
    setUploadedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...selected.filter((f) => !existing.has(f.name))];
    });
  };

  const removeFile = (name) => setUploadedFiles((prev) => prev.filter((f) => f.name !== name));

  const canSubmit = jobDescription.trim().length > 20 && uploadedFiles.length > 0 && !uploading;

  const handleSubmit = async () => {
    setError("");
    setUploading(true);
    try {
      const res = await uploadResumeBatch(uploadedFiles, jobDescription, jobTitle);
      setActiveAnalysis(res.analysis_id);
      navigate("/analyzing");
    } catch (err) {
      setError(err?.response?.data?.detail || "Upload failed. Is the backend running on localhost:8000?");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppShell title="Upload Resumes">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Job description panel */}
        <div className="bg-[#10162a] border border-[#1c2333] rounded-xl p-5 flex flex-col gap-4">
          <div className="text-white font-semibold text-[15px]">Job Description</div>

          <div>
            <label className="text-[12px] text-slate-400 mb-1.5 block">Role Title</label>
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="w-full bg-[#0d1320] border border-[#252d45] rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-[12px] text-slate-400 mb-1.5 block">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description — responsibilities, required skills, experience level..."
              className="w-full flex-1 min-h-[220px] resize-none bg-[#0d1320] border border-[#252d45] rounded-lg px-3 py-2.5 text-[13px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              {jobDescription.length} characters
              {jobDescription.length > 0 && jobDescription.length < 20 && (
                <span className="text-amber-400 ml-2">— add more detail (min 20 characters)</span>
              )}
            </p>
          </div>
        </div>

        {/* Upload panel */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative bg-[#10162a] border-2 border-dashed rounded-xl p-5 flex flex-col transition-colors ${
            dragActive ? "border-violet-500 bg-violet-500/5" : "border-[#2a3356]"
          }`}
        >
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4m0 0L7 9m5-5l5 5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 16v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-white font-semibold text-[15px]">Upload Candidate Resumes</p>
            <p className="text-slate-400 text-[13px] mt-1">
              Drag &amp; drop resumes here or{" "}
              <button onClick={() => fileInputRef.current?.click()} className="text-violet-400 hover:underline">
                browse files
              </button>
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["PDF, DOCX, TXT", "Max 50 files", "Max 10MB each"].map((t) => (
                <span key={t} className="text-[11px] text-slate-400 bg-[#0d1320] border border-[#252d45] px-2.5 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] text-slate-300 font-medium">Uploaded ({uploadedFiles.length})</p>
                <button onClick={() => setUploadedFiles([])} className="text-[11px] text-slate-500 hover:text-red-400">
                  Clear all
                </button>
              </div>
              <ul className="space-y-1.5 max-h-44 overflow-y-auto">
                {uploadedFiles.map((file) => (
                  <li key={file.name} className="flex items-center gap-2.5 bg-[#0d1320] border border-[#1c2333] rounded-lg px-3 py-2">
                    <div className="w-6 h-6 rounded bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] font-bold text-red-400">PDF</span>
                    </div>
                    <span className="flex-1 text-[12px] text-slate-300 truncate">{file.name}</span>
                    <span className="text-[11px] text-slate-500">{(file.size / 1024).toFixed(0)} KB</span>
                    <button onClick={() => removeFile(file.name)} className="text-slate-500 hover:text-red-400">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-300 text-[13px] rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full mt-6 py-4 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2.5 transition-all ${
          canSubmit
            ? "bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 text-white shadow-lg shadow-violet-600/30 hover:opacity-90"
            : "bg-[#161b28] text-slate-500 cursor-not-allowed"
        }`}
      >
        {uploading ? "Uploading..." : "🚀 Analyze Candidates"}
      </button>
    </AppShell>
  );
}
