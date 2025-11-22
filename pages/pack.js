import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function CareerPackPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [sector, setSector] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setError(null);
    if (!cvText) {
      alert("Please paste CV text first.");
      return;
    }

    setLoading(true);

    const res = await apiPost("/api/career-pack", {
      jobDescription,
      cvText,
      currentRole,
      targetRole,
      sector,
      experienceYears
    });

    setLoading(false);

    if (!res || !res.ok) {
      setError(res?.error || "Failed to parse AI response");
      return;
    }

    console.log("CAREER PACK:", res);

    // TODO: Render sections on the page
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>HireEdge – One-Click Career Pack</h2>

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

      <textarea
        placeholder="Job description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <textarea
        placeholder="Paste CV text"
        value={cvText}
        onChange={(e) => setCvText(e.target.value)}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating…" : "Generate Career Pack"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
