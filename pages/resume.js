// pages/resume.js
import { useCallback, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { Card, Section } from "../components/ui/Card";
import Textarea from "../components/ui/Textarea";
import { PrimaryButton, SecondaryButton, GhostButton } from "../components/ui/Button";
import { ErrorBanner, SuccessBanner } from "../components/ui/Alert";
import { LoadingDots } from "../components/ui/Loading";
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
  const [success, setSuccess] = useState("");

  const [loadingAts, setLoadingAts] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);

  const disableActions = useMemo(
    () => loadingAts || loadingFull || downloadingPdf || downloadingWord,
    [loadingAts, loadingFull, downloadingPdf, downloadingWord]
  );

  const guardInputs = useCallback(() => {
    if (!jobDescription.trim() || !cvText.trim()) {
      setError(INPUT_ERROR);
      return false;
    }
    setError("");
    return true;
  }, [jobDescription, cvText]);

  const handleAnalyse = async () => {
    if (!guardInputs()) return;
    setLoadingAts(true);
    setSuccess("");
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
    } finally {
      setLoadingAts(false);
    }
  };

  const handleFullResume = async () => {
    if (!guardInputs()) return;
    setLoadingFull(true);
    setSuccess("");
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
      setSuccess("Full resume ready. Copy or download below.");
    } catch (err) {
      console.error("Full resume error", err);
      setError(err.message);
    } finally {
      setLoadingFull(false);
    }
  };

  const handleCopyFull = async () => {
    if (!fullResume) return;
    try {
      await navigator.clipboard.writeText(fullResume);
      setSuccess("Full resume copied. Paste into Word/Docs and save as PDF.");
    } catch {
      setError("Could not copy automatically. Please copy manually.");
    }
  };

  const handleDownloadPdf = async () => {
    if (!fullResume) {
      setError("Generate the full resume first.");
      return;
    }
    try {
      setDownloadingPdf(true);
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      const margin = 40;
      const lineHeight = 14;
      const maxWidth = 515;
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
      setSuccess("PDF downloaded.");
    } catch (err) {
      console.error("PDF download error", err);
      setError("Could not generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadWord = () => {
    if (!fullResume) {
      setError("Generate the full resume first.");
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
      setSuccess("Word document downloaded.");
    } catch (err) {
      console.error("Word download error", err);
      setError("Could not generate Word document. Please try again.");
    } finally {
      setDownloadingWord(false);
    }
  };

  return (
    <Layout
      title="ATS Resume Optimiser & AI Resume Writer"
      subtitle="Paste the job description and your current CV. HireEdge will analyse the ATS match, highlight keywords and generate a fully rewritten, recruiter-ready resume."
    >
      <Section>
        <Card
          title="Your inputs"
          subtitle="Structured fields keep the ATS and resume writer focused on the right signals."
          actions={
            (loadingAts || loadingFull) && (
              <LoadingDots label={loadingAts ? "Analysing..." : "Generating..."} />
            )
          }
        >
          <div className="form-grid">
            <Textarea
              id="jobDescription"
              label="Job Description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              aria-required
            />
            <Textarea
              id="cvText"
              label="Your CV"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your existing CV text here..."
              aria-required
            />
          </div>

          <div className="inline-actions mt-12">
            <PrimaryButton onClick={handleAnalyse} disabled={loadingAts || disableActions}>
              {loadingAts ? "Analysing..." : "Analyse ATS Match"}
            </PrimaryButton>
            <SecondaryButton onClick={handleFullResume} disabled={loadingFull || disableActions}>
              {loadingFull ? "Generating resume..." : "Generate Full Resume"}
            </SecondaryButton>
          </div>

          <div className="stack mt-12">
            <ErrorBanner message={error} />
            <SuccessBanner message={success} />
          </div>
        </Card>
      </Section>

      <Section title="Results" subtitle="ATS signals on the left, recruiter-ready resume on the right.">
        <div className="card-grid">
          <Card title="ATS Match Overview">
            {atsScore !== null && (
                <div className="badge" aria-live="polite">
                  ATS Match Score: <strong>{atsScore}%</strong>
                </div>
              )}

              <div className="form-row mt-12">
              <div className="stack">
                <div className="section-title">Matched Keywords</div>
                <div className="chip-row">
                  {matched.map((w) => (
                    <span key={w} className="chip success">
                      {w}
                    </span>
                  ))}
                  {!matched.length && (
                    <span className="section-subtitle">Run analysis to see matched keywords.</span>
                  )}
                </div>
              </div>
              <div className="stack">
                <div className="section-title">Missing Keywords</div>
                <div className="chip-row">
                  {missing.map((w) => (
                    <span key={w} className="chip danger">
                      {w}
                    </span>
                  ))}
                  {!missing.length && (
                    <span className="section-subtitle">Run analysis to see missing keywords.</span>
                  )}
                </div>
              </div>
            </div>

              <div className="stack mt-16">
              <div className="section-title">Optimised Resume Draft (Summary)</div>
              <div className="pre-box">
                {optimisedDraft ? (
                  optimisedDraft
                ) : (
                  <span className="section-subtitle">
                    After ATS analysis, a short optimised draft will appear here.
                  </span>
                )}
              </div>
            </div>
          </Card>

          <Card
            title="Full AI Resume (Send to recruiters)"
            actions={
              <div className="inline-actions">
                <GhostButton onClick={handleCopyFull} disabled={!fullResume || disableActions}>
                  Copy Text
                </GhostButton>
                <GhostButton
                  onClick={handleDownloadPdf}
                  disabled={!fullResume || downloadingPdf || disableActions}
                >
                  {downloadingPdf ? "Downloading..." : "Download PDF"}
                </GhostButton>
                <GhostButton
                  onClick={handleDownloadWord}
                  disabled={!fullResume || downloadingWord || disableActions}
                >
                  {downloadingWord ? "Downloading..." : "Download Word"}
                </GhostButton>
              </div>
            }
          >
            <div className="pre-box" aria-live="polite">
              {fullResume ? (
                fullResume
              ) : (
                <span className="section-subtitle">
                  Click Generate Full Resume to create a clean, ATS-friendly resume you can
                  paste into Word/Google Docs and save as PDF, or download directly.
                </span>
              )}
            </div>
          </Card>
        </div>
      </Section>
    </Layout>
  );
}
