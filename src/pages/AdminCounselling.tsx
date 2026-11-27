import { useEffect, useMemo, useState } from "react";
import { useShop } from "@/lib/store";
import {
  api,
  absoluteUploadUrl,
  type CounsellingPlan,
  type CounsellingQuestion,
  type CounsellingBooking,
} from "@/lib/api";

type Tab = "pricing" | "questions" | "bookings";
type Range = "today" | "7d" | "1m" | "all";

export default function AdminCounselling() {
  const { account, toast, navigate } = useShop();
  const [tab, setTab] = useState<Tab>("pricing");

  if (account?.role !== "admin") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Admin access required</h1>
        <button onClick={() => navigate("home")} className="mt-6 rounded-xl border px-6 py-3">Go home</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Counselling — Admin</h1>
      <div className="mt-4 flex gap-2">
        {(["pricing", "questions", "bookings"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-xl px-4 py-2 text-sm capitalize ${tab === t ? "bg-black text-white" : "border"}`}>{t}</button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "pricing" && <PricingTab toast={toast} />}
        {tab === "questions" && <QuestionsTab toast={toast} />}
        {tab === "bookings" && <BookingsTab toast={toast} />}
      </div>
    </div>
  );
}

/* PRICING */
function PricingTab({ toast }: { toast: (msg: string, tone?: any) => void }) {
  const [plans, setPlans] = useState<CounsellingPlan[]>([]);
  const [edits, setEdits] = useState<Record<number, { pre: string; total: string }>>({});
  const [newPlan, setNewPlan] = useState({ duration: "", pre: "", total: "" });
  const [saving, setSaving] = useState<number | null>(null);

  const load = async () => {
    const res = await api.adminCounsellingPlans();
    setPlans(res.plans);
    const map: Record<number, { pre: string; total: string }> = {};
    res.plans.forEach((p) => { map[p.id] = { pre: String(p.preAmount), total: String(p.totalAmount) }; });
    setEdits(map);
  };

  useEffect(() => { load().catch((e) => toast(e.message, "error")); }, []);

  const save = async (id: number, duration: number) => {
    const e = edits[id];
    if (!e) return;
    setSaving(id);
    try {
      await api.adminCounsellingUpdatePlan(duration, { preAmount: Number(e.pre), totalAmount: Number(e.total), isActive: true });
      toast("Plan updated");
      await load();
    } catch (err) { toast("Update failed", "error"); } finally { setSaving(null); }
  };

  const addPlan = async () => {
    if (!newPlan.duration || !newPlan.pre || !newPlan.total) return;
    setSaving(-1);
    try {
      await api.adminCounsellingUpdatePlan(Number(newPlan.duration), { preAmount: Number(newPlan.pre), totalAmount: Number(newPlan.total), isActive: true });
      toast(`New ${newPlan.duration} min plan added!`);
      setNewPlan({ duration: "", pre: "", total: "" });
      await load();
    } catch (err) { toast("Add failed", "error"); } finally { setSaving(null); }
  };

  const deletePlan = async (id: number) => {
    if (!window.confirm("Delete this plan?")) return;
    try { await api.adminCounsellingDeletePlan(id); toast("Deleted"); await load(); } catch (err) { toast("Delete failed", "error"); }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Add New Time Slot</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input value={newPlan.duration} onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })} placeholder="Duration (mins)" type="number" className="rounded-lg border px-3 py-2 text-sm w-32" />
          <input value={newPlan.pre} onChange={(e) => setNewPlan({ ...newPlan, pre: e.target.value })} placeholder="Pre-amount (₹)" type="number" className="rounded-lg border px-3 py-2 text-sm w-32" />
          <input value={newPlan.total} onChange={(e) => setNewPlan({ ...newPlan, total: e.target.value })} placeholder="Total (₹)" type="number" className="rounded-lg border px-3 py-2 text-sm w-32" />
          <button onClick={addPlan} disabled={saving === -1} className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50">{saving === -1 ? "Adding…" : "Add Slot"}</button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Manage Existing Plans</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-2">Duration</th>
                <th className="py-2">Pre-amount (₹)</th>
                <th className="py-2">Total amount (₹)</th>
                <th className="py-2">Remaining</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => {
                const edit = edits[p.id] || { pre: "", total: "" };
                const remaining = Number(edit.total || 0) - Number(edit.pre || 0);
                return (
                  <tr key={p.id} className="border-b">
                    <td className="py-3">{p.durationMinutes} min</td>
                    <td className="py-3"><input value={edit.pre} onChange={(e) => setEdits((prev) => ({ ...prev, [p.id]: { ...prev[p.id], pre: e.target.value } }))} type="number" className="w-24 rounded-lg border px-3 py-1.5" /></td>
                    <td className="py-3"><input value={edit.total} onChange={(e) => setEdits((prev) => ({ ...prev, [p.id]: { ...prev[p.id], total: e.target.value } }))} type="number" className="w-24 rounded-lg border px-3 py-1.5" /></td>
                    <td className="py-3">₹{remaining > 0 ? remaining : 0}</td>
                    <td className="py-3 text-right space-x-2">
                      <button onClick={() => save(p.id, p.durationMinutes)} disabled={saving === p.id} className="rounded-lg bg-black px-3 py-1.5 text-xs text-white disabled:opacity-50">{saving === p.id ? "Saving…" : "Save"}</button>
                      <button onClick={() => deletePlan(p.id)} className="rounded-lg border border-red-500 px-3 py-1.5 text-xs text-red-500">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* QUESTIONS */
function QuestionsTab({ toast }: { toast: (msg: string, tone?: any) => void }) {
  const [questions, setQuestions] = useState<CounsellingQuestion[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [optionForm, setOptionForm] = useState<Record<number, { label: string; file: File | null }>>({});
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [editOptionLabel, setEditOptionLabel] = useState("");

  const load = async () => {
    const res = await api.adminCounsellingQuestions();
    setQuestions(res.questions);
  };

  useEffect(() => { load().catch((e) => toast(e.message, "error")); }, []);

  const addQuestion = async () => {
    if (!newQuestionText.trim()) return;
    setBusy(true);
    try {
      await api.adminCounsellingCreateQuestion({ questionText: newQuestionText, sortOrder: questions.length + 1 });
      toast("Question added");
      setNewQuestionText("");
      await load();
    } catch (err) { toast("Failed", "error"); } finally { setBusy(false); }
  };

  const saveQuestion = async (id: number) => {
    if (!editQuestionText.trim()) return;
    setBusy(true);
    try {
      await api.adminCounsellingUpdateQuestion(id, { questionText: editQuestionText });
      toast("Question updated");
      setEditingQuestion(null);
      await load();
    } catch (err) { toast("Failed", "error"); } finally { setBusy(false); }
  };

  const deleteQuestion = async (id: number) => {
    if (!window.confirm("Delete this question and all its options?")) return;
    try { await api.adminCounsellingDeleteQuestion(id); toast("Deleted"); await load(); } catch (err) { toast("Failed", "error"); }
  };

  const addOption = async (questionId: number) => {
    const form = optionForm[questionId];
    if (!form || !form.label.trim()) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("questionId", String(questionId));
      fd.append("label", form.label.trim());
      if (form.file) fd.append("image", form.file);
      await api.adminCounsellingCreateOption(fd);
      toast("Option added");
      setOptionForm(prev => ({ ...prev, [questionId]: { label: "", file: null } }));
      await load();
    } catch (err) { toast("Failed to add option", "error"); } finally { setBusy(false); }
  };

  const saveOption = async (id: number) => {
    if (!editOptionLabel.trim()) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("label", editOptionLabel);
      await api.adminCounsellingUpdateOption(id, fd);
      toast("Option updated");
      setEditingOption(null);
      await load();
    } catch (err) { toast("Failed", "error"); } finally { setBusy(false); }
  };

  const deleteOption = async (id: number) => {
    if (!window.confirm("Delete this option?")) return;
    try { await api.adminCounsellingDeleteOption(id); toast("Deleted"); await load(); } catch (err) { toast("Failed", "error"); }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Add a New Question</h2>
        <div className="mt-4 flex gap-2">
          <input value={newQuestionText} onChange={(e) => setNewQuestionText(e.target.value)} placeholder="e.g. What is your interest area?" className="flex-1 rounded-lg border px-3 py-2 text-sm" />
          <button onClick={addQuestion} disabled={busy} className="rounded-lg bg-black px-4 py-2 text-sm text-white">Add Question</button>
        </div>
      </div>

      {questions.map((q, index) => (
        <div key={q.id} className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between border-b pb-2">
            {editingQuestion === q.id ? (
              <div className="flex gap-2 flex-1">
                <input value={editQuestionText} onChange={(e) => setEditQuestionText(e.target.value)} className="flex-1 rounded border px-2 py-1 text-sm" />
                <button onClick={() => saveQuestion(q.id)} className="rounded bg-black px-3 py-1 text-xs text-white">Save</button>
                <button onClick={() => setEditingQuestion(null)} className="rounded border px-3 py-1 text-xs">Cancel</button>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-lg">Step {index + 1}: {q.questionText}</h3>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingQuestion(q.id); setEditQuestionText(q.questionText); }} className="text-sm font-medium text-blue-600">Edit</button>
                  <button onClick={() => deleteQuestion(q.id)} className="text-sm font-medium text-red-600">Delete</button>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {q.options.map(opt => (
              <div key={opt.id} className="relative flex flex-col items-center rounded border p-3">
                {opt.imageUrl && <img src={absoluteUploadUrl(opt.imageUrl)} className="h-8 w-8 object-contain mb-1" />}
                {editingOption === opt.id ? (
                  <div className="flex flex-col gap-1 w-full">
                    <input value={editOptionLabel} onChange={(e) => setEditOptionLabel(e.target.value)} className="rounded border px-1 py-0.5 text-xs w-full" />
                    <div className="flex gap-1">
                      <button onClick={() => saveOption(opt.id)} className="text-xs bg-black text-white px-2 py-0.5 rounded">Save</button>
                      <button onClick={() => setEditingOption(null)} className="text-xs border px-2 py-0.5 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-center">{opt.label}</span>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => { setEditingOption(opt.id); setEditOptionLabel(opt.label); }} className="text-xs text-blue-600">Edit</button>
                      <button onClick={() => deleteOption(opt.id)} className="text-xs text-red-500">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 border-t pt-3">
            <input placeholder="Option Label (e.g. Python)" value={optionForm[q.id]?.label || ""} onChange={(e) => setOptionForm(prev => ({ ...prev, [q.id]: { ...prev[q.id], label: e.target.value } }))} className="rounded border px-2 py-1 text-sm flex-1" />
            <input type="file" accept="image/*" onChange={(e) => setOptionForm(prev => ({ ...prev, [q.id]: { ...prev[q.id], file: e.target.files?.[0] || null } }))} className="text-sm" />
            <button onClick={() => addOption(q.id)} className="rounded bg-black px-3 py-1 text-xs text-white">Add Option</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* BOOKINGS */
function BookingsTab({ toast }: { toast: (msg: string, tone?: any) => void }) {
  const [range, setRange] = useState<Range>("7d");
  const [bookings, setBookings] = useState<CounsellingBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (r: Range) => {
    setLoading(true);
    try {
      const [list, stats] = await Promise.all([api.adminCounsellingBookings({ range: r, page: 1, limit: 50 }), api.adminCounsellingStats(r)]);
      setBookings(list.bookings);
      setTotal(stats.total);
    } catch (err) { toast("Load failed", "error"); } finally { setLoading(false); }
  };

  useEffect(() => { load(range); }, [range]);

  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Counselling sessions booked</h2>
          <p className="text-sm text-slate-600">Total in selected range: <b>{total}</b></p>
        </div>
        <div className="flex gap-2">
          {(["today", "7d", "1m", "all"] as Range[]).map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`rounded-lg px-3 py-1.5 text-xs ${range === r ? "bg-black text-white" : "border"}`}>{r === "today" ? "Today" : r === "7d" ? "7 Days" : r === "1m" ? "1 Month" : "All"}</button>
          ))}
        </div>
      </div>
      {loading ? <div className="mt-6 text-center text-sm">Loading…</div> : bookings.length === 0 ? <div className="mt-6 text-center text-sm text-slate-500">No bookings in this range.</div> : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-2">User</th>
                <th className="py-2">Date / Time</th>
                <th className="py-2">Duration</th>
                <th className="py-2">Pre-paid</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b">
                  <td className="py-3"><div className="font-medium">{b.contactName}</div><div className="text-xs text-slate-500">{b.contactEmail}</div></td>
                  <td className="py-3">{b.preferredDate} <br /><span className="text-xs text-slate-500">{b.preferredTime}</span></td>
                  <td className="py-3">{b.durationMinutes} min</td>
                  <td className="py-3">₹{b.preAmount}</td>
                  <td className="py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${b.status === "COMPLETED" ? "bg-green-100 text-green-700" : b.status === "PRE_PAID" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-800"}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}