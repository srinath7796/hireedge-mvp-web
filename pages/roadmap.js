import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function RoadmapPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
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
      targetRole,
      skills,
      experienceYears
    });

    setResult(res);
    setLoading(false);
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        AI Career Roadmap
      </h1>

      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Generate a personalised 12-month career roadmap powered by HireEdge AI.
      </p>

      {/* Current Role */}
      <label>Your current role</label>
      <input
        placeholder="e.g. Sales Executive"
        value={currentRole}
        onChange={(e) => setCurrentRole(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.7rem" }}
      />

      {/* Target Role */}
      <label>Your target role (optional)</label>
      <input
        placeholder="e.g. Product Manager"
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.7rem" }}
      />

      {/* Experience */}
      <label>Years of experience (optional)</label>
      <input
        type="number"
        placeholder="e.g. 3"
        value={experienceYears}
        onChange={(e) => setExperienceYears(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.7rem" }}
      />

      {/* Skills */}
      <label>Your key skills (comma-separated)</label>
      <textarea
        placeholder="e.g. communication, team leadership, Excel"
        value={skillsInput}
        onChange={(e) => setSkillsInput(e.target.value)}
        style={{
          width: "100%",
          height: "100px",
          marginBottom: "1.5rem",
          padding: "0.7rem",
        }}
      />

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "0.8rem 1.6rem",
          borderRadius: "999px",
          border: "none",
          background: "#000",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Roadmap"}
      </button>

      {/* RESULT */}
      {result && result.ok && (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Roadmap Summary
          </h2>
          <p style={{ color: "#444" }}>{result.roadmap.summary}</p>

          <h3 style={{ marginTop: "1.5rem" }}>Timeframe</h3>
          <p>{result.roadmap.timeframe_months} months</p>

          <h3 style={{ marginTop: "1.5rem" }}>Target Roles</h3>
          <ul>
            {result.roadmap.target_roles.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          <h3 style={{ marginTop: "2rem" }}>Roadmap Stages</h3>

          {result.roadmap.stages.map((stage, i) => (
            <div
              key={i}
              style={{
                marginTop: "1rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "10px",
              }}
            >
              <h4 style={{ marginBottom: "0.3rem" }}>{stage.name}</h4>
              <p>
                <strong>Duration:</strong> {stage.duration_weeks} weeks
              </p>

              <strong>Goals:</strong>
              <ul>
                {stage.goals.map((g, j) => (
                  <li key={j}>{g}</li>
                ))}
              </ul>

              <strong>Skills to learn:</strong>
              <ul>
                {stage.skills_to_learn.map((s, j) => (
                  <li key={j}>{s}</li>
                ))}
              </ul>

              <strong>Resources:</strong>
              <ul>
                {stage.resources.map((r, j) => (
                  <li key={j}>
                    {r.type}: {r.name} — <em>{r.provider}</em> ({r.notes})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* ERROR */}
      {result && !result.ok && (
        <p style={{ marginTop: "1rem", color: "red" }}>
          Error: {result.error || "Something went wrong"}
        </p>
      )}
    </main>
  );
}
