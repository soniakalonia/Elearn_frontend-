import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/utils/cn";
import { useShop, type UiCourse } from "@/lib/store";
import { absoluteUploadUrl } from "@/lib/api";
import { formatINR } from "@/lib/data";

/* ---------------- Logo ---------------- */
export function Logo({ light, compact }: { light?: boolean; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2 font-display font-bold tracking-tight", light ? "text-white" : "text-ink")}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime text-ink">E</span>
      {!compact && <span className="text-[1.05rem]">Elearn Hub</span>}
    </span>
  );
}

/* ---------------- ProgressRing ---------------- */
export function ProgressRing({
  value,
  size = 84,
  stroke = 8,
  tint = "#CDF56A",
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tint?: string;
  label?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circ - (clamped / 100) * circ;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFEAE0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tint}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      {label && <div className="absolute inset-0 grid place-items-center">{label}</div>}
    </div>
  );
}

/* ---------------- NewsletterForm ---------------- */
export function NewsletterForm({ light }: { light?: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.includes("@")) return;
        setSent(true);
        setEmail("");
        window.setTimeout(() => setSent(false), 3000);
      }}
      className="flex w-full max-w-sm gap-2"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        aria-label="Email address"
        className={
          light
            ? "flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-[0.78rem] text-white placeholder:text-white/40 outline-none focus:border-lime"
            : "flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-[0.78rem] text-ink placeholder:text-muted outline-none focus:border-ink"
        }
      />
      <button
        type="submit"
        className={light ? "btn btn-lime btn-sm" : "btn btn-primary btn-sm"}
      >
        {sent ? "Subscribed ✓" : "Subscribe"}
      </button>
    </form>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionHead({
  eyebrow,
  title,
  copy,
  action,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  copy?: string;
  action?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", align === "center" && "justify-center text-center")}>
      <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
        {eyebrow && <p className="eyebrow mb-2"><span className="h-1.5 w-1.5 rounded-full bg-coral" /> {eyebrow}</p>}
        <h2 className="display text-[clamp(1.9rem,3.5vw,2.9rem)]">{title}</h2>
        {copy && <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-muted">{copy}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Reveal (subtle on-scroll) ---------------- */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("transition-all duration-500", shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
    >
      {children}
    </div>
  );
}

/* ---------------- Avatar ---------------- */
export function Avatar({ src, size = 32, className }: { src?: string | null; size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-block shrink-0 overflow-hidden rounded-full bg-cream-deep", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="grid h-full w-full place-items-center text-[0.55rem] font-semibold text-muted">—</span>
      )}
    </span>
  );
}

/* ---------------- Stars ---------------- */
export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" className={n <= Math.round(rating) ? "text-gold" : "text-line"} fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
        </svg>
      ))}
    </span>
  );
}

/* ---------------- Rating (alias) ---------------- */
export function Rating({ rating, size = 12 }: { rating: number; size?: number }) {
  return <Stars rating={rating} size={size} />;
}

/* ---------------- Breadcrumbs ---------------- */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-[0.7rem] text-muted" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {item.href ? (
            <a href={`#/${item.href}`} className="hover:text-ink hover:underline">{item.label}</a>
          ) : (
            <span className="font-medium text-ink">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="text-line">/</span>}
        </span>
      ))}
    </nav>
  );
}

/* ---------------- EmptyState ---------------- */
export function EmptyState({
  icon, title, copy, action,
}: { icon: string; title: string; copy?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime text-ink"><Icon name={icon} size={22} /></span>
      <h3 className="mt-4 font-display text-[1.15rem] font-semibold">{title}</h3>
      {copy && <p className="mt-2 max-w-sm text-[0.82rem] text-muted">{copy}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ---------------- PageHero ---------------- */
export function PageHero({
  crumbs, eyebrow, title, copy, aside, children,
}: {
  crumbs?: { label: string; href?: string }[];
  eyebrow?: string;
  title: ReactNode;
  copy?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-cream py-10 md:py-14">
      <div className="wrap">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            {eyebrow && <p className="eyebrow mb-2"><span className="h-1.5 w-1.5 rounded-full bg-coral" /> {eyebrow}</p>}
            <h1 className="display text-[clamp(2rem,4vw,3.2rem)]">{title}</h1>
            {copy && <p className="mt-3 max-w-xl text-[0.92rem] leading-relaxed text-muted">{copy}</p>}
            {children && <div className="mt-4">{children}</div>}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Accordion ---------------- */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line-soft">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-3 py-3 text-left">
              <span className="text-[0.85rem] font-semibold text-ink">{item.q}</span>
              <Icon name={isOpen ? "minus" : "plus"} size={16} className="shrink-0 text-muted" />
            </button>
            {isOpen && <p className="pb-3 text-[0.8rem] leading-relaxed text-muted">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- useCountdown ---------------- */
export function useCountdown(hoursFromNow: number) {
  const target = useRef(Date.now() + hoursFromNow * 3600 * 1000);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, target.current - now);
  const totalSec = Math.floor(ms / 1000);
  return {
    dd: Math.floor(totalSec / 86400),
    hh: Math.floor((totalSec % 86400) / 3600),
    mm: Math.floor((totalSec % 3600) / 60),
    ss: totalSec % 60,
  };
}

/* ---------------- CourseCard (dynamic, DB-backed) ---------------- */
/* ---------------- CourseCard (fully clickable, DB-backed) ---------------- */
export function CourseCard({ course }: { course: UiCourse }) {
  const { addToCart, inWishlist, toggleWishlist, navigate, cartItems } = useShop();
  const saved = inWishlist(course.id);
  const inCart = cartItems.some((c) => c.courseId === course.id);
  const discountPct =
    course.originalPrice > 0 && course.discountPrice < course.originalPrice
      ? Math.round(((course.originalPrice - course.discountPrice) / course.originalPrice) * 100)
      : 0;

  const open = () => navigate(`course/${course.id}`);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
      className="group card flex h-full cursor-pointer flex-col overflow-hidden p-0 transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ink/40"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-cream-deep">
        {course.imageUrl ? (
          <img src={absoluteUploadUrl(course.imageUrl)} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted text-[0.7rem]">No image</div>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleWishlist(course.id); }}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-paper/95 text-ink shadow-md backdrop-blur transition hover:bg-lime"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {course.offerText && (
          <span className="absolute left-2 top-2 rounded-full bg-coral px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
            {course.offerText}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted">{course.categoryName}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-[1rem] font-semibold leading-snug">{course.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[0.74rem] leading-relaxed text-muted">{course.shortDescription}</p>
        <div className="mt-2 flex items-center gap-1.5 text-[0.66rem] text-muted">
          <Icon name="clock" size={11} /> {course.courseLength || "—"}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="font-display text-[1.05rem] font-semibold leading-none">{formatINR(course.discountPrice)}</p>
            {discountPct > 0 && (
              <p className="mt-1 text-[0.64rem] text-muted">
                <span className="line-through">{formatINR(course.originalPrice)}</span> · {discountPct}% off
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inCart ? navigate("cart") : addToCart(course.id); }}
            className="btn btn-sm btn-primary"
          >
            {inCart ? "In cart" : <>Add <Icon name="bag" size={12} /></>}
          </button>
        </div>
        <span className="mt-2 text-[0.66rem] font-medium text-ink opacity-70 group-hover:opacity-100">View details →</span>
      </div>
    </article>
  );
}