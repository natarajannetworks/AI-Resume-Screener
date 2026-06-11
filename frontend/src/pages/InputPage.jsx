import React, { useRef, useState, useCallback } from "react";

export default function InputPage({
  jobDescription,
  setJobDescription,
  uploadedFiles,
  setUploadedFiles,
  onAnalyze,
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      const dropped = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === "application/pdf"
      );
      setUploadedFiles((prev) => {
        const existing = new Set(prev.map((f) => f.name));
        return [...prev, ...dropped.filter((f) => !existing.has(f.name))];
      });
    },
    [setUploadedFiles]
  );

  const handleFileInput = (e) => {
    const selected = Array.from(e.target.files);
    setUploadedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...selected.filter((f) => !existing.has(f.name))];
    });
  };

  const removeFile = (name) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const canAnalyze = jobDescription.trim().length > 50 && uploadedFiles.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-widest text-[#8b949e]">
          Job Description
        </label>
        <div className="relative flex-1">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here — role, responsibilities, required skills, qualifications…"
            className="w-full h-[420px] resize-none bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-4 text-[14px] text-[#c9d1d9] placeholder-[#484f58] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all leading-relaxed"
          />
          <div className="absolute bottom-3 right-4 text-[11px] text-[#484f58]">
            {jobDescription.length} characters
            {jobDescription.length < 50 && jobDescription.length > 0 && (
              <span className="ml-2 text-amber-500/80">— add more detail</span>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-widest text-[#8b949e]">
          Upload Resumes
        </label>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 min-h-[220px] rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-all duration-200
            ${dragActive
              ? "border-violet-500 bg-violet-500/5"
              : "border-[#30363d] bg-[#161b22] hover:border-violet-500/50 hover:bg-[#161b22]"
            }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${dragActive ? "bg-violet-500/20" : "bg-[#21262d]"}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={dragActive ? "text-violet-400" : "text-[#8b949e]"}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[14px] text-[#c9d1d9]">
              Drag & drop PDF resumes here, or{" "}
              <span className="text-violet-400 font-medium">browse</span>
            </p>
            <p className="text-xs text-[#484f58] mt-1">Multiple files supported · PDF only</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        {}
        {uploadedFiles.length > 0 && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#21262d] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""} queued
              </span>
              <button
                onClick={() => setUploadedFiles([])}
                className="text-xs text-[#484f58] hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>
            <ul className="max-h-[160px] overflow-y-auto divide-y divide-[#21262d]">
              {uploadedFiles.map((file) => (
                <li key={file.name} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="w-7 h-7 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-red-400">PDF</span>
                  </div>
                  <span className="flex-1 text-[13px] text-[#c9d1d9] truncate">{file.name}</span>
                  <span className="text-[11px] text-[#484f58] mr-2">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                    className="text-[#484f58] hover:text-red-400 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {}
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={`mt-auto w-full py-3.5 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2.5 transition-all duration-200
            ${canAnalyze
              ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 hover:-translate-y-0.5"
              : "bg-[#21262d] text-[#484f58] cursor-not-allowed border border-[#30363d]"
            }`}
        >
          <span>🚀</span>
          Analyze Resumes
        </button>

        {!canAnalyze && (
          <p className="text-center text-[11px] text-[#484f58]">
            {jobDescription.length < 50
              ? "Add a detailed job description (50+ characters)"
              : "Upload at least one PDF resume"}
          </p>
        )}
      </div>
    </div>
  );
}
