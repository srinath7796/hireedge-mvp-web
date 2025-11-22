// pages/interview.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function InterviewPrepPage() {
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription && !targetRole) {
      alert("Please fill at least Target role or Job description.");
      return;
    }

    setLoading(true);
    const res = await apiPost("/api/interview-prep", {
      jobDescription,
      cvText,
      targetRole,
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
        AI Interview Prep Coach
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Paste the job description and your CV. HireEdge will generate tailored
        interview questions, STAR-style answers, and key tips.
      </p>

      {/* Inputs */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.2fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Target role</label>
          <input
            placeholder="e.g. Sales Manager, Product Manager"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ fontWeight: 600 }}>Job description</label>
          <textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            style={{
              width: "100%",
              height: "200px",
              marginTop: "0.5rem",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Your CV / background</label>
          <textarea
            placeholder="Paste your CV text or key experience here..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            style={{
              width: "100%",
              height: "260px",
              marginTop: "0.5rem",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      </section>

      <button
        onClick={handleGenerate}
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
        {loading ? "Generating..." : "Generate Interview Prep"}
      </button>

      {/* Results */}
      {result && result.ok && (
        <section style={{ marginTop: "2rem", display: "grid", gap: "1.5rem" }}>
          {/* Role summary */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid #eee",
              background: "#fafafa",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              Role Summary & Focus
            </h2>
            {result.roleSummary && (
              <p style={{ marginBottom: "0.75rem" }}>{result.roleSummary}</p>
            )}
            {result.focusAreas && result.focusAreas.length > 0 && (
              <p style={{ margin: 0 }}>
                <strong>Focus areas:</strong>{" "}
                {result.focusAreas.join(" · ")}
              </p>
            )}
          </div>

          {/* Question sets */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                borderRadius: "10px",
                border: "1px solid #e5f4ea",
                background: "#f4fbf7",
                padding: "0.75rem",
              }}
            >
              <h3>Behavioural / STAR questions</h3>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.behaviouralQuestions?.map((q, i) => (
                  <li key={i} style={{ marginBottom: "0.75rem" }}>
                    <strong>Q:</strong> {q.question}
                    <br />
                    <strong>A:</strong> {q.answer}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                borderRadius: "10px",
                border: "1px solid #eef",
                background: "#f7f8ff",
                padding: "0.75rem",
              }}
            >
              <h3>Role-specific questions</h3>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.roleSpecificQuestions?.map((q, i) => (
                  <li key={i} style={{ marginBottom: "0.75rem" }}>
                    <strong>Q:</strong> {q.question}
                    <br />
                    <strong>A:</strong> {q.answer}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strength questions */}
          {result.strengthQuestions &&
            result.strengthQuestions.length > 0 && (
              <div
                style={{
                  borderRadius: "10px",
                  border: "1px solid #fff4dd",
                  background: "#fffaf0",
                  padding: "0.75rem",
                }}
              >
                <h3>Strength / weakness questions</h3>
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  {result.strengthQuestions.map((q, i) => (
                    <li key={i} style={{ marginBottom: "0.75rem" }}>
                      <strong>Q:</strong> {q.question}
                      <br />
                      <strong>A:</strong> {q.answer}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Closing questions */}
          {result.closingQuestions && result.closingQuestions.length > 0 && (
            <div
              style={{
                borderRadius: "10px",
                border: "1px solid #eee",
                background: "#fafafa",
                padding: "0.75rem",
              }}
            >
              <h3>Questions to ask the interviewer</h3>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.closingQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {result.tips && result.tips.length > 0 && (
            <div
              style={{
                borderRadius: "10px",
                border: "1px solid #eee",
                background: "#f9f9f9",
                padding: "0.75rem",
              }}
            >
              <h3>Final tips for this interview</h3>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Error */}
      {result && !result.ok && (
        <p style={{ marginTop: "1.5rem", color: "red" }}>
          Error: {result.error || "Something went wrong"}
        </p>
      )}
    </main>
  );
}
