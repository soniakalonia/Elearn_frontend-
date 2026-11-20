import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { useShop } from "@/lib/store";
import { formatINR, mentorPrompts, mentorReplies } from "@/lib/data";
import { absoluteUploadUrl } from "@/lib/api";
import { cn } from "@/utils/cn";

type Msg = { id: number; role: "user" | "assistant"; paras: string[]; courseIds?: number[] };

export default function CareerDialog() {
  const { careerOpen, setCareerOpen, navigate, courses } = useShop();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      role: "assistant",
      paras: [
        "Hi — I'm Nova, your AI career mentor at Elearn Hub.",
        "Tell me your current situation, the role you want, and how many hours a week you can study. I'll map a realistic route with the exact courses and projects to take.",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  useEffect(() => {
    if (careerOpen) setTimeout(() => endRef.current?.scrollIntoView({ behavior: "auto", block: "end" }), 60);
  }, [careerOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCareerOpen(false);
    };
    if (careerOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [careerOpen, setCareerOpen]);

  if (!careerOpen) return null;

  const pickCourseIds = (titles: string[]): number[] => {
    const ids: number[] = [];
    for (const t of titles) {
      const match = courses.find((c) => c.title.toLowerCase().includes(t.toLowerCase().split(" ")[0]));
      if (match) ids.push(match.id);
    }
    return ids.slice(0, 2);
  };

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setMessages((prev) => [...prev, { id: nextId.current++, role: "user", paras: [text] }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const lower = text.toLowerCase();
      const match = mentorReplies.find((r) => r.keys.some((key) => lower.includes(key)));
      const reply: Msg = match
        ? {
            id: nextId.current++,
            role: "assistant",
            paras: match.text,
            courseIds: pickCourseIds(match.courses.map((slug) => slug.replace(/-/g, " "))),
          }
        : {
            id: nextId.current++,
            role: "assistant",
            paras: [
              "To give you a useful plan rather than generic advice, share three things: your current background, the role you want in 6–12 months, and the hours you can study each week.",
              "I'll then sequence the exact courses and projects for you. You can also try one of the quick starters below.",
            ],
          };
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 950);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-3 sm:p-5" role="dialog" aria-modal="true" aria-label="AI career guidance">
      <button type="button" aria-label="Close" onClick={() => setCareerOpen(false)} className="fixed inset-0 animate-fade bg-ink/55 backdrop-blur-[2px]" />
      <div className="animate-pop relative flex h-[min(720px,94vh)] w-full max-w-[640px] flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-plum px-4 py-3.5 text-white">
          <div className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-lime text-ink">
              <Icon name="sparkle" size={19} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-plum bg-emerald-500" />
            </span>
            <div>
              <p className="font-display text-[0.98rem] font-semibold">Career guidance</p>
              <p className="flex items-center gap-1 text-[0.62rem] text-white/55">
                <Icon name="shieldCheck" size={10} /> AI mentor · curriculum-aware · free
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => { setCareerOpen(false); navigate("mentor"); }}
              className="btn btn-sm h-8 border border-white/20 bg-white/10 px-3 text-[0.66rem] text-white hover:bg-white/20"
            >
              Full mentor page <Icon name="arrowUpRight" size={11} />
            </button>
            <button
              type="button"
              onClick={() => setCareerOpen(false)}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <Icon name="x" size={15} />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-cream/50 p-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <span className="mr-2 mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lime text-ink"><Icon name="sparkle" size={13} /></span>
              )}
              <div className={cn("max-w-[88%]", msg.role === "user" && "max-w-[85%]")}>
                <div className={cn("rounded-2xl px-3.5 py-3 text-[0.8rem] leading-relaxed", msg.role === "user" ? "rounded-br-md bg-ink text-white" : "rounded-bl-md border border-line bg-paper text-ink-soft")}>
                  {msg.paras.map((para, i) => <p key={i} className={cn(i > 0 && "mt-2", "whitespace-pre-line")}>{para}</p>)}
                </div>
                {msg.role === "assistant" && msg.courseIds && msg.courseIds.length > 0 && (
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {msg.courseIds.map((id) => {
                      const course = courses.find((c) => c.id === id);
                      if (!course) return null;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => { setCareerOpen(false); navigate(`course/${course.id}`); }}
                          className="flex items-center gap-2 rounded-xl border border-line bg-paper p-2 text-left transition-colors hover:border-ink"
                        >
                          {course.imageUrl ? (
                            <img src={absoluteUploadUrl(course.imageUrl)} alt="" className="h-8 w-10 rounded-md object-cover" />
                          ) : <div className="h-8 w-10 rounded-md bg-cream-deep" />}
                          <span className="min-w-0">
                            <span className="block truncate text-[0.68rem] font-semibold text-ink">{course.title}</span>
                            <span className="block text-[0.58rem] text-muted">{formatINR(course.discountPrice)}</span>
                          </span>
                        </button>
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
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-paper px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-line bg-paper p-3">
          <div className="hide-scrollbar mb-2 flex gap-1.5 overflow-x-auto">
            {mentorPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => send(prompt)} className="chip shrink-0 text-[0.62rem]">{prompt}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2 rounded-full border border-line bg-cream/60 p-1.5 pl-3.5 focus-within:border-ink">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your career, skills or interviews…"
              aria-label="Message the AI career mentor"
              className="min-w-0 flex-1 bg-transparent py-1.5 text-[0.8rem] outline-none placeholder:text-muted/80"
            />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Send" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-plum-soft disabled:opacity-40">
              <Icon name="send" size={14} />
            </button>
          </form>
          <p className="mt-1.5 text-center text-[0.56rem] text-muted">AI guidance is informational — verify important decisions with our human team.</p>
        </div>
      </div>
    </div>
  );
}