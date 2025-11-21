import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function TalentProfilePage() {
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!name || !headline) {
      alert("Name and professional headline are required.");
      return;
    }

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);
    const res = await apiPost("/api/talent-profile", {
      name,
      headline,
      skills,
      experience
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
        Smart Talent Profile Generator
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Generate a clean professional profile you can use for job applications,
        LinkedIn, or recruiters.
      </p>

      <label style={{ fontWeight: 600 }}>Full Name</label>
      <input
        placeholder="e.g. Srinath Senthilkumar"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "0.75rem",
          marginTop: "0.5rem",
          marginBottom: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <label style={{ fontWeight: 600 }}>Professional Headline</label>
      <input
        placeholder="e.g. Sales Manager | Customer Success | Team Leadership"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        style={{
          width: "100%",
          padding: "0.75rem",
          marginTop: "0.5rem",
          marginBottom: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <label style={{ fontWeight: 600 }}>Key Skills (comma-separated)</label>
      <textarea
        placeholder="e.g. sales, negotiation, leadership, CRM, communication"
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

      <label style={{ fontWeight: 600 }}>Experience Summary</label>
      <textarea
        placeholder="Write a short description of your experience..."
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        style={{
          width: "100%",
          height: "120px",
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
        {loading ? "Generating..." : "Generate Profile"}
      </button>

      {result && result.ok && (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Generated Profile
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
            <h3>{result.profile.name}</h3>
            <p>
              <strong>{result.profile.headline}</strong>
            </p>

            <h4>Summary</h4>
            <p>{result.profile.summary}</p>

            <h4>Skills</h4>
            <p>{result.profile.skills.join(", ")}</p>

            <h4>Experience</h4>
            <p>{result.profile.experience}</p>

            <h4>Highlights</h4>
            <ul>
              {result.profile.profileSections.highlights.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>

            <p style={{ color: "#555", marginTop: "1rem" }}>
              {result.profile.profileSections.finalNote}
            </p>
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
