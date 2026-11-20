const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");
const TOKEN_KEY = "elearn.token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const absoluteUploadUrl = (p?: string | null) => {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  return `${API_ORIGIN}${p.startsWith("/") ? "" : "/"}${p}`;
};

type ApiEnvelope<T> = { success: boolean; statusCode: number; message: string; data: T };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const json = (await res.json().catch(() => ({}))) as Partial<ApiEnvelope<T>>;
  if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`);
  return (json.data as T) ?? ({} as T);
}

export type BackendUser = {
  id: number; name: string; email: string; phone: string | null;
  role: "user" | "admin"; avatar: string | null; isVerified: boolean;
};

export type BackendUserRow = BackendUser & {
  isActive: boolean; lastLoginAt: string | null; createdAt: string;
};

export type BackendCategory = {
  id: number; name: string; shortHeading: string; description: string;
  sortOrder: number; isActive: boolean; createdAt: string; updatedAt: string;
};

export type BackendCourse = {
  id: number;
  title: string;
  shortDescription: string;
  description: string | null;
  objectives: string | null;
  categoryId: number;
  categoryName: string;
  originalPrice: number;
  discountPrice: number;
  status: "draft" | "live" | "paused";
  imageUrl: string | null;
  offerText: string | null;
  courseLength: string | null;
  createdAt: string;
  updatedAt: string;
};


export type BackendPath = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  duration: string | null;
  level: string | null;
  skills: string[];        // array in JS, JSON in DB
  outcomes: string;        // newline-separated
  steps: string;           // newline-separated
  categoryId: number;
  categoryName: string;
};

export const api = {
  signup: (body: { name: string; email: string; password: string; phone?: string }) =>
    request<{ user: BackendUser; token: string }>("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<{ user: BackendUser; token: string }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request<{ user: BackendUser }>("/auth/me"),

  listUsers: (params: { page?: number; limit?: number; search?: string; role?: "user" | "admin" } = {}) => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    if (params.role) q.set("role", params.role);
    return request<{ users: BackendUserRow[]; total: number; page: number; limit: number }>(
      `/users${q.toString() ? "?" + q.toString() : ""}`
    );
  },
  updateUserStatus: (id: number, isActive: boolean) =>
    request<{ user: BackendUserRow }>(`/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ isActive }) }),

  listCategories: (includeInactive = false) =>
    request<{ categories: BackendCategory[] }>(`/categories?includeInactive=${includeInactive}`),
  createCategory: (body: { name: string; shortHeading?: string; description: string; sortOrder?: number }) =>
    request<{ category: BackendCategory }>("/categories", { method: "POST", body: JSON.stringify(body) }),
  updateCategory: (id: number, patch: Partial<{ name: string; shortHeading: string; description: string; sortOrder: number; isActive: boolean }>) =>
    request<{ category: BackendCategory }>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteCategory: (id: number) => request<{}>(`/categories/${id}`, { method: "DELETE" }),

  listCourses: (params: { includeAll?: boolean; categoryId?: number; search?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.includeAll) q.set("includeAll", "true");
    if (params.categoryId) q.set("categoryId", String(params.categoryId));
    if (params.search) q.set("search", params.search);
    return request<{ courses: BackendCourse[] }>(`/courses${q.toString() ? "?" + q.toString() : ""}`);
  },
  getCourse: (id: number) => request<{ course: BackendCourse }>(`/courses/${id}`),
  createCourse: (body: {
    title: string; shortDescription?: string; description?: string; objectives?: string;
    categoryId: number; originalPrice: number; discountPrice: number;
    status: "draft" | "live" | "paused";
    imageUrl?: string | null; offerText?: string | null; courseLength?: string | null;
  }) => request<{ course: BackendCourse }>("/courses", { method: "POST", body: JSON.stringify(body) }),
  updateCourse: (id: number, patch: Partial<{
    title: string; shortDescription: string; description: string; objectives: string;
    categoryId: number; originalPrice: number; discountPrice: number;
    status: "draft" | "live" | "paused";
    imageUrl: string | null; offerText: string | null; courseLength: string | null;
  }>) => request<{ course: BackendCourse }>(`/courses/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteCourse: (id: number) => request<{}>(`/courses/${id}`, { method: "DELETE" }),
  uploadCourseImage: async (file: File) => {
    const form = new FormData();
    form.append("image", file);
    const token = getToken();
    const res = await fetch(`${BASE_URL}/courses/upload-image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const json = (await res.json().catch(() => ({}))) as Partial<ApiEnvelope<{ imageUrl: string }>>;
    if (!res.ok) throw new Error(json.message || "Upload failed");
    return json.data as { imageUrl: string };
  },

  listCart: () => request<{ items: { id: number; courseId: number; title: string; price: number; imageUrl: string | null }[] }>("/cart"),
  addToCart: (courseId: number) => request<{ items: { id: number; courseId: number; title: string; price: number; imageUrl: string | null }[] }>("/cart", { method: "POST", body: JSON.stringify({ courseId }) }),
  removeFromCart: (courseId: number) => request<{ items: { id: number; courseId: number; title: string; price: number; imageUrl: string | null }[] }>(`/cart/${courseId}`, { method: "DELETE" }),

  listWishlist: () => request<{ courseIds: number[] }>("/wishlist"),
  toggleWishlist: (courseId: number) => request<{ added: boolean; courseIds: number[] }>("/wishlist/toggle", { method: "POST", body: JSON.stringify({ courseId }) }),
   listPaths: () => request<{ paths: BackendPath[] }>("/paths"),
  createPath: (body: any) => request<{ path: BackendPath }>("/paths", { method: "POST", body: JSON.stringify(body) }),
  updatePath: (id: number, patch: any) => request<{ path: BackendPath }>(`/paths/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deletePath: (id: number) => request<{}>(`/paths/${id}`, { method: "DELETE" }),
};