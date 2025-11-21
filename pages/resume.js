import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function ResumePage() {
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
    const res = await apiPost("/api/generate-resume", {
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
        ATS Resume Optimiser
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Paste the job description and your CV. We&apos;ll analyse the match,
        highlight ATS keywords, and generate an optimised draft.
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
        placeholder="Paste your CV content here (we'll add file upload later)..."
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

      {/* In future we add file upload here */}

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
        {loading ? "Analysing..." : "Analyse & Optimise"}
      </button>

      {/* Results */}
      {result && result.ok && (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            ATS Match Overview
          </h2>

          <p style={{ marginBottom: "1rem" }}>
            <strong>ATS Match Score:</strong>{" "}
            {typeof result.atsScore === "number" ? `${result.atsScore}%` : "N/A"}
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
              <h3>Matched Keywords</h3>
              {result.matchedKeywords && result.matchedKeywords.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {result.matchedKeywords.map((k) => (
                    <span
                      key={k}
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "999px",
                        border: "1px solid #0a0"
                      }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#777" }}>No keywords matched yet.</p>
              )}
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <h3>Missing Keywords</h3>
              {result.missingKeywords && result.missingKeywords.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {result.missingKeywords.slice(0, 30).map((k) => (
                    <span
                      key={k}
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "999px",
                        border: "1px solid #a00"
                      }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#777" }}>
                  No missing keywords detected (great!).
                </p>
              )}
            </div>
          </div>

          <h3>Optimised Resume Draft</h3>
          <pre
            style={{
              background: "#fafafa",
              padding: "1rem",
              borderRadius: "8px",
              whiteSpace: "pre-wrap"
            }}
          >
            {result.optimisedResume}
          </pre>
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
