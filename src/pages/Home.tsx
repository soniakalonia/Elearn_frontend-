import { useState } from "react";
import Icon from "@/components/Icon";
import { useShop } from "@/lib/store";
import { absoluteUploadUrl } from "@/lib/api";
import {
  Accordion,
  Avatar,
  CourseCard,
  Reveal,
  SectionHead,
  Stars,
  useCountdown,
} from "@/components/Primitives";
import {
  faqs,
  reviews,
  stats,
  tools,
} from "@/lib/data";
import { cn } from "@/utils/cn";

function Hero() {
  const { navigate, setSearchTerm, categories } = useShop();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const search = () => {
    setSearchTerm(query.trim());
    if (category) {
      const qs = new URLSearchParams({ category });
      if (query.trim()) qs.set("q", query.trim());
      navigate(`courses?${qs.toString()}`);
    } else {
      navigate("courses");
    }
  };

  const quick = ["DevOps", "AutoCAD", "Data science", "UI/UX", "AI"];

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-lime/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-lilac/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-cream to-transparent" />
      <div className="wrap relative grid items-center gap-12 pb-14 pt-10 md:pt-14 lg:grid-cols-[1.04fr_.96fr] lg:gap-10 lg:pb-20 lg:pt-16">
        <div className="relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 py-1.5 pl-1.5 pr-3.5 shadow-sm backdrop-blur">
              <span className="rounded-full bg-lime px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-ink">
                New
              </span>
              <span className="text-[0.7rem] font-medium text-ink-soft">AI mentor + career roadmaps, included</span>
              <Icon name="arrowUpRight" size={12} className="text-muted" />
            </div>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="display mt-5 text-[clamp(2.65rem,5.8vw,4.5rem)] text-ink">
              Learn today's skills.
              <br />
              <span
                className="inline bg-[linear-gradient(transparent_58%,#CDF56A_58%,#CDF56A_90%,transparent_90%)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
              >
                Build tomorrow's career.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={130}>
            <p className="mt-5 max-w-[32rem] text-[0.98rem] leading-relaxed text-muted">
              Practitioner-led courses in DevOps, design, data and AI — with an AI mentor that plans your path, reviews
              your work and gets you interview-ready.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                search();
              }}
              className="mt-7 flex flex-col gap-2 rounded-2xl border border-line bg-paper p-2 shadow-[0_18px_45px_-30px_rgba(26,18,37,0.5)] sm:flex-row sm:items-center sm:rounded-full sm:p-1.5"
              role="search"
            >
              <div className="flex flex-1 items-center gap-2 px-3">
                <Icon name="search" size={17} className="shrink-0 text-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to learn?"
                  aria-label="What do you want to learn?"
                  className="min-w-0 flex-1 bg-transparent py-2 text-[0.86rem] text-ink outline-none placeholder:text-muted"
                />
              </div>
              <div className="hidden h-6 w-px bg-line sm:block" />
              <select
                aria-label="Category"
                className="hidden appearance-none bg-transparent px-3 text-[0.8rem] text-ink-soft outline-none md:block"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.slice(0, 6).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary sm:px-5">
                Find my course <Icon name="arrowRight" size={15} />
              </button>
            </form>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.7rem] text-muted">
              <span className="font-semibold text-ink-soft">Popular:</span>
              {quick.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchTerm(tag);
                    navigate("courses");
                  }}
                  className="rounded-full border border-line bg-paper/60 px-2.5 py-1 transition-colors hover:border-ink hover:text-ink"
                >
                  {tag}
                </button>
              ))}
            </div>
          </Reveal>

<Reveal delay={270}>
  <p className="mt-7 flex items-center gap-1.5 text-[0.7rem] text-ink-soft">
    <Icon name="shieldCheck" size={14} className="text-plum" /> 7-day money-back guarantee
  </p>
</Reveal>

        </div>

        {/* visual */}
        <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
          <div className="absolute -inset-3 rotate-2 rounded-[2rem] border border-ink/10 bg-lime/50" />
          <div className="relative overflow-hidden rounded-[1.8rem] border border-line bg-cream-deep shadow-[0_40px_80px_-45px_rgba(26,18,37,0.7)]">
            <img
              src="https://images.pexels.com/photos/6392976/pexels-photo-6392976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
              alt="A learner working through an Elearn Hub course on her laptop"
              className="h-[420px] w-full object-cover object-center sm:h-[480px] lg:h-[520px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/0 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/30 bg-paper/95 p-3 backdrop-blur">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime text-ink">
                  <Icon name="video" size={17} />
                </span>
                <div>
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-coral">Resume learning</p>
                  <p className="text-[0.78rem] font-semibold leading-tight text-ink">Docker & CI/CD pipelines</p>
                  <div className="mt-1.5 h-1.5 w-36 overflow-hidden rounded-full bg-cream-deep">
                    <span className="block h-full w-[68%] rounded-full bg-ink" />
                  </div>
                </div>
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-white">
                <Icon name="play" size={13} />
              </span>
            </div>
          </div>

          <div className="animate-float absolute -left-3 top-7 w-[192px] rounded-2xl border border-line bg-paper p-3.5 shadow-[0_25px_50px_-25px_rgba(26,18,37,0.5)] sm:-left-8 sm:w-[214px]">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-plum text-lime">
                <Icon name="sparkle" size={14} />
              </span>
              <div>
                <p className="text-[0.62rem] font-semibold text-ink">Your AI mentor</p>
                <p className="flex items-center gap-1 text-[0.54rem] text-muted">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" /> Online now
                </p>
              </div>
            </div>
            <p className="mt-2.5 text-[0.7rem] font-medium leading-snug text-ink-soft">
              Your 6-month DevOps roadmap is ready.
            </p>
            <button
              type="button"
              onClick={() => navigate("dashboard")}
              className="mt-2 flex items-center gap-1 text-[0.62rem] font-semibold text-plum hover:underline"
            >
              Review my plan <Icon name="arrowRight" size={11} />
            </button>
          </div>

          <div className="animate-float-slow absolute -right-2 bottom-24 w-[176px] rounded-2xl border border-line bg-paper p-3.5 shadow-[0_25px_50px_-25px_rgba(26,18,37,0.5)] sm:-right-5 sm:w-[196px]">
            <div className="flex items-center justify-between">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">This week</p>
              <Icon name="flame" size={13} className="text-coral" />
            </div>
            <div className="mt-1 flex items-end justify-between">
              <p className="font-display text-2xl font-semibold leading-none text-ink">4 / 5</p>
              <span className="text-[0.58rem] font-medium text-muted">goal</span>
            </div>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((d) => (
                <span key={d} className={cn("h-1.5 flex-1 rounded-full", d <= 4 ? "bg-lime-deep" : "bg-cream-deep")} />
              ))}
            </div>
            <p className="mt-2 text-[0.6rem] text-muted">12-day streak · keep it going</p>
          </div>

          <div className="absolute -right-2 -top-4 grid h-[74px] w-[74px] -rotate-12 place-items-center rounded-full bg-lime text-center shadow-lg sm:-right-4 sm:h-[86px] sm:w-[86px]">
            <div>
              <p className="font-display text-lg font-bold leading-none text-ink">25%</p>
              <p className="mt-0.5 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ink/70">off annual</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden border-t border-line/70 bg-cream-deep/40 lg:block">
        <div className="wrap flex items-center justify-between gap-4 py-2.5 text-[0.68rem] text-muted">
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
            <span className="font-medium text-ink-soft">Live workshop in 3 hours:</span> Kubernetes debugging, with Meghna Rao
          </p>
          <button type="button" onClick={() => navigate("dashboard")} className="flex items-center gap-1 font-semibold text-ink transition-colors hover:text-coral">
            Save my seat <Icon name="arrowRight" size={12} />
          </button>
        </div>
      </div>
    </section>
  );
}

function ToolMarquee() {
  return (
    <section aria-label="Tools you will master" className="marquee overflow-hidden border-y border-line bg-paper py-4">
      <div className="marquee-track items-center gap-0">
        {[0, 1].map((set) => (
          <div key={set} className="flex items-center gap-7 px-7" aria-hidden={set === 1}>
            {tools.map((tool) => (
              <span key={tool + set} className="flex shrink-0 items-center gap-7">
                <span className="font-display text-[0.95rem] font-medium uppercase tracking-[0.06em] text-ink/55">{tool}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-lime-deep" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  const { categories, categoriesLoading, courses } = useShop(); // Added 'courses' here

  return (
    <section className="section-pad relative">
      <div className="wrap">
        <Reveal>
          <SectionHead
            eyebrow="Explore the catalogue"
            title={<>Pick a lane. <span className="italic-accent text-plum">Go deep.</span></>}
            copy="Real categories from the live catalogue."
            action={<a href="#/courses" className="btn btn-outline">All categories <Icon name="arrowRight" size={15} /></a>}
          />
        </Reveal>

        <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categoriesLoading
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="card h-40 animate-pulse bg-cream-deep/40" />)
            : categories.length === 0
              ? <p className="col-span-full text-center text-muted">No categories yet — add one from the Admin console.</p>
              : categories.map((cat, i) => {
                  // Find the first course in this category that actually has an image
                  const courseWithImage = courses.find((c) => c.categoryId === cat.id && c.imageUrl);
                  const imageUrl = courseWithImage ? absoluteUploadUrl(courseWithImage.imageUrl) : null;

                  return (
                    <Reveal key={cat.id} delay={i * 45}>
                      <a href={`#/courses?category=${cat.id}`} className="group card card-hover flex h-full flex-col overflow-hidden p-0">
                        {/* Image Section */}
                        <div className="relative h-28 w-full bg-cream-deep overflow-hidden">
                          {imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt={cat.name} 
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center bg-lime/20 text-ink/40">
                               <Icon name="grid" size={24} />
                            </div>
                          )}
                          <span className="absolute right-2 top-2 rounded-full bg-paper/90 backdrop-blur px-2 py-0.5 text-[0.6rem] font-medium text-ink shadow-sm">
                            {cat.count} courses
                          </span>
                        </div>
                        
                        {/* Content Section */}
                        <div className="flex flex-1 flex-col p-4">
                          <h3 className="font-display text-[0.98rem] font-semibold group-hover:text-plum transition-colors">{cat.name}</h3>
                          <p className="mt-1 line-clamp-2 text-[0.72rem] text-muted">{cat.shortHeading || cat.description}</p>
                        </div>
                      </a>
                    </Reveal>
                  );
                })}
        </div>
      </div>
    </section>
  );
}

function Featured() {
  const { navigate, courses, coursesLoading } = useShop();
  const filtered = courses.slice(0, 8);

  return (
    <section className="section-pad border-y border-line bg-paper">
      <div className="wrap">
        <Reveal>
          <SectionHead
            eyebrow="New & popular"
            title={<>Courses that <span className="italic-accent text-plum">move careers.</span></>}
            copy="Live courses from the catalogue."
            action={<a href="#/courses" className="btn btn-outline">Browse all <Icon name="arrowRight" size={15} /></a>}
          />
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {coursesLoading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-64 animate-pulse bg-cream-deep/30" />)
            : filtered.length === 0
              ? <p className="col-span-full text-center text-muted">No courses yet — add one from the Admin console.</p>
              : filtered.map((c, i) => <Reveal key={c.id} delay={Math.min(i, 5) * 55}><CourseCard course={c} /></Reveal>)}
        </div>

        {filtered[0] && (
          <Reveal>
            <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-line bg-cream/60 px-5 py-4 sm:flex-row">
              <p className="flex items-center gap-2.5 text-[0.8rem] text-ink-soft">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-ink"><Icon name="sparkle" size={15} /></span>
                <span><span className="font-semibold text-ink">Not sure which fits?</span> Try a preview.</span>
              </p>
              <button type="button" onClick={() => navigate(`course/${filtered[0].id}`)} className="btn btn-sm btn-white">
                Open a course <Icon name="play" size={12} />
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function CareerTracks() {
  const { paths, } = useShop(); // Get paths from store

  return (
    <section className="section-pad">
      <div className="wrap">
        <Reveal>
          <SectionHead
            eyebrow="Career tracks"
            title={<>A route, not just <span className="italic-accent text-plum">a reading list.</span></>}
            copy="Sequenced courses, projects and mentor check-ins designed around the role you want next."
            action={<a href="#/paths" className="btn btn-outline">All career tracks <Icon name="route" size={15} /></a>}
          />
        </Reveal>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {paths.slice(0, 3).map((path, i) => (
            <Reveal key={path.id} delay={i * 70}>
              <a href="#/paths" className="group card card-hover block h-full overflow-hidden p-0">
                <div className="relative h-40 overflow-hidden">
                  {path.imageUrl ? (
                    <img src={absoluteUploadUrl(path.imageUrl)} alt="" className="h-full w-full object-cover" />
                  ) : <div className="h-full bg-plum" />}
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-lime px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-ink">
                    Career track
                  </span>
                  <div className="absolute inset-x-4 bottom-3">
                    <h3 className="font-display text-[1.35rem] font-semibold text-white">{path.title}</h3>
                    <p className="mt-0.5 text-[0.64rem] text-white/70">{path.duration} · {path.level}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-[0.77rem] leading-relaxed text-muted">{path.description}</p>
                  {/* ... (keep rest same) */}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function MentorTeaser() {
  const { navigate } = useShop();
  return (
    <section className="relative overflow-hidden bg-plum py-14 text-white md:py-20">
      <div className="noise pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-lime/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-coral/10 blur-3xl" />
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1fr_.92fr]">
        <div>
          <Reveal>
            <p className="eyebrow mb-3 text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" /> AI career mentor
            </p>
            <h2 className="display max-w-xl text-[clamp(2.1rem,4vw,3.4rem)] text-white">
              A mentor who knows where you're <span className="italic-accent text-lime">going.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-white/60">
              Tell it your role, your target and your available hours. It builds the roadmap, checks your projects and
              rehearses the interview — then adjusts as life happens.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <ul className="mt-7 grid max-w-lg gap-3 sm:grid-cols-2">
              {[
                { icon: "route", title: "Your personal roadmap", copy: "Week-by-week, adjusted to your goal" },
                { icon: "code", title: "Project feedback", copy: "Specific notes, not vague praise" },
                { icon: "target", title: "Interview prep", copy: "Role-specific questions and drills" },
                { icon: "file", title: "Portfolio review", copy: "Make your work easy to say yes to" },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-lime/15 text-lime">
                    <Icon name={item.icon} size={14} />
                  </span>
                  <span>
                    <span className="block text-[0.78rem] font-semibold text-white">{item.title}</span>
                    <span className="mt-0.5 block text-[0.65rem] leading-snug text-white/45">{item.copy}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => navigate("dashboard")} className="btn btn-lime">
                Meet your mentor <Icon name="arrowRight" size={15} />
              </button>
              <span className="flex items-center gap-1.5 text-[0.68rem] text-white/40">
                <Icon name="shieldCheck" size={13} /> Free for all Pro learners
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute -inset-2 rotate-2 rounded-[1.8rem] border border-lime/20" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#1d1029] shadow-[0_40px_80px_-35px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-ink">
                    <Icon name="sparkle" size={16} />
                  </span>
                  <div>
                    <p className="text-[0.76rem] font-semibold text-white">Nova · AI mentor</p>
                    <p className="flex items-center gap-1 text-[0.58rem] text-white/45">
                      <span className="h-1 w-1 rounded-full bg-lime" /> Thinking about your next move
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[0.55rem] uppercase tracking-wider text-white/40">Live demo</span>
              </div>
              <div className="space-y-3 p-4">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-white/10 px-3 py-2.5 text-[0.76rem] text-white/85">
                  I want to become a DevOps engineer in 6 months. I currently do IT support.
                </div>
                <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-3 py-2.5">
                  <p className="text-[0.76rem] leading-relaxed text-white/80">
                    That's a realistic switch. Your support background is an asset — you already understand production
                    pressure. Here's the short version:
                  </p>
                  <div className="mt-2.5 space-y-1.5">
                    {[
                      "Months 1–2 · Linux, networking, Git",
                      "Months 3–4 · Docker, CI/CD, AWS",
                      "Month 5 · Kubernetes + observability",
                      "Month 6 · Capstone + interview reps",
                    ].map((step) => (
                      <p key={step} className="flex items-center gap-2 text-[0.72rem] text-white/70">
                        <Icon name="checkCircle" size={12} className="shrink-0 text-lime" /> {step}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-1">
                  {["Show me the courses", "Make it 8 hours/week", "Prep me for interviews"].map((chip) => (
                    <span key={chip} className="rounded-full border border-lime/30 bg-lime/10 px-2.5 py-1 text-[0.62rem] text-lime">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-white/10 p-3">
                <button
                  type="button"
                  onClick={() => navigate("dashboard")}
                  className="flex w-full items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-left text-[0.72rem] text-white/40 transition-colors hover:border-lime/40"
                >
                  Ask anything about your career…
                  <span className="ml-auto grid h-6 w-6 place-items-center rounded-full bg-lime text-ink">
                    <Icon name="send" size={12} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


function OfferBanner() {
  const { applyCoupon, toast, navigate } = useShop();
  const { dd, hh, mm, ss } = useCountdown(47);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("ELEARN20");
      toast("Code ELEARN20 copied. Use it at checkout.");
    } catch {
      toast("Your code is ELEARN20 — apply it at checkout.");
    }
  };

  return (
    <section className="section-pad bg-paper pt-0">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.8rem] bg-lime p-6 md:p-9 lg:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-ink/5" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-white/25 blur-2xl" />
            <div className="relative grid items-center gap-7 md:grid-cols-[1.15fr_.85fr]">
              <div>
                <p className="eyebrow text-ink/60">
                  <Icon name="gift" size={13} /> New learner offer
                </p>
                <h2 className="display mt-2 max-w-lg text-[clamp(1.9rem,3.5vw,2.8rem)] text-ink">
                  Your first skill, <span className="italic-accent">20% lighter.</span>
                </h2>
                <p className="mt-2 max-w-md text-[0.85rem] leading-relaxed text-ink/65">
                  Take 20% off any single course — including the career-track capstones. No subscription needed.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      applyCoupon("ELEARN20");
                      navigate("courses");
                    }}
                    className="btn btn-primary"
                  >
                    Claim 20% off <Icon name="arrowRight" size={15} />
                  </button>
                  <div className="flex items-center gap-1.5 text-[0.7rem] text-ink/60">
                    <Icon name="clock" size={13} />
                    Ends in
                    <span className="font-mono text-[0.72rem] font-semibold text-ink">
                      {String(dd).padStart(2, "0")}d {String(hh).padStart(2, "0")}h {String(mm).padStart(2, "0")}m
                      {dd === 0 ? ` ${String(ss).padStart(2, "0")}s` : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-ink/25 bg-paper/80 p-4 md:p-5">
                <p className="text-center text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">Your coupon code</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 items-center justify-center rounded-xl border border-ink/15 bg-white py-3">
                    <span className="font-mono text-[1.2rem] font-bold tracking-[0.14em] text-ink">ELEARN20</span>
                  </div>
                  <button
                    type="button"
                    onClick={copy}
                    aria-label="Copy coupon code"
                    className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-xl bg-ink text-white transition-colors hover:bg-plum-soft"
                  >
                    <Icon name="copy" size={17} />
                  </button>
                </div>
                <p className="mt-2.5 text-center text-[0.62rem] leading-relaxed text-muted">
                  Valid on individual courses until Sunday. One use per learner.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqPreview() {
  return (
    <section className="section-pad border-t border-line bg-cream">
      <div className="wrap grid gap-9 lg:grid-cols-[.7fr_1.15fr] lg:gap-14">
        <Reveal>
          <p className="eyebrow mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" /> Good to know
          </p>
          <h2 className="display text-[clamp(2rem,3.5vw,2.9rem)]">
            Questions, <span className="italic-accent text-plum">answered.</span>
          </h2>
          <p className="mt-3 max-w-sm text-[0.88rem] leading-relaxed text-muted">
            Clear terms, no fine print. Here's what learners ask us most before starting.
          </p>
          <div className="mt-6 rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-plum text-lime">
                <Icon name="sparkle" size={18} />
              </span>
              <div>
                <p className="text-[0.82rem] font-semibold text-ink">Still deciding?</p>
                <p className="text-[0.68rem] leading-snug text-muted">Ask the mentor, or talk to a human on our team.</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <a href="#/dashboard" className="btn btn-sm btn-lime flex-1">Ask the mentor</a>
              <a href="#/contact" className="btn btn-sm btn-outline flex-1">Contact us</a>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-[0.68rem] text-muted">
            <span className="flex items-center gap-1.5"><Icon name="phone" size={12} /> Mon–Sat, 9–7 IST</span>
            <span className="flex items-center gap-1.5"><Icon name="mail" size={12} /> Replies in 4 hrs</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card px-5 py-2">
            <Accordion items={faqs} />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-paper/60 px-4 py-3">
            <p className="text-[0.72rem] text-muted">Want the detailed version?</p>
            <a href="#/legal/terms" className="flex items-center gap-1 text-[0.72rem] font-semibold text-ink hover:underline">
              Read our policies <Icon name="arrowUpRight" size={12} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <ToolMarquee />
      <Categories />
      <Featured />
      <CareerTracks />
      <MentorTeaser />
      <OfferBanner />
      <FaqPreview />

      <section className="bg-plum py-12 text-white">
        <div className="wrap flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div>
            <p className="eyebrow mb-2 text-lime">Your next chapter</p>
            <h2 className="display max-w-lg text-[clamp(1.8rem,3vw,2.5rem)] text-white">
              The market isn't waiting. <span className="italic-accent text-lime">Neither should you.</span>
            </h2>
          </div>
          <div className="flex w-full flex-col gap-4 md:w-auto md:items-end">
            <div className="flex flex-wrap gap-2">
              <a href="#/courses" className="btn btn-lime">Explore courses <Icon name="arrowRight" size={15} /></a>
              <a href="#/contact" className="btn btn-outline border-white/25 text-white hover:border-white hover:bg-white/10">
                Contact us
              </a>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {stats.slice(0, 3).map((s) => (
                <p key={s.label} className="text-[0.66rem] text-white/45">
                  <span className="font-display text-[0.95rem] font-semibold text-white">{s.value}</span> {s.label}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}