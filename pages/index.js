// pages/index.js
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>HireEdge – AI Career Platform (MVP)</title>
      </Head>
      <main style={pageStyle}>
        <section style={heroStyle}>
          <h1 style={titleStyle}>HireEdge – AI Career Platform (MVP)</h1>
          <p style={subtitleStyle}>
            This is the new Innovator MVP frontend. All tools below are powered
            by the HireEdge AI Engine – helping international graduates and UK
            job seekers with ATS, skills, career planning and visa pathways.
          </p>
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
            Powered by <strong>HireEdge AI Engine v1</strong> – multi-module
            career intelligence (resume, skills, roadmap, profile, gaps,
            interviews & visa).
          </p>
        </section>

        {/* BUTTON GRID */}
        <section style={gridStyle}>
          <ToolButton href="/resume" label="ATS Resume Optimiser" />
          <ToolButton href="/skills" label="AI Skills Matching" />
          <ToolButton href="/roadmap" label="AI Career Roadmap" />
          <ToolButton href="/profile" label="Smart Talent Profile" />
          <ToolButton href="/linkedin" label="LinkedIn Optimiser" />
          <ToolButton href="/gap" label="Career Gap Explainer" />
          <ToolButton href="/interview" label="Interview Prep Engine" />
          <ToolButton href="/visa" label="Visa Sponsorship Pathway" />
        </section>

        {/* FEATURE EXPLANATIONS FOR ENDORSER */}
        <section style={detailsSectionStyle}>
          <h2 style={h2Style}>What makes HireEdge innovative?</h2>
          <ul style={listStyle}>
            <li>
              <strong>ATS Resume Optimiser</strong> – analyses job
              descriptions + CV, detects hidden ATS keywords and generates an
              optimised resume draft.
            </li>
            <li>
              <strong>AI Skills Matching</strong> – compares CV vs job and shows
              matched skills, missing skills and an overall fit score.
            </li>
            <li>
              <strong>AI Career Roadmap</strong> – builds a 3-stage roadmap
              (short, mid and long-term) based on role, skills and target
              industry.
            </li>
            <li>
              <strong>Smart Talent Profile</strong> – creates a recruiter-ready
              professional summary, skills section and highlights in one click.
            </li>
            <li>
              <strong>LinkedIn Optimiser</strong> – generates headline, About
              section and profile suggestions aligned with the target role.
            </li>
            <li>
              <strong>Career Gap Explainer</strong> – converts career breaks
              (relocation, study, family, health) into CV lines, interview
              answers and recruiter email paragraphs.
            </li>
            <li>
              <strong>Interview Prep Engine</strong> – uses the job description
              + CV to generate likely questions and STAR-format answer guidance.
            </li>
            <li>
              <strong>Visa Sponsorship Pathway</strong> – maps profile, salary
              and experience to possible UK work routes (e.g. Skilled Worker,
              Graduate Route, Health & Care) and highlights risks and next
              steps.
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}

function ToolButton({ href, label }) {
  return (
    <a href={href} style={btnStyle}>
      {label}
    </a>
  );
}

// ---- styles ----
const pageStyle = {
  minHeight: "100vh",
  padding: "3rem 1.5rem 4rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  background: "#ffffff"
};

const heroStyle = {
  maxWidth: "900px",
  textAlign: "center",
  marginBottom: "2.5rem"
};

const titleStyle = {
  fontSize: "2.4rem",
  marginBottom: "0.75rem"
};

const subtitleStyle = {
  fontSize: "1rem",
  color: "#444",
  lineHeight: 1.6
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1rem",
  maxWidth: "950px",
  width: "100%",
  marginBottom: "3rem"
};

const btnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.9rem 1.2rem",
  borderRadius: "999px",
  border: "1.5px solid #4b3cff",
  color: "#4b3cff",
  fontWeight: 600,
  textDecoration: "none",
  fontSize: "0.95rem",
  background: "#f7f4ff",
  cursor: "pointer"
};

const detailsSectionStyle = {
  maxWidth: "900px",
  fontSize: "0.95rem",
  color: "#333",
  lineHeight: 1.7
};

const h2Style = {
  fontSize: "1.4rem",
  marginBottom: "0.75rem"
};

const listStyle = {
  paddingLeft: "1.2rem"
};
