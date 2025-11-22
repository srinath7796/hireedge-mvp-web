// utils/apiClient.js
const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://hireedge-backend-mvp.vercel.app";

export async function apiPost(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // ignore JSON parse errors
    }

    if (!res.ok) {
      return {
        ok: false,
        error: data?.error || `Request failed with status ${res.status}`
      };
    }

    return data;
  } catch (err) {
    console.error("apiPost error", err);
    return { ok: false, error: "Network error" };
  }
}
