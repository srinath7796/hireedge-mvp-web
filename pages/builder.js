// pages/builder.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function ResumeBuilderPage() {
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [tone, setTone] = useState("professional");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!fullName || !targetRole) {
      alert("Please fill at least Full name and Target role.");
      return;
    }
    setLoading(true);
    const res = await apiPost("/api/generate-resume", {
      fullName,
      headline,
      location,
      email,
      phone,
      summary,
      experience,
      education,
      skills,
      targetRole,
      tone
    });
    if (res && res.ok) {
      setResult(res.resumeText || "");
    } else {
      setResult("");
      alert(res?.error || "Something went wrong");
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      alert("Resume copied to clipboard.");
    } catch {
      alert("Could not copy. Please copy manually.");
    }
  };

  return (
    <main style={pageStyle}>
      <section style={leftPaneStyle}>
        <h1 style={{ fontSize: "1.9rem", marginBottom: "0.5rem" }}>
          AI Resume Builder
        </h1>
        <p style={{ color: "#555", marginBottom: "1.5rem" }}>
          Enter your details and target role. HireEdge AI will generate a clean,
          ATS-friendly resume you can copy into Word, PDF or your job portal.
        </p>

        <div style={twoColGrid}>
          <div>
            <label style={labelStyle}>Full name*</label>
            <input
              style={inputStyle}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Srinath Senthilkumar"
            />
          </div>
          <div>
            <label style={labelStyle}>Target role*</label>
            <input
              style={inputStyle}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Sales Manager – UK Retail"
            />
          </div>
        </div>

        <div style={twoColGrid}>
          <div>
            <label style={labelStyle}>Headline / current title</label>
            <input
              style={inputStyle}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Sales Manager | CareerTech Founder"
            />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input
              style={inputStyle}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. London, UK"
            />
          </div>
        </div>

        <div style={twoColGrid}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input
              style={inputStyle}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 ..."
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Professional summary</label>
          <textarea
            style={taStyle}
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Briefly describe your background, strengths and what you are looking for."
          />
        </div>

        <div>
          <label style={labelStyle}>
            Experience (roles, companies, responsibilities, achievements)
          </label>
          <textarea
            style={taStyle}
            rows={5}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="- Job Title, Company, dates&#10;- Key achievements, metrics, responsibilities..."
          />
        </div>

        <div>
          <label style={labelStyle}>Education</label>
          <textarea
            style={taStyle}
            rows={3}
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="- Degree, University, location, year&#10;- Any key modules or distinctions..."
          />
        </div>

        <div>
          <label style={labelStyle}>Skills (comma-separated)</label>
          <textarea
            style={taStyle}
            rows={2}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. sales, CRM, leadership, customer success, data analysis"
          />
        </div>

        <div>
          <label style={labelStyle}>Tone</label>
          <select
            style={inputStyle}
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="professional">Professional</option>
            <option value="confident">Confident</option>
            <option value="friendly">Friendly</option>
            <option value="concise">Very concise</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={btnStyle}
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </section>

      <section style={rightPaneStyle}>
        <div style={previewHeaderStyle}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Resume Preview</h2>
          <button
            onClick={handleCopy}
            disabled={!result}
            style={copyBtnStyle}
          >
            Copy Text
          </button>
        </div>
        <div style={previewBoxStyle}>
          {result ? (
            <pre style={preStyle}>{result}</pre>
          ) : (
            <p style={{ color: "#777" }}>
              Your generated resume will appear here. After copying, you can
              paste into Word/Google Docs and export as PDF.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

// ---- styles ----
const pageStyle = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
  gap: "2rem",
  padding: "2.5rem 1.5rem",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
};

const leftPaneStyle = {
  maxWidth: "720px",
  margin: "0 auto"
};

const rightPaneStyle = {
  maxWidth: "520px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column"
};

const twoColGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "0.9rem",
  marginBottom: "0.75rem"
};

const labelStyle = {
  fontWeight: 600,
  fontSize: "0.9rem"
};

const inputStyle = {
  width: "100%",
  padding: "0.55rem 0.75rem",
  marginTop: "0.3rem",
  marginBottom: "0.6rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "0.9rem"
};

const taStyle = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  marginTop: "0.3rem",
  marginBottom: "0.8rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "0.9rem",
  lineHeight: 1.4
};

const btnStyle = {
  marginTop: "0.5rem",
  padding: "0.8rem 1.6rem",
  borderRadius: "999px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};

const previewHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "0.75rem"
};

const copyBtnStyle = {
  padding: "0.45rem 0.9rem",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#f5f5f5",
  fontSize: "0.85rem",
  cursor: "pointer"
};

const previewBoxStyle = {
  flex: 1,
  borderRadius: "12px",
  border: "1px solid #eee",
  padding: "1rem",
  background: "#fafafa",
  overflow: "auto"
};

const preStyle = {
  whiteSpace: "pre-wrap",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  fontSize: "0.85rem",
  lineHeight: 1.5,
  margin: 0
};
