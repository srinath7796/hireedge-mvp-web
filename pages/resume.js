// pages/resume.js
import { useCallback, useState } from "react";
import { apiPost } from "../utils/apiClient";

const INPUT_ERROR = "Please paste both Job Description and CV.";

export default function ResumeOptimiserPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");

  const [atsScore, setAtsScore] = useState(null);
  const [matched, setMatched] = useState([]);
  const [missing, setMissing] = useState([]);
  const [optimisedDraft, setOptimisedDraft] = useState("");

  const [fullResume, setFullResume] = useState("");
  const [error, setError] = useState("");

  const [loadingAts, setLoadingAts] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);

  const guardInputs = useCallback(() => {
    if (!jobDescription.trim() || !cvText.trim()) {
      setError(INPUT_ERROR);
      alert(INPUT_ERROR);
      return false;
    }
    setError("");
    return true;
  }, [jobDescription, cvText]);

  const handleAnalyse = async () => {
    if (!guardInputs()) return;
    setLoadingAts(true);
    try {
      const response = await apiPost("/api/generate-resume", {
        jobDescription,
        cvText,
      });
      if (!response?.ok) {
        throw new Error(response?.error || "Something went wrong with ATS analysis.");
      }
      const data = response.data || response;
      setAtsScore(data.atsScore ?? null);
      setMatched(data.matchedKeywords || []);
      setMissing(data.missingKeywords || []);
      setOptimisedDraft(data.optimisedResume || "");
    } catch (err) {
      console.error("ATS analysis error", err);
      setError(err.message);
      alert(err.message);
    } finally {
      setLoadingAts(false);
    }
  };

  const handleFullResume = async () => {
    if (!guardInputs()) return;
    setLoadingFull(true);
    try {
      const response = await apiPost("/api/resume-writer", {
        jobDescription,
        cvText,
      });
      if (!response?.ok) {
        throw new Error(
          response?.error || "Something went wrong generating the full resume."
        );
      }
      const data = response.data || response;
      setFullResume(data.resumeText || "");
    } catch (err) {
      console.error("Full resume error", err);
      setError(err.message);
      alert(err.message);
    } finally {
      setLoadingFull(false);
    }
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

  const handleDownloadPdf = async () => {
    if (!fullResume) {
      alert("Generate the full resume first.");
      return;
    }
    try {
      setDownloadingPdf(true);
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      const margin = 40;
      const lineHeight = 14;
      const maxWidth = 515; // 595 - 2*40
      let y = margin;

      const lines = doc.splitTextToSize(fullResume, maxWidth);
      lines.forEach((line) => {
        if (y > 800 - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      doc.save("hireedge-resume.pdf");
    } catch (err) {
      console.error("PDF download error", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadWord = () => {
    if (!fullResume) {
      alert("Generate the full resume first.");
      return;
    }
    try {
      setDownloadingWord(true);
      const blob = new Blob([fullResume], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hireedge-resume.doc";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Word download error", err);
      alert("Could not generate Word document. Please try again.");
    } finally {
      setDownloadingWord(false);
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

          {error && (
            <p style={{ color: "#b42318", marginTop: "0.3rem", fontSize: "0.9rem" }}>
              {error}
            </p>
          )}

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
        <div style={blockStyle}>
          <h2 style={h2Style}>ATS Match Overview</h2>
          {atsScore !== null && (
            <p style={{ fontWeight: 600 }}>
              ATS Match Score: <span>{atsScore}%</span>
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

        <div style={blockStyle}>
          <div style={fullHeaderStyle}>
            <h2 style={h2Style}>Full AI Resume (Send to Recruiters)</h2>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              <button
                onClick={handleCopyFull}
                disabled={!fullResume}
                style={copyBtnStyle}
              >
                Copy Text
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={!fullResume || downloadingPdf}
                style={copyBtnStyle}
              >
                {downloadingPdf ? "Downloading..." : "Download PDF"}
              </button>
              <button
                onClick={handleDownloadWord}
                disabled={!fullResume || downloadingWord}
                style={copyBtnStyle}
              >
                {downloadingWord ? "Downloading..." : "Download Word"}
              </button>
            </div>
          </div>
          <div style={preBoxStyle}>
            {fullResume ? (
              <pre style={preStyle}>{fullResume}</pre>
            ) : (
              <p style={{ color: "#777", fontSize: "0.9rem" }}>
                Click <strong>Generate Full Resume</strong> to create a clean,
                ATS-friendly resume you can paste into Word/Google Docs and save as PDF,
                or download directly.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "2rem 1.5rem 3rem",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
};

const topSectionStyle = {
  maxWidth: "1100px",
  margin: "0 auto 2rem",
};

const columnStyle = {
  maxWidth: "900px",
  margin: "0 auto",
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  fontSize: "0.9rem",
  marginTop: "0.75rem",
  marginBottom: "0.3rem",
};

const taStyle = {
  width: "100%",
  borderRadius: "10px",
  border: "1px solid #ccc",
  padding: "0.75rem",
  fontSize: "0.9rem",
  lineHeight: 1.4,
};

const btnRowStyle = {
  display: "flex",
  gap: "0.75rem",
  marginTop: "0.9rem",
  flexWrap: "wrap",
};

const primaryBtn = {
  padding: "0.7rem 1.3rem",
  borderRadius: "999px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "0.7rem 1.3rem",
  borderRadius: "999px",
  border: "1px solid #111",
  background: "#fff",
  color: "#111",
  fontWeight: 600,
  cursor: "pointer",
};

const bottomSectionStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
  gap: "1.5rem",
};

const blockStyle = {
  borderRadius: "14px",
  border: "1px solid #eee",
  padding: "1rem 1.2rem",
  background: "#fafafa",
};

const h2Style = {
  fontSize: "1.2rem",
  margin: 0,
  marginBottom: "0.5rem",
};

const h3Style = {
  fontSize: "1rem",
  marginTop: "0.75rem",
  marginBottom: "0.4rem",
};

const keywordGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  gap: "0.75rem",
  marginTop: "0.5rem",
};

const chipWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
};

const chipBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.2rem 0.55rem",
  borderRadius: "999px",
  fontSize: "0.8rem",
};

const chipGreen = {
  ...chipBase,
  background: "#e8f9f0",
  border: "1px solid #9bd7b5",
};

const chipRed = {
  ...chipBase,
  background: "#fdeced",
  border: "1px solid #f6a5ac",
};

const preBoxStyle = {
  marginTop: "0.75rem",
  borderRadius: "10px",
  border: "1px solid #e0e0e0",
  background: "#fff",
  padding: "0.8rem",
  maxHeight: "420px",
  overflow: "auto",
};

const preStyle = {
  whiteSpace: "pre-wrap",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  fontSize: "0.85rem",
  margin: 0,
};

const fullHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.5rem",
};

const copyBtnStyle = {
  padding: "0.4rem 0.9rem",
  borderRadius: "999px",
  border: "1px solid #ccc",
  background: "#fff",
  fontSize: "0.85rem",
  cursor: "pointer",
};
