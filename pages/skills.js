import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function SkillsPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyse = async () => {
    if (!jobDescription || !cvText) {
      alert("Please paste both the Job Description and your CV.");
      return;
    }

    setLoading(true);
    const res = await apiPost("/api/skills-matching", {
      jobDescription,
      cvText
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        AI Skills Matching
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Compare your CV against a job description and see how well your skills
        match, plus what you&apos;re missing.
      </p>

      {/* Job Description */}
      <label style={{ fontWeight: 600 }}>Job Description</label>
      <textarea
        placeholder="Paste the full job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        style={{
          width: "100%",
          height: "150px",
          marginTop: "0.5rem",
          marginBottom: "1.5rem",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      {/* CV Text */}
      <label style={{ fontWeight: 600 }}>Your CV</label>
      <textarea
        placeholder="Paste your CV here..."
        value={cvText}
        onChange={(e) => setCvText(e.target.value)}
        style={{
          width: "100%",
          height: "200px",
          marginTop: "0.5rem",
          marginBottom: "1rem",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={handleAnalyse}
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          borderRadius: "999px",
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        {loading ? "Analysing..." : "Check Skills Match"}
      </button>

      {/* Results */}
      {result && result.ok && (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Match Summary
          </h2>

          <p style={{ marginBottom: "1rem" }}>
            <strong>Overall Fit Score:</strong>{" "}
            {typeof result.fitScore === "number"
              ? `${result.fitScore}%`
              : "N/A"}
          </p>

          <div
            style={{
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
              marginBottom: "1.5rem"
            }}
          >
            <div style={{ flex: 1, minWidth: "200px" }}>
              <h3>Matched Skills</h3>
              {result.matchedSkills && result.matchedSkills.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {result.matchedSkills.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "999px",
                        border: "1px solid #0a0"
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#777" }}>No skills matched yet.</p>
              )}
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <h3>Missing Skills</h3>
              {result.missingSkills && result.missingSkills.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {result.missingSkills.slice(0, 30).map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "999px",
                        border: "1px solid #a00"
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#777" }}>
                  No missing skills detected (great!).
                </p>
              )}
            </div>
          </div>

          {result.explanation && (
            <p style={{ color: "#555" }}>{result.explanation}</p>
          )}
        </section>
      )}

      {result && !result.ok && (
        <p style={{ marginTop: "1rem", color: "red" }}>
          Error: {result.error || "Something went wrong"}
        </p>
      )}
    </main>
  );
}
