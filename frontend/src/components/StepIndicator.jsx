import React from "react";

const steps = [
  { id: 1, label: "Input" },
  { id: 2, label: "Analyzing" },
  { id: 3, label: "Results" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, idx) => {
        const isActive = step.id === currentStep;
        const isDone = step.id < currentStep;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${isActive ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" : ""}
                  ${isDone ? "bg-violet-600/30 text-violet-400 border border-violet-500/40" : ""}
                  ${!isActive && !isDone ? "bg-[#21262d] text-[#8b949e] border border-[#30363d]" : ""}
                `}
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium transition-colors ${
                  isActive ? "text-violet-400" : isDone ? "text-violet-500/70" : "text-[#8b949e]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-24 sm:w-36 h-px mx-2 mb-5 transition-all duration-500 ${
                  step.id < currentStep ? "bg-violet-500/50" : "bg-[#30363d]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
