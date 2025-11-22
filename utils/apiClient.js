// utils/apiClient.js
// Simple fetch wrapper for backend API calls with consistent error handling.

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

async function parseJson(response) {
  try {
    return await response.json();
  } catch (err) {
    return null;
  }
}

function normalizeSuccess(data) {
  if (data && typeof data === "object" && "ok" in data) {
    return data;
  }
  return { ok: true, ...data };
}

export async function apiPost(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await parseJson(res);

    if (!res.ok) {
      const errorMessage =
        data?.error || data?.message || `Request failed with status ${res.status}`;
      return { ok: false, error: errorMessage };
    }

    return normalizeSuccess(data);
  } catch (err) {
    console.error("apiPost error", err);
    return { ok: false, error: "Network error" };
  }
}
