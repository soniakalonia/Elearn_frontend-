import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { Avatar, PageHero, Reveal, SectionHead, Stars } from "@/components/Primitives";
import { useShop } from "@/lib/store";
import { courses, reviews as seedReviews, type Review } from "@/lib/data";
import { cn } from "@/utils/cn";

export default function Reviews() {
  const { toast, learner, navigate } = useShop();
  const [allReviews, setAllReviews] = useState<Review[]>(seedReviews);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [courseFilter, setCourseFilter] = useState("all");
  const [sort, setSort] = useState<"recent" | "helpful">("recent");
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [courseSlug, setCourseSlug] = useState(courses[0].slug);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => {
    const list = allReviews.filter((r) => {
      if (ratingFilter && r.rating !== ratingFilter) return false;
      if (courseFilter !== "all" && r.courseSlug !== courseFilter) return false;
      return true;
    });
    if (sort === "helpful") return [...list].sort((a, b) => b.helpful - a.helpful);
    return list;
  }, [allReviews, ratingFilter, courseFilter, sort]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || text.trim().length < 20) {
      toast("Add your name, a title and at least 20 characters of review", "error");
      return;
    }
    const course = courses.find((c) => c.slug === courseSlug);
    const review: Review = {
      id: `local-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || "Elearn Hub learner",
      avatar: learner.avatar,
      course: course?.title ?? "Elearn Hub course",
      courseSlug,
      rating,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      title: title.trim(),
      text: text.trim(),
      helpful: 0,
    };
    setAllReviews((prev) => [review, ...prev]);
    setSubmitted(true);
    setName("");
    setRole("");
    setTitle("");
    setText("");
    setRating(5);
    toast("Thank you — your review is live");
  };

  const toggleHelpful = (id: string) => {
    setHelpful((prev) => {
      const already = prev[id];
      setAllReviews((list) => list.map((r) => (r.id === id ? { ...r, helpful: r.helpful + (already ? -1 : 1) } : r)));
      return { ...prev, [id]: !already };
    });
  };

  return (
    <>
      <PageHero
        crumbs={[{ label: "Reviews" }]}
        eyebrow="Learner stories · verified"
        title={<>Real people. <span className="italic-accent text-plum">Real moves.</span></>}
        copy="Every review here comes from a learner who finished the course and submitted the project. No paid placements, no polished fiction."
        aside={
          <div className="card hidden w-[252px] p-4 lg:block">
            <p className="eyebrow">Overall rating</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-display text-[2.5rem] font-semibold leading-none">4.9</span>
              <div className="pb-1">
                <Stars rating={4.9} size={13} />
                <p className="mt-0.5 text-[0.62rem] text-muted">3,240 reviews</p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {[
                { star: 5, pct: 86 },
                { star: 4, pct: 9 },
                { star: 3, pct: 3 },
                { star: 2, pct: 1 },
                { star: 1, pct: 1 },
              ].map((row) => (
                <div key={row.star} className="flex items-center gap-2">
                  <span className="w-2 text-[0.6rem] text-muted">{row.star}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-deep">
                    <div className="h-full rounded-full bg-ink/70" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-[0.58rem] text-muted">{row.pct}%</span>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 border-t border-line-soft pt-2.5 text-[0.62rem] text-muted">
              <Icon name="shieldCheck" size={12} className="text-plum" /> Completion-verified only
            </p>
          </div>
        }
      />

      <section className="wrap py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="hide-scrollbar flex gap-1.5 overflow-x-auto">
            <button type="button" onClick={() => setRatingFilter(null)} className={cn("chip shrink-0", ratingFilter === null && "chip-active")}>
              All reviews
            </button>
            {[5, 4].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
                className={cn("chip shrink-0", ratingFilter === star && "chip-active")}
              >
                <Icon name="star" size={11} className="text-gold" /> {star} stars
              </button>
            ))}
            <button type="button" onClick={() => navigate("courses")} className="chip shrink-0">
              <Icon name="graduation" size={11} /> Courses
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              aria-label="Filter reviews by course"
              className="max-w-[220px] rounded-full border border-line bg-paper px-3 py-2 text-[0.7rem] text-ink-soft outline-none"
            >
              <option value="all">All courses</option>
              {courses.map((course) => (
                <option key={course.slug} value={course.slug}>{course.title}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "recent" | "helpful")}
              aria-label="Sort reviews"
              className="rounded-full border border-line bg-paper px-3 py-2 text-[0.7rem] text-ink-soft outline-none"
            >
              <option value="recent">Most recent</option>
              <option value="helpful">Most helpful</option>
            </select>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_330px]">
          <div>
            <p className="mb-3 text-[0.74rem] text-muted">
              Showing <span className="font-semibold text-ink">{filtered.length}</span> of {allReviews.length} reviews
            </p>
            {filtered.length === 0 ? (
              <div className="card p-10 text-center">
                <Icon name="search" size={26} className="mx-auto text-muted" />
                <h3 className="mt-3 font-display text-lg font-semibold">No reviews match that filter</h3>
                <p className="mt-1 text-sm text-muted">Try another rating or course.</p>
                <button type="button" onClick={() => { setRatingFilter(null); setCourseFilter("all"); }} className="btn btn-sm btn-outline mt-4">Clear filters</button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((review, i) => (
                  <Reveal key={review.id} delay={Math.min(i, 4) * 40}>
                    <article className="card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={review.avatar} size={40} />
                          <div>
                            <p className="flex items-center gap-1.5 text-[0.83rem] font-semibold">
                              {review.name}
                              <span className="flex items-center gap-0.5 rounded-full bg-lime/45 px-1.5 py-0.5 text-[0.52rem] font-semibold uppercase tracking-wide text-ink">
                                <Icon name="check" size={8} strokeWidth={3} /> Verified
                              </span>
                            </p>
                            <p className="text-[0.66rem] text-muted">{review.role} · {review.date}</p>
                          </div>
                        </div>
                        <Stars rating={review.rating} size={14} />
                      </div>
                      <h3 className="mt-3 font-display text-[1.05rem] font-semibold">{review.title}</h3>
                      <p className="mt-1.5 text-[0.82rem] leading-relaxed text-muted">{review.text}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-3">
                        <a href={`#/course/${review.courseSlug}`} className="flex min-w-0 items-center gap-1.5 text-[0.68rem] font-medium text-ink-soft transition-colors hover:text-ink">
                          <Icon name="book" size={13} className="shrink-0 text-muted" />
                          <span className="truncate">{review.course}</span>
                          <Icon name="arrowUpRight" size={11} className="shrink-0" />
                        </a>
                        <button
                          type="button"
                          onClick={() => toggleHelpful(review.id)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.64rem] transition-colors",
                            helpful[review.id] ? "border-ink bg-lime/40 text-ink" : "border-line text-muted hover:border-ink hover:text-ink",
                          )}
                        >
                          <Icon name="checkCircle" size={12} /> Helpful ({review.helpful})
                        </button>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}

            <div className="mt-6 grid gap-4 rounded-2xl border border-line bg-plum p-5 text-white sm:grid-cols-[1.2fr_.8fr] sm:items-center">
              <div>
                <p className="eyebrow mb-1.5 text-lime">Your story is next</p>
                <h3 className="font-display text-[1.35rem] font-semibold text-white">Finished a course? Tell us what changed.</h3>
                <p className="mt-1 text-[0.76rem] text-white/55">Honest reviews help the next learner choose well — and help us build better courses.</p>
              </div>
              <button type="button" onClick={() => document.getElementById("write-review")?.scrollIntoView({ behavior: "smooth", block: "center" })} className="btn btn-lime btn-sm sm:justify-self-end">
                Write a review <Icon name="arrowRight" size={13} />
              </button>
            </div>
          </div>

          <aside id="write-review" className="lg:sticky lg:top-[78px] xl:top-[122px]">
            <div className="card p-5">
              <p className="eyebrow">Share your experience</p>
              <h2 className="mt-1 font-display text-[1.2rem] font-semibold">
                {submitted ? "Thanks for paying it forward." : "Write a review"}
              </h2>
              {submitted ? (
                <div className="mt-3 rounded-xl bg-lime/30 p-4 text-center">
                  <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-lime text-ink"><Icon name="check" size={18} strokeWidth={2.5} /></span>
                  <p className="mt-2 text-[0.8rem] font-medium text-ink">Your review is published</p>
                  <p className="mt-1 text-[0.7rem] leading-relaxed text-ink-soft">It appears at the top of the list. You can write another whenever you like.</p>
                  <button type="button" onClick={() => setSubmitted(false)} className="btn btn-sm btn-outline mt-3">Write another</button>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-4 space-y-3">
                  <div className="field">
                    <label htmlFor="review-name">Your name</label>
                    <input id="review-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aditi Sharma" className="input" required />
                  </div>
                  <div className="field">
                    <label htmlFor="review-role">Current role (optional)</label>
                    <input id="review-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Product designer" className="input" />
                  </div>
                  <div className="field">
                    <label htmlFor="review-course">Course</label>
                    <select id="review-course" value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)} className="select">
                      {courses.map((course) => (
                        <option key={course.slug} value={course.slug}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[0.75rem] font-semibold text-ink-soft">Your rating</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                          className="transition-transform hover:scale-110"
                        >
                          <svg width="23" height="23" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M10 1.7l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8L10 1.7Z" fill={star <= rating ? "#F2B53D" : "#E4DACC"} />
                          </svg>
                        </button>
                      ))}
                      <span className="ml-1 text-[0.72rem] font-medium text-ink-soft">{rating}.0</span>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="review-title">Review title</label>
                    <input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The projects did it for me" className="input" required />
                  </div>
                  <div className="field">
                    <label htmlFor="review-text">Your review</label>
                    <textarea id="review-text" value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="What did you build? What changed for you?" className="textarea resize-none" required />
                    <p className="text-[0.6rem] text-muted">{text.trim().length}/20 characters minimum</p>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Publish review <Icon name="arrowRight" size={14} /></button>
                  <p className="text-center text-[0.6rem] leading-relaxed text-muted">By publishing you agree to our community guidelines and privacy policy.</p>
                </form>
              )}
            </div>

            <div className="mt-3 rounded-xl border border-line bg-paper p-4">
              <p className="flex items-center gap-1.5 text-[0.72rem] font-semibold"><Icon name="sparkle" size={13} /> Need a second opinion?</p>
              <p className="mt-1 text-[0.68rem] leading-relaxed text-muted">Nova can help you choose between two courses before you commit.</p>
              <a href="#/dashboard" className="mt-2 inline-flex items-center gap-1 text-[0.68rem] font-semibold text-ink hover:underline">Ask the mentor <Icon name="arrowRight" size={11} /></a>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-paper section-pad">
        <div className="wrap">
          <SectionHead
            align="center"
            eyebrow="The outcomes behind the words"
            title={<>Reviews are nice. <span className="italic-accent text-plum">Progress is better.</span></>}
            copy="The numbers behind our learner community, updated each month."
          />
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { value: "92%", label: "complete their first project", icon: "target" },
              { value: "3.4×", label: "more interview callbacks after a capstone", icon: "trending" },
              { value: "78%", label: "report a role change within 9 months", icon: "route" },
              { value: "4.9/5", label: "average rating across courses", icon: "star" },
            ].map((stat) => (
              <div key={stat.label} className="card p-4 text-center">
                <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-lime/45"><Icon name={stat.icon === "trending" ? "chart" : stat.icon} size={15} /></span>
                <p className="mt-2 font-display text-2xl font-semibold">{stat.value}</p>
                <p className="mt-0.5 text-[0.68rem] leading-snug text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[0.62rem] text-muted">Based on the Elearn Hub 2025 learner outcomes survey (n = 4,812). Outcomes vary by learner effort.</p>
        </div>
      </section>
    </>
  );
}
