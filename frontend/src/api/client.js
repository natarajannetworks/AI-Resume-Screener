import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 120000, // AI scoring can take a while across multiple resumes
});

// ── Upload ──────────────────────────────────────────────────────────────
export async function uploadResumeBatch(files, jobDescription, jobTitle) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("job_description", jobDescription);
  formData.append("job_title", jobTitle || "Untitled Role");

  const res = await api.post("/upload-batch", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // { analysis_id, uploaded_files, status }
}

// ── Analysis ─────────────────────────────────────────────────────────────
export async function analyzeAll(analysisId, jobDescription) {
  const res = await api.post("/analyze-all", {
    analysis_id: analysisId,
    job_description: jobDescription,
  });
  return res.data; // array of scored candidates
}

export async function getRankings(analysisId) {
  const res = await api.get("/rankings", {
    params: analysisId ? { analysis_id: analysisId } : {},
  });
  return res.data;
}

export async function compareCandidates(id1, id2, jobDescription) {
  const res = await api.post("/compare", {
    id1,
    id2,
    job_description: jobDescription,
  });
  return res.data;
}

// ── Candidates ───────────────────────────────────────────────────────────
export async function getCandidates(analysisId) {
  const res = await api.get("/candidates", {
    params: analysisId ? { analysis_id: analysisId } : {},
  });
  return res.data;
}

export async function getCandidateDetail(candidateId) {
  const res = await api.get(`/candidates/${candidateId}`);
  return res.data;
}

// ── History ──────────────────────────────────────────────────────────────
export async function getHistory() {
  const res = await api.get("/history");
  return res.data;
}

export async function getHistoryDetail(analysisId) {
  const res = await api.get(`/history/${analysisId}`);
  return res.data;
}

export async function deleteHistory(analysisId) {
  const res = await api.delete(`/history/${analysisId}`);
  return res.data;
}

// ── Reports ──────────────────────────────────────────────────────────────
export async function getReportableAnalyses() {
  const res = await api.get("/reports");
  return res.data;
}

export function getExcelReportUrl(analysisId) {
  return `${api.defaults.baseURL}/reports/${analysisId}/excel`;
}

export function getPdfReportUrl(analysisId) {
  return `${api.defaults.baseURL}/reports/${analysisId}/pdf`;
}

// ── Analytics ────────────────────────────────────────────────────────────
export async function getAnalytics(analysisId) {
  const res = await api.get("/analytics", {
    params: analysisId ? { analysis_id: analysisId } : {},
  });
  return res.data;
}

export default api;
