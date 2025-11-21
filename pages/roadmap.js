import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function RoadmapPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [industry, setIndustry] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!currentRole) {
      alert("Please enter your current role.");
      return;
    }

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);
    const res = await apiPost("/api/career-roadmap", {
      currentRole,
      skills,
      targetIndustry: industry || "General"
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
        AI Career Roadmap
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        See a clear 3-stage roadmap from where you are now to your next
        leadership or specialist role.
      </p>

      <label style={{ fontWeight: 600 }}>Your current role</label>
      <input
        placeholder="e.g. Sales Manager, Data Analyst, Store Supervisor"
        value={currentRole}
        onChange={(e) => setCurrentRole(e.target.value)}
        style={{
          width: "100%",
          marginTop: "0.5rem",
          marginBottom: "1rem",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <label style={{ fontWeight: 600 }}>Key skills (comma-separated)</label>
      <textarea
        placeholder="e.g. customer success, data analysis, team leadership, stakeholder management"
        value={skillsInput}
        onChange={(e) => setSkillsInput(e.target.value)}
        style={{
          width: "100%",
          height: "100px",
          marginTop: "0.5rem",
          marginBottom: "1rem",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <label style={{ fontWeight: 600 }}>Target industry (optional)</label>
      <input
        placeholder="e.g. Tech, Retail, Healthcare"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        style={{
          width: "100%",
          marginTop: "0.5rem",
          marginBottom: "1.5rem",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          borderRadius: "999px",
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        {loading ? "Generating roadmap..." : "Generate Career Roadmap"}
      </button>

      {result && result.ok && (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Your 3-Stage Roadmap
          </h2>

          {result.roadmap &&
            result.roadmap.map((step) => (
              <div
                key={step.step}
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "1px solid #eee",
                  background: "#fafafa"
                }}
              >
                <h3 style={{ marginBottom: "0.25rem" }}>
                  Step {step.step}: {step.title}
                </h3>
                <p style={{ margin: 0, color: "#555" }}>
                  <strong>Timeframe:</strong> {step.horizon}
                </p>
                <p style={{ margin: "0.25rem 0 0.75rem 0", color: "#555" }}>
                  <strong>Target role:</strong> {step.suggestedRole}
                </p>
                <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
                  {step.actions.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}

          {result.note && (
            <p style={{ color: "#555" }}>{result.note}</p>
          )}
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
