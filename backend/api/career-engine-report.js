// backend/api/career-engine-report.js
// Aggregates ATS, resume rewrite, skills, roadmap, LinkedIn copy, interview prep and gap explainer.

const { callChatCompletion, tryParseJSON } = require("../utils/aiClient");
const { getBody, sendBadRequest, sendOk, sendServerError } = require("../utils/http");

async function runJsonPrompt(system, user, temperature = 0.4) {
  const content = await callChatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    responseFormat: { type: "json_object" },
    temperature,
  });
  return tryParseJSON(content) || {};
}

async function getAts(jobDescription, cvText) {
  return runJsonPrompt(
    "You are an ATS coach. Return atsScore (0-100), matchedKeywords, missingKeywords, and summary (1-2 sentences).",
    `Job description:\n${jobDescription}\n\nCV:\n${cvText}`
  );
}

async function getResume(jobDescription, cvText) {
  const content = await callChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "Rewrite resumes into clean ATS-friendly plain text. Keep achievements measurable and concise.",
      },
      {
        role: "user",
        content: `Job description:\n${jobDescription}\n\nCV:\n${cvText}\n\nRewrite as a recruiter-ready resume in plain text.`,
      },
    ],
    temperature: 0.35,
  });
  return { resumeText: content };
}

async function getSkills(jobDescription, cvText) {
  return runJsonPrompt(
    "You compare skills. Return matched (array of strings), missing (array), and narrative string summary.",
    `Job description:\n${jobDescription}\n\nCV:\n${cvText}`
  );
}

async function getRoadmap(userProfile, targetRole) {
  return runJsonPrompt(
    "You are a career coach. Return JSON with shortTerm (array of steps), midTerm (array), longTerm (array) and salaryGuidance (string).",
    `Profile:${JSON.stringify(userProfile || {})}\nTarget role:${targetRole || ""}`
  );
}

async function getProfileSummary(cvText) {
  return runJsonPrompt(
    "Create a short headline, summary and 3-5 highlights for a talent profile. Use plain text.",
    cvText || ""
  );
}

async function getLinkedIn(jobDescription, cvText) {
  return runJsonPrompt(
    "Draft LinkedIn headline, about section, and 3 key suggestions. Keep ATS keywords.",
    `Job description:${jobDescription}\nCV:${cvText}`
  );
}

async function getInterview(jobDescription, cvText) {
  return runJsonPrompt(
    "Generate 6 interview questions with brief STAR guidance. Return questions (array of {question, guidance}) and followUps (array).",
    `Job description:${jobDescription}\nCV:${cvText}`
  );
}

async function getGapExplainer(userProfile) {
  return runJsonPrompt(
    "Explain career gaps empathetically. Return narrative, cvLines (array) and recruiterEmail (string).",
    JSON.stringify(userProfile || {})
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendBadRequest(res, "Only POST supported");
    return;
  }

  const { cvText, jobDescription, userProfile = {} } = getBody(req);
  if (!cvText || !jobDescription) {
    sendBadRequest(res, "cvText and jobDescription are required");
    return;
  }

  try {
    const [ats, resume, skills, roadmap, profile, linkedin, interview, gapExplainer] =
      await Promise.all([
        getAts(jobDescription, cvText),
        getResume(jobDescription, cvText),
        getSkills(jobDescription, cvText),
        getRoadmap(userProfile, userProfile.targetRole || ""),
        getProfileSummary(cvText),
        getLinkedIn(jobDescription, cvText),
        getInterview(jobDescription, cvText),
        getGapExplainer(userProfile),
      ]);

    sendOk(res, {
      report: {
        ats,
        resume,
        skills,
        roadmap,
        profile,
        linkedin,
        interview,
        gapExplainer,
      },
    });
  } catch (err) {
    console.error("career-engine-report error", err);
    sendServerError(res, "Could not generate combined report. Please try again.");
  }
};
