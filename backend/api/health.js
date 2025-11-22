// backend/api/health.js
// Lightweight health/operability check for serverless deployment.

const { sendBadRequest, sendOk } = require("../utils/http");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    sendBadRequest(res, "Only GET supported");
    return;
  }

  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);

  sendOk(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
    openaiConfigured,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    endpoints: {
      ats: "/api/generate-resume",
      resumeWriter: "/api/resume-writer",
      bundle: "/api/career-engine-report",
    },
  });
};
