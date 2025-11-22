// pages/linkedin.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function LinkedinOptimiserPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [cvText, setCvText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!cvText) {
      alert("Please paste your CV text.");
      return;
    }

    setLoading(true);
    const res = await apiPost("/api/linkedin-optimizer", {
      currentRole,
      targetRole,
      industry,
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
        AI LinkedIn Profile Optimiser
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        HireEdge turns your CV into a recruiter-ready LinkedIn profile: headline,
        About section, strengths, keywords and experience bullets.
      </p>

      {/* Inputs */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Current role</label>
          <input
            placeholder="e.g. Sales Executive"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ fontWeight: 600 }}>Target role</label>
          <input
            placeholder="e.g. Sales Manager"
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

          <label style={{ fontWeight: 600 }}>Industry (optional)</label>
          <input
            placeholder="e.g. B2B SaaS, Retail, Healthcare"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              padding: "0.7rem",
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
        {loading ? "Generating..." : "Generate LinkedIn Profile"}
      </button>

      {/* Results */}
      {result && result.ok && (
        <section style={{ marginTop: "2rem", display: "grid", gap: "1.5rem" }}>
          {/* Headline & About */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid #eee",
              background: "#fafafa",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
              Headline
            </h2>
            <p style={{ margin: 0 }}>{result.headline}</p>
          </div>

          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid #eee",
              background: "#fafafa",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
              About Section
            </h2>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                margin: 0,
                fontFamily: "inherit",
                lineHeight: 1.5,
              }}
            >
              {result.about}
            </pre>
          </div>

          {/* Strengths + Keywords + Hashtags */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Strengths</h3>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
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
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>
                Recruiter Keywords
              </h3>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.searchKeywords.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>

            <div
              style={{
                borderRadius: "10px",
                border: "1px solid #fff4dd",
                background: "#fffaf0",
                padding: "0.75rem",
              }}
            >
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Hashtags</h3>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.hashtags.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Experience bullets */}
          {result.experienceBullets && result.experienceBullets.length > 0 && (
            <div
              style={{
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid #eee",
                background: "#fafafa",
              }}
            >
              <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
                Experience Bullet Points
              </h2>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {result.experienceBullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Error state */}
      {result && !result.ok && (
        <p style={{ marginTop: "1.5rem", color: "red" }}>
          Error: {result.error || "Something went wrong"}
        </p>
      )}
    </main>
  );
}
