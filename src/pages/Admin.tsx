import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { absoluteUploadUrl, api, type AdminStats, type BackendUserRow, type AdminOrderRow } from "@/lib/api";
import { formatINR } from "@/lib/data";
import { cn } from "@/utils/cn";
import { useShop, type UiCategory, type UiCourse, type UiPath } from "@/lib/store";

type ATab = "overview" | "orders" | "users" | "categories" | "courses" | "paths" | "profile" | "counselling";

const adminNav: { id: ATab; label: string; icon: string }[] = [
  { id: "overview", label: "Dashboard", icon: "layout" },
  { id: "orders", label: "Orders", icon: "receipt" },
  { id: "users", label: "Users", icon: "users" },
  { id: "categories", label: "Categories", icon: "grid" },
  { id: "courses", label: "Courses", icon: "book" },
  { id: "paths", label: "Career Tracks", icon: "route" },
  { id: "counselling", label: "Counselling", icon: "calendar" },
  { id: "profile", label: "Profile", icon: "user" },
];

// ---------- Reusable confirm dialog ----------
function ConfirmDialog({
  open, title, message, confirmLabel = "Delete", onCancel, onConfirm, loading,
}: {
  open: boolean; title: string; message: string; confirmLabel?: string;
  onCancel: () => void; onConfirm: () => void; loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onCancel} className="fixed inset-0 bg-ink/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-2xl bg-paper p-5 shadow-2xl">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">{message}</p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onCancel} disabled={loading} className="btn btn-outline btn-sm flex-1">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={loading} className="btn btn-sm flex-1 bg-coral text-white hover:opacity-90">
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Category modal ----------
function CategoryModal({
  open, mode, initial, onClose, onSave,
}: {
  open: boolean; mode: "new" | "edit"; initial: UiCategory | null;
  onClose: () => void;
  onSave: (data: { name: string; shortHeading: string; description: string }) => Promise<boolean>;
}) {
  const [form, setForm] = useState({ name: "", shortHeading: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm({ name: initial?.name || "", shortHeading: initial?.shortHeading || "", description: initial?.description || "" });
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="fixed inset-0 bg-ink/50 backdrop-blur-sm" />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          const ok = await onSave(form);
          setSaving(false);
          if (ok) onClose();
        }}
        className="relative w-full max-w-md rounded-2xl bg-paper p-5 shadow-2xl"
      >
        <h3 className="font-display text-lg font-semibold">{mode === "new" ? "New category" : "Edit category"}</h3>
        <div className="mt-4 space-y-3">
          <div className="field"><label>Name</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" required /></div>
          <div className="field"><label>Short heading</label><input value={form.shortHeading} onChange={(e) => setForm((f) => ({ ...f, shortHeading: e.target.value }))} className="input" placeholder="e.g. Ship faster, break less" /></div>
          <div className="field"><label>Description</label><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input min-h-[100px]" required /></div>
        </div>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-outline btn-sm flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn btn-primary btn-sm flex-1">{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

// ---------- Course modal ----------
function CourseModal({
  open, mode, initial, categories, onClose, onSave, uploadImage,
}: {
  open: boolean; mode: "new" | "edit"; initial: UiCourse | null;
  categories: UiCategory[];
  onClose: () => void;
  onSave: (data: {
    title: string; shortDescription: string; description: string; objectives: string;
    categoryId: number; originalPrice: number; discountPrice: number;
    status: "draft" | "live" | "paused";
    imageUrl: string | null; offerText: string | null; courseLength: string | null;
  }) => Promise<boolean>;
  uploadImage: (file: File) => Promise<string | null>;
}) {
  const [form, setForm] = useState({
    title: "", shortDescription: "", description: "", objectives: "",
    categoryId: 0, originalPrice: "", discountPrice: "",
    status: "draft" as "draft" | "live" | "paused",
    imageUrl: "", offerText: "", courseLength: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm({
        title: initial?.title || "",
        shortDescription: initial?.shortDescription || "",
        description: initial?.description || "",
        objectives: initial?.objectives || "",
        categoryId: initial?.categoryId || (categories[0]?.id ?? 0),
        originalPrice: initial ? String(initial.originalPrice) : "",
        discountPrice: initial ? String(initial.discountPrice) : "",
        status: initial?.status || "draft",
        imageUrl: initial?.imageUrl || "",
        offerText: initial?.offerText || "",
        courseLength: initial?.courseLength || "",
      });
    }
  }, [open, initial, categories]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="fixed inset-0 bg-ink/50 backdrop-blur-sm" />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!form.categoryId) return;
          setSaving(true);
          const ok = await onSave({
            title: form.title,
            shortDescription: form.shortDescription,
            description: form.description,
            objectives: form.objectives,
            categoryId: Number(form.categoryId),
            originalPrice: Number(form.originalPrice) || 0,
            discountPrice: Number(form.discountPrice) || 0,
            status: form.status,
            imageUrl: form.imageUrl || null,
            offerText: form.offerText || null,
            courseLength: form.courseLength || null,
          });
          setSaving(false);
          if (ok) onClose();
        }}
        className="relative my-8 w-full max-w-2xl rounded-2xl bg-paper p-5 shadow-2xl"
      >
        <h3 className="font-display text-lg font-semibold">{mode === "new" ? "New course" : "Edit course"}</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="field sm:col-span-2"><label>Title</label><input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input" required /></div>
          <div className="field sm:col-span-2"><label>Short description</label><input value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} className="input" /></div>

          <div className="field sm:col-span-2">
            <label>Long Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input min-h-[80px]" placeholder="Full description about the course..." />
          </div>

          <div className="field sm:col-span-2">
            <label>Course Objectives (What you'll learn)</label>
            <textarea
              value={form.objectives}
              onChange={(e) => setForm((f) => ({ ...f, objectives: e.target.value }))}
              className="input min-h-[100px]"
              placeholder="Enter each objective on a new line. These will show as bullet points on the course page."
            />
          </div>

          <div className="field">
            <label>Category</label>
            <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))} className="select" required>
              <option value={0} disabled>Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))} className="select">
              <option value="draft">Draft</option>
              <option value="live">Live</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div className="field"><label>Original price (₹)</label><input type="number" min="0" value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))} className="input" required /></div>
          <div className="field"><label>Discount price (₹)</label><input type="number" min="0" value={form.discountPrice} onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))} className="input" required /></div>

          <div className="field"><label>Course length / Duration</label><input value={form.courseLength} onChange={(e) => setForm((f) => ({ ...f, courseLength: e.target.value }))} className="input" placeholder="e.g. 12h 30m" /></div>
          <div className="field"><label>Offer (optional)</label><input value={form.offerText} onChange={(e) => setForm((f) => ({ ...f, offerText: e.target.value }))} className="input" placeholder="e.g. Bestseller" /></div>

          <div className="field sm:col-span-2">
            <label>Image</label>
            <div className="flex items-center gap-3">
              <input
                ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setUploading(true);
                  const url = await uploadImage(f);
                  setUploading(false);
                  if (url) setForm((prev) => ({ ...prev, imageUrl: url }));
                }}
              />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-outline btn-sm">
                {uploading ? "Uploading…" : "Choose image"}
              </button>
              {form.imageUrl && <img src={absoluteUploadUrl(form.imageUrl)} alt="" className="h-12 w-16 rounded object-cover" />}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-outline btn-sm flex-1">Cancel</button>
          <button type="submit" disabled={saving || uploading} className="btn btn-primary btn-sm flex-1">
            {saving ? "Saving…" : mode === "new" ? "Create course" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function PathModal({
  open, mode, initial, categories, onClose, onSave, uploadImage,
}: {
  open: boolean; mode: "new" | "edit"; initial: UiPath | null;
  categories: UiCategory[];
  onClose: () => void;
  onSave: (data: {
    title: string; description: string; imageUrl: string | null;
    duration: string | null; level: string | null;
    skills: string[]; outcomes: string; steps: string;
    categoryId: number;
  }) => Promise<boolean>;
  uploadImage: (file: File) => Promise<string | null>;
}) {
  const [form, setForm] = useState({
    title: "", description: "", imageUrl: "",
    duration: "", level: "", skills: "", outcomes: "", steps: "",
    categoryId: 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm({
        title: initial?.title || "",
        description: initial?.description || "",
        imageUrl: initial?.imageUrl || "",
        duration: initial?.duration || "",
        level: initial?.level || "",
        skills: (initial?.skills || []).join(", "),
        outcomes: initial?.outcomes || "",
        steps: initial?.steps || "",
        categoryId: initial?.categoryId || (categories[0]?.id ?? 0),
      });
    }
  }, [open, initial, categories]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="fixed inset-0 bg-ink/50 backdrop-blur-sm" />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          const ok = await onSave({
            title: form.title,
            description: form.description,
            imageUrl: form.imageUrl || null,
            duration: form.duration || null,
            level: form.level || null,
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
            outcomes: form.outcomes,
            steps: form.steps,
            categoryId: Number(form.categoryId),
          });
          setSaving(false);
          if (ok) onClose();
        }}
        className="relative my-8 w-full max-w-2xl rounded-2xl bg-paper p-5 shadow-2xl"
      >
        <h3 className="font-display text-lg font-semibold">{mode === "new" ? "New career track" : "Edit career track"}</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="field sm:col-span-2"><label>Title</label><input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input" required /></div>
          <div className="field sm:col-span-2"><label>Short description</label><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input min-h-[70px]" required /></div>

          <div className="field"><label>Duration</label><input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} className="input" placeholder="e.g. 6 months" /></div>
          <div className="field"><label>Level</label><input value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} className="input" placeholder="e.g. Beginner to job-ready" /></div>

          <div className="field sm:col-span-2"><label>Skills (comma-separated)</label><input value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} className="input" placeholder="Linux, Docker, Kubernetes" /></div>

          <div className="field sm:col-span-2"><label>Outcomes (one per line)</label><textarea value={form.outcomes} onChange={(e) => setForm((f) => ({ ...f, outcomes: e.target.value }))} className="input min-h-[80px]" placeholder={"Deploy production-grade containers\nAutomate CI/CD pipelines"} /></div>

          <div className="field sm:col-span-2"><label>Sequence / Steps (one per line)</label><textarea value={form.steps} onChange={(e) => setForm((f) => ({ ...f, steps: e.target.value }))} className="input min-h-[80px]" placeholder={"Linux fundamentals\nDocker deep dive\nKubernetes in production"} /></div>

          <div className="field">
            <label>Category</label>
            <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))} className="select" required>
              <option value={0} disabled>Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="field sm:col-span-2">
            <label>Image</label>
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setUploading(true);
                  const url = await uploadImage(f);
                  setUploading(false);
                  if (url) setForm((prev) => ({ ...prev, imageUrl: url }));
                }}
              />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-outline btn-sm">
                {uploading ? "Uploading…" : "Choose image"}
              </button>
              {form.imageUrl && <img src={absoluteUploadUrl(form.imageUrl)} alt="" className="h-12 w-16 rounded object-cover" />}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-outline btn-sm flex-1">Cancel</button>
          <button type="submit" disabled={saving || uploading} className="btn btn-primary btn-sm flex-1">
            {saving ? "Saving…" : mode === "new" ? "Create track" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* Simple revenue bar chart */
function RevenueChart({ data }: { data: { date: string; amount: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.amount));
  return (
    <div className="mt-3 flex h-24 items-end gap-1.5">
      {data.map((d) => (
        <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-sm bg-lime-deep"
            style={{ height: `${Math.max(3, (d.amount / max) * 80)}px` }}
            title={`₹${d.amount.toLocaleString("en-IN")}`}
          />
          <span className="text-[0.5rem] text-muted">{new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 1)}</span>
        </div>
      ))}
    </div>
  );
}

/* Simple signups bar chart */
function SignupChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="mt-3 flex h-24 items-end gap-0.5">
      {data.map((d) => (
        <div key={d.date} className="flex flex-1 flex-col items-center justify-end">
          <div
            className="w-full rounded-sm bg-plum/70"
            style={{ height: `${Math.max(2, (d.count / max) * 80)}px` }}
            title={`${d.count} signups`}
          />
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const {
    account, signOut, navigate, openAuth, toast,
    categories, categoriesLoading, createCategory, updateCategory, deleteCategory,
    courses, coursesLoading, createCourse, updateCourse, deleteCourse, uploadCourseImage,
    paths, pathsLoading, createPath, updatePath, deletePath,
  } = useShop();

  const [tab, setTab] = useState<ATab>("overview");
  const [dateRange, setDateRange] = useState("7d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [adminOrders, setAdminOrders] = useState<AdminOrderRow[]>([]);
  const [adminOrdersTotal, setAdminOrdersTotal] = useState(0);
  const [adminOrdersPage, setAdminOrdersPage] = useState(1);
  const [adminOrdersLoading, setAdminOrdersLoading] = useState(false);

  // category UI
  const [catModal, setCatModal] = useState<null | "new" | "edit">(null);
  const [catEdit, setCatEdit] = useState<UiCategory | null>(null);
  const [catDelete, setCatDelete] = useState<UiCategory | null>(null);

  // course UI
  const [courseModal, setCourseModal] = useState<null | "new" | "edit">(null);
  const [courseEdit, setCourseEdit] = useState<UiCourse | null>(null);
  const [courseDelete, setCourseDelete] = useState<UiCourse | null>(null);
  const [pathModal, setPathModal] = useState<null | "new" | "edit">(null);
  const [pathEdit, setPathEdit] = useState<UiPath | null>(null);
  const [pathDelete, setPathDelete] = useState<UiPath | null>(null);
  const [deleting, setDeleting] = useState(false);

  // courses pagination
  const [coursePage, setCoursePage] = useState(1);
  const COURSES_PER_PAGE = 10;
  const totalCoursePages = Math.ceil(courses.length / COURSES_PER_PAGE) || 1;
  const paginatedCourses = courses.slice((coursePage - 1) * COURSES_PER_PAGE, coursePage * COURSES_PER_PAGE);

  // users UI
  const [users, setUsers] = useState<BackendUserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState("");
  const [usersRole, setUsersRole] = useState<"" | "user" | "admin">("");
  const USERS_PER_PAGE = 10;

  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminStatsLoading, setAdminStatsLoading] = useState(false);
  const [adminStatsError, setAdminStatsError] = useState<string | null>(null);

  // 1. Fetch Dashboard Stats
  useEffect(() => {
    if (tab !== "overview") return;
    setAdminStatsLoading(true);
    setAdminStatsError(null);

    const query: any = { range: dateRange };
    if (dateRange === "custom") {
      query.start = customStart;
      query.end = customEnd;
    }

    api.getAdminStats(query)
      .then((s) => setAdminStats(s))
      .catch((err) => setAdminStatsError(err instanceof Error ? err.message : "Failed to load stats"))
      .finally(() => setAdminStatsLoading(false));
  }, [tab, dateRange, customStart, customEnd]);

  // 2. Fetch Orders
  useEffect(() => {
    if (tab !== "orders") return;
    setAdminOrdersLoading(true);

    const query: any = { page: adminOrdersPage, limit: 10, range: dateRange };
    if (dateRange === "custom") {
      query.start = customStart;
      query.end = customEnd;
    }

    api.getAdminOrders(query)
      .then((res) => {
        setAdminOrders(res.orders);
        setAdminOrdersTotal(res.total);
      })
      .catch((err) => toast(err.message, "error"))
      .finally(() => setAdminOrdersLoading(false));
  }, [tab, adminOrdersPage, dateRange, customStart, customEnd, toast]);

  // 3. Fetch Users  ✅ NEW
  useEffect(() => {
    if (tab !== "users") return;
    if (!account || account.role !== "admin") return;

    setUsersLoading(true);

    const query: any = { page: usersPage, limit: USERS_PER_PAGE };
    if (usersSearch.trim()) query.search = usersSearch.trim();
    if (usersRole) query.role = usersRole;

    api.listUsers(query)
      .then((res) => {
        setUsers(res.users);
        setUsersTotal(res.total);
      })
      .catch((err) => toast(err instanceof Error ? err.message : "Failed to load users", "error"))
      .finally(() => setUsersLoading(false));
  }, [tab, usersPage, usersSearch, usersRole, account, toast]);

  // Reset to page 1 when filters change  ✅ NEW
  useEffect(() => {
    setUsersPage(1);
  }, [usersSearch, usersRole]);

  if (!account || account.role !== "admin") {
    return (
      <div className="wrap flex min-h-[62vh] items-center justify-center py-14">
        <div className="card w-full max-w-md p-7 text-center">
          <h1 className="mt-4 font-display text-2xl font-semibold">Admin access required</h1>
          <button type="button" onClick={() => openAuth("admin", "signin")} className="btn btn-primary btn-block mt-5">Sign in as admin</button>
          <button type="button" onClick={() => navigate("home")} className="mt-3 text-[0.7rem] text-muted hover:text-ink">Back to home</button>
        </div>
      </div>
    );
  }

  const toggleUserStatus = async (id: number, isActive: boolean) => {
    try {
      await api.updateUserStatus(id, !isActive);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !isActive } : u)));
      toast("User status updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed", "error");
    }
  };

  // Helper for Date Filter UI
  const DateFilter = () => (
    <div className="flex flex-wrap items-center gap-2 bg-paper p-2 rounded-xl border border-line mb-4">
      {["today", "7d", "1m", "custom"].map((r) => (
        <button
          key={r}
          onClick={() => setDateRange(r)}
          className={cn(
            "px-3 py-1.5 text-[0.7rem] font-medium rounded-lg transition-colors",
            dateRange === r ? "bg-ink text-white" : "text-muted hover:bg-cream"
          )}
        >
          {r === "today" ? "Today" : r === "7d" ? "Last 7 Days" : r === "1m" ? "Last 30 Days" : "Custom"}
        </button>
      ))}
      {dateRange === "custom" && (
        <div className="flex items-center gap-2 ml-auto">
          <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="input h-8 text-[0.7rem] py-1" />
          <span className="text-[0.7rem] text-muted">to</span>
          <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="input h-8 text-[0.7rem] py-1" />
        </div>
      )}
    </div>
  );

  return (
    <div className="wrap py-6 md:py-8">
      <div className="grid items-start gap-5 lg:grid-cols-[244px_1fr]">
        <aside className="lg:sticky lg:top-[84px]">
          <div className="overflow-hidden rounded-2xl bg-plum text-white">
            <div className="p-4">
              <p className="text-[0.84rem] font-semibold">{account.name}</p>
              <p className="text-[0.62rem] text-lime">Administrator</p>
            </div>
            <nav className="gap-0.5 p-2 grid">
              {adminNav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === "counselling") {
                      navigate("admin/counselling");
                      return;
                    }
                    setTab(item.id);
                  }}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[0.76rem] font-medium",
                    tab === item.id ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon name={item.icon} size={15} /> {item.label}
                </button>
              ))}
            </nav>
            <div className="p-2">
              <button type="button" onClick={signOut} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[0.72rem] text-white/45 hover:bg-white/5 hover:text-white">
                <Icon name="logout" size={14} /> Log out
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <h1 className="display text-[clamp(1.6rem,3vw,2.2rem)]">{adminNav.find((n) => n.id === tab)?.label}</h1>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="mt-5 space-y-4">
              <DateFilter />
              {adminStatsLoading && !adminStats ? (
                <div className="card p-6 text-center text-[0.78rem] text-muted">Loading dashboard…</div>
              ) : adminStatsError ? (
                <div className="card p-6 text-center text-[0.78rem] text-coral">{adminStatsError}</div>
              ) : adminStats ? (
                <>
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    {[
                      {
                        label: "Revenue",
                        value: `₹${adminStats.totals.revenue.toLocaleString("en-IN")}`,
                        sub: `${adminStats.totals.paidOrders} paid orders`,
                        icon: "receipt",
                        tint: "#CDF56A",
                      },
                      {
                        label: "Active learners",
                        value: String(adminStats.totals.activeLearners),
                        sub: "active accounts",
                        icon: "users",
                        tint: "#A9DDF5",
                      },
                      {
                        label: "Live courses",
                        value: String(adminStats.totals.liveCourses),
                        sub: `${adminStats.totals.totalCourses} total`,
                        icon: "book",
                        tint: "#D9C8FF",
                      },
                      {
                        label: "Enrollments",
                        value: String(adminStats.totals.totalEnrollments),
                        sub: "all time",
                        icon: "graduation",
                        tint: "#FFD3C7",
                      },
                    ].map((stat) => (
                      <div key={stat.label} className="card p-3.5">
                        <div className="flex items-start justify-between">
                          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted">{stat.label}</p>
                          <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: stat.tint }}>
                            <Icon name={stat.icon} size={13} />
                          </span>
                        </div>
                        <p className="mt-2 font-display text-[1.5rem] font-semibold leading-none">{stat.value}</p>
                        <p className="mt-1.5 text-[0.62rem] text-muted">{stat.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Charts row */}
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="card p-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-display text-[0.95rem] font-semibold">Revenue — last 7 days</h2>
                        <span className="text-[0.62rem] text-muted">
                          ₹{adminStats.revenueLast7Days.reduce((s, d) => s + d.amount, 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <RevenueChart data={adminStats.revenueLast7Days} />
                    </div>

                    <div className="card p-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-display text-[0.95rem] font-semibold">New signups — last 30 days</h2>
                        <span className="text-[0.62rem] text-muted">
                          {adminStats.signupsLast30Days.reduce((s, d) => s + d.count, 0)} total
                        </span>
                      </div>
                      <SignupChart data={adminStats.signupsLast30Days} />
                    </div>
                  </div>

                  {/* Top courses */}
                  <div className="card p-4">
                    <h2 className="font-display text-[0.95rem] font-semibold">Top 5 courses by enrollments</h2>
                    {adminStats.topCourses.length === 0 ? (
                      <p className="mt-3 text-[0.74rem] text-muted">No courses yet.</p>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {adminStats.topCourses.map((c) => {
                          const max = Math.max(1, ...adminStats.topCourses.map((x) => x.enrollments));
                          return (
                            <div key={c.id}>
                              <div className="flex justify-between text-[0.66rem]">
                                <span className="truncate text-ink-soft">{c.title}</span>
                                <span className="shrink-0 text-muted">{c.enrollments}</span>
                              </div>
                              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream-deep">
                                <div className="h-full rounded-full bg-lime-deep" style={{ width: `${(c.enrollments / max) * 100}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Recent enrollments */}
                  <div className="card overflow-hidden">
                    <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
                      <h2 className="font-display text-[0.95rem] font-semibold">Recent enrollments</h2>
                      <button
                        type="button"
                        onClick={() => setTab("users")}
                        className="text-[0.64rem] font-medium text-muted hover:text-ink"
                      >
                        See users <Icon name="arrowRight" size={11} />
                      </button>
                    </div>
                    {adminStats.recentEnrollments.length === 0 ? (
                      <p className="px-4 py-6 text-center text-[0.74rem] text-muted">No enrollments yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left">
                          <thead className="bg-cream/60">
                            <tr>
                              {["Name", "Email", "Course", "Date"].map((h) => (
                                <th key={h} className="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-line-soft">
                            {adminStats.recentEnrollments.map((e, i) => (
                              <tr key={i}>
                                <td className="px-4 py-2.5 text-[0.72rem] font-medium">{e.userName}</td>
                                <td className="px-4 py-2.5 text-[0.7rem] text-muted">{e.userEmail}</td>
                                <td className="px-4 py-2.5 text-[0.7rem]">{e.courseTitle}</td>
                                <td className="px-4 py-2.5 text-[0.66rem] text-muted">
                                  {new Date(e.createdAt).toLocaleDateString("en-IN")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <div className="mt-5">
              <DateFilter />
              <div className="overflow-hidden rounded-2xl border border-line bg-paper">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left">
                    <thead className="bg-cream/60">
                      <tr>
                        {["User", "Course", "Total", "Method", "Date"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line-soft">
                      {adminOrdersLoading ? (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">Loading orders…</td></tr>
                      ) : adminOrders.length === 0 ? (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No orders found for this period.</td></tr>
                      ) : adminOrders.map((o) => (
                        <tr key={o.id}>
                          <td className="px-4 py-3 text-[0.74rem] font-medium">{o.user_name}</td>
                          <td className="px-4 py-3 text-[0.72rem] text-muted">{o.course_title || "Multiple items"}</td>
                          <td className="px-4 py-3 text-[0.72rem] font-semibold">{formatINR(o.total)}</td>
                          <td className="px-4 py-3 text-[0.68rem] text-muted capitalize">{o.payment_method || "—"}</td>
                          <td className="px-4 py-3 text-[0.68rem] text-muted">
                            {new Date(o.created_at).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {adminOrdersTotal > 10 && (
                  <div className="flex items-center justify-between border-t border-line px-4 py-3">
                    <p className="text-[0.68rem] text-muted">
                      Showing {(adminOrdersPage - 1) * 10 + 1}–{Math.min(adminOrdersPage * 10, adminOrdersTotal)} of {adminOrdersTotal}
                    </p>
                    <div className="flex gap-1.5">
                      <button type="button" onClick={() => setAdminOrdersPage(p => Math.max(1, p - 1))} disabled={adminOrdersPage === 1} className="btn btn-sm btn-outline disabled:opacity-40">Prev</button>
                      <button type="button" onClick={() => setAdminOrdersPage(p => p + 1)} disabled={adminOrdersPage * 10 >= adminOrdersTotal} className="btn btn-sm btn-outline disabled:opacity-40">Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* USERS ✅ UPDATED */}
          {tab === "users" && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-paper">
              {/* Header with search + role filter */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
                <h2 className="font-display text-[0.98rem] font-semibold">
                  All Users {usersTotal > 0 && <span className="text-muted">({usersTotal})</span>}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="search"
                    value={usersSearch}
                    onChange={(e) => setUsersSearch(e.target.value)}
                    placeholder="Search name or email…"
                    className="input h-8 w-48 text-[0.72rem] py-1"
                  />
                  <select
                    value={usersRole}
                    onChange={(e) => setUsersRole(e.target.value as "" | "user" | "admin")}
                    className="select h-8 text-[0.72rem] py-1"
                  >
                    <option value="">All roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead className="bg-cream/60">
                    <tr>{["Name", "Email", "Role", "Joined", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
                    {usersLoading ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">Loading…</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No users found</td></tr>
                    ) : users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-4 py-3 font-medium text-[0.74rem]">{u.name}</td>
                        <td className="px-4 py-3 text-[0.74rem] text-muted">{u.email}</td>
                        <td className="px-4 py-3 text-[0.68rem] capitalize">{u.role}</td>
                        <td className="px-4 py-3 text-[0.68rem] text-muted">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-3">
                          <span className={cn("tag", u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-cream-deep text-muted")}>
                            {u.isActive ? "Active" : "Paused"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {u.id !== account.id && (
                            <button type="button" onClick={() => toggleUserStatus(u.id, u.isActive)} className="text-[0.66rem] font-semibold text-ink hover:underline">
                              {u.isActive ? "Pause" : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination ✅ NEW */}
              {usersTotal > USERS_PER_PAGE && (
                <div className="flex items-center justify-between border-t border-line px-4 py-3">
                  <p className="text-[0.68rem] text-muted">
                    Showing {(usersPage - 1) * USERS_PER_PAGE + 1}–
                    {Math.min(usersPage * USERS_PER_PAGE, usersTotal)} of {usersTotal}
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                      disabled={usersPage === 1}
                      className="btn btn-sm btn-outline disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsersPage((p) => p + 1)}
                      disabled={usersPage * USERS_PER_PAGE >= usersTotal}
                      className="btn btn-sm btn-outline disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CATEGORIES */}
          {tab === "categories" && (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[0.74rem] text-muted">{categoriesLoading ? "Loading…" : `${categories.length} categories`}</p>
                <button type="button" onClick={() => { setCatEdit(null); setCatModal("new"); }} className="btn btn-sm btn-primary">
                  <Icon name="plus" size={13} /> New category
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="card p-4">
                    <h3 className="font-display text-[0.95rem] font-semibold">{cat.name}</h3>
                    {cat.shortHeading && <p className="mt-0.5 text-[0.7rem] font-medium text-ink-soft">{cat.shortHeading}</p>}
                    <p className="mt-1 line-clamp-3 text-[0.7rem] text-muted">{cat.description}</p>
                    <div className="mt-3 flex gap-2 border-t border-line-soft pt-3">
                      <button type="button" onClick={() => { setCatEdit(cat); setCatModal("edit"); }} className="text-[0.66rem] font-semibold text-ink hover:underline">Edit</button>
                      <button type="button" onClick={() => setCatDelete(cat)} className="text-[0.66rem] text-muted hover:text-coral">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              <CategoryModal
                open={catModal !== null} mode={catModal === "edit" ? "edit" : "new"} initial={catEdit}
                onClose={() => { setCatModal(null); setCatEdit(null); }}
                onSave={async (data) => {
                  if (catModal === "edit" && catEdit) return updateCategory(catEdit.id, data);
                  return createCategory(data);
                }}
              />
              <ConfirmDialog
                open={!!catDelete} title="Delete category?" message={`"${catDelete?.name}" will be permanently removed.`}
                onCancel={() => setCatDelete(null)} loading={deleting}
                onConfirm={async () => {
                  if (!catDelete) return;
                  setDeleting(true);
                  const ok = await deleteCategory(catDelete.id);
                  setDeleting(false);
                  if (ok) setCatDelete(null);
                }}
              />
            </div>
          )}

          {/* COURSES */}
          {tab === "courses" && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <h2 className="font-display text-[0.98rem] font-semibold">{coursesLoading ? "Loading…" : `${courses.length} courses`}</h2>
                <button type="button" onClick={() => { setCourseEdit(null); setCourseModal("new"); }} className="btn btn-sm btn-primary">
                  <Icon name="plus" size={13} /> New course
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead className="bg-cream/60">
                    <tr>{["Course", "Category", "Price", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
                    {courses.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No courses yet</td></tr>
                    ) : paginatedCourses.map((c) => (
                      <tr key={c.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {c.imageUrl ? (
                              <img src={absoluteUploadUrl(c.imageUrl)} alt="" className="h-8 w-11 rounded object-cover" />
                            ) : <div className="h-8 w-11 rounded bg-cream-deep" />}
                            <p className="max-w-[240px] truncate text-[0.74rem] font-medium">{c.title}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[0.68rem] text-muted">{c.categoryName}</td>
                        <td className="px-4 py-3 text-[0.7rem] font-semibold">{formatINR(c.discountPrice)}</td>
                        <td className="px-4 py-3">
                          <span className={cn("tag", c.status === "live" ? "bg-emerald-50 text-emerald-700" : c.status === "draft" ? "bg-gold/15 text-amber-700" : "bg-cream-deep text-muted")}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => { setCourseEdit(c); setCourseModal("edit"); }} className="text-[0.66rem] font-semibold text-ink hover:underline">Edit</button>
                            <button type="button" onClick={() => setCourseDelete(c)} className="text-[0.66rem] text-muted hover:text-coral">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalCoursePages > 1 && (
                <div className="flex items-center justify-between border-t border-line px-4 py-3">
                  <p className="text-[0.68rem] text-muted">
                    Showing {(coursePage - 1) * COURSES_PER_PAGE + 1}–{Math.min(coursePage * COURSES_PER_PAGE, courses.length)} of {courses.length}
                  </p>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => setCoursePage(p => Math.max(1, p - 1))} disabled={coursePage === 1} className="btn btn-sm btn-outline disabled:opacity-40">Prev</button>
                    <button type="button" onClick={() => setCoursePage(p => Math.min(totalCoursePages, p + 1))} disabled={coursePage === totalCoursePages} className="btn btn-sm btn-outline disabled:opacity-40">Next</button>
                  </div>
                </div>
              )}

              <CourseModal
                open={courseModal !== null} mode={courseModal === "edit" ? "edit" : "new"} initial={courseEdit} categories={categories}
                onClose={() => { setCourseModal(null); setCourseEdit(null); }}
                onSave={async (data) => {
                  if (courseModal === "edit" && courseEdit) return updateCourse(courseEdit.id, data);
                  return createCourse(data);
                }}
                uploadImage={uploadCourseImage}
              />

              <ConfirmDialog
                open={!!courseDelete} title="Delete course?" message={`"${courseDelete?.title}" will be permanently removed.`}
                onCancel={() => setCourseDelete(null)} loading={deleting}
                onConfirm={async () => {
                  if (!courseDelete) return;
                  setDeleting(true);
                  const ok = await deleteCourse(courseDelete.id);
                  setDeleting(false);
                  if (ok) setCourseDelete(null);
                }}
              />
            </div>
          )}

          {/* CAREER TRACKS */}
          {tab === "paths" && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <h2 className="font-display text-[0.98rem] font-semibold">
                  {pathsLoading ? "Loading…" : `${paths.length} career tracks`}
                </h2>
                <button type="button" onClick={() => { setPathEdit(null); setPathModal("new"); }} className="btn btn-sm btn-primary">
                  <Icon name="plus" size={13} /> New track
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead className="bg-cream/60">
                    <tr>{["Track", "Category", "Duration", "Level", ""].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
                    {paths.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No career tracks yet</td></tr>
                    ) : paths.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {p.imageUrl
                              ? <img src={absoluteUploadUrl(p.imageUrl)} alt="" className="h-8 w-11 rounded object-cover" />
                              : <div className="h-8 w-11 rounded bg-cream-deep" />}
                            <p className="max-w-[240px] truncate text-[0.74rem] font-medium">{p.title}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[0.68rem] text-muted">{p.categoryName}</td>
                        <td className="px-4 py-3 text-[0.68rem] text-muted">{p.duration || "—"}</td>
                        <td className="px-4 py-3 text-[0.68rem] text-muted">{p.level || "—"}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => { setPathEdit(p); setPathModal("edit"); }} className="text-[0.66rem] font-semibold text-ink hover:underline">Edit</button>
                            <button type="button" onClick={() => setPathDelete(p)} className="text-[0.66rem] text-muted hover:text-coral">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PathModal
                open={pathModal !== null}
                mode={pathModal === "edit" ? "edit" : "new"}
                initial={pathEdit}
                categories={categories}
                onClose={() => { setPathModal(null); setPathEdit(null); }}
                onSave={async (data) => {
                  if (pathModal === "edit" && pathEdit) return updatePath(pathEdit.id, data);
                  return createPath(data);
                }}
                uploadImage={uploadCourseImage}
              />

              <ConfirmDialog
                open={!!pathDelete} title="Delete career track?" message={`"${pathDelete?.title}" will be permanently removed.`}
                onCancel={() => setPathDelete(null)} loading={deleting}
                onConfirm={async () => {
                  if (!pathDelete) return;
                  setDeleting(true);
                  const ok = await deletePath(pathDelete.id);
                  setDeleting(false);
                  if (ok) setPathDelete(null);
                }}
              />
            </div>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="mt-5 card p-5">
              <h2 className="font-display text-[0.98rem] font-semibold">Admin profile</h2>
              <div className="mt-3 grid gap-3">
                <div className="field"><label>Full name</label><input defaultValue={account.name} className="input" /></div>
                <div className="field"><label>Email</label><input defaultValue={account.email} className="input" readOnly /></div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}