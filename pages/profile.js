// pages/profile.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function TalentProfilePage() {
  const [fullName, setFullName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [cvText, setCvText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!fullName || !cvText) {
      alert("Please fill your name and paste your CV text.");
      return;
    }

    const skills =
      skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];

    setLoading(true);
    const res = await apiPost("/api/talent-profile", {
      fullName,
      currentRole,
      experienceYears,
      skills,
      cvText,
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        AI Talent Profile Generator
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Turn your CV into a clean, recruiter-ready talent card with headline,
        bio, key skills and achievements. Perfect for portfolios, PDF profiles
        and visa evidence.
      </p>

      {/* Inputs */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.1fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Full name</label>
          <input
            placeholder="e.g. Srinath Senthilkumar"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ fontWeight: 600 }}>Current role</label>
          <input
            placeholder="e.g. Sales Assistant, Academic Counsellor"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ fontWeight: 600 }}>Years of experience</label>
          <input
            placeholder="e.g. 4.5"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ fontWeight: 600 }}>
            Key skills (comma-separated)
          </label>
          <textarea
            placeholder="e.g. B2B sales, CRM, team leadership, customer success"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            style={{
              width: "100%",
              height: "120px",
              marginTop: "0.5rem",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Your CV text</label>
          <textarea
            placeholder="Paste your CV or main experience here..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            style={{
              width: "100%",
              height: "260px",
              marginTop: "0.5rem",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      </section>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "0.9rem 1.8rem",
          borderRadius: "999px",
          border: "none",
          background: "#000",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {loading ? "Generating profile..." : "Generate Talent Profile"}
      </button>

      {/* Result */}
      {result && result.ok && (
        <section style={{ marginTop: "2rem" }}>
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid #eee",
              background: "#fafafa",
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.6rem",
                    margin: 0,
                  }}
                >
                  {fullName}
                </h2>
                <p style={{ margin: "0.25rem 0", color: "#555" }}>
                  {result.title || currentRole}
                </p>
              </div>
              {result.linkedinHeadline && (
                <p
                  style={{
                    margin: 0,
                    maxWidth: "480px",
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                    color: "#444",
                    textAlign: "right",
                  }}
                >
                  {result.linkedinHeadline}
                </p>
              )}
            </div>

            {/* Bio */}
            {result.bio && (
              <div style={{ marginTop: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  Professional Summary
                </h3>
                <p
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.5,
                  }}
                >
                  {result.bio}
                </p>
              </div>
            )}

            {/* Skills + Tags */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: "1.25rem",
                marginTop: "1.25rem",
              }}
            >
              {result.skills && result.skills.length > 0 && (
                <div>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                    Core Skills
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {result.skills.map((s, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "0.25rem 0.55rem",
                          borderRadius: "999px",
                          border: "1px solid #ddd",
                          fontSize: "0.85rem",
                          background: "#fff",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.expertiseTags && result.expertiseTags.length > 0 && (
                <div>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                    Expertise Tags
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {result.expertiseTags.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "0.25rem 0.55rem",
                          borderRadius: "999px",
                          border: "1px dashed #ddd",
                          fontSize: "0.85rem",
                          background: "#fdfdfd",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Achievements */}
            {result.achievements && result.achievements.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                  Key Achievements
                </h3>
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  {result.achievements.map((a, i) => (
                    <li key={i} style={{ marginBottom: "0.4rem" }}>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Error */}
      {result && !result.ok && (
        <p style={{ marginTop: "1.5rem", color: "red" }}>
          Error: {result.error || "Something went wrong"}
        </p>
      )}
    </main>
  );
}
