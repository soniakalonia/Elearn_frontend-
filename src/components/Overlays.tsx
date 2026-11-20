import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/data";
import { absoluteUploadUrl } from "@/lib/api";
import { cn } from "@/utils/cn";

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    cartLoading,
    removeFromCart,
    navigate,
    toast,
  } = useShop();
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    if (cartOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const subtotal = cartItems.reduce((sum, it) => sum + it.price, 0);

  const handleRemove = async (courseId: number) => {
    setBusyId(courseId);
    await removeFromCart(courseId);
    setBusyId(null);
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your shopping bag">
      <button
        type="button"
        aria-label="Close cart"
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 animate-fade bg-ink/45 backdrop-blur-[2px]"
      />
      <aside className="animate-drawer absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Your learning bag</h2>
            <p className="text-[0.7rem] text-muted">
              {cartLoading ? "Loading…" : `${cartItems.length} ${cartItems.length === 1 ? "item" : "items"} ready when you are`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-paper text-ink transition-colors hover:bg-cream-deep"
          >
            <Icon name="x" size={17} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-lime/60 text-ink">
                <Icon name="bag" size={28} />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">Your bag is waiting</h3>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-muted">
                Add a course and it will show up here. No cart survives a browser refresh — it is saved to your account.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate("courses");
                }}
                className="btn btn-primary mt-6"
              >
                Browse courses <Icon name="arrowRight" size={15} />
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {cartItems.map((item) => (
                <li key={item.id} className="card flex gap-3 p-3">
                  {item.imageUrl ? (
                    <img src={absoluteUploadUrl(item.imageUrl)} alt="" className="h-[68px] w-[84px] shrink-0 rounded-xl object-cover" />
                  ) : (
                    <span className="grid h-[68px] w-[84px] shrink-0 place-items-center rounded-xl bg-plum text-lime">
                      <Icon name="sparkle" size={24} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCartOpen(false);
                          navigate(`course/${item.courseId}`);
                        }}
                        className="line-clamp-2 text-left font-display text-[0.84rem] font-semibold leading-snug text-ink hover:underline"
                      >
                        {item.title}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.courseId)}
                        disabled={busyId === item.courseId}
                        aria-label={`Remove ${item.title}`}
                        className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-cream-deep hover:text-coral disabled:opacity-50"
                      >
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="rounded bg-cream px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wide text-ink-soft">
                        Course
                      </span>
                      <span className="font-display text-[0.9rem] font-semibold text-ink">{formatINR(item.price)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-line bg-paper px-5 pb-5 pt-4">
            <dl className="space-y-1.5 text-[0.8rem]">
              <div className="flex justify-between text-ink-soft">
                <dt>Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between border-t border-line-soft pt-2 font-semibold text-ink">
                <dt>Total</dt>
                <dd className="font-display text-lg">{formatINR(subtotal)}</dd>
              </div>
            </dl>
            <p className="mb-3 mt-1 text-[0.62rem] text-muted">GST included · instant access · 7-day money-back</p>
            <button
              type="button"
              onClick={() => {
                setCartOpen(false);
                navigate("cart");
              }}
              className="btn btn-primary btn-block"
            >
              Review & checkout <Icon name="arrowRight" size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                setCartOpen(false);
                toast("Bag saved — your items stay here until you check out", "info");
              }}
              className="mt-2 w-full text-center text-[0.7rem] text-muted transition-colors hover:text-ink"
            >
              Continue browsing
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export function Toasts() {
  const { toasts, dismissToast } = useShop();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-5 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="animate-toast pointer-events-auto flex w-full max-w-[22rem] items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-3 shadow-[0_20px_50px_-20px_rgba(26,18,37,0.5)]"
        >
          <span
            className={cn(
              "grid h-7 w-7 shrink-0 place-items-center rounded-full",
              t.tone === "success" && "bg-lime text-ink",
              t.tone === "info" && "bg-sky/60 text-ink",
              t.tone === "error" && "bg-coral/15 text-coral",
            )}
          >
            <Icon name={t.tone === "success" ? "check" : t.tone === "info" ? "info" : "alert"} size={14} strokeWidth={2.2} />
          </span>
          <p className="flex-1 text-[0.78rem] font-medium leading-snug text-ink">{t.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss notification"
            className="text-muted transition-colors hover:text-ink"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}