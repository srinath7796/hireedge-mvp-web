// pages/skills.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function SkillsGapPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyse = async () => {
    if (!jobDescription || !cvText) {
      alert("Please paste both Job Description and CV text.");
      return;
    }

    setLoading(true);
    const res = await apiPost("/api/skills-matching", {
      jobDescription,
      cvText,
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        AI Skills Match & Gap Analysis
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Paste the job description and your CV. HireEdge will analyse your skills,
        show what matches, what&apos;s missing, and give you a learning plan.
      </p>

      {/* INPUTS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Job description</label>
          <textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            style={{
              width: "100%",
              height: "220px",
              marginTop: "0.5rem",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Your CV text</label>
          <textarea
            placeholder="Paste your CV text here..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            style={{
              width: "100%",
              height: "220px",
              marginTop: "0.5rem",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      </section>

      <button
        onClick={handleAnalyse}
        disabled={loading}
        style={{
          padding: "0.9rem 1.8rem",
          borderRadius: "999px",
          border: "none",
          background: "#000",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {loading ? "Analysing..." : "Analyse Skills & Gaps"}
      </button>

      {/* RESULTS */}
      {result && result.ok && (
        <section style={{ marginTop: "2rem" }}>
          {/* Overall fit */}
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid #eee",
              background: "#fafafa",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Overall Fit</h2>
            <p style={{ margin: "0.5rem 0", fontSize: "1.1rem" }}>
              <strong>{result.overallFit ?? 0}%</strong> skills match
            </p>
            {result.gapSummary && (
              <p style={{ margin: 0, color: "#555" }}>{result.gapSummary}</p>
            )}
          </div>

          {/* Skills columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                border: "1px solid #e5f4ea",
                background: "#f4fbf7",
                borderRadius: "10px",
                padding: "0.75rem",
              }}
            >
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Matched Skills</h3>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.matchedSkills?.length ? (
                  result.matchedSkills.map((s, i) => <li key={i}>{s}</li>)
                ) : (
                  <li>No clear matches found.</li>
                )}
              </ul>
            </div>

            <div
              style={{
                border: "1px solid #fff4dd",
                background: "#fffaf0",
                borderRadius: "10px",
                padding: "0.75rem",
              }}
            >
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>
                Partially Matched
              </h3>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.partialMatchSkills?.length ? (
                  result.partialMatchSkills.map((s, i) => <li key={i}>{s}</li>)
                ) : (
                  <li>No partial matches.</li>
                )}
              </ul>
            </div>

            <div
              style={{
                border: "1px solid #fde0e0",
                background: "#fff5f5",
                borderRadius: "10px",
                padding: "0.75rem",
              }}
            >
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Missing Skills</h3>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.missingSkills?.length ? (
                  result.missingSkills.map((s, i) => <li key={i}>{s}</li>)
                ) : (
                  <li>No critical missing skills detected.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Learning plan */}
          {result.learningPlan && result.learningPlan.length > 0 && (
            <div>
              <h2 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>
                Learning Plan to Close Gaps
              </h2>
              <div style={{ display: "grid", gap: "1rem" }}>
                {result.learningPlan.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: "10px",
                      border: "1px solid #eee",
                      padding: "0.75rem",
                      background: "#fafafa",
                    }}
                  >
                    <h3 style={{ marginTop: 0, fontSize: "1rem" }}>
                      {item.skill}
                    </h3>
                    <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                      {item.actions.map((a, j) => (
                        <li key={j}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ERROR STATE */}
      {result && !result.ok && (
        <p style={{ marginTop: "1.5rem", color: "red" }}>
          Error: {result.error || "Something went wrong"}
        </p>
      )}
    </main>
  );
}
