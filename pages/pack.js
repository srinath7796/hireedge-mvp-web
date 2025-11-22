// pages/pack.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function CareerPackPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
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
      experienceYears,
      sector,
      jobDescription,
      cvText
    });

    if (!res || !res.ok) {
      setError(res?.error || "Career pack generation failed");
      setLoading(false);
      return;
    }

    setResult(res);
    setLoading(false);
  };

  const renderList = (items) => {
    if (!items || !items.length) {
      return <p style={{ margin: 0, color: "#777" }}>No items.</p>;
    }
    return (
      <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "960px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
        HireEdge – One-Click Career Pack
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555", maxWidth: "720px" }}>
        Paste your job description and CV once. HireEdge will generate ATS match, skills
        gaps, 3-stage roadmap, LinkedIn copy, interview questions, and UK visa hints in
        one go.
      </p>

      {/* INPUT FORM */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem 1.5rem",
          marginBottom: "1.5rem",
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          background: "#fafafa"
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Current role</label>
          <input
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            placeholder="e.g. Senior Academic Counsellor"
            style={{
              width: "100%",
              marginTop: "0.35rem",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Target role</label>
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Sales Manager"
            style={{
              width: "100%",
              marginTop: "0.35rem",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Years of experience</label>
          <input
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            placeholder="e.g. 4.5"
            style={{
              width: "100%",
              marginTop: "0.35rem",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Sector (optional)</label>
          <input
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="e.g. Tech, Retail, Healthcare"
            style={{
              width: "100%",
              marginTop: "0.35rem",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Job description (optional)</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the main parts of the job description here."
            rows={8}
            style={{
              width: "100%",
              marginTop: "0.35rem",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontFamily: "inherit",
              fontSize: "0.9rem"
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Your CV text (required)</label>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your CV text here."
            rows={8}
            style={{
              width: "100%",
              marginTop: "0.35rem",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontFamily: "inherit",
              fontSize: "0.9rem"
            }}
          />
        </div>
      </section>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          display: "inline-block",
          padding: "0.8rem 1.6rem",
          borderRadius: "999px",
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 600,
          cursor: loading ? "default" : "pointer",
          marginBottom: "0.75rem"
        }}
      >
        {loading ? "Generating Career Pack..." : "Generate Career Pack"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "0.25rem", marginBottom: "1rem" }}>
          Error: {error}
        </p>
      )}

      {/* RESULTS */}
      {result && (
        <div style={{ marginTop: "1.5rem" }}>
          {/* ATS MATCH */}
          <section
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1rem"
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              ATS Match & Resume Optimisation
            </h2>
            <p style={{ marginTop: 0 }}>
              <b>ATS Match:</b>{" "}
              {result.ats?.match ? "Good match found" : "Gaps found"}
            </p>

            {result.ats?.gaps && result.ats.gaps.length > 0 && (
              <>
                <h4 style={{ marginBottom: "0.25rem" }}>Gaps</h4>
                {renderList(result.ats.gaps)}
              </>
            )}

            {result.ats?.recommendations &&
              result.ats.recommendations.length > 0 && (
                <>
                  <h4 style={{ marginBottom: "0.25rem", marginTop: "0.75rem" }}>
                    Recommendations
                  </h4>
                  {renderList(result.ats.recommendations)}
                </>
              )}
          </section>

          {/* SKILLS */}
          <section
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1rem"
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              Skills Match & Gap Plan
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem"
              }}
            >
              <div>
                <h4>Matched skills</h4>
                {renderList(result.skills?.explicit)}
              </div>
              <div>
                <h4>Missing skills</h4>
                {renderList(result.skills?.missing)}
              </div>
            </div>
          </section>

          {/* ROADMAP */}
          <section
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1rem"
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              3-Stage Career Roadmap
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1.25rem"
              }}
            >
              <div>
                <h4>Immediate actions</h4>
                {renderList(result.roadmap?.immediate)}
              </div>
              <div>
                <h4>Short-term (next 6–12 months)</h4>
                {renderList(result.roadmap?.short_term)}
              </div>
              <div>
                <h4>Long-term direction</h4>
                {renderList(result.roadmap?.long_term)}
              </div>
            </div>
          </section>

          {/* LINKEDIN */}
          <section
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1rem"
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              LinkedIn Headline & About
            </h2>

            <h4>Suggested headline</h4>
            <p style={{ marginTop: "0.25rem" }}>{result.linkedin?.headline}</p>

            <h4 style={{ marginTop: "0.75rem" }}>About / Summary</h4>
            <p style={{ marginTop: "0.25rem", whiteSpace: "pre-line" }}>
              {result.linkedin?.summary}
            </p>

            <h4 style={{ marginTop: "0.75rem" }}>Recommended skills</h4>
            {renderList(result.linkedin?.skills)}
          </section>

          {/* INTERVIEW */}
          <section
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1rem"
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              Interview Questions & Model Answers (Hints)
            </h2>

            <h4>Tips</h4>
            {renderList(result.interview?.tips)}

            <h4 style={{ marginTop: "0.75rem" }}>Example questions</h4>
            {renderList(result.interview?.example_questions)}
          </section>

          {/* VISA */}
          <section
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1rem"
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              Visa Sponsorship Pathway Hints
            </h2>
            <p style={{ marginTop: 0 }}>
              <b>Status:</b> {result.visa?.status || "Not specified in CV"}
            </p>
            <p style={{ marginTop: "0.35rem" }}>
              <b>Recommendation:</b>{" "}
              {result.visa?.recommendation ||
                "Ensure valid work visa or right to work for target country."}
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
