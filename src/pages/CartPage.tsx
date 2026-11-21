import { useState } from "react";
import Icon from "@/components/Icon";
import { Breadcrumbs, CourseCard, EmptyState, Reveal } from "@/components/Primitives";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/data";
import { absoluteUploadUrl, api, loadRazorpayScript } from "@/lib/api";
import { cn } from "@/utils/cn";

const steps = ["Your bag", "Details & payment", "Access"] as const;

const COUNTRIES = [
  "India",
  "United Arab Emirates",
  "United States",
  "United Kingdom",
  "Singapore",
  "Canada",
  "Australia",
  "Germany",
  "Netherlands",
  "Other",
];

export default function CartPage() {
  const {
    cartItems,
    cartLoading,
    removeFromCart,
    navigate,
    toast,
    account,
    courses,
    addToCart,
    inWishlist,
    toggleWishlist,
    refreshCart,
    refreshEnrollments,
    refreshOrders,
  } = useShop();

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({
    name: account?.name ?? "",
    email: account?.email ?? "",
    phone: "",
    country: "India",
  });
  const [order, setOrder] = useState<{
    orderCode: string;
    total: number;
    email: string;
    paymentId: string;
  } | null>(null);

  const subtotal = cartItems.reduce((sum, it) => sum + it.price, 0);
  const total = subtotal;

  const setField = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const validateForm = (): string | null => {
    if (!form.name.trim() || form.name.trim().length < 2) return "Please enter your full name";
    if (!form.email.includes("@") || !form.email.includes(".")) return "Please enter a valid email address";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 8) return "Please enter a valid phone number";
    if (!form.country) return "Please select a country";
    return null;
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paying) return;

    if (!account) {
      toast("Please sign in to complete your purchase", "error");
      navigate("cart"); // no-op if already on cart
      return;
    }
    if (cartItems.length === 0) {
      toast("Your cart is empty", "error");
      return;
    }

    const v = validateForm();
    if (v) {
      toast(v, "error");
      return;
    }

    setPaying(true);
    try {
      // 1. Create Razorpay order on backend
      const created = await api.createRazorpayOrder({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        country: form.country,
      });

      // 2. Load Razorpay checkout script
      await loadRazorpayScript();

      // 3. Open modal
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: created.key,
          amount: created.amount,
          currency: created.currency,
          name: "ElearnHub",
          description: `Order ${created.orderCode}`,
          order_id: created.razorpayOrderId,
          prefill: created.prefill,
          notes: created.notes,
          theme: { color: "#1A1225" },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
          handler: (response) => {
            (async () => {
              try {
                const verified = await api.verifyRazorpayPayment({
                  orderId: created.orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                setOrder({
                  orderCode: verified.orderCode,
                  total: verified.total,
                  email: form.email,
                  paymentId: response.razorpay_payment_id,
                });
                setStep(2);
                window.scrollTo({ top: 0, behavior: "smooth" });
                toast("Payment successful — welcome to your new course");
                // Refresh background state so dashboard reflects new enrollments
                await Promise.all([
                  refreshCart(),
                  refreshEnrollments(),
                  refreshOrders(),
                ]);
                resolve();
              } catch (err) {
                reject(err);
              }
            })();
          },
        });
        rzp.open();
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg.toLowerCase().includes("cancel")) {
        toast("Payment cancelled — no money was taken", "info");
      } else {
        toast(msg, "error");
      }
    } finally {
      setPaying(false);
    }
  };

  // ---------- Success screen ----------
  if (step === 2 && order) {
    return (
      <div className="wrap py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          <div className="card overflow-hidden">
            <div className="relative bg-plum px-6 py-8 text-center text-white">
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-lime/10 blur-2xl" />
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-lime text-ink">
                <Icon name="check" size={30} strokeWidth={2.5} />
              </span>
              <p className="eyebrow mt-4 text-lime">Payment successful</p>
              <h1 className="display mt-1.5 text-[clamp(1.9rem,4vw,2.7rem)] text-white">
                You're in. Let's build something.
              </h1>
              <p className="mx-auto mt-2 max-w-md text-[0.85rem] leading-relaxed text-white/60">
                Your receipt and access links are on their way to{" "}
                <span className="font-medium text-white">{order.email}</span>.
              </p>
            </div>
            <div className="p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Order ID", value: order.orderCode },
                  { label: "Amount paid", value: formatINR(order.total) },
                  { label: "Payment ID", value: order.paymentId.slice(0, 12) + "…" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-cream px-3 py-2.5">
                    <p className="text-[0.6rem] uppercase tracking-[0.1em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-0.5 truncate font-display text-[0.85rem] font-semibold">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("dashboard")}
                  className="btn btn-primary sm:flex-1"
                >
                  Go to my learning <Icon name="arrowRight" size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("courses")}
                  className="btn btn-outline sm:flex-1"
                >
                  Browse more courses
                </button>
              </div>
              <p className="mt-3 text-center text-[0.62rem] text-muted">
                A receipt has been emailed to {order.email}.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Main cart / checkout ----------
  return (
    <div className="wrap py-6 md:py-9">
      <Breadcrumbs items={[{ label: "Your bag" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display text-[clamp(2rem,4vw,2.9rem)]">Your learning bag</h1>
          <p className="mt-1 text-[0.84rem] text-muted">
            {cartLoading
              ? "Loading…"
              : cartItems.length === 0
              ? "Nothing here yet — your next skill is one click away."
              : `${cartItems.length} item${cartItems.length > 1 ? "s" : ""} · instant access after payment`}
          </p>
        </div>
        <a href="#/courses" className="btn btn-sm btn-outline">
          <Icon name="arrowLeft" size={13} /> Keep browsing
        </a>
      </div>

      <div className="mt-5 flex items-center gap-2 overflow-x-auto border-y border-line py-3 text-[0.7rem]">
        {steps.map((label, i) => (
          <div key={label} className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "grid h-5 w-5 place-items-center rounded-full text-[0.6rem] font-semibold",
                i <= step ? "bg-ink text-white" : "bg-cream-deep text-muted"
              )}
            >
              {i < step ? <Icon name="check" size={10} strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn("font-medium", i <= step ? "text-ink" : "text-muted")}>{label}</span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-8 bg-line sm:w-16" />}
          </div>
        ))}
      </div>

      {cartItems.length === 0 && step === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon="bag"
            title="Your bag is empty"
            copy="Pick a course, follow a career track, or start a Pro membership for the entire catalogue."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("courses")}
                  className="btn btn-primary"
                >
                  Browse courses
                </button>
                <button
                  type="button"
                  onClick={() => navigate("pricing")}
                  className="btn btn-outline"
                >
                  See pricing
                </button>
              </div>
            }
          />
          {courses.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-[1.25rem] font-semibold">Popular right now</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.slice(0, 3).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1fr_354px]">
          <div>
            {step === 0 ? (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="card flex flex-col gap-3 p-3.5 sm:flex-row sm:items-stretch">
                    {item.imageUrl ? (
                      <button
                        type="button"
                        onClick={() => navigate(`course/${item.courseId}`)}
                        className="block shrink-0 overflow-hidden rounded-xl"
                      >
                        <img
                          src={absoluteUploadUrl(item.imageUrl)}
                          alt=""
                          className="h-[110px] w-full object-cover sm:h-[96px] sm:w-[150px]"
                        />
                      </button>
                    ) : (
                      <span className="grid h-[110px] w-full shrink-0 place-items-center rounded-xl bg-plum text-lime sm:h-[96px] sm:w-[150px]">
                        <Icon name="sparkle" size={30} />
                      </span>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="tag bg-cream text-ink-soft">Course</span>
                          <button
                            type="button"
                            onClick={() => navigate(`course/${item.courseId}`)}
                            className="mt-1 block text-left font-display text-[0.95rem] font-semibold leading-snug hover:underline"
                          >
                            {item.title}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.courseId)}
                          aria-label={`Remove ${item.title}`}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted hover:bg-cream hover:text-coral"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3 text-[0.66rem] text-muted">
                          <span className="flex items-center gap-1">
                            <Icon name="infinity" size={11} /> 12-month access
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item.courseId)}
                            className="flex items-center gap-1 hover:text-ink"
                          >
                            <Icon name="heart" size={11} />{" "}
                            {inWishlist(item.courseId) ? "Saved" : "Save for later"}
                          </button>
                        </div>
                        <span className="font-display text-[1rem] font-semibold">
                          {formatINR(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-paper px-4 py-3 text-[0.68rem] text-muted">
                  <span className="flex items-center gap-1.5">
                    <Icon name="shieldCheck" size={13} className="text-plum" /> 7-day money-back
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="lock" size={13} className="text-plum" /> Secure checkout
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="receipt" size={13} className="text-plum" /> GST invoice
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="clock" size={13} className="text-plum" /> Instant access
                  </span>
                </div>
              </div>
            ) : (
              <form id="checkout-form" onSubmit={placeOrder} className="space-y-4">
                <div className="card p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-[1.1rem] font-semibold">Your details</h2>
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-[0.68rem] font-medium text-muted hover:text-ink"
                    >
                      Back to bag
                    </button>
                  </div>
                  <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                    <div className="field">
                      <label htmlFor="co-name">Full name *</label>
                      <input
                        id="co-name"
                        value={form.name}
                        onChange={(e) => setField({ name: e.target.value })}
                        className="input"
                        required
                        disabled={paying}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="co-email">Email address *</label>
                      <input
                        id="co-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setField({ email: e.target.value })}
                        className="input"
                        required
                        disabled={paying}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="co-phone">Phone number *</label>
                      <input
                        id="co-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setField({ phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="input"
                        required
                        disabled={paying}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="co-country">Country *</label>
                      <select
                        id="co-country"
                        className="select"
                        value={form.country}
                        onChange={(e) => setField({ country: e.target.value })}
                        disabled={paying}
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="card p-5">
                  <h2 className="font-display text-[1.1rem] font-semibold">Payment</h2>
                  <p className="mt-0.5 text-[0.68rem] text-muted">
                    UPI, cards, net banking and wallets — processed securely by Razorpay.
                  </p>
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-paper p-3 text-[0.72rem] text-muted">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-cream">
                      <Icon name="shieldCheck" size={16} className="text-plum" />
                    </span>
                    <span>
                      You'll be redirected to Razorpay's secure checkout to complete the payment.
                    </span>
                  </div>
                </div>

                <div className="card p-5">
                  <label className="flex cursor-pointer items-start gap-2 text-[0.72rem] leading-relaxed text-muted">
                    <input type="checkbox" required className="mt-0.5 h-3.5 w-3.5 accent-ink" />
                    <span>
                      I accept the{" "}
                      <a href="#/legal/terms" className="font-medium text-ink underline underline-offset-2">
                        Terms
                      </a>
                      ,{" "}
                      <a href="#/legal/refund" className="font-medium text-ink underline underline-offset-2">
                        Refund policy
                      </a>{" "}
                      and{" "}
                      <a href="#/legal/privacy" className="font-medium text-ink underline underline-offset-2">
                        Privacy policy
                      </a>
                      .
                    </span>
                  </label>
                  <button type="submit" className="btn btn-primary btn-block mt-4" disabled={paying}>
                    {paying ? (
                      <>
                        Opening Razorpay… <Icon name="loader" size={14} />
                      </>
                    ) : (
                      <>
                        Pay {formatINR(total)} with Razorpay <Icon name="lock" size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="lg:sticky lg:top-[78px] xl:top-[122px]">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line bg-cream/60 px-4 py-3">
                <h2 className="font-display text-[1rem] font-semibold">Order summary</h2>
                <span className="text-[0.64rem] text-muted">
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3 p-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-2 text-[0.74rem]">
                    <span className="min-w-0 flex-1 text-ink-soft">
                      <span className="line-clamp-2">{item.title}</span>
                    </span>
                    <span className="shrink-0 font-medium">{formatINR(item.price)}</span>
                  </div>
                ))}
                <div className="hairline" />
                <dl className="space-y-1.5 text-[0.76rem]">
                  <div className="flex justify-between text-ink-soft">
                    <dt>Subtotal</dt>
                    <dd>{formatINR(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-muted">
                    <dt>GST</dt>
                    <dd>Included</dd>
                  </div>
                  <div className="flex justify-between border-t border-line-soft pt-2 font-semibold text-ink">
                    <dt>Total</dt>
                    <dd className="font-display text-xl">{formatINR(total)}</dd>
                  </div>
                </dl>
                {step === 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="btn btn-primary btn-block"
                  >
                    Proceed to checkout <Icon name="arrowRight" size={15} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="checkout-form"
                    className="btn btn-primary btn-block"
                    disabled={paying}
                  >
                    {paying ? "Processing…" : <>Pay {formatINR(total)} <Icon name="lock" size={14} /></>}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate("courses")}
                  className="w-full text-center text-[0.68rem] text-muted hover:text-ink"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {cartItems.length > 0 && step === 0 && courses.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-[1.3rem] font-semibold">Learners often add these</h2>
            <a href="#/courses" className="text-[0.7rem] font-semibold text-ink hover:underline">
              View all courses
            </a>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses
              .filter((c) => !cartItems.some((line) => line.courseId === c.id))
              .slice(0, 3)
              .map((course) => (
                <Reveal key={course.id}>
                  <CourseCard course={course} />
                </Reveal>
              ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3">
            <p className="text-[0.72rem] text-muted">
              Already have a coupon? Discounts are added at checkout.
            </p>
            <button
              type="button"
              onClick={() => addToCart(courses[0].id)}
              className="btn btn-sm btn-outline"
            >
              <Icon name="bag" size={13} /> Add another course
            </button>
          </div>
        </section>
      )}
    </div>
  );
}