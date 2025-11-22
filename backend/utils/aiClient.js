// backend/utils/aiClient.js
// Minimal OpenAI helper used by serverless functions.

const API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const DEFAULT_TIMEOUT_MS = 60_000;

function missingKeyError() {
  return new Error("OPENAI_API_KEY is not configured");
}

async function callChatCompletion({
  messages,
  temperature = 0.3,
  responseFormat,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) {
  if (!process.env.OPENAI_API_KEY) throw missingKeyError();

  const payload = {
    model: DEFAULT_MODEL,
    messages,
    temperature,
  };

  if (responseFormat) {
    payload.response_format = responseFormat;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await safeReadJSON(response);
      const message = errorBody?.error?.message || `OpenAI error ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("OpenAI request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function safeReadJSON(response) {
  try {
    return await response.json();
  } catch (err) {
    return null;
  }
}

function tryParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

module.exports = { callChatCompletion, tryParseJSON };
