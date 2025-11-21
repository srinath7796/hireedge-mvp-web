import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function GapPage() {
  const [gapType, setGapType] = useState("relocation");
  const [duration, setDuration] = useState("");
  const [previousRole, setPreviousRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [reasonDetails, setReasonDetails] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!gapType) {
      alert("Please select a gap type.");
      return;
    }

    setLoading(true);
    const res = await apiPost("/api/gap-explainer", {
      gapType,
      duration,
      previousRole,
      targetRole,
      reasonDetails
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
        Career Gap Explainer
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Create a clear explanation for CV, interviews and recruiter emails when
        you have a career break or gap.
      </p>

      <label style={{ fontWeight: 600 }}>Type of gap</label>
      <select
        value={gapType}
        onChange={(e) => setGapType(e.target.value)}
        style={inputStyle}
      >
        <option value="relocation">Relocation / moved country</option>
        <option value="study">Study / further education</option>
        <option value="family">Family responsibilities</option>
        <option value="health">Health (now resolved)</option>
        <option value="job_search">Job search period</option>
        <option value="career_change">Career change / reskilling</option>
        <option value="other">Other / general gap</option>
      </select>

      <label style={{ fontWeight: 600 }}>Approximate duration (optional)</label>
      <input
        placeholder="e.g. 6 months, 1 year"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        style={inputStyle}
      />

      <label style={{ fontWeight: 600 }}>Previous role (optional)</label>
      <input
        placeholder="e.g. Sales Executive"
        value={previousRole}
        onChange={(e) => setPreviousRole(e.target.value)}
        style={inputStyle}
      />

      <label style={{ fontWeight: 600 }}>Target role now (optional)</label>
      <input
        placeholder="e.g. Sales Manager in UK retail"
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value)}
        style={inputStyle}
      />

      <label style={{ fontWeight: 600 }}>
        Anything important you did in this period? (optional)
      </label>
      <textarea
        placeholder="e.g. completed online courses, looked after family, learnt about UK job market..."
        value={reasonDetails}
        onChange={(e) => setReasonDetails(e.target.value)}
        style={taStyle}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={btnStyle}
      >
        {loading ? "Generating..." : "Generate Explanations"}
      </button>

      {result && result.ok && (
        <section style={{ marginTop: "2rem" }}>
          {result.durationText && (
            <p style={{ color: "#555" }}>{result.durationText}</p>
          )}

          <div style={cardStyle}>
            <h2>CV Line</h2>
            <p>{result.cvLine}</p>
          </div>

          <div style={cardStyle}>
            <h2>Interview Answer</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{result.interviewAnswer}</p>
          </div>

          <div style={cardStyle}>
            <h2>Email Paragraph to Recruiter / Hiring Manager</h2>
            <p>{result.emailParagraph}</p>
          </div>

          <p style={{ marginTop: "1rem", color: "#555" }}>{result.note}</p>
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

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  marginTop: "0.5rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const taStyle = {
  width: "100%",
  height: "110px",
  marginTop: "0.5rem",
  marginBottom: "1.5rem",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid "#ccc"
};

const btnStyle = {
  padding: "0.75rem 1.5rem",
  borderRadius: "999px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};

const cardStyle = {
  marginTop: "1.5rem",
  padding: "1.25rem",
  borderRadius: "12px",
  border: "1px solid #eee",
  background: "#fafafa",
  lineHeight: 1.6
};
