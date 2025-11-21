// pages/resume.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function ResumeOptimiserPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");

  const [atsScore, setAtsScore] = useState(null);
  const [matched, setMatched] = useState([]);
  const [missing, setMissing] = useState([]);
  const [optimisedDraft, setOptimisedDraft] = useState("");

  const [fullResume, setFullResume] = useState("");
  const [loadingAts, setLoadingAts] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);

  const handleAnalyse = async () => {
    if (!jobDescription || !cvText) {
      alert("Please paste both Job Description and CV.");
      return;
    }
    setLoadingAts(true);
    const res = await apiPost("/api/generate-resume", {
      jobDescription,
      cvText
    });
    if (res && res.ok) {
      setAtsScore(res.atsScore);
      setMatched(res.matchedKeywords || []);
      setMissing(res.missingKeywords || []);
      setOptimisedDraft(res.optimisedResume || "");
    } else {
      alert(res?.error || "Something went wrong with ATS analysis.");
    }
    setLoadingAts(false);
  };

  const handleFullResume = async () => {
    if (!jobDescription || !cvText) {
      alert("Please paste both Job Description and CV.");
      return;
    }
    setLoadingFull(true);
    const res = await apiPost("/api/resume-writer", {
      jobDescription,
      cvText
    });
    if (res && res.ok) {
      setFullResume(res.resumeText || "");
    } else {
      alert(res?.error || "Something went wrong generating full resume.");
    }
    setLoadingFull(false);
  };

  const handleCopyFull = async () => {
    if (!fullResume) return;
    try {
      await navigator.clipboard.writeText(fullResume);
      alert("Full resume copied. Paste into Word/Docs and save as PDF.");
    } catch {
      alert("Could not copy automatically. Please copy manually.");
    }
  };

  return (
    <main style={pageStyle}>
      <section style={topSectionStyle}>
        <div style={columnStyle}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            ATS Resume Optimiser & AI Resume Writer
          </h1>
          <p style={{ color: "#555", marginBottom: "1rem" }}>
            Paste the job description and your current CV. HireEdge will analyse
            the ATS match, highlight keywords and generate a fully rewritten,
            recruiter-ready resume.
          </p>

          <label style={labelStyle}>Job Description</label>
          <textarea
            style={taStyle}
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
          />

          <label style={labelStyle}>Your CV</label>
          <textarea
            style={taStyle}
            rows={10}
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your existing CV text here..."
          />

          <div style={btnRowStyle}>
            <button
              onClick={handleAnalyse}
              disabled={loadingAts}
              style={primaryBtn}
            >
              {loadingAts ? "Analysing..." : "Analyse ATS Match"}
            </button>
            <button
              onClick={handleFullResume}
              disabled={loadingFull}
              style={secondaryBtn}
            >
              {loadingFull ? "Generating full resume..." : "Generate Full Resume"}
            </button>
          </div>
        </div>
      </section>

      <section style={bottomSectionStyle}>
        {/* ATS Overview */}
        <div style={blockStyle}>
          <h2 style={h2Style}>ATS Match Overview</h2>
          {atsScore !== null && (
            <p style={{ fontWeight: 600 }}>
              ATS Match Score:{" "}
              <span>
                {atsScore}
                {"%"}
              </span>
            </p>
          )}

          <div style={keywordGridStyle}>
            <div>
              <h3 style={h3Style}>Matched Keywords</h3>
              <div style={chipWrapStyle}>
                {matched.map((w) => (
                  <span key={w} style={chipGreen}>
                    {w}
                  </span>
                ))}
                {!matched.length && (
                  <p style={{ color: "#777", fontSize: "0.9rem" }}>
                    Run analysis to see matched keywords.
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 style={h3Style}>Missing Keywords</h3>
              <div style={chipWrapStyle}>
                {missing.map((w) => (
                  <span key={w} style={chipRed}>
                    {w}
                  </span>
                ))}
                {!missing.length && (
                  <p style={{ color: "#777", fontSize: "0.9rem" }}>
                    Run analysis to see missing keywords.
                  </p>
                )}
              </div>
            </div>
          </div>

          <h3 style={h3Style}>Optimised Resume Draft (Summary)</h3>
          <div style={preBoxStyle}>
            {optimisedDraft ? (
              <pre style={preStyle}>{optimisedDraft}</pre>
            ) : (
              <p style={{ color: "#777", fontSize: "0.9rem" }}>
                After ATS analysis, a short optimised draft will appear here.
              </p>
            )}
          </div>
        </div>

        {/* Full AI Resume */}
        <div style={blockStyle}>
          <div style={fullHeaderStyle}>
            <h2 style={h2Style}>Full AI Resume (Send to Recruiters)</h2>
            <button
              onClick={handleCopyFull}
              disabled={!fullResume}
              style={copyBtnStyle}
            >
              Copy Resume Text
            </button>
          </div>
          <div style={preBoxStyle}>
            {fullResume ? (
              <pre style={preStyle}>{fullResume}</pre>
            ) : (
              <p style={{ color: "#777", fontSize: "0.9rem" }}>
                Click <strong>Generate Full Resume</strong> to create a clean,
                ATS-friendly resume you can paste into Word/Google Docs and
                save as PDF.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// ---- styles ----
const pageStyle = {
  minHeight: "100vh",
  padding: "2rem 1.5rem 3rem",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
};

const topSectionStyle = {
  maxWidth: "1100px",
  margin: "0 auto 2rem"
};

const columnStyle = {
  maxWidth: "900px",
  margin: "0 auto"
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  fontSize: "0.9rem",
  marginTop: "0.75rem",
  marginBottom: "0.3rem"
};

const taStyle = {
  width: "100%",
  borderRadius: "10px",
  border: "1px solid #ccc",
  padding: "0.75rem",
  fontSize: "0.9rem",
  lineHeight: 1.4
};

const btnRowStyle = {
  display: "flex",
  gap: "0.75rem",
  marginTop: "0.9rem",
  flexWrap: "wrap"
};

const primaryBtn = {
  padding: "0.7rem 1.3rem",
  borderRadius: "999px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};

const secondaryBtn = {
  padding: "0.7rem 1.3rem",
  borderRadius: "999px",
  border: "1px solid #111",
  background: "#fff",
  color: "#111",
  fontWeight: 600,
  cursor: "pointer"
};

const bottomSectionStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
  gap: "1.5rem"
};

const blockStyle = {
  borderRadius: "14px",
  border: "1px solid #eee",
  padding: "1rem 1.2rem",
  background: "#fafafa"
};

const h2Style = {
  fontSize: "1.2rem",
  margin: 0,
  marginBottom: "0.5rem"
};

const h3Style = {
  fontSize: "1rem",
  marginTop: "0.75rem",
  marginBottom: "0.4rem"
};

const keywordGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  gap: "0.75rem",
  marginTop: "0.5rem"
};

const chipWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem"
};

const chipBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.2rem 0.55rem",
  borderRadius: "999px",
  fontSize: "0.8rem"
};

const chipGreen = {
  ...chipBase,
  background: "#e8f9f0",
  border: "1px solid #9bd7b5"
};

const chipRed = {
  ...chipBase,
  background: "#fdeced",
  border: "1px solid #f6a5ac"
};

const preBoxStyle = {
  marginTop: "0.75rem",
  borderRadius: "10px",
  border: "1px solid #e0e0e0",
  background: "#fff",
  padding: "0.8rem",
  maxHeight: "420px",
  overflow: "auto"
};

const preStyle = {
  whiteSpace: "pre-wrap",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  fontSize: "0.85rem",
  margin: 0
};

const fullHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.5rem"
};

const copyBtnStyle = {
  padding: "0.4rem 0.9rem",
  borderRadius: "999px",
  border: "1px solid #ccc",
  background: "#fff",
  fontSize: "0.85rem",
  cursor: "pointer"
};
