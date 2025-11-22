// pages/bundle.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function CareerEngineBundlePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!jobDescription.trim() || !cvText.trim()) {
      const message = "Please paste both the Job Description and your CV.";
      setError(message);
      alert(message);
      return;
    }

    let parsedProfile = {};
    try {
      parsedProfile = userProfile ? JSON.parse(userProfile) : {};
    } catch (err) {
      const message = "User profile must be valid JSON (or leave it blank).";
      setError(message);
      alert(message);
      return;
    }

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const response = await apiPost("/api/career-engine-report", {
        jobDescription,
        cvText,
        userProfile: parsedProfile,
      });

      if (!response?.ok) {
        throw new Error(response?.error || "Could not generate the report.");
      }
      const data = response.data || response;
      setReport(data.report);
    } catch (err) {
      console.error("bundle request error", err);
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={pageStyle}>
      <section style={formSectionStyle}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
          HireEdge Career Engine – Full Report
        </h1>
        <p style={{ color: "#555", marginBottom: "1rem" }}>
          Submit one form to generate ATS analysis, full resume rewrite, skills match,
          roadmap, LinkedIn copy, interview prep and a gap explainer. Results stay in
          plain text for ATS-friendly downloads.
        </p>

        <label style={labelStyle}>Job Description</label>
        <textarea
          style={inputStyle}
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job description..."
        />

        <label style={labelStyle}>Your CV</label>
        <textarea
          style={inputStyle}
          rows={8}
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Paste your existing CV in plain text..."
        />

        <label style={labelStyle}>Optional user profile JSON (e.g. career goals)</label>
        <textarea
          style={inputStyle}
          rows={4}
          value={userProfile}
          onChange={(e) => setUserProfile(e.target.value)}
          placeholder='{"targetRole":"Product Manager","location":"London"}'
        />

        {error && (
          <p style={{ color: "#b42318", marginTop: "0.3rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}

        <button onClick={handleSubmit} disabled={loading} style={primaryBtn}>
          {loading ? "Generating report..." : "Generate Full Report"}
        </button>
      </section>

      {report && (
        <section style={gridStyle}>
          <Card title="ATS Summary">
            <p><strong>Score:</strong> {report.ats?.atsScore ?? "-"}%</p>
            <p style={{ marginTop: "0.5rem" }}>{report.ats?.summary}</p>
            <KeywordList label="Matched" items={report.ats?.matchedKeywords} color="#2e8b57" />
            <KeywordList label="Missing" items={report.ats?.missingKeywords} color="#b42318" />
          </Card>

          <Card title="Full Resume">
            <PreBlock text={report.resume?.resumeText} />
          </Card>

          <Card title="Skills & Gaps">
            <p style={{ marginTop: 0 }}>{report.skills?.summary}</p>
            <KeywordList label="Matched" items={report.skills?.matched} color="#2e8b57" />
            <KeywordList label="Missing" items={report.skills?.missing} color="#b42318" />
          </Card>

          <Card title="Career Roadmap">
            <RoadmapList label="Short term" items={report.roadmap?.shortTerm} />
            <RoadmapList label="Mid term" items={report.roadmap?.midTerm} />
            <RoadmapList label="Long term" items={report.roadmap?.longTerm} />
            {report.roadmap?.salaryGuidance && (
              <p style={{ marginTop: "0.5rem" }}>
                <strong>Salary guidance:</strong> {report.roadmap.salaryGuidance}
              </p>
            )}
          </Card>

          <Card title="Talent Profile">
            <p><strong>Headline:</strong> {report.profile?.headline}</p>
            <p><strong>Summary:</strong> {report.profile?.summary}</p>
            <ul style={listStyle}>
              {(report.profile?.highlights || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>

          <Card title="LinkedIn Optimiser">
            <p><strong>Headline:</strong> {report.linkedin?.headline}</p>
            <p><strong>About:</strong></p>
            <PreBlock text={report.linkedin?.about} />
            <ul style={listStyle}>
              {(report.linkedin?.suggestions || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>

          <Card title="Interview Questions">
            <ul style={listStyle}>
              {(report.interview?.questions || []).map((item, idx) => (
                <li key={`${item.question}-${idx}`}>
                  <strong>{item.question}</strong>
                  <div style={{ fontSize: "0.9rem", color: "#444" }}>{item.guidance}</div>
                </li>
              ))}
            </ul>
            {report.interview?.followUps?.length ? (
              <>
                <p><strong>Follow-ups:</strong></p>
                <ul style={listStyle}>
                  {report.interview.followUps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </Card>

          <Card title="Career Gap Explainer">
            <p style={{ marginTop: 0 }}>{report.gapExplainer?.narrative}</p>
            <PreBlock text={(report.gapExplainer?.cvLines || []).join("\n") || ""} />
            <p><strong>Recruiter email:</strong></p>
            <PreBlock text={report.gapExplainer?.recruiterEmail} />
          </Card>
        </section>
      )}
    </main>
  );
}

function Card({ title, children }) {
  return (
    <div style={cardStyle}>
      <h2 style={cardTitleStyle}>{title}</h2>
      {children}
    </div>
  );
}

function PreBlock({ text }) {
  if (!text) {
    return <p style={{ color: "#777", fontSize: "0.9rem" }}>Result will appear here.</p>;
  }
  return (
    <pre style={preStyle}>
      {text}
    </pre>
  );
}

function KeywordList({ label, items = [], color = "#444" }) {
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <p style={{ marginBottom: "0.35rem" }}>
        <strong style={{ color }}>{label}:</strong>
      </p>
      <div style={chipWrapStyle}>
        {items.length ? (
          items.map((word) => (
            <span key={word} style={{ ...chipBase, borderColor: color, color }}>
              {word}
            </span>
          ))
        ) : (
          <span style={{ color: "#777", fontSize: "0.85rem" }}>No data yet.</span>
        )}
      </div>
    </div>
  );
}

function RoadmapList({ label, items = [] }) {
  if (!items.length) return null;
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <p style={{ marginBottom: "0.35rem" }}>
        <strong>{label}</strong>
      </p>
      <ul style={listStyle}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "2rem 1.5rem 3rem",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  background: "#ffffff",
};

const formSectionStyle = {
  maxWidth: "900px",
  margin: "0 auto 2rem",
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  fontSize: "0.9rem",
  marginTop: "0.75rem",
  marginBottom: "0.3rem",
};

const inputStyle = {
  width: "100%",
  borderRadius: "10px",
  border: "1px solid #ccc",
  padding: "0.75rem",
  fontSize: "0.9rem",
  lineHeight: 1.4,
};

const primaryBtn = {
  marginTop: "1rem",
  padding: "0.8rem 1.4rem",
  borderRadius: "999px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1rem",
  maxWidth: "1100px",
  margin: "0 auto",
};

const cardStyle = {
  border: "1px solid #eee",
  borderRadius: "12px",
  padding: "1rem 1.1rem",
  background: "#fafafa",
};

const cardTitleStyle = {
  fontSize: "1.1rem",
  marginTop: 0,
};

const preStyle = {
  whiteSpace: "pre-wrap",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  fontSize: "0.9rem",
  background: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "0.75rem",
  margin: "0.5rem 0 0",
};

const chipBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.2rem 0.55rem",
  borderRadius: "999px",
  border: "1px solid #999",
  fontSize: "0.8rem",
};

const chipWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
};

const listStyle = {
  paddingLeft: "1.2rem",
  marginTop: "0.4rem",
};
