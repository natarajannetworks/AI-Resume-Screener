import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeAnalysisId, setActiveAnalysisId] = useState(
    () => Number(localStorage.getItem("resumeai_active_analysis")) || null
  );
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [candidates, setCandidates] = useState([]);

  const setActiveAnalysis = (id) => {
    setActiveAnalysisId(id);
    if (id) localStorage.setItem("resumeai_active_analysis", String(id));
  };

  return (
    <AppContext.Provider
      value={{
        activeAnalysisId,
        setActiveAnalysis,
        jobDescription,
        setJobDescription,
        jobTitle,
        setJobTitle,
        candidates,
        setCandidates,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
