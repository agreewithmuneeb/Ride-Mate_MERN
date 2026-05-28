const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const getToken = () => localStorage.getItem("token") || "";

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, body) => apiRequest(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
};
