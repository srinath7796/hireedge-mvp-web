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
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setError("");
    setResult(null);

    if (!cvText) {
      setError("Please paste your CV text first.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiPost("/api/career-pack", {
        currentRole,
        targetRole,
        experienceYears,
        sector,
        jobDescription,
        cvText
      });

      console.log("Career pack result:", res); // helpful for debugging

      if (!res || res.ok === false) {
        setError(res?.error || "Career pack generation failed");
        setResult(null);
      } else {
        setResult(res);
      }
    } catch (e) {
      console.error("Career pack error", e);
      setError("Network or server error while generating pack.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const sectionCard = (title, content) => (
    <section
      style={{
        marginTop: "1.5rem",
        padding: "1rem 1.25rem",
        borderRadius: "12px",
        border: "1px solid #eee",
        background: "#fafafa"
      }}
    >
      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{title}</h2>
      {content}
    </section>
  );

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        HireEdge – One-Click Career Pack
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555", maxWidth: "700px" }}>
        Paste your job description and CV once. HireEdge will generate ATS
        match, skills gaps, 3-stage roadmap, LinkedIn copy, interview questions
        and visa hints in one go.
      </p>

      {/* Form */}
      <div
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
            placeholder="e.g. Sales Assistant"
            style={{
              width: "100%",
              marginTop: "0.4rem",
              padding: "0.65rem",
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
              padding: "0.65rem",
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
              padding: "0.65rem",
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
            placeholder="e.g. Retail, Tech"
            style={{
              width: "100%",
              marginTop: "0.4rem",
              padding: "0.65rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem"
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Job description (optional)</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here"
            style={{
              width: "100%",
              height: "180px",
              marginTop: "0.4rem",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Your CV text (required)</label>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your CV text here"
            style={{
              width: "100%",
              height: "180px",
              marginTop: "0.4rem",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "0.8rem 1.7rem",
          borderRadius: "999px",
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 600,
          cursor: loading ? "default" : "pointer"
        }}
      >
        {loading ? "Generating Career Pack..." : "Generate Career Pack"}
      </button>

      {error && (
        <p style={{ marginTop: "0.75rem", color: "red", fontSize: "0.9rem" }}>
          Error: {error}
        </p>
      )}

      {/* Results */}
      {result && result.ok && (
        <div style={{ marginTop: "2rem" }}>
          {result.summary &&
            sectionCard("Career Snapshot", <p>{result.summary}</p>)}

          {result.ats &&
            sectionCard(
              "ATS Match & Resume Optimisation",
              <div>
                {result.ats.score != null && (
                  <p>
                    <strong>ATS Match Score:</strong> {result.ats.score}%
                  </p>
                )}
                {result.ats.matchedKeywords && (
                  <p>
                    <strong>Matched keywords:</strong>{" "}
                    {result.ats.matchedKeywords.join(", ")}
                  </p>
                )}
                {result.ats.missingKeywords &&
                  result.ats.missingKeywords.length > 0 && (
                    <p>
                      <strong>Missing keywords:</strong>{" "}
                      {result.ats.missingKeywords.join(", ")}
                    </p>
                  )}
                {result.ats.optimisedSummary && (
                  <>
                    <h3 style={{ marginTop: "0.75rem" }}>Optimised Summary</h3>
                    <p>{result.ats.optimisedSummary}</p>
                  </>
                )}
              </div>
            )}

          {result.skills &&
            sectionCard(
              "Skills Match & Gap Plan",
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1rem"
                }}
              >
                <div>
                  <h3>Matched Skills</h3>
                  <ul>
                    {(result.skills.matched || []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Partially Matched</h3>
                  <ul>
                    {(result.skills.partial || []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Missing Skills & Actions</h3>
                  <ul>
                    {(result.skills.missingPlan || []).map((item, i) => (
                      <li key={i}>
                        <strong>{item.skill}:</strong> {item.actions.join(" • ")}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          {result.roadmap &&
            sectionCard(
              "3-Stage Career Roadmap",
              <div>
                {result.roadmap.summary && <p>{result.roadmap.summary}</p>}
                <ul style={{ paddingLeft: "1.25rem" }}>
                  {(result.roadmap.stages || []).map((stage, i) => (
                    <li key={i} style={{ marginBottom: "0.75rem" }}>
                      <strong>
                        {stage.name} – {stage.duration || ""}
                      </strong>
                      {stage.goals && (
                        <p style={{ margin: "0.25rem 0" }}>
                          Goals: {stage.goals.join(", ")}
                        </p>
                      )}
                      {stage.actions && (
                        <ul style={{ paddingLeft: "1.25rem" }}>
                          {stage.actions.map((a, j) => (
                            <li key={j}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {result.linkedin &&
            sectionCard(
              "LinkedIn Headline & About",
              <div>
                {result.linkedin.headline && (
                  <>
                    <h3>Headline</h3>
                    <p>{result.linkedin.headline}</p>
                  </>
                )}
                {result.linkedin.about && (
                  <>
                    <h3>About</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                      {result.linkedin.about}
                    </p>
                  </>
                )}
                {result.linkedin.strengths && (
                  <>
                    <h3>Strengths</h3>
                    <ul>
                      {result.linkedin.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

          {result.interview &&
            sectionCard(
              "Interview Questions & Model Answers",
              <div>
                {(result.interview.questions || []).map((q, i) => (
                  <div key={i} style={{ marginBottom: "0.75rem" }}>
                    <p>
                      <strong>Q{i + 1}.</strong> {q.question}
                    </p>
                    {q.answer && (
                      <p style={{ marginLeft: "0.5rem", color: "#444" }}>
                        <strong>Suggested answer:</strong> {q.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          {result.visa &&
            sectionCard(
              "Visa Sponsorship Pathway Hints",
              <div>
                {result.visa.summary && <p>{result.visa.summary}</p>}
                {(result.visa.routes || []).map((route, i) => (
                  <div key={i} style={{ marginTop: "0.75rem" }}>
                    <p>
                      <strong>{route.name}</strong>
                    </p>
                    {route.notes && <p style={{ color: "#555" }}>{route.notes}</p>}
                    {route.steps && (
                      <ul style={{ paddingLeft: "1.25rem" }}>
                        {route.steps.map((s, j) => (
                          <li key={j}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Debug fallback – show raw JSON if nothing rendered */}
      {result && !result.ok && !error && (
        <section style={{ marginTop: "2rem" }}>
          <h2>Raw AI response (debug)</h2>
          <pre
            style={{
              background: "#111",
              color: "#0f0",
              padding: "1rem",
              borderRadius: "8px",
              overflowX: "auto",
              fontSize: "0.8rem"
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}
