// backend/utils/validation.js
// Lightweight helpers to validate and normalise incoming payloads.

function ensureString(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function requireFields(obj, fields = []) {
  return fields.every((field) => {
    const value = obj[field];
    return typeof value === "string" && value.trim().length > 0;
  });
}

function truncateText(text, maxLength = 12000) {
  const clean = ensureString(text);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength)}...`;
}

module.exports = { ensureString, requireFields, truncateText };
