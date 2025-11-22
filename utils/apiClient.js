// utils/apiClient.js
export async function apiPost(path, data = {}) {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("apiPost error:", err);
    return { error: "Network error" };
  }
}
