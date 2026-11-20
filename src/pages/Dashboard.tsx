import { useState } from "react";
import Icon from "@/components/Icon";
import { ProgressRing } from "@/components/Primitives";
import CareerDialog from "@/components/CareerDialog";
import { useShop } from "@/lib/store";
import {
  courseBySlug,
  courses,
  formatINR,
  learningCourses,
  mockOrders,
} from "@/lib/data";
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

const activity = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 80 },
  { day: "Wed", minutes: 20 },
  { day: "Thu", minutes: 65 },
  { day: "Fri", minutes: 95 },
  { day: "Sat", minutes: 30 },
  { day: "Sun", minutes: 0 },
];

const skillProgress = [
  { label: "Containers & Kubernetes", value: 72, tint: "#CDF56A" },
  { label: "Cloud architecture", value: 46, tint: "#A9DDF5" },
  { label: "CI/CD automation", value: 58, tint: "#D9C8FF" },
  { label: "Observability", value: 24, tint: "#FFD3C7" },
];

export default function Dashboard() {
  const { learner, wishlist, navigate, toast, cart, account, signOut, openAuth, setCareerOpen } = useShop();
  const [tab, setTab] = useState<Tab>("overview");
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });

  const displayName = account?.name ?? learner.name;
  const displayEmail = account?.email ?? learner.email;
  const displayPlan = account ? (account.role === "admin" ? "Administrator" : "Pro member") : learner.plan;
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const currentCourse = courseBySlug(learningCourses[0].slug);
  const savedCourses = courses.filter((c) => wishlist.includes(c.slug));
  const enrolled = learningCourses
    .map((entry) => ({ entry, course: courseBySlug(entry.slug) }))
    .filter((item): item is { entry: (typeof learningCourses)[number]; course: NonNullable<ReturnType<typeof courseBySlug>> } => Boolean(item.course));

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

  const dateLabel = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());

  if (!account) {
    return (
      <div className="wrap flex min-h-[62vh] items-center justify-center py-14">
        <div className="card w-full max-w-md p-7 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-lime/60 text-ink"><Icon name="graduation" size={26} /></span>
          <h1 className="mt-4 font-display text-2xl font-semibold">Sign in to continue learning</h1>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
            Your dashboard keeps your courses, progress, certificates and AI mentor roadmap in one place.
          </p>
          <button type="button" onClick={() => openAuth("learner", "signin")} className="btn btn-primary btn-block mt-5">
            Sign in as learner <Icon name="arrowRight" size={15} />
          </button>
          <button type="button" onClick={() => openAuth("learner", "signup")} className="btn btn-outline btn-block btn-sm mt-2">Create a free account</button>
          <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-[0.64rem] text-muted">
            Demo: <span className="font-mono">student@elearnhub.in</span> · <span className="font-mono">learn@2026</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-6 md:py-8">
      <div className="grid items-start gap-5 lg:grid-cols-[244px_1fr]">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-[84px] xl:top-[126px]">
          <div className="overflow-hidden rounded-2xl bg-plum text-white">
            <div className="relative border-b border-white/10 p-4">
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-lime/10 blur-lg" />
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
              <div className="mt-3 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
                <div className="flex items-center justify-between text-[0.6rem] text-white/50">
                  <span>Weekly goal</span><span className="text-white">4 / 5 hrs</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[80%] rounded-full bg-lime" />
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
                  {item.id === "wishlist" && wishlist.length > 0 && (
                    <span className="ml-auto rounded-full bg-lime px-1.5 py-0.5 text-[0.54rem] font-bold text-ink">{wishlist.length}</span>
                  )}
                  {item.id === "courses" && <span className="ml-auto text-[0.6rem] text-white/35">{enrolled.length}</span>}
                </button>
              ))}
            </nav>
            <div className="p-2">
              <a href="#/pricing" className="flex items-center gap-2 rounded-lg bg-lime/10 px-3 py-2.5 text-[0.72rem] font-medium text-lime transition-colors hover:bg-lime/20">
                <Icon name="zap" size={14} /> Upgrade to Teams
                <Icon name="arrowRight" size={12} className="ml-auto" />
              </a>
              <button type="button" onClick={signOut} className="mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[0.72rem] text-white/45 transition-colors hover:bg-white/5 hover:text-white">
                <Icon name="logout" size={14} /> Log out
              </button>
            </div>
          </div>
          <div className="mt-3 hidden rounded-xl border border-line bg-paper p-3.5 lg:block">
            <p className="flex items-center gap-1.5 text-[0.72rem] font-semibold"><Icon name="flame" size={13} className="text-coral" /> 12-day streak</p>
            <p className="mt-1 text-[0.64rem] leading-relaxed text-muted">Longest streak: 21 days. Learn 20 minutes today to keep it alive.</p>
            <div className="mt-2 flex gap-1">
              {[1, 0, 1, 1, 1, 1, 0].map((active, i) => (
                <span key={i} className={cn("h-1.5 flex-1 rounded-full", active ? "bg-lime-deep" : "bg-cream-deep")} />
              ))}
            </div>
          </div>
        </aside>

        {/* mobile tabs */}
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
                {tab === "overview" ? "You're 3 lessons away from your next milestone. Keep going." : "Everything in one place, exactly as you left it."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[0.68rem] text-ink-soft">
                <Icon name="calendar" size={12} /> {dateLabel}
              </span>
              <button type="button" onClick={() => toast("You're all caught up", "info")} aria-label="Notifications" className="relative grid h-8 w-8 place-items-center rounded-full border border-line bg-paper text-ink-soft hover:text-ink">
                <Icon name="bell" size={15} />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-coral" />
              </button>
            </div>
          </div>

          {tab === "overview" && (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {[
                  { label: "Courses enrolled", value: "6", sub: "2 in progress", icon: "book", tint: "#CDF56A" },
                  { label: "Hours learned", value: "48.5", sub: "+4.2 this week", icon: "clock", tint: "#A9DDF5" },
                  { label: "Certificates", value: "3", sub: "2 shareable links", icon: "award", tint: "#D9C8FF" },
                  { label: "Mentor chats", value: "124", sub: "8 conversations", icon: "sparkle", tint: "#FFD3C7" },
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
                  {currentCourse && (
                    <div className="px-4 pb-4">
                      <div className="flex flex-col gap-3 rounded-xl bg-cream/70 p-3 sm:flex-row">
                        <img src={currentCourse.image} alt="" className="h-[92px] w-full rounded-lg object-cover sm:w-[136px]" />
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-coral">In progress · 68%</p>
                            <h3 className="mt-0.5 font-display text-[0.92rem] font-semibold leading-snug">{currentCourse.title}</h3>
                            <p className="mt-0.5 text-[0.64rem] text-muted">Next: {learningCourses[0].nextUp}</p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                              <div className="h-full w-[68%] rounded-full bg-ink" />
                            </div>
                            <a href={`#/course/${currentCourse.slug}`} className="btn btn-primary btn-sm h-7 px-3 text-[0.64rem]">
                              Resume <Icon name="play" size={10} />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between rounded-lg border border-line-soft px-3 py-2">
                        <p className="flex items-center gap-1.5 text-[0.66rem] text-muted"><Icon name="clock" size={12} /> Next live session: Thursday, 7:00 PM</p>
                        <button type="button" onClick={() => toast("Seat saved — calendar invite sent")} className="text-[0.64rem] font-semibold text-ink hover:underline">Save seat</button>
                      </div>
                      <div className="mt-2.5 rounded-xl bg-plum p-3 text-white">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime text-ink"><Icon name="sparkle" size={15} /></span>
                            <div>
                              <p className="text-[0.72rem] font-semibold">Nova noticed a gap</p>
                              <p className="text-[0.6rem] text-white/50">Review your Terraform module before the capstone.</p>
                            </div>
                          </div>
                          <button type="button" onClick={() => setCareerOpen(true)} className="btn btn-lime btn-sm h-7 shrink-0 px-2.5 text-[0.6rem]">Ask Nova</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="card p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-[0.98rem] font-semibold">This week</h2>
                      <span className="rounded-full bg-lime/50 px-2 py-0.5 text-[0.58rem] font-semibold">On track</span>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <ProgressRing value={80} size={84} label={<span className="font-display text-[0.82rem] font-semibold leading-none">4<span className="text-[0.6rem] text-muted">/5h</span></span>} />
                      <div className="flex-1 space-y-1.5">
                        {[
                          { label: "Lessons", value: "7" },
                          { label: "Projects", value: "1" },
                          { label: "Streak", value: "12 days" },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center justify-between text-[0.66rem]">
                            <span className="text-muted">{row.label}</span>
                            <span className="font-medium">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex h-16 items-end gap-1.5">
                      {activity.map((day) => (
                        <div key={day.day} className="flex flex-1 flex-col items-center gap-1">
                          <div className={cn("w-full rounded-sm", day.minutes > 0 ? "bg-lime-deep" : "bg-cream-deep")} style={{ height: `${Math.max(6, day.minutes * 0.55)}px` }} />
                          <span className="text-[0.52rem] text-muted">{day.day[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-4">
                    <h2 className="font-display text-[0.98rem] font-semibold">Skills in focus</h2>
                    <div className="mt-3 space-y-2.5">
                      {skillProgress.slice(0, 3).map((skill) => (
                        <div key={skill.label}>
                          <div className="flex justify-between text-[0.64rem]"><span className="text-ink-soft">{skill.label}</span><span className="text-muted">{skill.value}%</span></div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream-deep">
                            <div className="h-full rounded-full" style={{ width: `${skill.value}%`, background: skill.tint }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
                <div className="card overflow-hidden">
                  <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
                    <h2 className="font-display text-[0.98rem] font-semibold">Recent orders</h2>
                    <button type="button" onClick={() => go("orders")} className="flex items-center gap-1 text-[0.66rem] font-medium text-muted hover:text-ink">View all <Icon name="arrowRight" size={11} /></button>
                  </div>
                  <div className="divide-y divide-line-soft">
                    {mockOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center gap-3 px-4 py-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cream"><Icon name="receipt" size={14} /></span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[0.74rem] font-medium">{order.items}</p>
                          <p className="text-[0.6rem] text-muted">{order.id} · {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.74rem] font-semibold">{formatINR(order.total)}</p>
                          <span className="text-[0.55rem] font-semibold uppercase tracking-wide text-emerald-700">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <h2 className="font-display text-[0.98rem] font-semibold">Recommended next</h2>
                    <button type="button" onClick={() => navigate("courses")} className="text-[0.64rem] text-muted hover:text-ink">See all</button>
                  </div>
                  <div className="divide-y divide-line-soft border-t border-line-soft">
                    {courses.slice(2, 5).map((course) => (
                      <a key={course.slug} href={`#/course/${course.slug}`} className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-cream/60">
                        <img src={course.image} alt="" className="h-9 w-12 shrink-0 rounded-md object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.7rem] font-medium">{course.title}</span>
                          <span className="block text-[0.58rem] text-muted">{course.level} · {formatINR(course.price)}</span>
                        </span>
                        <Icon name="arrowUpRight" size={12} className="shrink-0 text-muted" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3 rounded-xl border border-line bg-lime/25 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lime text-ink"><Icon name="gift" size={16} /></span>
                  <div>
                    <p className="text-[0.76rem] font-semibold">Refer a friend, both learn cheaper</p>
                    <p className="text-[0.64rem] text-ink-soft">Give ₹500 off their first course and get ₹500 credit when they finish module one.</p>
                  </div>
                </div>
                <button type="button" onClick={() => toast("Referral link copied — share away!")} className="btn btn-sm btn-white shrink-0">Copy my link <Icon name="copy" size={12} /></button>
              </div>
            </div>
          )}

          {tab === "courses" && (
            <div className="mt-5 space-y-3">
              {enrolled.map(({ entry, course }) => (
                <div key={course.slug} className="card flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
                  <img src={course.image} alt="" className="h-[100px] w-full rounded-lg object-cover sm:h-16 sm:w-24" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="tag bg-lime/50 text-ink">{entry.progress}% complete</span>
                      <span className="text-[0.6rem] text-muted">{course.instructor.name}</span>
                    </div>
                    <h3 className="mt-1 font-display text-[0.92rem] font-semibold">{course.title}</h3>
                    <p className="text-[0.64rem] text-muted">Next up: {entry.nextUp}</p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream-deep">
                      <div className="h-full rounded-full bg-ink" style={{ width: `${entry.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="flex items-center gap-1 text-[0.62rem] text-muted"><Icon name="clock" size={11} /> {entry.minutes} min</span>
                    <a href={`#/course/${course.slug}`} className="btn btn-sm btn-primary">Resume <Icon name="play" size={11} /></a>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => navigate("courses")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-paper py-4 text-[0.76rem] font-medium text-muted transition-colors hover:border-ink hover:text-ink">
                <Icon name="plus" size={14} /> Add another course
              </button>
            </div>
          )}

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
                    <div key={course.slug} className="card flex gap-3 p-3">
                      <img src={course.image} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-[0.78rem] font-semibold">{course.title}</h3>
                        <p className="mt-0.5 text-[0.64rem] text-muted">{formatINR(course.price)} · {course.level}</p>
                        <a href={`#/course/${course.slug}`} className="mt-1.5 inline-flex items-center gap-1 text-[0.64rem] font-semibold text-ink hover:underline">View course <Icon name="arrowRight" size={10} /></a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <a href="#/wishlist" className="mt-3 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-ink hover:underline">Open the full wishlist <Icon name="arrowRight" size={12} /></a>
            </div>
          )}

          {tab === "orders" && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <h2 className="font-display text-[0.98rem] font-semibold">All orders</h2>
                <span className="text-[0.64rem] text-muted">{mockOrders.length} transactions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left">
                  <thead className="bg-cream/60">
                    <tr>
                      {["Order", "Date", "Item", "Total", "Status", ""].map((th) => (
                        <th key={th} className="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted">{th}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
                    {mockOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 font-mono text-[0.66rem]">{order.id}</td>
                        <td className="px-4 py-3 text-[0.68rem] text-muted">{order.date}</td>
                        <td className="px-4 py-3 text-[0.7rem]">{order.items}</td>
                        <td className="px-4 py-3 text-[0.7rem] font-semibold">{formatINR(order.total)}</td>
                        <td className="px-4 py-3"><span className="tag bg-emerald-50 text-emerald-700">{order.status}</span></td>
                        <td className="px-4 py-3"><button type="button" onClick={() => toast(`Invoice ${order.id} downloaded`)} className="text-[0.66rem] font-medium text-ink hover:underline">Invoice</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-line-soft px-4 py-3 text-[0.64rem] text-muted">All prices include GST. Need a revised invoice? Contact support with your GSTIN.</p>
            </div>
          )}

          {tab === "certificates" && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { course: courses[9], date: "12 Jan 2026", id: "EH-CERT-9F2A" },
                { course: courses[5], date: "28 Nov 2025", id: "EH-CERT-4B71" },
                { course: courses[7], date: "04 Oct 2025", id: "EH-CERT-2D08" },
              ].map((cert) => (
                <div key={cert.id} className="card overflow-hidden">
                  <div className="relative bg-plum px-4 py-4 text-white">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime text-ink"><Icon name="award" size={16} /></span>
                    <p className="mt-2 font-display text-[0.92rem] font-semibold leading-snug">{cert.course.title}</p>
                    <p className="mt-0.5 text-[0.6rem] text-white/45">Certificate of completion · {cert.date}</p>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="font-mono text-[0.6rem] text-muted">{cert.id}</span>
                    <button type="button" onClick={() => toast("Certificate PDF downloading")} className="btn btn-sm btn-outline h-7 px-2.5 text-[0.62rem]">Download</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "billing" && (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="eyebrow">Current plan</p>
                    <p className="mt-1 font-display text-xl font-semibold">Pro · Annual</p>
                  </div>
                  <span className="tag bg-lime text-ink">Active</span>
                </div>
                <p className="mt-2 text-[0.74rem] text-muted">₹11,988 / year · renews 18 Mar 2026</p>
                <div className="mt-3 rounded-xl bg-cream p-3">
                  {["Unlimited courses", "Unlimited AI mentor", "Live workshops", "Verified certificates"].map((f) => (
                    <p key={f} className="flex items-center gap-2 text-[0.68rem] text-ink-soft"><Icon name="check" size={11} className="text-plum" /> {f}</p>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <a href="#/pricing" className="btn btn-sm btn-primary flex-1">Manage plan</a>
                  <button type="button" onClick={() => toast("Cancellation options sent to your email", "info")} className="btn btn-sm btn-outline">Cancel</button>
                </div>
              </div>
              <div className="card p-4">
                <p className="eyebrow">Payment method</p>
                <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-line p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-cream"><Icon name="creditCard" size={15} /></span>
                  <div className="flex-1">
                    <p className="text-[0.74rem] font-medium">Visa ending 4242</p>
                    <p className="text-[0.6rem] text-muted">Expires 08/28 · auto-pay on</p>
                  </div>
                  <button type="button" onClick={() => toast("Card update is a demo action", "info")} className="text-[0.66rem] font-semibold text-ink hover:underline">Edit</button>
                </div>
                <p className="eyebrow mt-4">Billing address</p>
                <p className="mt-1.5 text-[0.72rem] leading-relaxed text-ink-soft">Aditi Sharma<br />Indiranagar, Bengaluru 560038<br />Karnataka, India</p>
                <button type="button" onClick={() => toast("Billing details updated in demo", "info")} className="mt-2 text-[0.66rem] font-semibold text-ink hover:underline">Edit billing details</button>
              </div>
              <div className="card p-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-[0.95rem] font-semibold">Invoices</h2>
                  <span className="text-[0.62rem] text-muted">GST included</span>
                </div>
                <div className="mt-2 divide-y divide-line-soft">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div>
                        <p className="text-[0.72rem] font-medium">{order.date} · {order.items}</p>
                        <p className="font-mono text-[0.58rem] text-muted">{order.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[0.7rem] font-semibold">{formatINR(order.total)}</span>
                        <button type="button" onClick={() => toast(`Invoice ${order.id} downloaded`)} className="text-[0.64rem] font-medium text-ink hover:underline">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast("Profile settings saved");
              }}
              className="mt-5 grid gap-3 lg:grid-cols-2"
            >
              <div className="card p-4">
                <h2 className="font-display text-[0.95rem] font-semibold">Personal details</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="field"><label htmlFor="set-first">First name</label><input id="set-first" defaultValue="Aditi" className="input" /></div>
                  <div className="field"><label htmlFor="set-last">Last name</label><input id="set-last" defaultValue="Sharma" className="input" /></div>
                  <div className="field sm:col-span-2"><label htmlFor="set-email">Email</label><input id="set-email" type="email" defaultValue={learner.email} className="input" /></div>
                  <div className="field sm:col-span-2"><label htmlFor="set-goal">Career goal</label><input id="set-goal" defaultValue="DevOps Engineer" className="input" /></div>
                </div>
              </div>
              <div className="space-y-3">
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
                <div className="card p-4">
                  <h2 className="font-display text-[0.95rem] font-semibold">Privacy</h2>
                  <p className="mt-1 text-[0.68rem] leading-relaxed text-muted">Signed in as {displayEmail}. Manage AI conversation history and marketing preferences from your privacy centre.</p>
                  <a href="#/legal/privacy" className="mt-1.5 inline-flex items-center gap-1 text-[0.68rem] font-semibold text-ink hover:underline">Open privacy centre <Icon name="arrowRight" size={11} /></a>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:col-span-2">
                <button type="submit" className="btn btn-primary btn-sm">Save changes</button>
                <button type="button" onClick={() => toast("Nothing to undo", "info")} className="btn btn-outline btn-sm">Discard</button>
                {cart.length > 0 && <span className="ml-auto text-[0.64rem] text-muted">You have {cart.length} item(s) in your bag</span>}
              </div>
            </form>
          )}

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
                        A private space to plan your next role, review a project or rehearse an interview. Grounded in the Elearn Hub curriculum and your learning history.
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setCareerOpen(true)} className="btn btn-lime shrink-0">Chat with Nova <Icon name="arrowRight" size={14} /></button>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { icon: "route", title: "Career roadmap", copy: "DevOps Engineer in 6 months · week 8 of 24" },
                    { icon: "file", title: "Project review", copy: "2 submissions · last reviewed 4 days ago" },
                    { icon: "target", title: "Interview prep", copy: "12 questions practised · 82% confidence" },
                    { icon: "award", title: "Skills snapshot", copy: "Kubernetes 72% · AWS 46% · CI/CD 58%" },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-line bg-cream/50 p-3">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-lime/50"><Icon name={item.icon} size={14} /></span>
                      <p className="mt-2 text-[0.76rem] font-semibold">{item.title}</p>
                      <p className="mt-0.5 text-[0.64rem] leading-snug text-muted">{item.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
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
                <div className="card p-4">
                  <h3 className="font-display text-[0.95rem] font-semibold">Recent conversations</h3>
                  <div className="mt-3 divide-y divide-line-soft">
                    {[
                      { title: "DevOps roadmap review", date: "2 days ago", tag: "Roadmap" },
                      { title: "Capstone project feedback", date: "5 days ago", tag: "Project" },
                      { title: "Salary expectations in Bengaluru", date: "8 days ago", tag: "Career" },
                    ].map((chat) => (
                      <button key={chat.title} type="button" onClick={() => setCareerOpen(true)} className="flex w-full items-center gap-2 py-2.5 text-left">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cream"><Icon name="sparkle" size={12} /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.72rem] font-medium">{chat.title}</span>
                          <span className="block text-[0.6rem] text-muted">{chat.tag} · {chat.date}</span>
                        </span>
                        <Icon name="chevronRight" size={12} className="text-muted" />
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 flex items-start gap-1.5 text-[0.6rem] text-muted"><Icon name="lock" size={11} className="mt-0.5 shrink-0" /> Career guidance is private to your account and never shown publicly.</p>
                </div>
              </div>
            </div>
          )}

          {tab === "password" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (passwordForm.next.length < 6) {
                  toast("New password needs at least 6 characters", "error");
                  return;
                }
                if (passwordForm.next !== passwordForm.confirm) {
                  toast("New passwords do not match", "error");
                  return;
                }
                setPasswordForm({ current: "", next: "", confirm: "" });
                toast("Password updated successfully");
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
                  <div className="field"><label htmlFor="pw-current">Current password</label><input id="pw-current" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))} className="input" required /></div>
                  <div className="field"><label htmlFor="pw-next">New password</label><input id="pw-next" type="password" value={passwordForm.next} onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))} className="input" required minLength={6} /></div>
                  <div className="field"><label htmlFor="pw-confirm">Confirm new password</label><input id="pw-confirm" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))} className="input" required minLength={6} /></div>
                </div>
                {passwordForm.next.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((n) => {
                      const strength = Math.min(4, Math.floor(passwordForm.next.length / 3) + (/[A-Z0-9@!#]/.test(passwordForm.next) ? 1 : 0));
                      return <span key={n} className={cn("h-1 flex-1 rounded-full", n <= strength ? (strength <= 1 ? "bg-coral" : strength <= 2 ? "bg-gold" : "bg-lime-deep") : "bg-cream-deep")} />;
                    })}
                  </div>
                )}
                <button type="submit" className="btn btn-primary btn-block mt-4">Update password</button>
                <p className="mt-2 text-center text-[0.6rem] text-muted">Demo account — the change is not persisted to a server.</p>
              </div>
            </form>
          )}
        </main>
      </div>
      <CareerDialog />
    </div>
  );
}
