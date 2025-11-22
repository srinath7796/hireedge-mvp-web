import { useState } from "react";
import Layout from "../components/Layout";
import { Card, Section } from "../components/ui/Card";
import { TextInput, Select } from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import { PrimaryButton } from "../components/ui/Button";
import { ErrorBanner } from "../components/ui/Alert";
import { apiPost } from "../utils/apiClient";

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !cvText.trim()) {
      setError("Please paste both the Job Description and your CV.");
      return;
    }

    setLoading(true);
    setError("");
    const res = await apiPost("/api/interview-prep", {
      jobDescription,
      cvText,
      role,
      experienceLevel,
    });
    if (!res?.ok) {
      setError(res?.error || "Something went wrong.");
    }
    setResult(res);
    setLoading(false);
  };

  return (
    <Layout
      title="AI Interview Preparation"
      subtitle="Paste the job description and your CV. Generate likely questions, STAR-format answers and focus areas."
    >
      <Section>
        <Card title="Inputs" subtitle="Ground the model with the role and your experience.">
          <div className="form-grid">
            <Textarea
              id="jobDescription"
              label="Job Description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
            />
            <Textarea
              id="cvText"
              label="Your CV"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your CV here..."
              rows={10}
            />
            <div className="form-row">
              <TextInput
                id="role"
                label="Target role (optional)"
                placeholder="e.g. Sales Manager, Customer Success Manager"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <Select
                id="experienceLevel"
                label="Experience level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="junior">Junior / Graduate</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </Select>
            </div>
          </div>
          <div className="inline-actions mt-12">
            <PrimaryButton onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate Interview Pack"}
            </PrimaryButton>
          </div>
          <ErrorBanner message={error} />
        </Card>
      </Section>

      {result && result.ok && (
        <Section title="Interview pack" subtitle={result.summary}>
          {result.weakAreas && result.weakAreas.length > 0 && (
            <Card title="Possible gaps to address">
              <ul className="section-subtitle pl-16">
                {result.weakAreas.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </Card>
          )}

          <Card title="General Interview Questions">
            <QuestionGroup questions={result.generalQuestions} />
          </Card>
          <Card title="Role-specific Questions">
            <QuestionGroup questions={result.roleQuestions} />
          </Card>
          <Card title="Behavioural (STAR) Questions">
            <QuestionGroup questions={result.behaviouralQuestions} />
          </Card>
        </Section>
      )}

      {result && !result.ok && <ErrorBanner message={result.error || "Something went wrong"} />}
    </Layout>
  );
}

function QuestionGroup({ questions }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="stack">
      {questions.map((q, idx) => (
        <div key={idx} className="card">
          <p className="section-title">Q{idx + 1}. {q.question}</p>
          <p className="section-subtitle pre-wrap">{q.answer}</p>
        </div>
      ))}
    </div>
  );
}
