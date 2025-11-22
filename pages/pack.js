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

    if (!cvText) {
      alert("Please paste your CV text first.");
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

      if (!res || res.ok === false) {
        setError(res?.error || "Career pack generation failed");
      } else {
        // res is exactly the JSON you showed:
        // { ok, ats, skills, roadmap, linkedin, interview, visa }
        setResult(res);
      }
    } catch (e) {
      console.error("career-pack error", e);
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
    marginTop: "1rem",
    background: "#fafafa"
  };

  const sectionTitleStyle = {
    fontWeight: 600,
    marginBottom: "0.75rem"
  };

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        HireEdge – One-Click Career Pack
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555", maxWidth: "650px" }}>
        Paste your job description and CV once. HireEdge will generate ATS
        match, skills gaps, 3-stage roadmap, LinkedIn copy, interview questions
        and UK visa hints in one go.
      </p>

      {/* FORM GRID */}
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
            placeholder="e.g. Senior Academic Counsellor"
            style={{
              width: "100%",
              marginTop: "0.5rem",
              padding: "0.75rem",
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
              marginTop: "0.5rem",
              padding: "0.75rem",
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
              marginTop: "0.5rem",
              padding: "0.75rem",
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
              marginTop: "0.5rem",
              padding: "0.75rem",
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
            placeholder="Paste the main part of the job description here"
            style={{
              width: "100%",
              height: "160px",
              marginTop: "0.5rem",
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
            placeholder="Paste your CV text here"
            style={{
              width: "100%",
              height: "160px",
              marginTop: "0.5rem",
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
          padding: "0.8rem 1.8rem",
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
        <p style={{ marginTop: "1rem", color: "red" }}>
          Error: {error}
        </p>
      )}

      {/* RESULT SECTIONS */}
      {result && result.ok && (
        <div style={{ marginTop: "2rem" }}>
          {/* 1. ATS */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
              ATS Match &amp; Resume Optimisation
            </div>
            {result.ats ? (
              <>
                <p style={{ margin: "0 0 0.5rem 0" }}>
                  <strong>ATS Match:</strong>{" "}
                  {result.ats.match ? "Likely match" : "Gaps found"}
                </p>

                {result.ats.gaps && result.ats.gaps.length > 0 && (
                  <>
                    <p style={{ margin: "0.5rem 0 0.25rem 0" }}>
                      <strong>Key gaps:</strong>
                    </p>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                      {result.ats.gaps.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </>
                )}

                {result.ats.recommendations &&
                  result.ats.recommendations.length > 0 && (
                    <>
                      <p style={{ margin: "0.75rem 0 0.25rem 0" }}>
                        <strong>Optimisation suggestions:</strong>
                      </p>
                      <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                        {result.ats.recommendations.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}
              </>
            ) : (
              <p>No ATS data returned.</p>
            )}
          </div>

          {/* 2. Skills */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Skills Match &amp; Gap Plan</div>
            {result.skills ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem"
                }}
              >
                <div>
                  <p>
                    <strong>Matched skills</strong>
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                    {result.skills.explicit?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p>
                    <strong>Missing skills</strong>
                  </p>
                  {result.skills.missing && result.skills.missing.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                      {result.skills.missing.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No major missing skills detected.</p>
                  )}
                </div>
              </div>
            ) : (
              <p>No skills data returned.</p>
            )}
          </div>

          {/* 3. Roadmap */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>3-Stage Career Roadmap</div>
            {result.roadmap ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "1rem"
                }}
              >
                <div>
                  <p>
                    <strong>Immediate actions</strong>
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                    {result.roadmap.immediate?.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p>
                    <strong>Short-term (next 6–12 months)</strong>
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                    {result.roadmap.short_term?.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p>
                    <strong>Long-term direction</strong>
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                    {result.roadmap.long_term?.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p>No roadmap data returned.</p>
            )}
          </div>

          {/* 4. LinkedIn */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>LinkedIn Headline &amp; About</div>
            {result.linkedin ? (
              <>
                <p>
                  <strong>Suggested headline</strong>
                </p>
                <p style={{ marginTop: 0 }}>{result.linkedin.headline}</p>

                <p style={{ marginTop: "1rem" }}>
                  <strong>About / Summary</strong>
                </p>
                <p style={{ whiteSpace: "pre-line", marginTop: 0 }}>
                  {result.linkedin.summary}
                </p>

                {result.linkedin.skills && (
                  <>
                    <p style={{ marginTop: "1rem" }}>
                      <strong>Key LinkedIn skills</strong>
                    </p>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                      {result.linkedin.skills.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <p>No LinkedIn data returned.</p>
            )}
          </div>

          {/* 5. Interview */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
              Interview Questions &amp; Model Answers (Hints)
            </div>
            {result.interview ? (
              <>
                {result.interview.tips && (
                  <>
                    <p>
                      <strong>Preparation tips</strong>
                    </p>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                      {result.interview.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </>
                )}

                {result.interview.example_questions && (
                  <>
                    <p style={{ marginTop: "1rem" }}>
                      <strong>Example questions to practise</strong>
                    </p>
                    <ol style={{ margin: 0, paddingLeft: "1.25rem" }}>
                      {result.interview.example_questions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ol>
                  </>
                )}
              </>
            ) : (
              <p>No interview hints returned.</p>
            )}
          </div>

          {/* 6. Visa */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
              Visa Sponsorship Pathway Hints
            </div>
            {result.visa ? (
              <>
                <p>
                  <strong>Status:</strong> {result.visa.status || "Not specified"}
                </p>
                {result.visa.recommendation && (
                  <p style={{ marginTop: "0.5rem" }}>
                    <strong>Recommendation:</strong>{" "}
                    {result.visa.recommendation}
                  </p>
                )}
              </>
            ) : (
              <p>No visa hints returned.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
