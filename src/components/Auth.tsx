import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { Logo } from "@/components/Primitives";
import { useShop, type Role } from "@/lib/store";
import { cn } from "@/utils/cn";

const roleCards: { role: Role; title: string; copy: string; icon: string; perks: string[] }[] = [
  {
    role: "user",
    title: "I'm here to learn",
    copy: "Courses, projects, mentor and career tools.",
    icon: "graduation",
    perks: ["My courses & progress", "Orders & certificates", "Wishlist & wishlist sync"],
  },
  {
    role: "admin",
    title: "I'm an admin",
    copy: "Manage the catalogue, orders and learners.",
    icon: "settings",
    perks: ["Sales & learner metrics", "Course & coupon management", "Reviews & payments"],
  },
];

export function AuthModal() {
  const { authOpen, setAuthOpen, authMode, setAuthMode, authRole, signIn, signUp } = useShop();
  const [mode, setMode] = useState(authMode);
  const [role, setRole] = useState<Role>(authRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authOpen) {
      setMode(authMode);
      setRole(authRole);
      setPassword("");
      setShowPass(false);
      setLoading(false);
    }
  }, [authOpen, authMode, authRole]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAuthOpen(false);
    };
    if (authOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authOpen, setAuthOpen]);

  if (!authOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (mode === "signup" && !consent) return;

    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, password, role);
      } else {
        await signUp(name, email, password, "user"); 
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : Math.min(4, Math.floor(password.length / 3) + (/[A-Z0-9@!#]/.test(password) ? 1 : 0));

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-label="Sign in or register">
      <button type="button" aria-label="Close" onClick={() => setAuthOpen(false)} className="fixed inset-0 animate-fade bg-ink/55 backdrop-blur-[2px]" />
      <div className="animate-pop relative grid w-full max-w-[880px] overflow-hidden rounded-3xl border border-line bg-paper shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        {/* visual side */}
        <div className="relative hidden min-h-[560px] bg-plum md:block">
          <img
            src="https://images.pexels.com/photos/8837758/pexels-photo-8837758.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
            alt="A learner at her desk"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-plum via-plum/45 to-plum/15" />
          <div className="relative flex h-full flex-col justify-between p-6 text-white">
            <span className="inline-flex w-max rounded-2xl bg-lime px-2.5 py-2 text-ink shadow-lg"><Logo compact /></span>
            <div>
              <p className="eyebrow text-lime">Your next chapter</p>
              <h3 className="display mt-2 text-[1.7rem] text-white">
                One account for courses, mentor and your career.
              </h3>
              <ul className="mt-4 space-y-2">
                {["Real projects with mentor feedback", "AI career guidance, 24/7", "Verified certificates employers trust"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[0.78rem] text-white/75">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-lime text-ink"><Icon name="check" size={11} strokeWidth={2.6} /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* form side */}
        <div className="relative p-5 md:p-7">
          <button
            type="button"
            onClick={() => setAuthOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-cream"
          >
            <Icon name="x" size={16} />
          </button>

          <div className="md:hidden"><Logo /></div>
          <p className="eyebrow mt-4 md:mt-1">{mode === "signin" ? "Welcome back" : "Join the hub"}</p>
          <h2 className="display mt-1.5 text-[1.8rem]">{mode === "signin" ? "Sign in to continue" : "Create your account"}</h2>
          <p className="mt-1 text-[0.78rem] text-muted">
            {mode === "signin" ? "Pick your role — the experience adapts to you." : "Free to start. Upgrade whenever you're ready."}
          </p>

          {/* mode tabs */}
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-full border border-line bg-cream p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setAuthMode(m);
                }}
                aria-pressed={mode === m}
                className={cn("rounded-full py-2 text-[0.76rem] font-semibold transition-colors", mode === m ? "bg-ink text-white" : "text-ink-soft hover:text-ink")}
              >
                {m === "signin" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          {/* role chooser */}
          <div className={cn("mt-3.5 grid gap-2", mode === "signup" ? "grid-cols-1" : "grid-cols-2")}>
            {roleCards
              .filter((card) => mode === "signup" ? card.role === "user" : true)
              .map((card) => (
                <button
                  key={card.role}
                  type="button"
                  onClick={() => setRole(card.role)}
                  aria-pressed={role === card.role}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition-all",
                    role === card.role ? "border-ink bg-lime/25 shadow-sm" : "border-line bg-white hover:border-muted",
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className={cn("grid h-8 w-8 place-items-center rounded-lg", role === card.role ? "bg-ink text-lime" : "bg-cream text-ink")}>
                      <Icon name={card.icon} size={16} />
                    </span>
                    {role === card.role && <Icon name="checkCircle" size={16} className="text-ink" />}
                  </span>
                  <span className="mt-2 block text-[0.8rem] font-semibold">{card.title}</span>
                  <span className="mt-0.5 block text-[0.64rem] leading-snug text-muted">{card.copy}</span>
                </button>
              ))}
          </div>

          <form onSubmit={submit} className="mt-4 space-y-3">
            {mode === "signup" && (
              <div className="field">
                <label htmlFor="auth-name">Full name</label>
                <div className="relative">
                  <Icon name="user" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input id="auth-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aditi Sharma" className="input pl-9" required />
                </div>
              </div>
            )}
            <div className="field">
              <label htmlFor="auth-email">Email address</label>
              <div className="relative">
                <Icon name="mail" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input pl-9" required />
              </div>
            </div>
            <div className="field">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-pass">Password</label>
                {mode === "signin" && (
                  <button type="button" className="text-[0.66rem] font-medium text-muted hover:text-ink" onClick={() => { }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Icon name="lock" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="auth-pass"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="input pl-9 pr-10"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <Icon name="eye" size={15} />
                </button>
              </div>
              {mode === "signup" && password.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={cn("h-1 flex-1 rounded-full", n <= strength ? (strength <= 1 ? "bg-coral" : strength <= 2 ? "bg-gold" : "bg-lime-deep") : "bg-cream-deep")} />
                    ))}
                  </div>
                  <span className="text-[0.6rem] text-muted">{["", "Weak", "Okay", "Good", "Strong"][strength]}</span>
                </div>
              )}
            </div>

            {mode === "signin" ? (
              <label className="flex cursor-pointer items-center gap-2 text-[0.72rem] text-ink-soft">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-3.5 w-3.5 accent-ink" />
                Keep me signed in on this device
              </label>
            ) : (
              <label className="flex cursor-pointer items-start gap-2 text-[0.7rem] leading-relaxed text-muted">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-ink" required />
                <span>
                  I agree to the <a href="#/legal/terms" className="font-medium text-ink underline underline-offset-2">Terms</a> and{" "}
                  <a href="#/legal/privacy" className="font-medium text-ink underline underline-offset-2">Privacy policy</a>.
                </span>
              </label>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary btn-block disabled:opacity-60">
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}{" "}
              {!loading && <Icon name="arrowRight" size={15} />}
            </button>
            <p className="text-center text-[0.64rem] text-muted">
              {mode === "signin" ? (
                <>
                  New to Elearn Hub?{" "}
                  <button type="button" onClick={() => { setMode("signup"); setAuthMode("signup"); }} className="font-semibold text-ink underline underline-offset-2">
                    Register free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setMode("signin"); setAuthMode("signin"); }} className="font-semibold text-ink underline underline-offset-2">
                    Sign in
                  </button>
                </>
              )}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="flex items-center gap-1 text-[0.6rem] text-muted"><Icon name="shieldCheck" size={11} /> Secured with 256-bit TLS</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}