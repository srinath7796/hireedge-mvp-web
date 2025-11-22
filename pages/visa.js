// pages/visa.js
import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function VisaPathwayPage() {
  const [targetCountry, setTargetCountry] = useState("UK");
  const [goal, setGoal] = useState("work");
  const [profile, setProfile] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!profile) {
      alert("Please describe your profile (studies, work, current visa etc.).");
      return;
    }

    setLoading(true);
    const res = await apiPost("/api/visa-pathway", {
      profile,
      targetCountry,
      goal,
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
        AI Visa Pathway Finder
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Describe your background and goals. HireEdge suggests realistic visa
        pathways and next steps. This is guidance only, not legal advice.
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
          <label style={{ fontWeight: 600 }}>Target country</label>
          <input
            placeholder="e.g. UK, Canada, Australia"
            value={targetCountry}
            onChange={(e) => setTargetCountry(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ fontWeight: 600 }}>Main goal</label>
          <input
            placeholder="e.g. work, study, startup, family"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>
            Your profile (be as detailed as possible)
          </label>
          <textarea
            placeholder="Example: Age 28, Indian citizen, MSc in Data Science in the UK (2024), 4.5 years sales experience, currently on UK Graduate Visa until 2027, want to stay long term via Skilled Worker or Innovator etc."
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            style={{
              width: "100%",
              height: "220px",
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
        {loading ? "Analysing..." : "Generate Visa Pathways"}
      </button>

      {/* Results */}
      {result && result.ok && result.bestRoute && (
        <section style={{ marginTop: "2rem", display: "grid", gap: "1.5rem" }}>
          {/* Best route */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid #e5f4ea",
              background: "#f4fbf7",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>
              Best-fit route: {result.bestRoute.name}
            </h2>
            <p style={{ margin: "0.25rem 0 0.75rem 0" }}>
              {result.bestRoute.summary}
            </p>
            {result.bestRoute.whyGoodFit && (
              <p style={{ margin: "0 0 0.75rem 0", color: "#555" }}>
                <strong>Why it fits you:</strong> {result.bestRoute.whyGoodFit}
              </p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "1rem",
                marginTop: "0.5rem",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1rem", marginTop: 0 }}>
                  Key requirements
                </h3>
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  {(result.bestRoute.keyRequirements || []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: "1rem", marginTop: 0 }}>
                  Risks / limitations
                </h3>
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  {(result.bestRoute.risksOrLimitations || []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: "1rem", marginTop: 0 }}>Next steps</h3>
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  {(result.bestRoute.nextSteps || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Alternatives */}
          {result.alternativeRoutes &&
            result.alternativeRoutes.length > 0 && (
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "1px solid #eee",
                  background: "#fafafa",
                }}
              >
                <h2 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>
                  Alternative routes to consider
                </h2>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {result.alternativeRoutes.map((route, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "10px",
                        border: "1px solid #eee",
                        background: "#fff",
                      }}
                    >
                      <h3 style={{ marginTop: 0, fontSize: "1rem" }}>
                        {route.name}
                      </h3>
                      <p style={{ margin: "0 0 0.5rem 0" }}>{route.summary}</p>
                      {route.whenToUse && (
                        <p style={{ margin: 0, color: "#555" }}>
                          <strong>When to use:</strong> {route.whenToUse}
                        </p>
                      )}
                      {route.keyRequirements && route.keyRequirements.length > 0 && (
                        <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0 0 0" }}>
                          {route.keyRequirements.map((r, j) => (
                            <li key={j}>{r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Disclaimer */}
          <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#777" }}>
            {result.disclaimer}
          </p>
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
