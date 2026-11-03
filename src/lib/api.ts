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
  localStorage.removeItem(MAISON_KEY);
}

/*
  Accès maison (conciergerie) : la maison entre dans la galerie d'un artiste
  avec un jeton de 2 h. Son propre jeton est mis de côté pour y revenir.
*/
const MAISON_KEY = "drawiful_maison";

export type MaisonVisit = { token: string; galleryName: string };

export function getMaisonVisit(): MaisonVisit | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MAISON_KEY);
    return raw ? (JSON.parse(raw) as MaisonVisit) : null;
  } catch {
    return null;
  }
}

export function startMaisonVisit(artistToken: string, galleryName: string) {
  const own = getToken();
  if (!own) return;
  localStorage.setItem(MAISON_KEY, JSON.stringify({ token: own, galleryName }));
  setToken(artistToken);
}

// Retour au compte de la maison ; renvoie false s'il n'y avait pas d'accès en cours.
export function endMaisonVisit(): boolean {
  const visit = getMaisonVisit();
  localStorage.removeItem(MAISON_KEY);
  if (!visit) return false;
  setToken(visit.token);
  return true;
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
      // Accès maison expiré (2 h) : retour au compte de la maison
      if (endMaisonVisit()) {
        window.location.href = "/maison";
      } else {
        clearToken();
        window.location.href = "/login";
      }
    }
    throw new ApiError(data.message || "Une erreur est survenue", res.status);
  }

  return data;
}

export const api = {
  // Accès maison (conciergerie)
  maisonAccess: () => request("/api/maison/acces"),
  maisonSearch: (q: string) => request(`/api/maison/galeries?q=${encodeURIComponent(q)}`),
  maisonEnter: (profileId: string) =>
    request(`/api/maison/galeries/${encodeURIComponent(profileId)}/entrer`, { method: "POST" }),
  maisonJournal: () => request("/api/maison/journal"),

  // Auth
  login: (email: string, password: string) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (
    email: string,
    password: string,
    attribution: { signupSource?: string; signupMedium?: string; signupCampaign?: string } = {},
  ) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, ...attribution }),
    }),

  // Profil artiste
  getMyProfile: () => request("/api/artists/me/profile"),
  updateMyProfile: (data: Record<string, unknown>) =>
    request("/api/artists/me/profile", { method: "PATCH", body: JSON.stringify(data) }),

  // Adresse de la galerie (<slug>.drawiful.art) et domaine personnalisé
  getMyDomain: () => request("/api/artists/me/domain"),
  setMyDomain: (domain: string) =>
    request("/api/artists/me/domain", { method: "PUT", body: JSON.stringify({ domain }) }),
  verifyMyDomain: () => request("/api/artists/me/domain/verify", { method: "POST" }),
  removeMyDomain: () => request("/api/artists/me/domain", { method: "DELETE" }),

  // Intérêt pour une fonctionnalité à venir (ex. les tirages encadrés)
  getMyInterests: () => request("/api/interests/me"),
  registerInterest: (data: { feature: string; formats?: string[]; priceRange?: string }) =>
    request("/api/interests", { method: "POST", body: JSON.stringify(data) }),

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
  createSubscriptionCheckout: (planKey: string) =>
    request("/api/subscriptions/checkout", { method: "POST", body: JSON.stringify({ planKey }) }),

  // Ventes
  getOrders: () => request("/api/orders"),
  getOrderStats: () => request("/api/orders/stats"),

  // Fréquentation de la galerie (visiteurs, « se sont attardés »), N derniers jours
  getMyStats: (days = 7) => request(`/api/analytics/me?days=${days}`),

  // Le Cercle : collectionneurs de l'artiste et cartons de vernissage privé
  getMyCircle: () => request("/api/circle/me"),
  removeCircleMember: (id: string) => request(`/api/circle/me/members/${id}`, { method: "DELETE" }),
  sendCircleInvitation: (data: { artworkId: string; eventDate?: string; message?: string }) =>
    request("/api/circle/me/invitations", { method: "POST", body: JSON.stringify(data) }),
  markOrderShipped: (id: string) => request(`/api/orders/${id}/ship`, { method: "PATCH" }),
  refundOrder: (id: string) => request(`/api/orders/${id}/refund`, { method: "POST" }),

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
