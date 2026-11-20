import Icon from "@/components/Icon";
import { PageHero, Reveal, SectionHead } from "@/components/Primitives";
import { courses, learningPaths, formatINR } from "@/lib/data";

const details: Record<string, { outcomes: string[]; steps: string[]; category: string }> = {
  "devops-launchpad": {
    category: "devops-cloud",
    outcomes: [
      "Deploy a containerised app with a real CI/CD pipeline",
      "Provision cloud infrastructure with Terraform",
      "Run and debug a Kubernetes workload",
      "Tell a credible interview story about reliability",
    ],
    steps: ["Linux & networking", "Docker & Git", "AWS + CI/CD", "Kubernetes capstone"],
  },
  "design-to-build": {
    category: "cad-design",
    outcomes: [
      "Produce a professional two-bedroom drawing package",
      "Build a coordinated BIM model",
      "Assemble a 3-sheet design portfolio",
      "Present design decisions with confidence",
    ],
    steps: ["AutoCAD precision", "Sheets & annotation", "Revit & BIM", "Portfolio review"],
  },
  "ai-data-accelerator": {
    category: "data-ai",
    outcomes: [
      "Clean and analyse a messy real dataset",
      "Train and evaluate a defensible ML model",
      "Ship a Streamlit data product",
      "Frame AI features for real business value",
    ],
    steps: ["Python & SQL", "Statistics", "Machine learning", "AI product capstone"],
  },
};

export default function Paths() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Career tracks" }]}
        eyebrow="Career tracks"
        title={<>Not random courses. <span className="italic-accent text-plum">A route.</span></>}
        copy="Career tracks sequence courses, projects and mentor check-ins so that every month moves you toward a specific role — not just a bigger watch history."
        aside={
          <div className="card hidden w-[260px] p-4 lg:block">
            <p className="eyebrow">How a track works</p>
            <ol className="mt-3 space-y-2.5">
              {["Diagnostic + goal setting", "Sequenced courses", "Portfolio project", "Mentor review & referrals"].map((step, i) => (
                <li key={step} className="flex items-start gap-2 text-[0.74rem] text-ink-soft">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cream text-[0.6rem] font-semibold text-ink">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <a href="#/dashboard" className="btn btn-sm btn-primary btn-block mt-4">Find my track</a>
          </div>
        }
      />

      <section className="wrap section-pad">
        <div className="space-y-8">
          {learningPaths.map((path, index) => {
            const info = details[path.slug];
            const trackCourses = courses.filter((c) => c.category === info.category).slice(0, 2);
            return (
              <Reveal key={path.slug}>
                <article className="card overflow-hidden p-0">
                  <div className={`grid lg:grid-cols-[.9fr_1.1fr] ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                    <div className="relative min-h-[280px] lg:min-h-[360px]">
                      <img src={path.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/10" />
                      <div className="absolute inset-x-5 bottom-5">
                        <span className="rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-ink" style={{ background: path.tint }}>
                          {path.months} · {path.level}
                        </span>
                        <h2 className="mt-2.5 font-display text-[1.8rem] font-semibold text-white">{path.name}</h2>
                        <p className="mt-1 text-[0.78rem] text-white/65">{path.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {path.skills.map((skill) => (
                            <span key={skill} className="rounded-md border border-white/25 bg-white/10 px-2 py-0.5 text-[0.62rem] text-white backdrop-blur">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 md:p-7">
                      <div className="flex items-center justify-between">
                        <p className="eyebrow">{path.learners} on this path</p>
                        <span className="flex items-center gap-1 text-[0.68rem] text-muted"><Icon name="award" size={13} /> Certificate</span>
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {info.outcomes.map((outcome) => (
                          <p key={outcome} className="flex items-start gap-2 text-[0.78rem] leading-snug text-ink-soft">
                            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lime/50 text-ink">
                              <Icon name="check" size={9} strokeWidth={2.6} />
                            </span>
                            {outcome}
                          </p>
                        ))}
                      </div>
                      <div className="mt-5 rounded-xl bg-cream p-3">
                        <p className="mb-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted">The sequence</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {info.steps.map((step, i) => (
                            <span key={step} className="flex items-center gap-1.5">
                              <span className="rounded-md border border-line bg-paper px-2 py-1 text-[0.64rem] font-medium text-ink-soft">{step}</span>
                              {i < info.steps.length - 1 && <Icon name="chevronRight" size={11} className="text-muted" />}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {trackCourses.map((c) => (
                              <img key={c.slug} src={c.instructor.avatar} alt="" className="h-6 w-6 rounded-full border-2 border-paper object-cover" />
                            ))}
                          </div>
                          <p className="text-[0.68rem] text-muted">
                            {path.courses} · from <span className="font-semibold text-ink">{formatINR(trackCourses[0]?.price ?? 2499)}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <a href={`#/courses?category=${info.category}`} className="btn btn-sm btn-outline">See courses</a>
                          <a href="#/pricing" className="btn btn-sm btn-primary">Start this track <Icon name="arrowRight" size={13} /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-paper py-12 md:py-16">
        <div className="wrap">
          <SectionHead
            eyebrow="More than a syllabus"
            title={<>Four things every track <span className="italic-accent text-plum">gets right.</span></>}
            align="center"
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "target", title: "Starts with a goal", copy: "A diagnostic maps what you already know to the role you want, so you skip what you can prove." },
              { icon: "layers", title: "Built in sequence", copy: "Each course assumes only what the previous one taught. No unexplained leaps." },
              { icon: "file", title: "Ends in evidence", copy: "Every track closes with a portfolio project reviewed against a real hiring rubric." },
              { icon: "users", title: "Mentor, not autopilot", copy: "Monthly check-ins with human coaches, alongside unlimited AI feedback in between." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="card h-full p-5">
                  <span className="icon-tile bg-lime/50"><Icon name={item.icon} size={19} /></span>
                  <h3 className="mt-4 font-display text-[1rem] font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-[0.78rem] leading-relaxed text-muted">{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#/dashboard" className="btn btn-primary">Find my best track <Icon name="sparkle" size={14} /></a>
            <a href="#/courses" className="btn btn-outline">Browse individual courses</a>
          </div>
        </div>
      </section>
    </>
  );
}
