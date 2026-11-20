import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { Breadcrumbs, Reveal, SectionHead } from "@/components/Primitives";
import { courseBySlug, courses, formatINR, mentorPrompts, mentorReplies } from "@/lib/data";
import { useShop } from "@/lib/store";
import { cn } from "@/utils/cn";

type Msg = { id: number; role: "user" | "assistant"; paras: string[]; courseSlugs?: string[] };

const initialMessages: Msg[] = [
  {
    id: 1,
    role: "assistant",
    paras: [
      "Hi Aditi — I'm Nova, your career mentor. I know the Elearn Hub curriculum, the projects our learners build and what hiring managers ask for.",
      "Tell me where you are now, where you want to be, and how many hours a week you can realistically commit. I'll map the shortest credible route.",
    ],
    courseSlugs: ["complete-devops-engineer-bootcamp", "ui-ux-design-portfolio"],
  },
];

export default function Mentor() {
  const { navigate, account, openAuth } = useShop();
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(2);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    const userMsg: Msg = { id: nextId.current++, role: "user", paras: [text] };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      const lower = text.toLowerCase();
      const match = mentorReplies.find((r) => r.keys.some((key) => lower.includes(key)));
      const reply: Msg = match
        ? { id: nextId.current++, role: "assistant", paras: match.text, courseSlugs: match.courses.slice(0, 2) }
        : {
            id: nextId.current++,
            role: "assistant",
            paras: [
              "Good question. To give you a useful answer rather than generic advice, I need three things: your current role or background, the role you want in 6–12 months, and your realistic study hours each week.",
              "If you tell me those, I'll build a week-by-week roadmap and pull the exact Elearn Hub courses you need — nothing more. You can also pick a starter below.",
            ],
            courseSlugs: ["complete-devops-engineer-bootcamp", "data-science-machine-learning-python"],
          };
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 1000);
  };

  const clear = () => {
    setMessages(initialMessages);
    setTyping(false);
    setInput("");
  };

  if (!account) {
    return (
      <div className="wrap flex min-h-[62vh] items-center justify-center py-14">
        <div className="card w-full max-w-md p-7 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-lime/60 text-ink"><Icon name="sparkle" size={26} /></span>
          <h1 className="mt-4 font-display text-2xl font-semibold">Career guidance is for members</h1>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
            Nova is part of your learner dashboard. Login to plan your next role, review projects and rehearse interviews privately.
          </p>
          <button type="button" onClick={() => openAuth("learner", "signin")} className="btn btn-primary btn-block mt-5">
            Login to continue <Icon name="arrowRight" size={15} />
          </button>
          <button type="button" onClick={() => navigate("courses")} className="mt-3 text-[0.7rem] text-muted hover:text-ink">Browse courses while you decide</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-cream pt-6 pb-9 md:pt-8 md:pb-12">
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-lime/25 blur-3xl" />
        <div className="wrap relative">
          <Breadcrumbs items={[{ label: "AI career mentor" }]} />
          <div className="mt-6 grid items-end gap-6 lg:grid-cols-[1.4fr_.6fr]">
            <div>
              <p className="eyebrow mb-3"><span className="h-1.5 w-1.5 rounded-full bg-coral" /> AI mentorship · included with Pro</p>
              <h1 className="display max-w-2xl text-[clamp(2.2rem,5vw,3.7rem)]">
                Your career, with a{" "}
                <span className="inline bg-[linear-gradient(transparent_60%,#CDF56A_60%,#CDF56A_92%,transparent_92%)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                  co-pilot.
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-[0.93rem] leading-relaxed text-muted">
                Not a chatbot that flatters you. A mentor grounded in our curriculum, project rubrics and real hiring
                feedback — available whenever you are.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { icon: "shieldCheck", label: "Grounded in our curriculum" },
                  { icon: "clock", label: "Available 24/7" },
                  { icon: "users", label: "Human-reviewed monthly" },
                ].map((item) => (
                  <span key={item.label} className="chip bg-paper text-[0.7rem]">
                    <Icon name={item.icon} size={12} className="text-plum" /> {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden justify-self-end rounded-2xl border border-line bg-paper p-4 lg:block">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-plum text-lime"><Icon name="sparkle" size={16} /></span>
                <div>
                  <p className="text-[0.72rem] font-semibold">Nova is online</p>
                  <p className="text-[0.6rem] text-muted">Average reply · 4 seconds</p>
                </div>
              </div>
              <p className="mt-2.5 max-w-[210px] text-[0.68rem] leading-relaxed text-muted">
                1,240 roadmaps built this month. Yours starts with one honest question.
              </p>
              <div className="mt-2.5 flex -space-x-2">
                {courses.slice(0, 4).map((c) => (
                  <img key={c.slug} src={c.instructor.avatar} alt="" className="h-6 w-6 rounded-full border-2 border-paper object-cover" />
                ))}
                <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-paper bg-cream text-[0.5rem] font-semibold">+8k</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-8">
        <div className="grid items-start gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-3 lg:sticky lg:top-[78px] xl:top-[122px]">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-plum text-lime">
                  <Icon name="brain" size={23} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-paper bg-emerald-500" />
                </span>
                <div>
                  <p className="font-display text-[1.02rem] font-semibold">Nova</p>
                  <p className="text-[0.66rem] text-muted">Career mentor · curriculum-aware</p>
                </div>
              </div>
              <p className="mt-3 text-[0.74rem] leading-relaxed text-muted">
                I can help you choose a track, plan your weeks, review an approach, or rehearse an interview answer.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {[
                  { value: "24/7", label: "Available" },
                  { value: "6", label: "Tracks" },
                  { value: "4.9", label: "Rated" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-cream px-1.5 py-2 text-center">
                    <p className="font-display text-[0.9rem] font-semibold leading-none">{stat.value}</p>
                    <p className="mt-1 text-[0.56rem] text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-muted">Suggested starting points</p>
              <div className="mt-2.5 space-y-1.5">
                {mentorPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left text-[0.72rem] leading-snug text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                  >
                    <Icon name="arrowUpRight" size={12} className="mt-0.5 shrink-0 text-muted" />
                    {prompt}
                  </button>
                ))}
              </div>
              <button type="button" onClick={clear} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-[0.68rem] font-medium text-muted transition-colors hover:text-ink">
                <Icon name="refresh" size={12} /> Start a fresh chat
              </button>
            </div>

            <div className="rounded-2xl border border-line bg-lime/30 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-ink-soft">Your current goal</p>
                <Icon name="route" size={14} />
              </div>
              <p className="mt-2 font-display text-[0.92rem] font-semibold leading-snug">DevOps Engineer in 6 months</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/70">
                <span className="block h-full w-[34%] rounded-full bg-ink" />
              </div>
              <p className="mt-1.5 text-[0.64rem] text-ink-soft">Week 8 of 24 · on track</p>
              <a href="#/dashboard" className="mt-2 inline-flex items-center gap-1 text-[0.68rem] font-semibold text-ink hover:underline">
                See learning plan <Icon name="arrowRight" size={11} />
              </a>
            </div>

            <p className="flex items-start gap-1.5 px-1 text-[0.62rem] leading-relaxed text-muted">
              <Icon name="info" size={12} className="mt-0.5 shrink-0" />
              AI guidance is informational and not a guarantee of employment. Human coaches review our recommendations monthly.
            </p>
          </aside>

          <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_28px_60px_-45px_rgba(26,18,37,0.55)]">
            <div className="flex items-center justify-between border-b border-line bg-cream/60 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-plum text-lime"><Icon name="sparkle" size={15} /></span>
                <div>
                  <p className="text-[0.8rem] font-semibold">Nova · AI career mentor</p>
                  <p className="flex items-center gap-1 text-[0.6rem] text-muted">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" /> Online · reply in seconds
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="hidden rounded-full border border-line bg-paper px-2 py-1 text-[0.58rem] text-muted sm:block">Pro feature</span>
                <button type="button" onClick={clear} aria-label="Clear conversation" className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink">
                  <Icon name="refresh" size={14} />
                </button>
              </div>
            </div>

            <div className="h-[430px] space-y-4 overflow-y-auto p-4 md:h-[470px]">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <span className="mr-2 mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lime text-ink"><Icon name="sparkle" size={13} /></span>
                  )}
                  <div className={cn("max-w-[88%] md:max-w-[80%]", msg.role === "user" && "max-w-[85%]")}>
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-3 text-[0.8rem] leading-relaxed",
                        msg.role === "user"
                          ? "rounded-br-md bg-ink text-white"
                          : "rounded-bl-md border border-line bg-cream/60 text-ink-soft",
                      )}
                    >
                      {msg.paras.map((para, i) => (
                        <p key={i} className={cn(i > 0 && "mt-2", "whitespace-pre-line")}>{para}</p>
                      ))}
                    </div>
                    {msg.role === "assistant" && msg.courseSlugs && (
                      <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                        {msg.courseSlugs.map((slug) => {
                          const course = courseBySlug(slug);
                          if (!course) return null;
                          return (
                            <a key={slug} href={`#/course/${slug}`} className="flex items-center gap-2 rounded-xl border border-line bg-paper p-2 transition-colors hover:border-ink">
                              <img src={course.image} alt="" className="h-8 w-10 rounded-md object-cover" />
                              <span className="min-w-0">
                                <span className="block truncate text-[0.68rem] font-semibold text-ink">{course.title}</span>
                                <span className="block text-[0.58rem] text-muted">{formatINR(course.price)} · {course.level}</span>
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-lime text-ink"><Icon name="sparkle" size={13} /></span>
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-cream/60 px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-line p-3">
              <div className="hide-scrollbar mb-2 flex gap-1.5 overflow-x-auto">
                {["Make me a 6-month DevOps plan", "Which course should I start with?", "Review my portfolio", "How much can I earn?"].map((chip) => (
                  <button key={chip} type="button" onClick={() => send(chip)} className="chip shrink-0 text-[0.64rem]">
                    {chip}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2 rounded-full border border-line bg-cream/50 p-1.5 pl-3.5 focus-within:border-ink"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your career, a course or an interview…"
                  aria-label="Message the AI career mentor"
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-[0.8rem] outline-none placeholder:text-muted/80"
                />
                <span className="hidden items-center gap-1 text-[0.58rem] text-muted md:flex"><Icon name="sparkle" size={11} /> Curriculum-aware</span>
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  aria-label="Send message"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-plum-soft disabled:opacity-40"
                >
                  <Icon name="send" size={14} />
                </button>
              </form>
              <p className="mt-1.5 text-center text-[0.58rem] text-muted">Nova can make mistakes. Verify important decisions with our human team.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-12 md:py-16">
        <div className="wrap">
          <SectionHead
            align="center"
            eyebrow="How mentorship works"
            title={<>Guidance that turns into <span className="italic-accent text-plum">momentum.</span></>}
            copy="Three ways Nova keeps you moving between lessons, not just during them."
          />
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              { icon: "route", step: "01", title: "A plan for your reality", copy: "Nova starts from your role, target and weekly hours, then sequences courses and projects so nothing is assumed." },
              { icon: "target", step: "02", title: "Another rep, on demand", copy: "Rehearse a system design answer, get your SQL query reviewed, or pressure-test a portfolio story before the real thing." },
              { icon: "refresh", step: "03", title: "Adjusts when life happens", copy: "Miss a week? Change your goal? Tell Nova. The roadmap recalculates without making you feel behind." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 70}>
                <div className="card h-full p-5">
                  <div className="flex items-center justify-between">
                    <span className="icon-tile bg-plum text-lime"><Icon name={item.icon} size={19} /></span>
                    <span className="font-display text-[1.4rem] font-semibold text-line">{item.step}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[1.05rem] font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted">{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={() => send("Build me a career roadmap from scratch")} className="btn btn-primary">Build my roadmap <Icon name="arrowRight" size={15} /></button>
            <button type="button" onClick={() => navigate("pricing")} className="btn btn-outline">See Pro membership</button>
          </div>
        </div>
      </section>
    </>
  );
}
