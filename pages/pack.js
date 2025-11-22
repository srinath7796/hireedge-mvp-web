import { useState } from "react";

export default function CareerPackPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [sector, setSector] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const generatePack = async () => {
    setError("");
    setData(null);

    if (!currentRole || !targetRole || !cvText) {
      setError("Please fill required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://hireedge-backend-mvp.vercel.app/api/career-pack",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentRole,
            targetRole,
            experienceYears,
            sector,
            jobDescription,
            cvText
          })
        }
      );

      const json = await res.json();
      setLoading(false);

      if (!json.ok) {
        setError(json.error || "Career pack failed");
        return;
      }

      setData(json);
    } catch (err) {
      setLoading(false);
      setError("API error");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>HireEdge – One-Click Career Pack</h1>

      {/* FORM */}
      <input
        placeholder="Current role"
        value={currentRole}
        onChange={(e) => setCurrentRole(e.target.value)}
      />
      <input
        placeholder="Target role"
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value)}
      />
      <input
        placeholder="Years of experience"
        value={experienceYears}
        onChange={(e) => setExperienceYears(e.target.value)}
      />
      <input
        placeholder="Sector (optional)"
        value={sector}
        onChange={(e) => setSector(e.target.value)}
      />
      <textarea
        placeholder="Job description (optional)"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <textarea
        placeholder="Your CV text"
        value={cvText}
        onChange={(e) => setCvText(e.target.value)}
      />

      <button onClick={generatePack} disabled={loading}>
        {loading ? "Generating..." : "Generate Career Pack"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* OUTPUT */}
      {data && (
        <div style={{ marginTop: "40px" }}>
          <h2>ATS Match & Resume Optimisation</h2>
          <p>ATS Match: {data.ats.match ? "Good" : "Gaps found"}</p>
          <p>Gaps: {data.ats.gaps.join(", ")}</p>

          <h2>Skills Match & Gap Plan</h2>
          <p>Matched: {data.skills.explicit.join(", ")}</p>
          <p>Missing: {data.skills.missing.join(", ")}</p>

          <h2>3-Stage Career Roadmap</h2>
          <p>Immediate: {data.roadmap.immediate.join(", ")}</p>
          <p>Short-term: {data.roadmap.short_term.join(", ")}</p>
          <p>Long-term: {data.roadmap.long_term.join(", ")}</p>

          <h2>LinkedIn Headline & About</h2>
          <p><b>Headline:</b> {data.linkedin.headline}</p>
          <p><b>About:</b> {data.linkedin.summary}</p>

          <h2>Interview Questions & Answers</h2>
          <p>{data.interview.tips.join(", ")}</p>
          <p>{data.interview.example_questions.join(", ")}</p>

          <h2>Visa Sponsorship Pathway</h2>
          <p><b>Status:</b> {data.visa.status}</p>
          <p><b>Recommendation:</b> {data.visa.recommendation}</p>
        </div>
      )}
    </div>
  );
}

