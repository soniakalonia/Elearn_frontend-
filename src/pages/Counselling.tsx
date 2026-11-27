import { useEffect, useMemo, useState } from "react";
import { useShop } from "@/lib/store";
import {
  api,
  loadRazorpayScript,
  absoluteUploadUrl,
  type CounsellingPlan,
  type CounsellingOptions,
} from "@/lib/api";

const TIME_SLOTS = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM",
];

export default function Counselling() {
  const { account, navigate, toast, openAuth } = useShop();

  const [plans, setPlans] = useState<CounsellingPlan[]>([]);
  const [questions, setQuestions] = useState<CounsellingOptions>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step: 0 = Q1, 1 = Q2, ... then Duration, Slot, Details, ThankYou
  const [step, setStep] = useState<number>(0);

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId) || null,
    [plans, selectedPlanId]
  );

  useEffect(() => {
    (async () => {
      try {
        const [pRes, oRes] = await Promise.all([
          api.counsellingPlans(),
          api.counsellingOptions(),
        ]);
        setPlans(pRes.plans);
        setQuestions(oRes.questions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load counselling");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (account) {
      setName(account.name || "");
      setEmail(account.email || "");
    }
  }, [account]);

  if (!account) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Counselling Sessions</h1>
        <p className="mt-2 text-slate-600">Please sign in to book a counselling session.</p>
        <button
          onClick={() => openAuth("user", "signin")}
          className="mt-6 rounded-xl bg-black px-6 py-3 text-white"
        >
          Sign in to continue
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-center">Loading…</div>;
  }

  if (error || plans.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Counselling sessions</h1>
        <p className="mt-2 text-slate-600">{error || "Counselling pricing is not configured yet."}</p>
        <button onClick={() => navigate("home")} className="mt-6 rounded-xl border px-6 py-3">
          Back to home
        </button>
      </div>
    );
  }

  // Total Steps = Number of Questions + Duration + Slot + Details + ThankYou
  const totalSteps = questions.length + 4;
  const durationStep = questions.length;
  const slotStep = questions.length + 1;
  const detailsStep = questions.length + 2;
  const thankYouStep = questions.length + 3;

  const canGoNext = (() => {
    // Question steps
    if (step < questions.length) {
      return !!answers[questions[step].id];
    }
    // Duration step
    if (step === durationStep) return !!selectedPlanId;
    // Slot step
    if (step === slotStep) return !!preferredDate && (!!preferredTime || !!customTime.trim());
    // Details step
    if (step === detailsStep)
      return (
        name.trim().length >= 2 &&
        /^\S+@\S+\.\S+$/.test(email) &&
        /^[0-9+\-\s()]{8,20}$/.test(phone)
      );
    return true;
  })();

  const finalTime = customTime.trim() || preferredTime;

  const handlePayAndConfirm = async () => {
    if (!selectedPlan) return;
    setSubmitting(true);
    try {
      const created = await api.counsellingCreateBooking({
        planId: selectedPlan.id,
        answers,
        preferredDate,
        preferredTime: finalTime,
        contactName: name.trim(),
        contactEmail: email.trim(),
        contactPhone: phone.trim(),
      });

      await loadRazorpayScript();

      const rzp = new (window as any).Razorpay({
        key: created.payment.razorpayKey,
        amount: Math.round(created.payment.amount * 100),
        currency: "INR",
        name: "ElearnHub Counselling",
        description: `${selectedPlan.durationMinutes} min counselling (pre-payment)`,
        order_id: created.payment.razorpayOrderId,
        prefill: created.payment.prefill,
        notes: created.payment.notes,
        theme: { color: "#111827" },
        handler: async (response: any) => {
          try {
            await api.counsellingVerifyPre(created.booking.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setBookingCode(created.booking.bookingCode);
            setStep(thankYouStep);
            toast("Counselling booked successfully");
          } catch (err) {
            toast("Verification failed", "error");
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            toast("Payment cancelled", "info");
          },
        },
      });
      rzp.open();
    } catch (err) {
      toast("Booking failed", "error");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Book a Counselling Session</h1>
      <p className="mt-1 text-sm text-slate-600">
        Step {Math.min(step + 1, totalSteps)} of {totalSteps}
      </p>

      {/* Progress bar */}
      <div className="mt-4 flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${step >= i ? "bg-black" : "bg-slate-200"}`}
          />
        ))}
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        {/* DYNAMIC QUESTIONS */}
        {step < questions.length && (() => {
          const q = questions[step];
          if (!q) return null;
          return (
            <div>
              <h2 className="text-lg font-semibold">{q.questionText}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {q.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: String(opt.id) }))}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                      answers[q.id] === String(opt.id)
                        ? "border-black bg-black text-white"
                        : "hover:border-slate-400"
                    }`}
                  >
                    {opt.imageUrl && (
                      <img
                        src={absoluteUploadUrl(opt.imageUrl)}
                        alt={opt.label}
                        className="h-8 w-8 object-contain"
                      />
                    )}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* DURATION */}
        {step === durationStep && (
          <div>
            <h2 className="text-lg font-semibold">Choose duration</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedPlanId === p.id ? "border-black ring-2 ring-black" : "hover:border-slate-400"
                  }`}
                >
                  <div className="text-sm text-slate-500">{p.durationMinutes} minutes</div>
                  <div className="mt-2 text-2xl font-semibold">₹{p.preAmount}</div>
                  <div className="text-xs text-slate-500">advance (pre-pay)</div>
                  <div className="mt-2 text-sm">Total ₹{p.totalAmount}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SLOT */}
        {step === slotStep && (
          <div>
            <h2 className="text-lg font-semibold">Select date and time</h2>
            <div className="mt-4">
              <label className="text-sm font-medium">Preferred date</label>
              <input
                type="date"
                value={preferredDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="mt-1 w-full rounded-xl border px-4 py-3"
              />
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">Preferred time</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setPreferredTime(t);
                      setCustomTime("");
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      preferredTime === t && !customTime ? "border-black bg-black text-white" : ""
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                value={customTime}
                onChange={(e) => {
                  setCustomTime(e.target.value);
                  setPreferredTime("");
                }}
                placeholder="Or type custom time"
                className="mt-3 w-full rounded-xl border px-4 py-3"
              />
            </div>
          </div>
        )}

        {/* DETAILS */}
        {step === detailsStep && (
          <div>
            <h2 className="text-lg font-semibold">Your details</h2>
            <div className="mt-4 space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border px-4 py-3"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border px-4 py-3"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>
            {selectedPlan && (
              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span>Duration</span>
                  <b>{selectedPlan.durationMinutes} min</b>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Total</span>
                  <b>₹{selectedPlan.totalAmount}</b>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Pay now (advance)</span>
                  <b>₹{selectedPlan.preAmount}</b>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Remaining</span>
                  <b>₹{selectedPlan.remainingAmount}</b>
                </div>
              </div>
            )}
          </div>
        )}

        {/* THANK YOU */}
        {step === thankYouStep && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✅
            </div>
            <h2 className="text-xl font-semibold">Thank you! Your booking is confirmed.</h2>
            <p className="mt-2 text-sm text-slate-600">
              Booking code: <b>{bookingCode}</b>
            </p>
            <p className="mt-4 text-sm text-slate-700">
              You will receive the meeting link before 30 minutes of your session.
            </p>
            <button
              onClick={() => navigate("my-bookings")}
              className="mt-6 rounded-xl bg-black px-6 py-3 text-white"
            >
              Go to My Bookings
            </button>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        {step < thankYouStep && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => (s > 0 ? s - 1 : s))}
              disabled={step === 0}
              className="rounded-xl border px-5 py-2.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            {step < detailsStep ? (
              <button
                onClick={() => setStep((s) => (s < detailsStep ? s + 1 : s))}
                disabled={!canGoNext}
                className="rounded-xl bg-black px-5 py-2.5 text-sm text-white disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handlePayAndConfirm}
                disabled={!canGoNext || submitting}
                className="rounded-xl bg-black px-5 py-2.5 text-sm text-white disabled:opacity-40"
              >
                {submitting ? "Processing…" : `Pay ₹${selectedPlan?.preAmount ?? 0} now`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}