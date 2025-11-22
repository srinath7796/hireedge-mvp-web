// backend/utils/http.js

function sendJSON(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function sendOk(res, payload) {
  sendJSON(res, 200, { ok: true, ...payload });
}

function sendBadRequest(res, message) {
  sendJSON(res, 400, { ok: false, error: message });
}

function sendServerError(res, message) {
  sendJSON(res, 500, { ok: false, error: message });
}

function getBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body || "{}");
  } catch (err) {
    return {};
  }
}

module.exports = { sendJSON, sendOk, sendBadRequest, sendServerError, getBody };
