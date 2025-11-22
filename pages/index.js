// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Card, Section } from "../components/ui/Card";
import { SecondaryButton } from "../components/ui/Button";
import { LoadingDots } from "../components/ui/Loading";
import { apiGet } from "../utils/apiClient";

const tools = [
  { href: "/resume", label: "ATS Resume Optimiser", description: "Score, keywords and a rewritten resume." },
  { href: "/skills", label: "AI Skills Matching", description: "Matched vs missing skills with fit score." },
  { href: "/roadmap", label: "AI Career Roadmap", description: "Short, mid and long-term moves." },
  { href: "/profile", label: "Smart Talent Profile", description: "Recruiter-ready summary and highlights." },
  { href: "/linkedin", label: "LinkedIn Optimiser", description: "Headline and About tuned to the role." },
  { href: "/gap", label: "Career Gap Explainer", description: "Turn breaks into credible CV lines." },
  { href: "/interview", label: "Interview Prep Engine", description: "Likely questions + STAR answers." },
  { href: "/visa", label: "Visa Pathway", description: "Work route guidance and next steps." },
];

export default function Home() {
  const [status, setStatus] = useState({ loading: true });

  useEffect(() => {
    let mounted = true;
    apiGet("/api/health").then((res) => {
      if (!mounted) return;
      if (res.ok) {
        setStatus({ loading: false, data: res });
      } else {
        setStatus({ loading: false, error: res.error });
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const ready = status.data?.openaiConfigured;

  return (
    <>
      <Head>
        <title>HireEdge – AI Career Platform (MVP)</title>
      </Head>
      <Layout
        title="HireEdge – AI career platform"
        subtitle="Built for international graduates and UK candidates who need clean, ATS-friendly outputs for endorsements and recruiter outreach."
        actions={<Link href="/resume" className="btn btn-primary">Start with Resume</Link>}
      >
        <Section>
          <Card
            title="Platform readiness"
            subtitle="Live health status shown in real time for demos and endorsements."
            actions={status.loading ? <LoadingDots label="Checking..." /> : null}
          >
            {status.loading && <p className="section-subtitle">Performing live readiness check...</p>}
            {!status.loading && status.error && (
              <div className="error-banner" role="alert">{status.error}</div>
            )}
            {!status.loading && ready && (
              <div className="success-banner" role="status">
                Model: <strong>{status.data?.model}</strong> · OpenAI key configured · Core engines online
              </div>
            )}
            {!status.loading && !ready && !status.error && (
              <div className="error-banner" role="alert">
                OpenAI key missing. Add it to continue running the engines.
              </div>
            )}
          </Card>
        </Section>

        <Section title="Career engines" subtitle="Nine focused tools, one consistent UI.">
          <div className="card-grid">
            <Card
              title="Full HireEdge Report"
              subtitle="Phase 2 bundle that unifies every engine into one deliverable."
              actions={<SecondaryButton disabled>Coming soon</SecondaryButton>}
            >
              <p className="section-subtitle">Submit once, receive ATS, resume, skills, roadmap and LinkedIn outputs together.</p>
            </Card>
            {tools.map((tool) => (
              <Card key={tool.href} title={tool.label} subtitle={tool.description}>
                <Link href={tool.href} className="btn btn-primary full-width">
                  Open {tool.label}
                </Link>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Innovator founder notes" subtitle="How to present the system in an endorsement pack.">
          <div className="card-grid">
            <Card title="Innovation">
              <p className="section-subtitle">
                Unified “career engine” prompts, JSON-structured outputs and ATS-first formatting keep resumes clean while
                enabling downstream automation.
              </p>
            </Card>
            <Card title="Scalability">
              <p className="section-subtitle">
                Serverless endpoints + stateless UI allow instant scaling on Vercel. Prompts live in shared helpers for easy tuning.
              </p>
            </Card>
            <Card title="Defensibility">
              <p className="section-subtitle">
                Consistent inputs/outputs make it simple to add audit logs, rate limits and partnership integrations without UI rewrites.
              </p>
            </Card>
          </div>
        </Section>
      </Layout>
    </>
  );
}
