import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { Logo } from "@/components/Primitives";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/data";
import { absoluteUploadUrl } from "@/lib/api";
import { cn } from "@/utils/cn";


function SearchBox({ mobile = false }: { mobile?: boolean }) {
  const { navigate, setSearchTerm, toast, courses } = useShop();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (holderRef.current && !holderRef.current.contains(e.target as Node)) setFocused(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const matches =
    q.trim().length > 1
      ? courses
        .filter((c) => {
          const haystack = `${c.title} ${c.shortDescription} ${c.categoryName}`.toLowerCase();
          return haystack.includes(q.trim().toLowerCase());
        })
        .slice(0, 4)
      : [];

  const submit = () => {
    setSearchTerm(q.trim());
    setFocused(false);
    inputRef.current?.blur();
    navigate("courses");
    if (q.trim()) toast(`Showing results for "${q.trim()}"`, "info");
  };

  return (
    <div ref={holderRef} className={cn("relative", mobile ? "w-full" : "w-full max-w-[330px]")}>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} role="search">
        <div className="flex h-10 items-center gap-2 rounded-full border border-line bg-white px-3.5 transition-colors focus-within:border-ink">
          <Icon name="search" size={15} className="shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search courses, skills…"
            aria-label="Search courses"
            className="min-w-0 flex-1 bg-transparent text-[0.79rem] text-ink outline-none placeholder:text-muted/80"
          />
          <kbd className="hidden shrink-0 rounded border border-line bg-cream px-1.5 py-0.5 text-[0.6rem] font-medium text-muted sm:block">⌘K</kbd>
        </div>
      </form>

      {focused && q.trim().length > 1 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 animate-pop overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_30px_60px_-25px_rgba(26,18,37,0.45)]">
          {matches.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-medium text-ink">No courses for "{q}" yet</p>
              <p className="mt-1 text-xs text-muted">Try a different keyword.</p>
            </div>
          ) : (
            <ul className="p-1.5">
              {matches.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => { setFocused(false); setQ(""); navigate(`course/${c.id}`); }}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-cream"
                  >
                    {c.imageUrl ? (
                      <img src={absoluteUploadUrl(c.imageUrl)} alt="" className="h-10 w-12 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-12 rounded-lg bg-cream-deep" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.8rem] font-medium text-ink">{c.title}</span>
                      <span className="block text-[0.68rem] text-muted">{c.categoryName} · {formatINR(c.discountPrice)}</span>
                    </span>
                    <Icon name="arrowRight" size={14} className="text-muted" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={submit}
            className="flex w-full items-center justify-between border-t border-line bg-cream/60 px-4 py-2.5 text-left text-[0.73rem] font-medium text-ink transition-colors hover:bg-cream"
          >
            View all results
            <Icon name="arrowRight" size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const {
    route, account, signOut, openAuth,
    cartItems, cartLoading, setCartOpen,
    wishlistIds, categories,
  } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.length;
  const wishlistCount = wishlistIds.length;

  useEffect(() => {
    setMenuOpen(false);
    setMobileSearch(false);
    setAccountOpen(false);
  }, [route]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (path: string) => route === path || route.startsWith(path + "/");

  return (
    <header className="relative z-40">
<div className="bg-plum text-white">
  <div className="wrap flex h-9 items-center justify-between gap-4 text-[0.7rem]">
    <p className="flex min-w-0 items-center gap-2 truncate">
      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lime text-ink">
        <Icon name="sparkle" size={10} strokeWidth={2} />
      </span>
      <span className="truncate">
        Practitioner-led courses built around real job roles ·{" "}
        <span className="font-semibold text-lime">start learning today</span>
      </span>
    </p>
    <div className="hidden shrink-0 items-center gap-5 text-white/70 md:flex">
      <a href="#/courses" className="transition-colors hover:text-lime">Browse courses</a>
      <span className="h-3 w-px bg-white/20" />
      <a href="#/contact" className="transition-colors hover:text-lime">Contact us</a>
    </div>
  </div>
</div>

      <div className="sticky top-0 z-40">
        <div className="border-b border-line bg-paper/95 backdrop-blur-md">
          <div className="wrap flex h-[66px] items-center gap-4">
            <a href="#/home" aria-label="Elearn Hub home" className="shrink-0 transition-opacity hover:opacity-80">
             <Logo compact />
            </a>

            <div className="ml-2 hidden flex-1 justify-center lg:flex">
              <SearchBox />
            </div>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
              <a href="#/courses" className={cn("rounded-full px-3.5 py-2 text-[0.79rem] font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink", isActive("courses") && "bg-cream text-ink")}>Courses</a>
              <a href="#/paths" className={cn("hidden rounded-full px-3.5 py-2 text-[0.79rem] font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink lg:block", isActive("paths") && "bg-cream text-ink")}>Career tracks</a>
              <a href="#/contact" className={cn("rounded-full px-3.5 py-2 text-[0.79rem] font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink", isActive("contact") && "bg-cream text-ink")}>Contact us</a>
            </nav>

            <div className="ml-auto flex items-center gap-1 md:gap-2">
              <button type="button" onClick={() => setMobileSearch((s) => !s)} aria-label="Search" className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink lg:hidden">
                <Icon name="search" size={18} />
              </button>
              <a href="#/wishlist" aria-label={`Wishlist (${wishlistCount} items)`} className="relative hidden h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink md:grid">
                <Icon name="heart" size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[0.56rem] font-semibold text-white">{wishlistCount}</span>
                )}
              </a>
              <button type="button" onClick={() => setCartOpen(true)} aria-label={`Open cart (${cartCount} items)`} className="relative flex h-9 items-center gap-1.5 rounded-full px-2.5 text-ink-soft transition-colors hover:bg-cream hover:text-ink">
                <Icon name="bag" size={18} />
                <span className="hidden text-[0.76rem] font-medium sm:block">Bag</span>
                <span className={cn("grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[0.58rem] font-semibold", cartLoading ? "bg-cream-deep text-muted" : cartCount ? "bg-lime text-ink" : "bg-cream-deep text-muted")}>
                  {cartCount}
                </span>
              </button>
              <span className="mx-1 hidden h-6 w-px bg-line md:block" />
              {account ? (
                <div ref={accountRef} className="relative hidden md:block">
                  <button type="button" onClick={() => setAccountOpen((s) => !s)} aria-expanded={accountOpen} aria-label={`Account menu for ${account.name}`} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-cream">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-plum text-[0.6rem] font-bold text-lime">
                      {account.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                    <span className="max-w-[86px] truncate text-[0.76rem] font-medium text-ink">{account.name.split(" ")[0]}</span>
                    <Icon name="chevronDown" size={12} className={cn("text-muted transition-transform", accountOpen && "rotate-180")} />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-[240px] animate-pop overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_25px_50px_-25px_rgba(26,18,37,0.5)]">
                      <div className="border-b border-line bg-cream/60 px-3.5 py-3">
                        <p className="truncate text-[0.76rem] font-semibold">{account.name}</p>
                        <p className="truncate text-[0.62rem] text-muted">{account.email}</p>
                        <span className={cn("tag mt-1.5", account.role === "admin" ? "bg-plum text-lime" : "bg-lime/50 text-ink")}>
                          {account.role === "admin" ? "Administrator" : "User"}
                        </span>
                      </div>
                      <div className="p-1.5">
                        <a href={account.role === "admin" ? "#/admin" : "#/dashboard"} onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[0.74rem] font-medium text-ink-soft hover:bg-cream hover:text-ink">
                          <Icon name="layout" size={14} /> {account.role === "admin" ? "Admin console" : "My dashboard"}
                        </a>
                        <button type="button" onClick={() => { setAccountOpen(false); signOut(); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[0.74rem] font-medium text-coral hover:bg-cream">
                          <Icon name="logout" size={14} /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuth("user", "signin")}
                  className="btn hidden h-8 min-w-[104px] items-center justify-center rounded-full px-7 text-[0.78rem] sm:inline-flex"
                  style={{ background: "var(--color-lime)", color: "var(--color-ink)" }}
                >
                  Login <Icon name="arrowRight" size={13} />
                </button>
              )}
              <button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((s) => !s)} className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-cream xl:hidden">
                <Icon name={menuOpen ? "x" : "menu"} size={18} />
              </button>
            </div>
          </div>

          {mobileSearch && (
            <div className="wrap animate-fade pb-3 lg:hidden"><SearchBox mobile /></div>
          )}
        </div>

        <div className="hidden border-b border-line bg-paper/90 backdrop-blur-md xl:block">
          <div className="wrap flex h-11 items-center justify-between gap-4">
            <nav className="hide-scrollbar flex items-center gap-0.5 overflow-x-auto" aria-label="Course categories">
              <a href="#/courses" className={cn("flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.73rem] font-medium transition-colors hover:bg-cream hover:text-ink", route.startsWith("courses") ? "bg-cream text-ink" : "text-ink-soft")}>
                <Icon name="grid" size={13} className="text-coral" /> All courses
              </a>
              {categories.slice(0, 6).map((cat) => (
                <a key={cat.id} href={`#/courses?category=${cat.id}`} className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.73rem] font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-deep" />
                  {cat.name}
                </a>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-4 text-[0.73rem] font-medium text-ink-soft">
              <a href="#/wishlist" className="flex items-center gap-1.5 transition-colors hover:text-ink"><Icon name="heart" size={12} /> Wishlist</a>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="animate-fade border-b border-line bg-paper shadow-xl xl:hidden">
            <div className="wrap max-h-[calc(100vh-60px)] overflow-y-auto py-5">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-3">Learn</p>
                  <div className="grid gap-1">
                    {[
                      { label: "All courses", href: "courses", icon: "grid" },
                      { label: "Learning paths", href: "paths", icon: "route" },
                      { label: "Contact us", href: "contact", icon: "mail" },
                      ...(account ? [{ label: "My learning", href: "dashboard", icon: "graduation" }] : []),
                      ...(account?.role === "admin" ? [{ label: "Admin console", href: "admin", icon: "settings" }] : []),
                    ].map((item) => (
                      <a key={item.href} href={`#/${item.href}`} className="flex items-center gap-2.5 rounded-xl px-2 py-2.5 text-[0.85rem] font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink">
                        <Icon name={item.icon} size={16} className="text-muted" />
                        {item.label}
                        <Icon name="chevronRight" size={13} className="ml-auto text-muted" />
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="eyebrow mb-3">Browse categories</p>
                  <div className="grid gap-1">
                    {categories.slice(0, 6).map((cat) => (
                      <a key={cat.id} href={`#/courses?category=${cat.id}`} className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-[0.82rem] text-ink-soft transition-colors hover:bg-cream hover:text-ink">
                        <span className="grid h-6 w-6 place-items-center rounded-lg bg-cream"><Icon name="grid" size={13} /></span>
                        {cat.name}
                        <span className="ml-auto text-[0.66rem] text-muted">{cat.count}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 border-t border-line pt-5">
                {account ? (
                  <div className="grid grid-cols-2 gap-2">
                    <a href={account.role === "admin" ? "#/admin" : "#/dashboard"} className="btn btn-outline">
                      <Icon name="layout" size={15} /> {account.role === "admin" ? "Admin console" : "My dashboard"}
                    </a>
                    <button type="button" onClick={signOut} className="btn btn-primary">
                      <Icon name="logout" size={15} /> Sign out
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => openAuth("user", "signin")} className="btn btn-lime btn-block h-9">
                    Login <Icon name="arrowRight" size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}