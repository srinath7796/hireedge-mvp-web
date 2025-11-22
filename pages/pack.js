// /pages/pack.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function CareerPackPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [sector, setSector] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setResult(null);

    if (!cvText.trim()) {
      setError("Please paste your CV text first.");
      return;
    }

    setLoading(true);
    const res = await apiPost("/api/career-pack", {
      currentRole,
      targetRole,
      yearsExperience,
      sector,
      jobDescription,
      cvText,
    });

    if (!res || res.ok === false) {
      setError(res?.error || "Career pack generation failed.");
      setLoading(false);
      return;
    }

    setResult(res);
    setLoading(false);
  };

  const sectionStyle = {
    marginTop: "1.5rem",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #eee",
    background: "#fafafa",
  };

  const labelStyle = { fontWeight: 600, display: "block", marginTop: "0.75rem" };
  const inputStyle = {
    width: "100%",
    marginTop: "0.35rem",
    padding: "0.65rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
  };

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "960px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        HireEdge – One-Click Career Pack
      </h1>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Paste your job description and CV once. HireEdge will generate ATS
        match, skills gaps, 3-stage roadmap, LinkedIn copy, interview questions
        and UK visa hints in one go.
      </p>

      {/* Inputs */}
      <section style={sectionStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <span style={labelStyle}>Current role</span>
            <input
              style={inputStyle}
              placeholder="e.g. Senior Academic Counsellor"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
            />
          </div>
          <div>
            <span style={labelStyle}>Target role</span>
            <input
              style={inputStyle}
              placeholder="e.g. Sales Manager"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>
          <div>
            <span style={labelStyle}>Years of experience</span>
            <input
              style={inputStyle}
              placeholder="e.g. 4.5"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
            />
          </div>
          <div>
            <span style={labelStyle}>Sector (optional)</span>
            <input
              style={inputStyle}
              placeholder="e.g. Tech, Retail, Healthcare"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            />
          </div>
        </div>

        <span style={labelStyle}>Job description (optional)</span>
        <textarea
          style={{ ...inputStyle, height: "110px", resize: "vertical" }}
          placeholder="Paste key parts of the job description here…"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <span style={labelStyle}>Your CV text (required)</span>
        <textarea
          style={{ ...inputStyle, height: "160px", resize: "vertical" }}
          placeholder="Paste your CV text here…"
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1.6rem",
            borderRadius: "999px",
            border: "none",
            background: "#111",
            color: "#fff",
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Generating career pack…" : "Generate Career Pack"}
        </button>

        {error && (
          <p style={{ marginTop: "0.75rem", color: "red" }}>Error: {error}</p>
        )}
      </section>

      {/* Results */}
      {result && result.ok && (
        <>
          {/* ATS */}
          <section style={sectionStyle}>
            <h2 style={{ marginBottom: "0.75rem" }}>
              ATS Match & Resume Optimisation
            </h2>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>ATS Match:</strong>{" "}
              {result.ats?.match ? "Good alignment" : "Gaps found"}
            </p>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <strong>Gaps</strong>
                <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem" }}>
                  {result.ats?.gaps?.length
                    ? result.ats.gaps.map((g, i) => <li key={i}>{g}</li>)
                    : <li>No major gaps detected.</li>}
                </ul>
              </div>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <strong>Recommendations</strong>
                <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem" }}>
                  {result.ats?.recommendations?.length
                    ? result.ats.recommendations.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))
                    : <li>No specific recommendations.</li>}
                </ul>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section style={sectionStyle}>
            <h2 style={{ marginBottom: "0.75rem" }}>Skills Match & Gap Plan</h2>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <strong>Explicit / matched skills</strong>
                <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem" }}>
                  {result.skills?.explicit?.length
                    ? result.skills.explicit.map((s, i) => <li key={i}>{s}</li>)
                    : <li>No explicit skills detected.</li>}
                </ul>
              </div>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <strong>Missing skills</strong>
                <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem" }}>
                  {result.skills?.missing?.length
                    ? result.skills.missing.map((s, i) => <li key={i}>{s}</li>)
                    : <li>No major missing skills detected.</li>}
                </ul>
              </div>
            </div>
          </section>

          {/* 3-Stage Roadmap */}
          <section style={sectionStyle}>
            <h2 style={{ marginBottom: "0.75rem" }}>3-Stage Career Roadmap</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "1.25rem",
              }}
            >
              <div>
                <strong>Immediate actions</strong>
                <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem" }}>
                  {result.roadmap?.immediate?.length
                    ? result.roadmap.immediate.map((s, i) => <li key={i}>{s}</li>)
                    : <li>No items.</li>}
                </ul>
              </div>
              <div>
                <strong>Short-term (next 6–12 months)</strong>
                <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem" }}>
                  {result.roadmap?.short_term?.length
                    ? result.roadmap.short_term.map((s, i) => <li key={i}>{s}</li>)
                    : <li>No items.</li>}
                </ul>
              </div>
              <div>
                <strong>Long-term direction</strong>
                <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem" }}>
                  {result.roadmap?.long_term?.length
                    ? result.roadmap.long_term.map((s, i) => <li key={i}>{s}</li>)
                    : <li>No items.</li>}
                </ul>
              </div>
            </div>
          </section>

          {/* LinkedIn */}
          <section style={sectionStyle}>
            <h2 style={{ marginBottom: "0.75rem" }}>
              LinkedIn Headline & About
            </h2>
            <p style={{ marginBottom: "0.6rem" }}>
              <strong>Suggested headline</strong>
              <br />
              {result.linkedin?.headline || "—"}
            </p>
            <p style={{ marginBottom: "0.75rem", whiteSpace: "pre-line" }}>
              <strong>About / Summary</strong>
              <br />
              {result.linkedin?.summary || "—"}
            </p>
            <p>
              <strong>Recommended skills / keywords</strong>
            </p>
            <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem" }}>
              {result.linkedin?.skills?.length
                ? result.linkedin.skills.map((s, i) => <li key={i}>{s}</li>)
                : <li>No skills suggested.</li>}
            </ul>
          </section>

          {/* Interview */}
          <section style={sectionStyle}>
            <h2 style={{ marginBottom: "0.75rem" }}>
              Interview Questions & Model Answers (Hints)
            </h2>
            <p>
              <strong>Tips</strong>
            </p>
            <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem" }}>
              {result.interview?.tips?.length
                ? result.interview.tips.map((t, i) => <li key={i}>{t}</li>)
                : <li>No tips generated.</li>}
            </ul>

            <p style={{ marginTop: "0.75rem" }}>
              <strong>Example questions</strong>
            </p>
            <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem" }}>
              {result.interview?.example_questions?.length
                ? result.interview.example_questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))
                : <li>No example questions generated.</li>}
            </ul>
          </section>

          {/* Visa */}
          <section style={sectionStyle}>
            <h2 style={{ marginBottom: "0.75rem" }}>
              Visa Sponsorship Pathway Hints
            </h2>
            <p>
              <strong>Status:</strong>{" "}
              {result.visa?.status || "Not specified in CV"}
            </p>
            <p style={{ marginTop: "0.4rem" }}>
              <strong>Recommendation:</strong>{" "}
              {result.visa?.recommendation || "—"}
            </p>
          </section>
        </>
      )}
    </main>
  );
}
