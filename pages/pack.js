// pages/pack.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function CareerPackPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [sector, setSector] = useState("");
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

    setLoading(true);
    const res = await apiPost("/api/career-pack", {
      jobDescription,
      cvText,
      currentRole,
      targetRole,
      experienceYears,
      sector
    });
    setLoading(false);

    if (!res || res.ok === false) {
      setError(res?.error || "Something went wrong");
      return;
    }

    setResult(res.pack || null);
  };

  const sectionCard = (title, children) => (
    <section
      style={{
        marginTop: "1.5rem",
        padding: "1.25rem",
        borderRadius: "12px",
        border: "1px solid #eee",
        background: "#fafafa"
      }}
    >
      <h2 style={{ fontSize: "1.15rem", margin: 0, marginBottom: "0.5rem" }}>
        {title}
      </h2>
      {children}
    </section>
  );

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        HireEdge – One-Click Career Pack
      </h1>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Paste your job description and CV once. HireEdge will generate ATS
        match, skills gaps, 3-stage roadmap, LinkedIn copy, interview questions
        and a UK visa hint in one go.
      </p>

      {/* Inputs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1.4fr",
          gap: "1.5rem",
          marginBottom: "1.5rem"
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Current role</label>
          <input
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            placeholder="e.g. Sales Assistant"
            style={{
              width: "100%",
              marginTop: "0.4rem",
              padding: "0.6rem 0.75rem",
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
            placeholder="e.g. Sales Manager (B2B SaaS)"
            style={{
              width: "100%",
              marginTop: "0.4rem",
              padding: "0.6rem 0.75rem",
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
              marginTop: "0.4rem",
              padding: "0.6rem 0.75rem",
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
            placeholder="e.g. Retail, Healthcare, Tech"
            style={{
              width: "100%",
              marginTop: "0.4rem",
              padding: "0.6rem 0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1.4fr",
          gap: "1.5rem"
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Job description (optional)</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here…"
            style={{
              width: "100%",
              minHeight: "180px",
              marginTop: "0.4rem",
              padding: "0.75rem",
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
            placeholder="Paste the main content of your CV here…"
            style={{
              width: "100%",
              minHeight: "180px",
              marginTop: "0.4rem",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontFamily: "inherit",
              fontSize: "0.9rem"
            }}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          marginTop: "1.5rem",
          padding: "0.8rem 1.6rem",
          borderRadius: "999px",
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 600,
          cursor: loading ? "default" : "pointer"
        }}
      >
        {loading ? "Generating Career Pack…" : "Generate Career Pack"}
      </button>

      {error && (
        <p style={{ marginTop: "1rem", color: "red" }}>
          Error: {String(error)}
        </p>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginTop: "2rem", marginBottom: "3rem" }}>
          {result.ats &&
            sectionCard("ATS Match & Resume Fit", (
              <>
                <p style={{ marginBottom: "0.35rem" }}>
                  <strong>ATS Score:</strong> {result.ats.score || 0}%
                </p>
                {result.ats.summary && (
                  <p style={{ marginBottom: "0.75rem", color: "#555" }}>
                    {result.ats.summary}
                  </p>
                )}
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <strong>Matched keywords</strong>
                    <ul>
                      {(result.ats.matchedKeywords || []).map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <strong>Missing keywords</strong>
                    <ul>
                      {(result.ats.missingKeywords || []).map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ))}

          {result.skills &&
            sectionCard("Skills Match & Gap Plan", (
              <>
                <p style={{ marginBottom: "0.35rem" }}>
                  <strong>Overall skills fit:</strong>{" "}
                  {result.skills.overallFit || 0}%
                </p>
                <p style={{ marginBottom: "0.75rem", color: "#555" }}>
                  {result.skills.gapSummary}
                </p>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <strong>Matched skills</strong>
                    <ul>
                      {(result.skills.matchedSkills || []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <strong>Partially matched</strong>
                    <ul>
                      {(result.skills.partialMatchSkills || []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <strong>Missing skills</strong>
                    <ul>
                      {(result.skills.missingSkills || []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ))}

          {result.roadmap &&
            sectionCard("3-Stage Career Roadmap", (
              <>
                <p style={{ marginBottom: "0.35rem", color: "#555" }}>
                  {result.roadmap.summary}
                </p>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong>Total timeframe:</strong>{" "}
                  {result.roadmap.timeframeMonths || 0} months
                </p>
                {(result.roadmap.stages || []).map((stg, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "1rem",
                      padding: "0.75rem",
                      borderRadius: "10px",
                      border: "1px solid #e5e5e5",
                      background: "#fff"
                    }}
                  >
                    <strong>
                      {stg.name}{" "}
                      {stg.durationWeeks
                        ? `(${stg.durationWeeks} weeks)`
                        : ""}
                    </strong>
                    {stg.focus && (
                      <p style={{ margin: "0.25rem 0 0.5rem 0", color: "#555" }}>
                        {stg.focus}
                      </p>
                    )}
                    <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
                      {(stg.actions || []).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            ))}

          {result.linkedin &&
            sectionCard("LinkedIn Profile Pack", (
              <>
                <p style={{ marginBottom: "0.4rem" }}>
                  <strong>Headline:</strong> {result.linkedin.headline}
                </p>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    marginBottom: "0.9rem",
                    color: "#555"
                  }}
                >
                  {result.linkedin.about}
                </p>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Strengths</strong>
                  <div style={{ marginTop: "0.4rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {(result.linkedin.strengths || []).map((s, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "999px",
                          border: "1px solid #ddd",
                          background: "#fff"
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Hashtags</strong>
                  <div style={{ marginTop: "0.4rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {(result.linkedin.hashtags || []).map((h, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "999px",
                          border: "1px solid #ddd",
                          background: "#fff"
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ))}

          {result.interview &&
            sectionCard("Interview Question Bank", (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
                <div>
                  <strong>General questions</strong>
                  <ul>
                    {(result.interview.generalQuestions || []).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Role-specific questions</strong>
                  <ul>
                    {(result.interview.roleSpecificQuestions || []).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Behavioural (STAR) questions</strong>
                  <ul>
                    {(result.interview.behaviouralQuestions || []).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

          {result.visaHint &&
            sectionCard("UK Visa Route Hint (High-Level, Non-Legal)", (
              <>
                <p style={{ marginBottom: "0.4rem" }}>
                  <strong>Suggested route:</strong> {result.visaHint.ukRoute}
                </p>
                <p style={{ marginBottom: "0.75rem", color: "#555" }}>
                  {result.visaHint.summary}
                </p>
                {(result.visaHint.flags || []).length > 0 && (
                  <>
                    <strong>Things to double-check with an adviser:</strong>
                    <ul>
                      {result.visaHint.flags.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ))}
        </div>
      )}
    </main>
  );
}
