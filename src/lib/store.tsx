import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from "react";
import {
  api, getToken, setToken, clearToken,
  type BackendUser, type BackendCategory, type BackendCourse,
} from "@/lib/api";

export type Toast = { id: number; message: string; tone: "success" | "info" | "error" };
export type Role = "user" | "admin";

export type Account = {
  id: number; name: string; email: string; role: Role; joined: string; avatar?: string | null;
};

export type AuthMode = "signin" | "signup";

export type UiCategory = {
  id: number; name: string; shortHeading: string; description: string;
  sortOrder: number; isActive: boolean; count: number;
};

export type UiCourse = {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  objectives: string;
  categoryId: number;
  categoryName: string;
  originalPrice: number;
  discountPrice: number;
  status: "draft" | "live" | "paused";
  imageUrl: string;
  offerText: string;
  courseLength: string;
  createdAt: string;
};

export type CartItem = { id: number; courseId: number; title: string; price: number; imageUrl: string | null };

type ShopValue = {
  route: string;
  navigate: (path: string) => void;
  toasts: Toast[];
  toast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  account: Account | null;
  signIn: (email: string, password: string, role: Role) => Promise<boolean>;
  signUp: (name: string, email: string, password: string, role: Role) => Promise<boolean>;
  signOut: () => void;
  authLoading: boolean;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  authRole: Role;
  setAuthRole: (role: Role) => void;
  openAuth: (role: Role, mode?: AuthMode) => void;
  careerOpen: boolean;
  setCareerOpen: (open: boolean) => void;
  categories: UiCategory[];
  categoriesLoading: boolean;
  refreshCategories: () => Promise<void>;
  createCategory: (body: { name: string; shortHeading?: string; description: string }) => Promise<boolean>;
  updateCategory: (id: number, patch: Partial<{ name: string; shortHeading: string; description: string; isActive: boolean }>) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  courses: UiCourse[];
  coursesLoading: boolean;
  refreshCourses: () => Promise<void>;
  createCourse: (body: {
    title: string; shortDescription?: string; description?: string; objectives?: string;
    categoryId: number; originalPrice: number; discountPrice: number;
    status: "draft" | "live" | "paused";
    imageUrl?: string | null; offerText?: string | null; courseLength?: string | null;
  }) => Promise<boolean>;
  updateCourse: (id: number, patch: Partial<{
    title: string; shortDescription: string; description: string; objectives: string;
    categoryId: number; originalPrice: number; discountPrice: number;
    status: "draft" | "live" | "paused";
    imageUrl: string | null; offerText: string | null; courseLength: string | null;
  }>) => Promise<boolean>;
  deleteCourse: (id: number) => Promise<boolean>;
  uploadCourseImage: (file: File) => Promise<string | null>;
  cartItems: CartItem[];
  cartLoading: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (courseId: number) => Promise<void>;
  removeFromCart: (courseId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  wishlistIds: number[];
  toggleWishlist: (courseId: number) => Promise<void>;
  inWishlist: (courseId: number) => boolean;
  coupon: string | null;
  couponPercent: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
};

const ShopContext = createContext<ShopValue | null>(null);
const COUPONS: Record<string, number> = { ELEARN20: 20, GROW25: 25, FIRST10: 10 };

function parseRoute(): string {
  const raw = window.location.hash.replace(/^#\/?/, "").trim();
  if (!raw) return "home";
  return raw.replace(/\/+$/, "");
}

const toAccount = (u: BackendUser): Account => ({
  id: u.id, name: u.name, email: u.email, role: u.role,
  joined: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  avatar: u.avatar,
});

const mapCategory = (c: BackendCategory, courses: UiCourse[]): UiCategory => ({
  id: c.id, name: c.name, shortHeading: c.shortHeading, description: c.description,
  sortOrder: c.sortOrder, isActive: c.isActive,
  count: courses.filter((co) => co.categoryId === c.id).length,
});

const mapCourse = (c: BackendCourse): UiCourse => ({
  id: c.id,
  title: c.title,
  shortDescription: c.shortDescription || "",
  description: c.description || "",
  objectives: c.objectives || "",
  categoryId: c.categoryId,
  categoryName: c.categoryName,
  originalPrice: Number(c.originalPrice),
  discountPrice: Number(c.discountPrice),
  status: c.status,
  imageUrl: c.imageUrl || "",
  offerText: c.offerText || "",
  courseLength: c.courseLength || "",
  createdAt: c.createdAt,
});

export function ShopProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<string>(() => (typeof window === "undefined" ? "home" : parseRoute()));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [account, setAccount] = useState<Account | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authRole, setAuthRole] = useState<Role>("user");
  const [careerOpen, setCareerOpen] = useState(false);
  const [categories, setCategories] = useState<UiCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [courses, setCourses] = useState<UiCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);

  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3400);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) { setAuthLoading(false); return; }
      try {
        const { user } = await api.me();
        setAccount(toAccount(user));
      } catch { clearToken(); }
      finally { setAuthLoading(false); }
    })();
  }, []);

  const refreshCategories = useCallback(async () => {
    const res = await api.listCategories(true);
    setCategories(res.categories.map((c) => mapCategory(c, courses)));
  }, [courses]);

  const refreshCourses = useCallback(async () => {
    const isAdmin = account?.role === "admin";
    const res = await api.listCourses({ includeAll: isAdmin });
    const mapped = res.courses.map(mapCourse);
    setCourses(mapped);
    setCategories((prev) => prev.map((c) => ({ ...c, count: mapped.filter((co) => co.categoryId === c.id).length })));
  }, [account]);

  const refreshCart = useCallback(async () => {
    if (!account) { setCartItems([]); return; }
    setCartLoading(true);
    try {
      const res = await api.listCart();
      setCartItems(res.items);
    } catch { setCartItems([]); }
    finally { setCartLoading(false); }
  }, [account]);

  const refreshWishlist = useCallback(async () => {
    if (!account) { setWishlistIds([]); return; }
    try {
      const res = await api.listWishlist();
      setWishlistIds(res.courseIds);
    } catch { setWishlistIds([]); }
  }, [account]);

  useEffect(() => {
    (async () => {
      setCategoriesLoading(true);
      setCoursesLoading(true);
      try {
        const [cat, crs] = await Promise.all([
          api.listCategories(account?.role === "admin"),
          api.listCourses({ includeAll: account?.role === "admin" }),
        ]);
        const mappedCourses = crs.courses.map(mapCourse);
        setCourses(mappedCourses);
        setCategories(cat.categories.map((c) => mapCategory(c, mappedCourses)));
      } catch (err) {
        toast(err instanceof Error ? err.message : "Failed to load catalogue", "error");
      } finally {
        setCategoriesLoading(false);
        setCoursesLoading(false);
      }
    })();
  }, [account, toast]);

  useEffect(() => { refreshCart(); }, [refreshCart]);
  useEffect(() => { refreshWishlist(); }, [refreshWishlist]);

  useEffect(() => {
    const onHash = () => { setRoute(parseRoute()); window.scrollTo({ top: 0, behavior: "auto" }); };
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = "#/home";
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const locked = authOpen || careerOpen || cartOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [authOpen, careerOpen, cartOpen]);

  const navigate = useCallback((path: string) => {
    const clean = path.replace(/^#?\/?/, "");
    if (parseRoute() === clean) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    window.location.hash = `#/${clean}`;
    setRoute(clean);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const signIn = useCallback(async (email: string, password: string, role: Role) => {
    try {
      const { user, token } = await api.login({ email, password });
      const mapped = toAccount(user);
      if (role === "admin" && mapped.role !== "admin") {
        toast("This account is not an admin account", "error"); return false;
      }
      setToken(token); setAccount(mapped); setAuthOpen(false);
      toast(mapped.role === "admin" ? "Signed in as admin" : `Welcome back, ${mapped.name.split(" ")[0]}`);
      setRoute(mapped.role === "admin" ? "admin" : "dashboard");
      window.location.hash = mapped.role === "admin" ? "#/admin" : "#/dashboard";
      return true;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Login failed", "error"); return false;
    }
  }, [toast]);

  const signUp = useCallback(async (name: string, email: string, password: string, _role: Role) => {
    try {
      const { user, token } = await api.signup({ name, email, password });
      const mapped = toAccount(user);
      setToken(token); setAccount(mapped); setAuthOpen(false);
      toast(`Account created — welcome, ${mapped.name.split(" ")[0]}`);
      setRoute("dashboard"); window.location.hash = "#/dashboard";
      return true;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Signup failed", "error"); return false;
    }
  }, [toast]);

  const signOut = useCallback(() => {
    clearToken(); setAccount(null); setCartItems([]); setWishlistIds([]);
    toast("Signed out", "info"); setRoute("home"); window.location.hash = "#/home";
  }, [toast]);

  const openAuth = useCallback((role: Role, mode: AuthMode = "signin") => {
    setAuthRole(role); setAuthMode(mode); setAuthOpen(true);
  }, []);

  const createCategory = useCallback(async (body: { name: string; shortHeading?: string; description: string }) => {
    try { await api.createCategory(body); await refreshCategories(); toast(`Category "${body.name}" created`); return true; }
    catch (err) { toast(err instanceof Error ? err.message : "Create failed", "error"); return false; }
  }, [refreshCategories, toast]);

  const updateCategory = useCallback(async (id: number, patch: Partial<{ name: string; shortHeading: string; description: string; isActive: boolean }>) => {
    try { await api.updateCategory(id, patch); await refreshCategories(); toast("Category updated"); return true; }
    catch (err) { toast(err instanceof Error ? err.message : "Update failed", "error"); return false; }
  }, [refreshCategories, toast]);

  const deleteCategory = useCallback(async (id: number) => {
    try { await api.deleteCategory(id); await refreshCategories(); toast("Category deleted"); return true; }
    catch (err) { toast(err instanceof Error ? err.message : "Delete failed", "error"); return false; }
  }, [refreshCategories, toast]);

  const createCourse = useCallback(async (body: Parameters<typeof api.createCourse>[0]) => {
    try { await api.createCourse(body); await refreshCourses(); toast(`Course "${body.title}" created`); return true; }
    catch (err) { toast(err instanceof Error ? err.message : "Create failed", "error"); return false; }
  }, [refreshCourses, toast]);

  const updateCourse = useCallback(async (id: number, patch: Parameters<typeof api.updateCourse>[1]) => {
    try { await api.updateCourse(id, patch); await refreshCourses(); toast("Course updated"); return true; }
    catch (err) { toast(err instanceof Error ? err.message : "Update failed", "error"); return false; }
  }, [refreshCourses, toast]);

  const deleteCourse = useCallback(async (id: number) => {
    try { await api.deleteCourse(id); await refreshCourses(); toast("Course deleted"); return true; }
    catch (err) { toast(err instanceof Error ? err.message : "Delete failed", "error"); return false; }
  }, [refreshCourses, toast]);

  const uploadCourseImage = useCallback(async (file: File) => {
    try { const res = await api.uploadCourseImage(file); return res.imageUrl; }
    catch (err) { toast(err instanceof Error ? err.message : "Upload failed", "error"); return null; }
  }, [toast]);

  const addToCart = useCallback(async (courseId: number) => {
    if (!account) { openAuth("user", "signin"); return; }
    try { const res = await api.addToCart(courseId); setCartItems(res.items); toast("Added to cart"); }
    catch (err) { toast(err instanceof Error ? err.message : "Add failed", "error"); }
  }, [account, openAuth, toast]);

  const removeFromCart = useCallback(async (courseId: number) => {
    if (!account) return;
    try { const res = await api.removeFromCart(courseId); setCartItems(res.items); toast("Removed from cart", "info"); }
    catch (err) { toast(err instanceof Error ? err.message : "Remove failed", "error"); }
  }, [account, toast]);

  const toggleWishlist = useCallback(async (courseId: number) => {
    if (!account) { openAuth("user", "signin"); return; }
    try { const res = await api.toggleWishlist(courseId); setWishlistIds(res.courseIds); toast(res.added ? "Saved to wishlist" : "Removed from wishlist"); }
    catch (err) { toast(err instanceof Error ? err.message : "Wishlist failed", "error"); }
  }, [account, openAuth, toast]);

  const inWishlist = useCallback((courseId: number) => wishlistIds.includes(courseId), [wishlistIds]);

  const couponPercent = coupon ? COUPONS[coupon] ?? 0 : 0;
  const applyCoupon = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (COUPONS[normalized]) { setCoupon(normalized); toast(`Coupon ${normalized} applied`); return true; }
    toast("That coupon is not valid", "error"); return false;
  }, [toast]);
  const removeCoupon = useCallback(() => { setCoupon(null); toast("Coupon removed", "info"); }, [toast]);

  const value: ShopValue = useMemo(() => ({
    route, navigate, toasts, toast, dismissToast, searchTerm, setSearchTerm,
    account, signIn, signUp, signOut, authLoading, authOpen, setAuthOpen, authMode, setAuthMode, authRole, setAuthRole, openAuth,
    careerOpen, setCareerOpen,
    categories, categoriesLoading, refreshCategories, createCategory, updateCategory, deleteCategory,
    courses, coursesLoading, refreshCourses, createCourse, updateCourse, deleteCourse, uploadCourseImage,
    cartItems, cartLoading, cartOpen, setCartOpen, addToCart, removeFromCart, refreshCart,
    wishlistIds, toggleWishlist, inWishlist,
    coupon, couponPercent, applyCoupon, removeCoupon,
  }), [
    route, navigate, toasts, toast, dismissToast, searchTerm,
    account, signIn, signUp, signOut, authLoading, authOpen, authMode, authRole, openAuth, careerOpen,
    categories, categoriesLoading, refreshCategories, createCategory, updateCategory, deleteCategory,
    courses, coursesLoading, refreshCourses, createCourse, updateCourse, deleteCourse, uploadCourseImage,
    cartItems, cartLoading, cartOpen, addToCart, removeFromCart, refreshCart,
    wishlistIds, toggleWishlist, inWishlist,
    coupon, couponPercent, applyCoupon, removeCoupon,
  ]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}