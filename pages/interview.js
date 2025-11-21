import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription || !cvText) {
      alert("Please paste both the Job Description and your CV.");
      return;
    }

    setLoading(true);
    const res = await apiPost("/api/interview-prep", {
      jobDescription,
      cvText,
      role,
      experienceLevel
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
        AI Interview Preparation
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Paste the job description and your CV. We&apos;ll generate likely
        interview questions, STAR-format answers and focus areas.
      </p>

      <label style={{ fontWeight: 600 }}>Job Description</label>
      <textarea
        placeholder="Paste the full job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        style={taStyle}
      />

      <label style={{ fontWeight: 600 }}>Your CV</label>
      <textarea
        placeholder="Paste your CV here..."
        value={cvText}
        onChange={(e) => setCvText(e.target.value)}
        style={{ ...taStyle, height: "180px" }}
      />

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem"
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ fontWeight: 600 }}>Target role (optional)</label>
          <input
            placeholder="e.g. Sales Manager, Customer Success Manager"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ flex: 1, minWidth: "180px" }}>
          <label style={{ fontWeight: 600 }}>Experience level</label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            style={{ ...inputStyle, height: "2.7rem" }}
          >
            <option value="junior">Junior / Graduate</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={btnStyle}
      >
        {loading ? "Generating..." : "Generate Interview Pack"}
      </button>

      {result && result.ok && (
        <section style={{ marginTop: "2rem" }}>
          <p style={{ color: "#555" }}>{result.summary}</p>

          {result.weakAreas && result.weakAreas.length > 0 && (
            <div
              style={{
                marginTop: "1rem",
                marginBottom: "1.5rem",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #f0c",
                background: "#fff7ff"
              }}
            >
              <strong>Possible gaps to address in your CV / answers:</strong>
              <ul>
                {result.weakAreas.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <QuestionGroup
            title="General Interview Questions"
            questions={result.generalQuestions}
          />
          <QuestionGroup
            title="Role-specific Questions"
            questions={result.roleQuestions}
          />
          <QuestionGroup
            title="Behavioural (STAR) Questions"
            questions={result.behaviouralQuestions}
          />
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

function QuestionGroup({ title, questions }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>{title}</h2>
      {questions.map((q, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            borderRadius: "10px",
            border: "1px solid #eee",
            background: "#fafafa"
          }}
        >
          <p style={{ fontWeight: 600 }}>Q{idx + 1}. {q.question}</p>
          <p style={{ whiteSpace: "pre-wrap" }}>{q.answer}</p>
        </div>
      ))}
    </div>
  );
}

const taStyle = {
  width: "100%",
  height: "140px",
  marginTop: "0.5rem",
  marginBottom: "1rem",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  marginTop: "0.5rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const btnStyle = {
  padding: "0.75rem 1.5rem",
  borderRadius: "999px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};
