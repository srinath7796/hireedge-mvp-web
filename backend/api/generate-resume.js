// backend/api/generate-resume.js
// Serverless handler: ATS analysis & resume draft builder.

const { callChatCompletion, tryParseJSON } = require("../utils/aiClient");
const { getBody, sendBadRequest, sendOk, sendServerError } = require("../utils/http");
const { ensureString, requireFields, truncateText } = require("../utils/validation");

async function buildAtsResponse(jobDescription, cvText) {
  const prompt = [
    {
      role: "system",
      content:
        "You are an ATS and resume expert. Return JSON with atsScore (0-100), matchedKeywords, missingKeywords, and optimisedResume (plain text).",
    },
    {
      role: "user",
      content: `Job description:\n${jobDescription}\n\nCandidate CV:\n${cvText}\n\nReturn concise ATS analysis and short optimised resume draft.`,
    },
  ];

  const content = await callChatCompletion({
    messages: prompt,
    responseFormat: { type: "json_object" },
    temperature: 0.4,
  });

  const parsed = tryParseJSON(content) || {};
  return {
    atsScore: parsed.atsScore ?? parsed.score ?? null,
    matchedKeywords: parsed.matchedKeywords || parsed.matched || [],
    missingKeywords: parsed.missingKeywords || parsed.missing || [],
    optimisedResume: parsed.optimisedResume || parsed.optimised || "",
  };
}

async function buildResumeFromForm(payload) {
  const prompt = [
    {
      role: "system",
      content:
        "You generate concise ATS-ready resumes in plain text. Keep bullet points short and achievement focused.",
    },
    {
      role: "user",
      content: JSON.stringify(payload),
    },
  ];

  const content = await callChatCompletion({ messages: prompt, temperature: 0.35 });
  return content;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendBadRequest(res, "Only POST supported");
    return;
  }

  const payload = getBody(req);
  const jobDescription = truncateText(ensureString(payload.jobDescription));
  const cvText = truncateText(ensureString(payload.cvText));
  const formFullName = ensureString(payload.fullName);
  const formTargetRole = ensureString(payload.targetRole);

  const hasAtsInputs = requireFields({ jobDescription, cvText }, ["jobDescription", "cvText"]);
  const hasFormInputs = requireFields({ formFullName, formTargetRole }, ["formFullName", "formTargetRole"]);

  if (!hasAtsInputs && !hasFormInputs) {
    sendBadRequest(res, "Missing required fields. Provide jobDescription+cvText or fullName+targetRole.");
    return;
  }

  try {
    // Case 1: ATS analysis path
    if (hasAtsInputs) {
      const atsResponse = await buildAtsResponse(jobDescription, cvText);
      sendOk(res, atsResponse);
      return;
    }

    // Case 2: Resume builder path
    const resumeText = await buildResumeFromForm({
      ...payload,
      fullName: formFullName,
      targetRole: formTargetRole,
    });
    sendOk(res, { resumeText });
  } catch (err) {
    console.error("generate-resume error", err);
    sendServerError(res, "Could not generate resume. Please try again.");
  }
};
