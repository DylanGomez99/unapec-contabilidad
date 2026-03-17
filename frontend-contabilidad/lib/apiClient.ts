import axios from "axios";

// This module creates a singleton Axios instance that automatically attaches
// the X-Tenant-ID header from localStorage on every request.

const isServer = typeof window === "undefined";
const baseURL = isServer 
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080")
  : ""; // Client-side uses relative paths to hit Next.js proxy rewrites

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ─── Request Interceptor — inject X-Tenant-ID ─────────────────────────────────
apiClient.interceptors.request.use((config) => {
  // Read from localStorage (client-side only)
  if (typeof window !== "undefined") {
    const tenantId = localStorage.getItem("activeTenantId") 
      || process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID 
      || "UNAPEC";
    config.headers["X-Tenant-ID"] = tenantId;
  }
  return config;
});

// ─── Response Interceptor — normalised error handling ─────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error de comunicación con el servidor.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
