import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function VisaPathwayPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [sector, setSector] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [highestEducation, setHighestEducation] = useState("");
  const [nationalityRegion, setNationalityRegion] = useState("");
  const [currentVisa, setCurrentVisa] = useState("");
  const [salaryGBP, setSalaryGBP] = useState("");
  const [hasJobOffer, setHasJobOffer] = useState(false);
  const [sponsorLicenceKnown, setSponsorLicenceKnown] = useState("unknown");
  const [wantsToStayYears, setWantsToStayYears] = useState("3");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!targetRole && !currentRole) {
      alert("Please enter at least your current or target role.");
      return;
    }

    setLoading(true);
    const res = await apiPost("/api/visa-pathway", {
      currentRole,
      targetRole,
      sector,
      yearsExperience: Number(yearsExperience) || 0,
      highestEducation,
      nationalityRegion,
      currentVisa,
      salaryGBP: Number(salaryGBP) || 0,
      hasJobOffer,
      sponsorLicenceKnown,
      wantsToStayYears: Number(wantsToStayYears) || 3
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        Visa Sponsorship Pathway Planner
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Get a high-level view of which UK work routes might fit you, how Skilled
        Worker sponsorship could work, and where the main risks are. This is a
        planning tool only – not legal advice.
      </p>

      {/* FORM */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem"
        }}
      >
        <div>
          <label style={labelStyle}>Current role (optional)</label>
          <input
            placeholder="e.g. Sales Manager"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Target UK role</label>
          <input
            placeholder="e.g. Sales Manager in UK retail"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Sector</label>
          <input
            placeholder="e.g. Retail, Tech, Healthcare"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Years of experience</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 4"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Highest education</label>
          <input
            placeholder="e.g. MSc, Bachelor, Diploma"
            value={highestEducation}
            onChange={(e) => setHighestEducation(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Nationality / region</label>
          <input
            placeholder="e.g. Non-UK, EU, India, Sri Lanka"
            value={nationalityRegion}
            onChange={(e) => setNationalityRegion(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Current UK visa (if any)</label>
          <input
            placeholder="e.g. Student, Graduate, None"
            value={currentVisa}
            onChange={(e) => setCurrentVisa(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Expected / offered salary (£ per year)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 32000"
            value={salaryGBP}
            onChange={(e) => setSalaryGBP(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Do you already have a UK job offer?</label>
          <select
            value={hasJobOffer ? "yes" : "no"}
            onChange={(e) => setHasJobOffer(e.target.value === "yes")}
            style={inputStyle}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>
            Is / will your employer be a licensed sponsor?
          </label>
          <select
            value={sponsorLicenceKnown}
            onChange={(e) => setSponsorLicenceKnown(e.target.value)}
            style={inputStyle}
          >
            <option value="unknown">Not sure</option>
            <option value="yes">Yes / likely</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>How long do you want to stay in the UK?</label>
          <select
            value={wantsToStayYears}
            onChange={(e) => setWantsToStayYears(e.target.value)}
            style={inputStyle}
          >
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="5">5+ years (long-term)</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={btnStyle}
      >
        {loading ? "Calculating..." : "Generate Sponsorship Pathway"}
      </button>

      {/* RESULTS */}
      {result && result.ok && (
        <section style={{ marginTop: "2rem", marginBottom: "3rem" }}>
          <div style={summaryCardStyle}>
            <h2 style={{ margin: 0 }}>{result.summary.headline}</h2>
            <p style={{ marginTop: "0.5rem", color: "#555" }}>
              {result.summary.note}
            </p>
          </div>

          <div style={gridTwoCols}>
            <div style={cardStyle}>
              <h3>SOC Code Guess</h3>
              <p>
                <strong>{result.socCodeGuess.code}</strong> –{" "}
                {result.socCodeGuess.label}
              </p>
              <p style={{ color: "#555" }}>{result.socCodeGuess.reason}</p>
            </div>

            <div style={cardStyle}>
              <h3>Salary Assessment</h3>
              <p>
                Likely threshold met?{" "}
                <strong>
                  {result.salaryAssessment.meetsTypical ? "Possibly yes" : "Not clear / likely low"}
                </strong>
              </p>
              <p style={{ color: "#555" }}>
                {result.salaryAssessment.comment}
              </p>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
              Suggested Routes
            </h2>
            {result.suggestedRoutes.map((r, idx) => (
              <div key={idx} style={cardStyle}>
                <h3 style={{ marginTop: 0 }}>{r.route}</h3>
                <p>
                  <strong>Suitability:</strong> {r.suitability} |{" "}
                  <strong>Risk level:</strong> {r.riskLevel}
                </p>
                <p style={{ color: "#555" }}>{r.reason}</p>
                {r.keySteps && (
                  <>
                    <p style={{ fontWeight: 600, marginTop: "0.5rem" }}>
                      Key steps:
                    </p>
                    <ul>
                      {r.keySteps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>

          {result.redFlags && result.redFlags.length > 0 && (
            <div style={warningCardStyle}>
              <h3 style={{ marginTop: 0 }}>Potential Risks / Red Flags</h3>
              <ul>
                {result.redFlags.map((rf, idx) => (
                  <li key={idx}>{rf}</li>
                ))}
              </ul>
              <p style={{ color: "#555" }}>
                Use these as discussion points with an immigration adviser or
                recruiter to plan around them.
              </p>
            </div>
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

const labelStyle = {
  fontWeight: 600
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  marginTop: "0.35rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "0.95rem"
};

const btnStyle = {
  padding: "0.8rem 1.6rem",
  borderRadius: "999px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};

const cardStyle = {
  marginTop: "1rem",
  padding: "1.2rem",
  borderRadius: "12px",
  border: "1px solid #eee",
  background: "#fafafa",
  lineHeight: 1.6
};

const summaryCardStyle = {
  padding: "1.4rem",
  borderRadius: "14px",
  border: "1px solid #ddd",
  background: "#f6f6f6",
  lineHeight: 1.5
};

const warningCardStyle = {
  marginTop: "1.5rem",
  padding: "1.2rem",
  borderRadius: "12px",
  border: "1px solid #f5c2c7",
  background: "#fff5f5",
  lineHeight: 1.6
};

const gridTwoCols = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1rem",
  marginTop: "1.5rem"
};
