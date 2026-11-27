import { useEffect, useState } from "react";
import { useShop } from "@/lib/store";
import { api, loadRazorpayScript, type CounsellingBooking } from "@/lib/api";

export default function MyBookings() {
  const { account, navigate, toast, openAuth } = useShop();
  const [bookings, setBookings] = useState<CounsellingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try { const res = await api.counsellingMyBookings(); setBookings(res.bookings); } catch (err) { toast("Failed to load bookings", "error"); } finally { setLoading(false); }
  };

  useEffect(() => { if (account) load(); }, [account]);

  if (!account) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">My Counselling Bookings</h1>
        <p className="mt-2 text-slate-600">Please sign in to view your bookings.</p>
        <button onClick={() => openAuth("user", "signin")} className="mt-6 rounded-xl bg-black px-6 py-3 text-white">Sign in</button>
      </div>
    );
  }

  const payRemaining = async (booking: CounsellingBooking) => {
    setBusyId(booking.id);
    try {
      const res = await api.counsellingPayPost(booking.id);
      if (res.alreadyCompleted) { toast("Booking already completed"); await load(); return; }
      await loadRazorpayScript();
      const payment = res.payment!;
      const rzp = new (window as any).Razorpay({
        key: payment.razorpayKey, amount: Math.round(payment.amount * 100), currency: "INR",
        name: "ElearnHub Counselling", description: `Remaining payment — ${booking.durationMinutes} min`,
        order_id: payment.razorpayOrderId, prefill: payment.prefill, notes: payment.notes, theme: { color: "#111827" },
        handler: async (response: any) => {
          try {
            await api.counsellingVerifyPost(booking.id, { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature });
            toast("Remaining payment completed");
            await load();
          } catch (err) { toast("Verification failed", "error"); } finally { setBusyId(null); }
        },
        modal: { ondismiss: () => { setBusyId(null); toast("Payment cancelled", "info"); } },
      });
      rzp.open();
    } catch (err) { toast("Failed", "error"); setBusyId(null); }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Counselling Bookings</h1>
        <button onClick={() => navigate("counselling")} className="rounded-xl bg-black px-4 py-2 text-sm text-white">Book new</button>
      </div>
      {loading ? <div className="mt-8 text-center">Loading…</div> : bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border bg-white p-8 text-center">
          <p className="text-slate-600">You have no counselling bookings yet.</p>
          <button onClick={() => navigate("counselling")} className="mt-4 rounded-xl border px-5 py-2 text-sm">Book your first session</button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">{b.bookingCode}</div>
                  <div className="mt-1 text-lg font-semibold">{b.durationMinutes} min Counselling Session</div>
                  <div className="mt-1 text-sm text-slate-600">{b.preferredDate} · {b.preferredTime}</div>
                  {b.answers && Object.keys(b.answers).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
                      {Object.entries(b.answers).map(([qId, answer]) => (
                        <span key={qId} className="rounded-md bg-slate-100 px-2 py-1 text-xs">{String(answer)}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${b.status === "COMPLETED" ? "bg-green-100 text-green-700" : b.status === "PRE_PAID" ? "bg-blue-100 text-blue-700" : b.status === "CANCELLED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800"}`}>{b.status}</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Total</div><div className="font-semibold">₹{b.totalAmount}</div></div>
                <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Paid (advance)</div><div className="font-semibold">₹{b.preAmount}</div></div>
                <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Remaining</div><div className="font-semibold">₹{b.remainingAmount}</div></div>
              </div>
              {b.status === "PRE_PAID" && b.remainingAmount > 0 && (
                <button onClick={() => payRemaining(b)} disabled={busyId === b.id} className="mt-4 rounded-xl bg-black px-5 py-2.5 text-sm text-white disabled:opacity-50">{busyId === b.id ? "Processing…" : `Pay remaining ₹${b.remainingAmount}`}</button>
              )}
              {b.status === "COMPLETED" && <div className="mt-4 text-sm text-green-700">Fully paid · Completed</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}