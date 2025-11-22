// backend/api/resume-writer.js
// Serverless handler: generates a full resume rewrite from CV + JD.

const { callChatCompletion } = require("../utils/aiClient");
const { getBody, sendBadRequest, sendOk, sendServerError } = require("../utils/http");
const { ensureString, requireFields, truncateText } = require("../utils/validation");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendBadRequest(res, "Only POST supported");
    return;
  }

  const payload = getBody(req);
  const jobDescription = truncateText(ensureString(payload.jobDescription));
  const cvText = truncateText(ensureString(payload.cvText));

  if (!requireFields({ jobDescription, cvText }, ["jobDescription", "cvText"])) {
    sendBadRequest(res, "Please provide jobDescription and cvText");
    return;
  }

  const prompt = [
    {
      role: "system",
      content:
        "You rewrite resumes into clean, ATS-friendly plain text. Keep strong verbs, measurable achievements and concise bullets.",
    },
    {
      role: "user",
      content: `Job description:\n${jobDescription}\n\nOriginal CV:\n${cvText}\n\nRewrite as a recruiter-ready resume in plain text.`,
    },
  ];

  try {
    const resumeText = await callChatCompletion({ messages: prompt, temperature: 0.35 });
    sendOk(res, { resumeText });
  } catch (err) {
    console.error("resume-writer error", err);
    sendServerError(res, "Could not generate resume. Please try again.");
  }
};
