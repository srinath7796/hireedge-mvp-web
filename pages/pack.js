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
  const [copyStatus, setCopyStatus] = useState("");

  const handleGenerate = async (event) => {
    event?.preventDefault?.();
    setError("");
    setResult(null);
    setCopyStatus("");

    const trimmedCvText = cvText.trim();

    if (!trimmedCvText) {
      setError("Please paste your CV text first.");
      return;
    }

    setLoading(true);

    try {
      const res = await apiPost("/api/career-pack", {
        currentRole: currentRole.trim(),
        targetRole: targetRole.trim(),
        yearsExperience: yearsExperience.trim(),
        sector: sector.trim(),
        jobDescription: jobDescription.trim(),
        cvText: trimmedCvText,
      });

      if (!res || res.ok === false) {
        throw new Error(res?.error || "Career pack generation failed.");
      }

      setResult(res);
    } catch (err) {
      setError(err.message || "Career pack generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentRole("");
    setTargetRole("");
    setYearsExperience("");
    setSector("");
    setJobDescription("");
    setCvText("");
    setResult(null);
    setError("");
    setCopyStatus("");
  };

  const isGenerateDisabled = loading || !cvText.trim();

  const sectionStyle = {
    marginTop: "1.5rem",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #eee",
    background: "#fafafa",
  };

  const formatSkillList = (skills) => {
    if (!skills?.length) return "key strengths";
    if (skills.length === 1) return skills[0];
    if (skills.length === 2) return `${skills[0]} and ${skills[1]}`;
    return `${skills.slice(0, -1).join(", ")}, and ${skills[skills.length - 1]}`;
  };

  const buildEndorsementRequest = (skills) => {
    const roleTarget = targetRole?.trim() || "my next role";
    const roleCurrent = currentRole?.trim() || "my current role";
    const skillText = formatSkillList(skills);

    return `Hi there! I'm working toward ${roleTarget} and would value your endorsement. In ${roleCurrent}, I leaned on ${skillText}. If that resonates, could you endorse me for these strengths? It will help my profile stand out for new opportunities.`;
  };

  const copyToClipboard = async (text) => {
    try {
      if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopyStatus("Copied to clipboard!");
      } else {
        setCopyStatus("Copy not supported in this browser.");
      }
    } catch (err) {
      setCopyStatus("Unable to copy. Please try again.");
    }

    setTimeout(() => setCopyStatus(""), 2400);
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
        <form onSubmit={handleGenerate} aria-busy={loading}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <label style={labelStyle} htmlFor="current-role">
                Current role
              </label>
              <input
                id="current-role"
                name="current-role"
                style={inputStyle}
                placeholder="e.g. Senior Academic Counsellor"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="target-role">
                Target role
              </label>
              <input
                id="target-role"
                name="target-role"
                style={inputStyle}
                placeholder="e.g. Sales Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="experience">
                Years of experience
              </label>
              <input
                id="experience"
                name="experience"
                style={inputStyle}
                placeholder="e.g. 4.5"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="sector">
                Sector (optional)
              </label>
              <input
                id="sector"
                name="sector"
                style={inputStyle}
                placeholder="e.g. Tech, Retail, Healthcare"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              />
            </div>
          </div>

          <label style={labelStyle} htmlFor="job-description">
            Job description (optional)
          </label>
          <textarea
            id="job-description"
            name="job-description"
            style={{ ...inputStyle, height: "110px", resize: "vertical" }}
            placeholder="Paste key parts of the job description here…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <label style={labelStyle} htmlFor="cv-text">
            Your CV text (required)
          </label>
          <textarea
            id="cv-text"
            name="cv-text"
            style={{ ...inputStyle, height: "160px", resize: "vertical" }}
            placeholder="Paste your CV text here…"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            required
          />

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={isGenerateDisabled}
              style={{
                padding: "0.75rem 1.6rem",
                borderRadius: "999px",
                border: "none",
                background: isGenerateDisabled ? "#999" : "#111",
                color: "#fff",
                fontWeight: 600,
                cursor: isGenerateDisabled ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Generating career pack…" : "Generate Career Pack"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              style={{
                padding: "0.75rem 1.1rem",
                borderRadius: "12px",
                border: "1px solid #ccc",
                background: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Clear form
            </button>
          </div>

          <p style={{ marginTop: "0.35rem", color: "#444", fontSize: "0.95rem" }}>
            Tip: CV text is required to generate a career pack. Optional fields help
            tailor the roadmap and ATS guidance.
          </p>

          {error && (
            <p style={{ marginTop: "0.75rem", color: "red" }} role="alert">
              Error: {error}
            </p>
          )}
        </form>
      </section>

      {/* Results */}
      {result && result.ok && (
        <>
          {(() => {
            const endorsementSource = (result.linkedin?.skills?.length
              ? result.linkedin.skills
              : result.skills?.explicit) || [];
            const endorsementSkills = endorsementSource.slice(0, 6);
            const endorsementText = buildEndorsementRequest(
              endorsementSource.slice(0, 5)
            );
            const hasSuggestedSkills = endorsementSkills.length > 0;

            return (
              <section
                style={{
                  ...sectionStyle,
                  background:
                    "linear-gradient(180deg, rgba(17,17,17,0.05) 0%, rgba(17,17,17,0.02) 100%)",
                  border: "1px solid #ddd",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2 style={{ marginBottom: "0.35rem" }}>
                      Endorsement Pitch & Highlights
                    </h2>
                    <p style={{ color: "#444", maxWidth: "720px" }}>
                      Send a friendly, targeted endorsement request with the
                      strengths that will make your profile stand out for your
                      next role.
                    </p>
                  </div>
                  {copyStatus && (
                    <span
                      role="status"
                      aria-live="polite"
                      style={{ color: "#0a7a0a", fontWeight: 600 }}
                    >
                      {copyStatus}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: "1rem",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
                    gap: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #e6e6e6",
                      padding: "1rem",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <h3 style={{ margin: 0 }}>Request message</h3>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(endorsementText)}
                        style={{
                          borderRadius: "999px",
                          border: "1px solid #111",
                          background: "#111",
                          color: "#fff",
                          padding: "0.4rem 0.9rem",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Copy
                      </button>
                    </div>
                    <p style={{ margin: "0.35rem 0 0", color: "#555" }}>
                      Personalise the greeting, then send.
                    </p>
                    <div
                      style={{
                        marginTop: "0.65rem",
                        background: "#f7f7f7",
                        borderRadius: "10px",
                        padding: "0.85rem 1rem",
                        fontSize: "0.98rem",
                        lineHeight: 1.55,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {endorsementText}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #e6e6e6",
                      padding: "1rem",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
                    }}
                  >
                    <h3 style={{ marginTop: 0 }}>Strengths to spotlight</h3>
                    <p style={{ color: "#555", marginTop: "0.2rem" }}>
                      Share the skills you want endorsed. Swap any that don’t
                      fit before sending.
                    </p>
                    {!hasSuggestedSkills && (
                      <p style={{ color: "#666", marginTop: "0.35rem" }}>
                        We couldn’t find skills in your results, so here are
                        three starter strengths you can replace with your own.
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginTop: "0.75rem",
                      }}
                    >
                      {(hasSuggestedSkills
                        ? endorsementSkills
                        : [
                            "Leadership",
                            "Stakeholder management",
                            "Results delivery",
                          ]
                      ).map((skill, idx) => (
                        <span
                          key={`${skill}-${idx}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            padding: "0.45rem 0.7rem",
                            borderRadius: "999px",
                            background: "#f1f1f1",
                            border: "1px solid #e1e1e1",
                            fontWeight: 600,
                            fontSize: "0.92rem",
                          }}
                        >
                          <span
                            aria-hidden
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#111",
                              display: "inline-block",
                            }}
                          />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })()}

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
