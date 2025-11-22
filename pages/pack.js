// /pages/pack.js
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

    if (!cvText) {
      alert("Please paste your CV text first.");
      return;
    }

    if (!currentRole || !targetRole) {
      alert("Please fill both current role and target role.");
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

    if (res && res.ok) {
      setResult(res);
    } else {
      setError(res?.error || "Career pack generation failed");
    }

    setLoading(false);
  };

  const renderList = (items) => {
    if (!items || !items.length) {
      return <p style={{ color: "#777", margin: 0 }}>No items.</p>;
    }
    return (
      <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        HireEdge – One-Click Career Pack
      </h1>
      <p style={{ marginBottom: "2rem", color: "#555" }}>
        Paste your job description and CV once. HireEdge will generate ATS
        match, skills gaps, 3-stage roadmap, LinkedIn copy, interview questions
        and UK visa hints in one go.
      </p>

      {/* Top form grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.5rem"
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
              marginTop: "0.4rem",
              marginBottom: "0.75rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <label style={{ fontWeight: 600 }}>Years of experience</label>
          <input
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            placeholder="e.g. 4.5"
            style={{
              width: "100%",
              marginTop: "0.4rem",
              marginBottom: "0.75rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <label style={{ fontWeight: 600 }}>Job description (optional)</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the main job description here..."
            style={{
              width: "100%",
              height: "180px",
              marginTop: "0.4rem",
              padding: "0.7rem",
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
              marginTop: "0.4rem",
              marginBottom: "0.75rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <label style={{ fontWeight: 600 }}>Sector (optional)</label>
          <input
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="e.g. Tech, Retail, Healthcare"
            style={{
              width: "100%",
              marginTop: "0.4rem",
              marginBottom: "0.75rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <label style={{ fontWeight: 600 }}>Your CV text (required)</label>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your full CV text here..."
            style={{
              width: "100%",
              height: "180px",
              marginTop: "0.4rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        </div>
      </section>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "0.85rem 1.8rem",
          borderRadius: "999px",
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 600,
          cursor: loading ? "default" : "pointer",
          marginBottom: "1.5rem"
        }}
      >
        {loading ? "Generating Career Pack..." : "Generate Career Pack"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
          Error: {error}
        </p>
      )}

      {/* Results */}
      {result && result.ok && (
        <>
          {/* ATS */}
          <section
            style={{
              borderRadius: "16px",
              border: "1px solid #eee",
              padding: "1.25rem 1.5rem",
              marginBottom: "1rem",
              background: "#fafafa"
            }}
          >
            <h2 style={{ margin: 0, marginBottom: "0.25rem", fontSize: "1rem" }}>
              ATS Match & Resume Optimisation
            </h2>
            <p style={{ margin: 0, color: "#555", marginBottom: "0.75rem" }}>
              ATS Match: {result.ats.match ? "Strong match" : "Gaps found"}
            </p>

            {renderList([
              ...(result.ats.gaps || []).map((g) => `Gap: ${g}`),
              ...(result.ats.recommendations || []).map(
                (r) => `Recommendation: ${r}`
              )
            ])}
          </section>

          {/* Skills */}
          <section
            style={{
              borderRadius: "16px",
              border: "1px solid #eee",
              padding: "1.25rem 1.5rem",
              marginBottom: "1rem",
              background: "#fff"
            }}
          >
            <h2 style={{ margin: 0, marginBottom: "0.75rem", fontSize: "1rem" }}>
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
                <h3 style={{ fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                  Matched skills
                </h3>
                {renderList(result.skills.matched)}
              </div>
              <div>
                <h3 style={{ fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                  Missing skills
                </h3>
                {renderList(result.skills.missing)}
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section
            style={{
              borderRadius: "16px",
              border: "1px solid #eee",
              padding: "1.25rem 1.5rem",
              marginBottom: "1rem",
              background: "#fafafa"
            }}
          >
            <h2 style={{ margin: 0, marginBottom: "0.75rem", fontSize: "1rem" }}>
              3-Stage Career Roadmap
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1.5rem"
              }}
            >
              <div>
                <h3 style={{ fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                  Immediate actions
                </h3>
                {renderList(result.roadmap.immediate)}
              </div>
              <div>
                <h3 style={{ fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                  Short-term (next 6–12 months)
                </h3>
                {renderList(result.roadmap.shortTerm)}
              </div>
              <div>
                <h3 style={{ fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                  Long-term direction
                </h3>
                {renderList(result.roadmap.longTerm)}
              </div>
            </div>
          </section>

          {/* LinkedIn */}
          <section
            style={{
              borderRadius: "16px",
              border: "1px solid #eee",
              padding: "1.25rem 1.5rem",
              marginBottom: "1rem",
              background: "#fff"
            }}
          >
            <h2 style={{ margin: 0, marginBottom: "0.75rem", fontSize: "1rem" }}>
              LinkedIn Headline & About
            </h2>
            <h3 style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>
              Suggested headline
            </h3>
            <p style={{ marginTop: 0, marginBottom: "0.75rem" }}>
              {result.linkedin.headline || "No headline generated."}
            </p>

            <h3 style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>
              About / Summary
            </h3>
            <p style={{ marginTop: 0, marginBottom: "0.75rem" }}>
              {result.linkedin.summary || "No summary generated."}
            </p>

            <h3 style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>
              Recommended skills
            </h3>
            {renderList(result.linkedin.skills)}
          </section>

          {/* Interview */}
          <section
            style={{
              borderRadius: "16px",
              border: "1px solid #eee",
              padding: "1.25rem 1.5rem",
              marginBottom: "1rem",
              background: "#fafafa"
            }}
          >
            <h2 style={{ margin: 0, marginBottom: "0.75rem", fontSize: "1rem" }}>
              Interview Questions & Model Answers (Hints)
            </h2>

            <h3 style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>Tips</h3>
            {renderList(result.interview.tips)}

            <h3
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.25rem",
                marginTop: "0.9rem"
              }}
            >
              Example questions
            </h3>
            {renderList(result.interview.questions)}
          </section>

          {/* Visa */}
          <section
            style={{
              borderRadius: "16px",
              border: "1px solid #eee",
              padding: "1.25rem 1.5rem",
              marginBottom: "1.5rem",
              background: "#fff"
            }}
          >
            <h2 style={{ margin: 0, marginBottom: "0.75rem", fontSize: "1rem" }}>
              Visa Sponsorship Pathway Hints
            </h2>
            <p style={{ margin: 0, marginBottom: "0.35rem" }}>
              <strong>Status:</strong> {result.visa.status || "Not specified"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Recommendation:</strong>{" "}
              {result.visa.recommendation || "No specific recommendation."}
            </p>
          </section>
        </>
      )}
    </main>
  );
}
