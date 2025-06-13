const BASE_URL = "http://localhost:8000/reports";

export async function fetchReports(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${BASE_URL}/?${params}`);
  if (!response.ok) throw new Error("Failed to fetch reports");
  return await response.json();
}


export async function createReport(formData) {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      throw new Error("Failed to create report");
    }

    return await response.json();
  } catch (err) {
    console.error("Request failed:", err);
    throw err;
  }
}


export async function updateReportStatus(id, status) {
  const response = await fetch(`${BASE_URL}/${id}?status=${status}`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to update status");
  return await response.json();
}
