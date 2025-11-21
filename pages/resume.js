import { useState } from "react";
import { apiPost } from "../utils/apiClient";

export default function ResumePage() {
  const [text, setText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateResume = async () => {
    setLoading(true);
    const res = await apiPost("/api/generate-resume", {
      rawText: text,
      jobTitle
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Resume Generator</h1>

      <textarea
        placeholder="Paste your CV..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          height: "150px",
          marginTop: "1rem",
          padding: "1rem"
        }}
      />

      <input
        placeholder="Target Job Title (optional)"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        style={{
          marginTop: "1rem",
          padding: "0.5rem",
          width: "100%"
        }}
      />

      <button
        onClick={generateResume}
        disabled={loading}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px"
        }}
      >
        {loading ? "Generating..." : "Generate Resume"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#fafafa"
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
