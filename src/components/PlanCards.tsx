import Icon from "@/components/Icon";
import { useShop } from "@/lib/store";
import { formatINR, type Plan } from "@/lib/data";
import { cn } from "@/utils/cn";

export function BillingToggle({
  billing,
  onChange,
  light = false,
}: {
  billing: "monthly" | "annual";
  onChange: (billing: "monthly" | "annual") => void;
  light?: boolean;
}) {
  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-2.5">
      <div className={cn("inline-flex rounded-full border p-1", light ? "border-white/15 bg-white/5" : "border-line bg-paper")}>
        {(["monthly", "annual"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "relative rounded-full px-4 py-2 text-[0.76rem] font-semibold capitalize transition-all",
              billing === option
                ? light ? "bg-lime text-ink" : "bg-ink text-white shadow-sm"
                : light ? "text-white/60 hover:text-white" : "text-ink-soft hover:text-ink",
            )}
            aria-pressed={billing === option}
          >
            {option}
            {option === "annual" && (
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.5 text-[0.56rem] font-bold uppercase tracking-wide",
                  billing === "annual" ? "bg-coral text-white" : "bg-lime text-ink",
                )}
              >
                −23%
              </span>
            )}
          </button>
        ))}
      </div>
      <span className={cn("text-[0.7rem]", light ? "text-white/45" : "text-muted")}>Cancel anytime</span>
    </div>
  );
}

export function PlanCard({
  plan,
  billing,
  compact = false,
}: {
  plan: Plan;
  billing: "monthly" | "annual";
  compact?: boolean;
}) {
  const { addPlan, navigate } = useShop();
  const popular = plan.popular;
  const isFree = plan.monthly === 0;
  const price = billing === "annual" ? plan.annual : plan.monthly;
  const suffix = plan.id === "teams" ? "/seat/mo" : "/month";

  const choose = () => {
    if (isFree) {
      navigate("courses");
      return;
    }
    if (plan.id === "teams") {
      navigate("contact");
      return;
    }
    addPlan(plan.id, billing);
  };

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-[1.6rem] border p-6 transition-all duration-300 lg:p-7",
        popular
          ? "border-plum bg-plum text-white shadow-[0_35px_70px_-35px_rgba(36,21,51,0.8)] lg:-my-2 lg:py-9"
          : "border-line bg-paper hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]",
      )}
    >
      {popular && (
        <>
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime px-3.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ink shadow-sm">
            Most popular
          </span>
          <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-lime/20" />
          <span className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-lime/5 blur-xl" />
        </>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h3 className={cn("font-display text-[1.35rem] font-semibold", popular ? "text-white" : "text-ink")}>{plan.name}</h3>
          <p className={cn("mt-1 text-[0.78rem]", popular ? "text-white/55" : "text-muted")}>{plan.tagline}</p>
        </div>
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl", popular ? "bg-lime text-ink" : "bg-cream text-ink")}>
          <Icon name={plan.id === "starter" ? "compass" : plan.id === "pro" ? "sparkle" : "users"} size={17} />
        </span>
      </div>

      <div className="mt-6 flex items-end gap-1.5">
        <span className={cn("font-display text-[2.5rem] font-semibold leading-none tracking-[-0.04em]", popular ? "text-white" : "text-ink")}>
          {isFree ? "₹0" : formatINR(price)}
        </span>
        {!isFree && <span className={cn("ml-1 pb-1 text-[0.72rem]", popular ? "text-white/50" : "text-muted")}>{suffix}</span>}
      </div>
      <p className={cn("mt-1.5 h-4 text-[0.68rem]", popular ? "text-lime/80" : "text-muted")}>
        {isFree ? "Free forever. No card required." : billing === "annual" ? `${formatINR(price * 12)} billed yearly · save 23%` : "Billed monthly · switch to annual to save"}
      </p>

      <button
        type="button"
        onClick={choose}
        className={cn("btn btn-block mt-5", popular ? "btn-lime" : plan.id === "teams" ? "btn-outline" : "btn-primary")}
      >
        {plan.cta}
        <Icon name={plan.id === "teams" ? "arrowUpRight" : "arrowRight"} size={15} />
      </button>

      <div className={cn("mt-6 border-t pt-5", popular ? "border-white/10" : "border-line-soft")}>
        <p className={cn("mb-3 text-[0.64rem] font-semibold uppercase tracking-[0.14em]", popular ? "text-white/40" : "text-muted")}>
          {plan.id === "starter" ? "What's included" : `Everything in ${plan.id === "teams" ? "Pro" : "your plan"}`}
        </p>
        <ul className={cn("space-y-2.5", compact && "space-y-2")}>
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className={cn("mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full", popular ? "bg-lime/15 text-lime" : "bg-lime/45 text-ink")}>
                <Icon name="check" size={10} strokeWidth={2.6} />
              </span>
              <span className={cn("text-[0.78rem] leading-snug", popular ? "text-white/70" : "text-ink-soft")}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("mt-auto flex items-center gap-1.5 pt-6 text-[0.64rem]", popular ? "text-white/35" : "text-muted")}>
        <Icon name="shieldCheck" size={12} />
        7-day money-back guarantee
      </div>
    </div>
  );
}
