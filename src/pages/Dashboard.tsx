import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { ProgressRing } from "@/components/Primitives";
import CareerDialog from "@/components/CareerDialog";
import { useShop } from "@/lib/store";
import { absoluteUploadUrl } from "@/lib/api";
import { formatINR } from "@/lib/data";
import { cn } from "@/utils/cn";

type Tab = "overview" | "courses" | "career" | "wishlist" | "orders" | "certificates" | "billing" | "settings" | "password";

const navItems: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Dashboard", icon: "layout" },
  { id: "courses", label: "My courses", icon: "book" },
  { id: "career", label: "Career guidance", icon: "sparkle" },
  { id: "orders", label: "Orders & invoices", icon: "receipt" },
  { id: "certificates", label: "Certificates", icon: "award" },
  { id: "wishlist", label: "Wishlist", icon: "heart" },
  { id: "billing", label: "Billing & plan", icon: "creditCard" },
  { id: "settings", label: "Profile", icon: "user" },
  { id: "password", label: "Update password", icon: "lock" },
];

function parseCourseHours(len: string | null): number {
  if (!len) return 0;
  const h = /(\d+)\s*h/i.exec(len);
  const m = /(\d+)\s*m/i.exec(len);
  return (h ? Number(h[1]) : 0) + (m ? Number(m[1]) / 60 : 0);
}

function isoDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function Dashboard() {
  const {
    account, signOut, openAuth, navigate, toast,
    enrollments, enrollmentsLoading,
    orders, ordersLoading,
    wishlistIds, cartItems, courses: shopCourses, paths,
    setCareerOpen,
  } = useShop();
  const [tab, setTab] = useState<Tab>("overview");
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });

  const displayName = account?.name ?? "Learner";
  const displayEmail = account?.email ?? "";
  const displayPlan = account?.role === "admin" ? "Administrator" : "Learner";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const dateLabel = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());

  // ---- Stats from real enrollments ----
  const hoursLearned = useMemo(
    () => enrollments.reduce((sum, e) => sum + parseCourseHours(e.courseLength) * (e.progress / 100), 0),
    [enrollments]
  );
  const completedCount = enrollments.filter((e) => e.progress >= 100).length;
  const inProgressCount = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;

  const currentEnrollment = useMemo(
    () => [...enrollments].filter((e) => e.progress < 100).sort((a, b) => (b.lastAccessedAt || "").localeCompare(a.lastAccessedAt || ""))[0] ?? null,
    [enrollments]
  );

  const currentCourse = currentEnrollment
    ? shopCourses.find((c) => c.id === currentEnrollment.courseId) ?? null
    : null;

  // ---- This week chart: count enrollments touched per day (last 7 days) ----
  const weekBars = useMemo(() => {
    const days: { label: string; key: string; active: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push({ label: d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 1), key: isoDateKey(d), active: 0 });
    }
    const touchedByDay: Record<string, Set<number>> = {};
    for (const e of enrollments) {
      if (!e.lastAccessedAt) continue;
      const key = isoDateKey(new Date(e.lastAccessedAt));
      if (!touchedByDay[key]) touchedByDay[key] = new Set();
      touchedByDay[key].add(e.courseId);
    }
    return days.map((d) => ({ ...d, active: touchedByDay[d.key]?.size ?? 0 }));
  }, [enrollments]);
  const totalActiveDays = weekBars.filter((b) => b.active > 0).length;
  const weekMax = Math.max(1, ...weekBars.map((b) => b.active));

  // ---- Skills in focus: from career path matching user's most-touched category ----
  const skillFocus = useMemo(() => {
    if (enrollments.length === 0 || paths.length === 0) return [];
    const catCount: Record<number, number> = {};
    for (const e of enrollments) catCount[e.categoryId] = (catCount[e.categoryId] || 0) + 1;
    const topCat = Number(Object.keys(catCount).sort((a, b) => catCount[Number(b)] - catCount[Number(a)])[0]);
    const path = paths.find((p) => p.categoryId === topCat);
    if (!path || path.skills.length === 0) return [];
    const coursesInCat = enrollments.filter((e) => e.categoryId === topCat);
    const avg = coursesInCat.length
      ? Math.round(coursesInCat.reduce((s, e) => s + e.progress, 0) / coursesInCat.length)
      : 0;
    const tint = ["#CDF56A", "#A9DDF5", "#D9C8FF", "#FFD3C7"];
    return path.skills.slice(0, 4).map((label, i) => ({
      label,
      value: Math.min(100, Math.max(10, avg - i * 6)),
      tint: tint[i % tint.length],
    }));
  }, [enrollments, paths]);

  // ---- Wishlist courses (real, from wishlistIds) ----
  const savedCourses = useMemo(
    () => shopCourses.filter((c) => wishlistIds.includes(c.id)),
    [shopCourses, wishlistIds]
  );

  // ---- Certificates: completed enrollments ----
  const certificates = useMemo(
    () => enrollments.filter((e) => e.progress >= 100),
    [enrollments]
  );

  // ---- Recent orders (first 3) ----
  const recentOrders = orders.slice(0, 3);

  const go = (next: Tab) => {
    if (next === "career") {
      setTab("career");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCareerOpen(true);
      return;
    }
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!account) {
    return (
      <div className="wrap flex min-h-[62vh] items-center justify-center py-14">
        <div className="card w-full max-w-md p-7 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-lime/60 text-ink"><Icon name="graduation" size={26} /></span>
          <h1 className="mt-4 font-display text-2xl font-semibold">Sign in to continue learning</h1>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
            Your dashboard keeps your courses, progress, certificates and AI mentor roadmap in one place.
          </p>
          <button type="button" onClick={() => openAuth("user", "signin")} className="btn btn-primary btn-block mt-5">
            Sign in <Icon name="arrowRight" size={15} />
          </button>
          <button type="button" onClick={() => openAuth("user", "signup")} className="btn btn-outline btn-block btn-sm mt-2">Create a free account</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-6 md:py-8">
      <div className="grid items-start gap-5 lg:grid-cols-[244px_1fr]">
        <aside className="lg:sticky lg:top-[84px] xl:top-[126px]">
          <div className="overflow-hidden rounded-2xl bg-plum text-white">
            <div className="relative border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-lime/40 bg-lime font-display text-[0.76rem] font-bold text-ink">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[0.84rem] font-semibold">{displayName}</p>
                  <p className="flex items-center gap-1 text-[0.62rem] text-lime">
                    <Icon name="sparkle" size={10} /> {displayPlan}
                  </p>
                </div>
              </div>
            </div>
            <nav className="hidden gap-0.5 p-2 lg:grid" aria-label="Dashboard sections">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[0.76rem] font-medium transition-colors",
                    tab === item.id ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon name={item.icon} size={15} className={tab === item.id ? "text-lime" : ""} />
                  {item.label}
                  {item.id === "wishlist" && wishlistIds.length > 0 && (
                    <span className="ml-auto rounded-full bg-lime px-1.5 py-0.5 text-[0.54rem] font-bold text-ink">{wishlistIds.length}</span>
                  )}
                  {item.id === "courses" && <span className="ml-auto text-[0.6rem] text-white/35">{enrollments.length}</span>}
                </button>
              ))}
            </nav>
            <div className="p-2">
              <button type="button" onClick={signOut} className="mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[0.72rem] text-white/45 transition-colors hover:bg-white/5 hover:text-white">
                <Icon name="logout" size={14} /> Log out
              </button>
            </div>
          </div>
        </aside>

        <div className="hide-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 lg:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={cn("chip shrink-0 text-[0.68rem]", tab === item.id && "chip-active")}
            >
              <Icon name={item.icon} size={12} /> {item.label}
            </button>
          ))}
        </div>

        <main className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-coral" /> {tab === "overview" ? "Dashboard" : navItems.find((n) => n.id === tab)?.label}</p>
              <h1 className="display mt-1.5 text-[clamp(1.8rem,3.5vw,2.6rem)]">
                {tab === "overview" ? <>Welcome back, <span className="italic-accent text-plum">{displayName.split(" ")[0]}.</span></> : navItems.find((n) => n.id === tab)?.label}
              </h1>
              <p className="mt-1 text-[0.8rem] text-muted">
                {tab === "overview" ? "Everything you're learning, in one place." : "All from your real account."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[0.68rem] text-ink-soft">
                <Icon name="calendar" size={12} /> {dateLabel}
              </span>
            </div>
          </div>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {[
                  { label: "Courses enrolled", value: String(enrollments.length), sub: `${inProgressCount} in progress`, icon: "book", tint: "#CDF56A" },
                  { label: "Hours learned", value: hoursLearned.toFixed(1), sub: "across all enrollments", icon: "clock", tint: "#A9DDF5" },
                  { label: "Certificates", value: String(completedCount), sub: completedCount ? "ready to share" : "finish a course to earn one", icon: "award", tint: "#D9C8FF" },
                  { label: "Wishlist", value: String(wishlistIds.length), sub: wishlistIds.length ? "saved courses" : "nothing saved yet", icon: "heart", tint: "#FFD3C7" },
                ].map((stat) => (
                  <div key={stat.label} className="card p-3.5">
                    <div className="flex items-start justify-between">
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted">{stat.label}</p>
                      <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: stat.tint }}><Icon name={stat.icon} size={13} /></span>
                    </div>
                    <p className="mt-2 font-display text-[1.7rem] font-semibold leading-none">{stat.value}</p>
                    <p className="mt-1.5 text-[0.62rem] text-muted">{stat.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
                <div className="card overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <h2 className="font-display text-[0.98rem] font-semibold">Continue learning</h2>
                    <button type="button" onClick={() => go("courses")} className="flex items-center gap-1 text-[0.66rem] font-medium text-muted hover:text-ink">
                      All courses <Icon name="arrowRight" size={11} />
                    </button>
                  </div>
                  {enrollmentsLoading ? (
                    <div className="px-4 pb-4 text-[0.72rem] text-muted">Loading…</div>
                  ) : currentEnrollment && currentCourse ? (
                    <div className="px-4 pb-4">
                      <div className="flex flex-col gap-3 rounded-xl bg-cream/70 p-3 sm:flex-row">
                        {currentCourse.imageUrl ? (
                          <img src={absoluteUploadUrl(currentCourse.imageUrl)} alt="" className="h-[92px] w-full rounded-lg object-cover sm:w-[136px]" />
                        ) : <div className="h-[92px] w-full rounded-lg bg-cream-deep sm:w-[136px]" />}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-coral">In progress · {currentEnrollment.progress}%</p>
                            <h3 className="mt-0.5 font-display text-[0.92rem] font-semibold leading-snug">{currentCourse.title}</h3>
                            {currentEnrollment.lastLesson && <p className="mt-0.5 text-[0.64rem] text-muted">Last: {currentEnrollment.lastLesson}</p>}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                              <div className="h-full rounded-full bg-ink" style={{ width: `${currentEnrollment.progress}%` }} />
                            </div>
                            <button type="button" onClick={() => navigate(`course/${currentCourse.id}`)} className="btn btn-primary btn-sm h-7 px-3 text-[0.64rem]">
                              Resume <Icon name="play" size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 pb-4">
                      <p className="text-[0.74rem] text-muted">You haven't enrolled in a course yet.</p>
                      <button type="button" onClick={() => navigate("courses")} className="btn btn-primary btn-sm mt-2">Browse courses</button>
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="card p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-[0.98rem] font-semibold">This week</h2>
                      <span className="rounded-full bg-lime/50 px-2 py-0.5 text-[0.58rem] font-semibold">{totalActiveDays} / 7 days active</span>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <ProgressRing value={Math.round((totalActiveDays / 7) * 100)} size={84} label={<span className="font-display text-[0.82rem] font-semibold leading-none">{totalActiveDays}<span className="text-[0.6rem] text-muted">/7</span></span>} />
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between text-[0.66rem]"><span className="text-muted">Enrolled</span><span className="font-medium">{enrollments.length}</span></div>
                        <div className="flex items-center justify-between text-[0.66rem]"><span className="text-muted">In progress</span><span className="font-medium">{inProgressCount}</span></div>
                        <div className="flex items-center justify-between text-[0.66rem]"><span className="text-muted">Completed</span><span className="font-medium">{completedCount}</span></div>
                      </div>
                    </div>
                    <div className="mt-3 flex h-16 items-end gap-1.5">
                      {weekBars.map((b) => (
                        <div key={b.key} className="flex flex-1 flex-col items-center gap-1">
                          <div className={cn("w-full rounded-sm", b.active > 0 ? "bg-lime-deep" : "bg-cream-deep")} style={{ height: `${Math.max(6, (b.active / weekMax) * 56)}px` }} />
                          <span className="text-[0.52rem] text-muted">{b.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-4">
                    <h2 className="font-display text-[0.98rem] font-semibold">Skills in focus</h2>
                    {skillFocus.length === 0 ? (
                      <p className="mt-3 text-[0.7rem] text-muted">Enroll in a career path's courses to see skill progress.</p>
                    ) : (
                      <div className="mt-3 space-y-2.5">
                        {skillFocus.map((skill) => (
                          <div key={skill.label}>
                            <div className="flex justify-between text-[0.64rem]"><span className="text-ink-soft">{skill.label}</span><span className="text-muted">{skill.value}%</span></div>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream-deep">
                              <div className="h-full rounded-full" style={{ width: `${skill.value}%`, background: skill.tint }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
                <div className="card overflow-hidden">
                  <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
                    <h2 className="font-display text-[0.98rem] font-semibold">Recent orders</h2>
                    <button type="button" onClick={() => go("orders")} className="flex items-center gap-1 text-[0.66rem] font-medium text-muted hover:text-ink">View all <Icon name="arrowRight" size={11} /></button>
                  </div>
                  {ordersLoading ? (
                    <div className="px-4 py-6 text-center text-[0.72rem] text-muted">Loading…</div>
                  ) : recentOrders.length === 0 ? (
                    <div className="px-4 py-6 text-center text-[0.72rem] text-muted">No orders yet.</div>
                  ) : (
                    <div className="divide-y divide-line-soft">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center gap-3 px-4 py-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cream"><Icon name="receipt" size={14} /></span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[0.74rem] font-medium">{order.itemsSummary || "—"}</p>
                            <p className="text-[0.6rem] text-muted">{order.orderCode} · {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[0.74rem] font-semibold">{formatINR(order.total)}</p>
                            <span className={cn("text-[0.55rem] font-semibold uppercase tracking-wide", order.status === "paid" ? "text-emerald-700" : "text-muted")}>{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <h2 className="font-display text-[0.98rem] font-semibold">Recommended next</h2>
                    <button type="button" onClick={() => navigate("courses")} className="text-[0.64rem] text-muted hover:text-ink">See all</button>
                  </div>
                  <div className="divide-y divide-line-soft border-t border-line-soft">
                    {shopCourses.slice(0, 3).map((course) => (
                      <button key={course.id} type="button" onClick={() => navigate(`course/${course.id}`)} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-cream/60">
                        {course.imageUrl ? (
                          <img src={absoluteUploadUrl(course.imageUrl)} alt="" className="h-9 w-12 shrink-0 rounded-md object-cover" />
                        ) : <div className="h-9 w-12 shrink-0 rounded-md bg-cream-deep" />}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.7rem] font-medium">{course.title}</span>
                          <span className="block text-[0.58rem] text-muted">{course.categoryName} · {formatINR(course.discountPrice)}</span>
                        </span>
                        <Icon name="arrowUpRight" size={12} className="shrink-0 text-muted" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MY COURSES */}
          {tab === "courses" && (
            <div className="mt-5 space-y-3">
              {enrollmentsLoading ? (
                <div className="card p-6 text-center text-[0.75rem] text-muted">Loading…</div>
              ) : enrollments.length === 0 ? (
                <div className="card p-10 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-lime/40"><Icon name="book" size={22} /></span>
                  <h2 className="mt-3 font-display text-lg font-semibold">No enrollments yet</h2>
                  <p className="mt-1 text-sm text-muted">Browse the catalogue and add a course to start learning.</p>
                  <button type="button" onClick={() => navigate("courses")} className="btn btn-primary btn-sm mt-4">Browse courses</button>
                </div>
              ) : (
                enrollments.map((e) => {
                  const course = shopCourses.find((c) => c.id === e.courseId);
                  return (
                    <div key={e.id} className="card flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
                      {course?.imageUrl ? (
                        <img src={absoluteUploadUrl(course.imageUrl)} alt="" className="h-[100px] w-full rounded-lg object-cover sm:h-16 sm:w-24" />
                      ) : <div className="h-[100px] w-full rounded-lg bg-cream-deep sm:h-16 sm:w-24" />}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="tag bg-lime/50 text-ink">{e.progress}% complete</span>
                          {e.categoryName && <span className="text-[0.6rem] text-muted">{e.categoryName}</span>}
                        </div>
                        <h3 className="mt-1 font-display text-[0.92rem] font-semibold">{e.courseTitle}</h3>
                        {e.lastLesson && <p className="text-[0.64rem] text-muted">Last: {e.lastLesson}</p>}
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream-deep">
                          <div className="h-full rounded-full bg-ink" style={{ width: `${e.progress}%` }} />
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button type="button" onClick={() => navigate(`course/${e.courseId}`)} className="btn btn-sm btn-primary">Resume <Icon name="play" size={11} /></button>
                      </div>
                    </div>
                  );
                })
              )}
              <button type="button" onClick={() => navigate("courses")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-paper py-4 text-[0.76rem] font-medium text-muted transition-colors hover:border-ink hover:text-ink">
                <Icon name="plus" size={14} /> Add another course
              </button>
            </div>
          )}

          {/* WISHLIST */}
          {tab === "wishlist" && (
            <div className="mt-5">
              {savedCourses.length === 0 ? (
                <div className="card p-10 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-lime/40"><Icon name="heart" size={22} /></span>
                  <h2 className="mt-3 font-display text-lg font-semibold">No saved courses yet</h2>
                  <p className="mt-1 text-sm text-muted">Tap the heart on any course to build your shortlist.</p>
                  <button type="button" onClick={() => navigate("courses")} className="btn btn-primary btn-sm mt-4">Browse courses</button>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {savedCourses.map((course) => (
                    <div key={course.id} className="card flex gap-3 p-3">
                      {course.imageUrl ? (
                        <img src={absoluteUploadUrl(course.imageUrl)} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                      ) : <div className="h-16 w-20 shrink-0 rounded-lg bg-cream-deep" />}
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-[0.78rem] font-semibold">{course.title}</h3>
                        <p className="mt-0.5 text-[0.64rem] text-muted">{formatINR(course.discountPrice)} · {course.categoryName}</p>
                        <button type="button" onClick={() => navigate(`course/${course.id}`)} className="mt-1.5 inline-flex items-center gap-1 text-[0.64rem] font-semibold text-ink hover:underline">View course <Icon name="arrowRight" size={10} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <h2 className="font-display text-[0.98rem] font-semibold">All orders</h2>
                <span className="text-[0.64rem] text-muted">{orders.length} transactions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left">
                  <thead className="bg-cream/60">
                    <tr>
                      {["Order", "Date", "Item", "Total", "Status"].map((th) => (
                        <th key={th} className="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted">{th}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
                    {ordersLoading ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">Loading…</td></tr>
                    ) : orders.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No orders yet</td></tr>
                    ) : orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 font-mono text-[0.66rem]">{order.orderCode}</td>
                        <td className="px-4 py-3 text-[0.68rem] text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-3 text-[0.7rem]">{order.itemsSummary || "—"}</td>
                        <td className="px-4 py-3 text-[0.7rem] font-semibold">{formatINR(order.total)}</td>
                        <td className="px-4 py-3"><span className={cn("tag", order.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-cream-deep text-muted")}>{order.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-line-soft px-4 py-3 text-[0.64rem] text-muted">All prices include GST.</p>
            </div>
          )}

          {/* CERTIFICATES */}
          {tab === "certificates" && (
            <div className="mt-5">
              {certificates.length === 0 ? (
                <div className="card p-10 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-lime/40"><Icon name="award" size={22} /></span>
                  <h2 className="mt-3 font-display text-lg font-semibold">No certificates yet</h2>
                  <p className="mt-1 text-sm text-muted">Complete a course to earn a verifiable certificate.</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {certificates.map((c) => (
                    <div key={c.id} className="card overflow-hidden">
                      <div className="relative bg-plum px-4 py-4 text-white">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime text-ink"><Icon name="award" size={16} /></span>
                        <p className="mt-2 font-display text-[0.92rem] font-semibold leading-snug">{c.courseTitle}</p>
                        <p className="mt-0.5 text-[0.6rem] text-white/45">Completed · {c.completedAt ? new Date(c.completedAt).toLocaleDateString("en-IN") : "—"}</p>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2.5">
                        <span className="font-mono text-[0.6rem] text-muted">EH-CERT-{String(c.id).padStart(4, "0")}</span>
                        <button type="button" onClick={() => toast("Certificate PDF is generated by the backend (coming soon)", "info")} className="btn btn-sm btn-outline h-7 px-2.5 text-[0.62rem]">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BILLING */}
          {tab === "billing" && (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="eyebrow">Current plan</p>
                    <p className="mt-1 font-display text-xl font-semibold">{displayPlan}</p>
                  </div>
                  <span className="tag bg-lime text-ink">Active</span>
                </div>
                <p className="mt-2 text-[0.74rem] text-muted">Pay-as-you-go per course. No recurring billing.</p>
                <div className="mt-3 rounded-xl bg-cream p-3">
                  {["Lifetime access to purchased courses", "AI mentor available", "Verified certificates on completion", "Email support"].map((f) => (
                    <p key={f} className="flex items-center gap-2 text-[0.68rem] text-ink-soft"><Icon name="check" size={11} className="text-plum" /> {f}</p>
                  ))}
                </div>
              </div>
              <div className="card p-4">
                <p className="eyebrow">Account</p>
                <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-line p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-cream"><Icon name="user" size={15} /></span>
                  <div className="flex-1">
                    <p className="text-[0.74rem] font-medium">{displayName}</p>
                    <p className="text-[0.6rem] text-muted">{displayEmail}</p>
                  </div>
                </div>
              </div>
              <div className="card p-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-[0.95rem] font-semibold">Invoices</h2>
                  <span className="text-[0.62rem] text-muted">GST included</span>
                </div>
                <div className="mt-2 divide-y divide-line-soft">
                  {orders.length === 0 ? (
                    <p className="py-3 text-[0.72rem] text-muted">No invoices yet.</p>
                  ) : orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div>
                        <p className="text-[0.72rem] font-medium">{new Date(order.createdAt).toLocaleDateString("en-IN")} · {order.itemsSummary || "—"}</p>
                        <p className="font-mono text-[0.58rem] text-muted">{order.orderCode}</p>
                      </div>
                      <span className="text-[0.7rem] font-semibold">{formatINR(order.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <form onSubmit={(e) => { e.preventDefault(); toast("Profile settings saved locally (backend endpoint coming soon)", "info"); }} className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="card p-4">
                <h2 className="font-display text-[0.95rem] font-semibold">Personal details</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="field sm:col-span-2"><label>Full name</label><input defaultValue={displayName} className="input" /></div>
                  <div className="field sm:col-span-2"><label>Email</label><input type="email" defaultValue={displayEmail} className="input" readOnly /></div>
                  <div className="field sm:col-span-2"><label>Career goal</label><input placeholder="e.g. DevOps Engineer" className="input" /></div>
                </div>
              </div>
              <div className="card p-4">
                <h2 className="font-display text-[0.95rem] font-semibold">Notifications</h2>
                <div className="mt-2 space-y-2">
                  {["Weekly learning summary", "Live workshop reminders", "New course drops", "Mentor check-in nudges"].map((label, i) => (
                    <label key={label} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-cream/60 px-3 py-2 text-[0.72rem] text-ink-soft">
                      {label}
                      <input type="checkbox" defaultChecked={i < 3} className="h-3.5 w-7 accent-ink" />
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 lg:col-span-2">
                <button type="submit" className="btn btn-primary btn-sm">Save changes</button>
                {cartItems.length > 0 && <span className="ml-auto text-[0.64rem] text-muted">You have {cartItems.length} item(s) in your bag</span>}
              </div>
            </form>
          )}

          {/* CAREER */}
          {tab === "career" && (
            <div className="mt-5 space-y-4">
              <div className="card overflow-hidden">
                <div className="grid gap-4 bg-plum p-5 text-white sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lime text-ink"><Icon name="sparkle" size={20} /></span>
                    <div>
                      <p className="eyebrow text-lime">Included with your learner account</p>
                      <h2 className="mt-1 font-display text-[1.35rem] font-semibold text-white">Nova, your AI career mentor.</h2>
                      <p className="mt-1 max-w-lg text-[0.8rem] leading-relaxed text-white/60">
                        Plan your next role, review a project or rehearse an interview — grounded in your learning history.
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setCareerOpen(true)} className="btn btn-lime shrink-0">Chat with Nova <Icon name="arrowRight" size={14} /></button>
                </div>
              </div>
              <div className="card p-4">
                <h3 className="font-display text-[0.95rem] font-semibold">Ask Nova about</h3>
                <div className="mt-3 space-y-1.5">
                  {["Make me a 6-month DevOps plan", "Which course should I start with?", "Review my portfolio", "How do I explain my project in an interview?"].map((prompt) => (
                    <button key={prompt} type="button" onClick={() => setCareerOpen(true)} className="flex w-full items-center gap-2 rounded-lg border border-line px-3 py-2 text-left text-[0.72rem] text-ink-soft transition-colors hover:border-ink hover:text-ink">
                      <Icon name="arrowUpRight" size={12} className="shrink-0 text-muted" /> {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASSWORD */}
          {tab === "password" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (passwordForm.next.length < 6) { toast("New password needs at least 6 characters", "error"); return; }
                if (passwordForm.next !== passwordForm.confirm) { toast("New passwords do not match", "error"); return; }
                setPasswordForm({ current: "", next: "", confirm: "" });
                toast("Password update is not connected to the backend yet", "info");
              }}
              className="mt-5 max-w-lg"
            >
              <div className="card p-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-plum text-lime"><Icon name="lock" size={17} /></span>
                  <div>
                    <h2 className="font-display text-[0.98rem] font-semibold">Update password</h2>
                    <p className="text-[0.64rem] text-muted">Use at least 6 characters with a mix of letters and numbers.</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="field"><label>Current password</label><input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))} className="input" required /></div>
                  <div className="field"><label>New password</label><input type="password" value={passwordForm.next} onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))} className="input" required minLength={6} /></div>
                  <div className="field"><label>Confirm new password</label><input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))} className="input" required minLength={6} /></div>
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-4">Update password</button>
              </div>
            </form>
          )}
        </main>
      </div>
      <CareerDialog />
    </div>
  );
}