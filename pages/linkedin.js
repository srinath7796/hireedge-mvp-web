import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function LinkedInPage() {
  const [name, setName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [achievements, setAchievements] = useState("");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!name || !currentRole) {
      alert("Please fill in your name and current role.");
      return;
    }

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);
    const res = await apiPost("/api/linkedin-optimizer", {
      name,
      currentRole,
      targetRole,
      skills,
      achievements,
      tone
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
        LinkedIn Profile Optimiser
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Generate a strong LinkedIn headline and About section that is aligned
        with your target role and skills.
      </p>

      <label style={{ fontWeight: 600 }}>Full Name</label>
      <input
        placeholder="e.g. Srinath Senthilkumar"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <label style={{ fontWeight: 600 }}>Current Role</label>
      <input
        placeholder="e.g. Sales Manager"
        value={currentRole}
        onChange={(e) => setCurrentRole(e.target.value)}
        style={inputStyle}
      />

      <label style={{ fontWeight: 600 }}>Target Role / Direction (optional)</label>
      <input
        placeholder="e.g. Sales Manager in CareerTech, Customer Success Lead"
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value)}
        style={inputStyle}
      />

      <label style={{ fontWeight: 600 }}>Key Skills (comma-separated)</label>
      <textarea
        placeholder="e.g. sales, leadership, CRM, customer service, negotiation"
        value={skillsInput}
        onChange={(e) => setSkillsInput(e.target.value)}
        style={textAreaStyle}
      />

      <label style={{ fontWeight: 600 }}>Key Achievements (optional)</label>
      <textarea
        placeholder="- Led a team of 5 to hit 120% of sales target\n- Improved customer retention by 15%\nUse bullet lines like this."
        value={achievements}
        onChange={(e) => setAchievements(e.target.value)}
        style={textAreaStyle}
      />

      <label style={{ fontWeight: 600 }}>Tone</label>
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        style={{
          ...inputStyle,
          height: "2.7rem"
        }}
      >
        <option value="professional">Professional</option>
        <option value="friendly">Friendly</option>
      </select>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={buttonStyle}
      >
        {loading ? "Generating..." : "Generate LinkedIn Copy"}
      </button>

      {result && result.ok && (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Generated LinkedIn Content
          </h2>

          <div
            style={{
              background: "#fafafa",
              borderRadius: "12px",
              border: "1px solid #eee",
              padding: "1.5rem",
              lineHeight: "1.6"
            }}
          >
            <h3>Headline</h3>
            <p>{result.profile.headline}</p>

            <h3>About Section</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{result.profile.about}</p>

            <h3>Highlights</h3>
            <ul>
              {result.profile.highlights.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>

            <h3>Suggestions</h3>
            <ul>
              {result.profile.suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
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

const textAreaStyle = {
  width: "100%",
  height: "110px",
  marginTop: "0.5rem",
  marginBottom: "1rem",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  borderRadius: "999px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};
