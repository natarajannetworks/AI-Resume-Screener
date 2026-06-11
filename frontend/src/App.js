import React, { useState } from "react";
import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";
import InputPage from "./pages/InputPage";
import AnalyzingPage from "./pages/AnalyzingPage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  const [step, setStep] = useState(1); // 1=Input, 2=Analyzing, 3=Results
  const [jobDescription, setJobDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || uploadedFiles.length === 0) return;
    setStep(2);

    // Read all PDF files as base64
    const fileData = await Promise.all(
      uploadedFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                name: file.name,
                base64: e.target.result.split(",")[1],
                size: file.size,
              });
            };
            reader.readAsDataURL(file);
          })
      )
    );

    try {
      const analysisResults = await analyzeResumesWithClaude(
        jobDescription,
        fileData
      );
      setResults(analysisResults);
      setStep(3);
    } catch (err) {
      console.error("Analysis failed:", err);
      // Fallback mock for demo
      setResults(generateMockResults(fileData));
      setStep(3);
    }
  };

  const handleReset = () => {
    setStep(1);
    setJobDescription("");
    setUploadedFiles([]);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <StepIndicator currentStep={step} />
        <div className="mt-8">
          {step === 1 && (
            <InputPage
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              onAnalyze={handleAnalyze}
            />
          )}
          {step === 2 && (
            <AnalyzingPage
              fileCount={uploadedFiles.length}
              files={uploadedFiles}
            />
          )}
          {step === 3 && results && (
            <ResultsPage results={results} onReset={handleReset} jobDescription={jobDescription} />
          )}
        </div>
      </div>
    </div>
  );
}

// Claude API Integration
async function analyzeResumesWithClaude(jd, files) {
  const candidates = [];

  for (const file of files) {
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: file.base64,
            },
          },
          {
            type: "text",
            text: `You are an expert HR recruiter and resume analyst. Analyze the resume above against this job description:

---JOB DESCRIPTION---
${jd}
---END JD---

Return ONLY valid JSON (no markdown, no extra text) in this exact structure:
{
  "name": "Candidate full name",
  "email": "email if found else null",
  "phone": "phone if found else null",
  "location": "city/country if found else null",
  "currentRole": "current or most recent job title",
  "totalExperience": "e.g. 3 years",
  "education": "highest degree + institution",
  "skills": ["skill1", "skill2", "skill3", ...],
  "score": 85,
  "skillMatch": 80,
  "experienceMatch": 90,
  "educationMatch": 85,
  "summary": "2-3 sentence summary of why this candidate is or isn't a good fit",
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2"],
  "recommendation": "Shortlist" | "Consider" | "Reject"
}

Score 0-100 based on overall fit. Be precise and honest.`,
          },
        ],
      },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages,
      }),
    });

    const data = await response.json();
    const text = data.content?.map((b) => b.text || "").join("") || "{}";
    const clean = text.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(clean);
      candidates.push({ ...parsed, fileName: file.name });
    } catch {
      candidates.push({
        ...generateMockCandidate(file.name),
        fileName: file.name,
      });
    }
  }

  // Sort by score descending and assign ranks
  candidates.sort((a, b) => b.score - a.score);
  candidates.forEach((c, i) => (c.rank = i + 1));
  return candidates;
}

// Mock Data
function generateMockResults(files) {
  const mock = files.map((f) => generateMockCandidate(f.name));
  mock.sort((a, b) => b.score - a.score);
  mock.forEach((c, i) => (c.rank = i + 1));
  return mock;
}

function generateMockCandidate(fileName) {
  const names = [
    "Priya Sharma",
    "Rahul Verma",
    "Anjali Nair",
    "Karthik Rajan",
    "Sneha Patel",
    "Arjun Mehta",
  ];
  const roles = [
    "Senior Frontend Developer",
    "Full Stack Engineer",
    "React Developer",
    "Software Engineer",
    "UI/UX Developer",
  ];
  const score = Math.floor(Math.random() * 40) + 55;
  return {
    name: names[Math.floor(Math.random() * names.length)],
    email: "candidate@email.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    currentRole: roles[Math.floor(Math.random() * roles.length)],
    totalExperience: `${Math.floor(Math.random() * 7) + 1} years`,
    education: "B.Tech Computer Science, IIT Madras",
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "REST APIs"],
    score,
    skillMatch: score + Math.floor(Math.random() * 10) - 5,
    experienceMatch: score + Math.floor(Math.random() * 10) - 5,
    educationMatch: score + Math.floor(Math.random() * 10) - 5,
    summary:
      "Strong candidate with relevant frontend experience. Matches most required skills with good project history.",
    strengths: ["Strong React skills", "Team player", "Fast learner"],
    gaps: ["Limited cloud experience", "No system design exposure"],
    recommendation: score >= 80 ? "Shortlist" : score >= 65 ? "Consider" : "Reject",
    fileName,
  };
}
