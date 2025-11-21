const BASE_URL = "https://hireedge-backend-mvp.vercel.app"; // your backend URL

export async function apiPost(endpoint, data) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    return { error: "Network error" };
  }
}

export async function apiGet(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    return { error: "Network error" };
  }
}
