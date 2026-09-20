const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("drawiful_token");
}

export function setToken(token: string) {
  localStorage.setItem("drawiful_token", token);
}

export function clearToken() {
  localStorage.removeItem("drawiful_token");
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      clearToken();
      window.location.href = "/login";
    }
    throw new ApiError(data.message || "Une erreur est survenue", res.status);
  }

  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),

  // Profil artiste
  getMyProfile: () => request("/api/artists/me/profile"),
  updateMyProfile: (data: Record<string, unknown>) =>
    request("/api/artists/me/profile", { method: "PATCH", body: JSON.stringify(data) }),

  // Œuvres
  getArtworks: () => request("/api/artworks"),
  createArtwork: (data: Record<string, unknown>) =>
    request("/api/artworks", { method: "POST", body: JSON.stringify(data) }),
  updateArtwork: (id: string, data: Record<string, unknown>) =>
    request(`/api/artworks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteArtwork: (id: string) => request(`/api/artworks/${id}`, { method: "DELETE" }),

  // Certificats
  generateCertificate: (artworkId: string) =>
    request("/api/certificates/generate", { method: "POST", body: JSON.stringify({ artworkId }) }),
  getCertificate: (serialNumber: string) => request(`/api/certificates/verify/${serialNumber}`),

  // Abonnement
  getPlans: () => request("/api/subscriptions/plans"),
  createPortalSession: () => request("/api/subscriptions/portal", { method: "POST" }),

  // Ventes
  getOrders: () => request("/api/orders"),
  getOrderStats: () => request("/api/orders/stats"),
  markOrderShipped: (id: string) => request(`/api/orders/${id}/ship`, { method: "PATCH" }),

  // Stripe Connect
  getConnectStatus: () => request("/api/stripe-connect/status"),
  createConnectOnboarding: () => request("/api/stripe-connect/onboarding", { method: "POST" }),
  createConnectDashboard: () => request("/api/stripe-connect/dashboard", { method: "POST" }),

  // Compte
  getAccount: () => request("/api/account/me"),
  changePassword: (currentPassword: string, newPassword: string) =>
    request("/api/account/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  changeEmail: (newEmail: string, currentPassword: string) =>
    request("/api/account/email", {
      method: "PATCH",
      body: JSON.stringify({ newEmail, currentPassword }),
    }),
};

export { ApiError };
