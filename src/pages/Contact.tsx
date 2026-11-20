import { useState } from "react";
import Icon from "@/components/Icon";
import { Accordion, PageHero, Reveal, SectionHead } from "@/components/Primitives";
import { useShop } from "@/lib/store";
import { faqs } from "@/lib/data";

const channels = [
  { icon: "mail", label: "Email us", value: "hello@elearnhub.in", helper: "Replies in under 4 working hours", href: "mailto:hello@elearnhub.in" },
  { icon: "whatsapp", label: "WhatsApp", value: "+91 80 4718 2200", helper: "Mon–Sat, 9:00–19:00 IST", href: "https://wa.me/918047182200" },
  { icon: "phone", label: "Learner support", value: "+91 80 4718 2200", helper: "For billing, access and refunds", href: "tel:+918047182200" },
  { icon: "users", label: "Teams & enterprise", value: "teams@elearnhub.in", helper: "Onboarding within one working day", href: "mailto:teams@elearnhub.in" },
];

const topics = ["Course advice", "Billing or invoice", "Access or refund", "Teams & enterprise", "Partnerships", "Something else"];

export default function Contact() {
  const { toast } = useShop();
  const [form, setForm] = useState({ name: "", email: "", topic: topics[0], order: "", message: "", consent: false });
  const [sent, setSent] = useState<string | null>(null);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || form.message.trim().length < 10) {
      toast("Add your name, a valid email and a little more detail", "error");
      return;
    }
    if (!form.consent) {
      toast("Please accept the privacy notice so we can reply", "error");
      return;
    }
    setSent(`EH-${Math.floor(Math.random() * 9000 + 1000)}`);
    toast("Message received. We'll be in touch within 4 hours.");
  };

  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        eyebrow="We're humans, actually"
        title={<>Let's get you <span className="italic-accent text-plum">unstuck.</span></>}
        copy="Course advice, billing questions, team licences or a problem with your access — tell us what's happening and a real person will pick it up."
        aside={
          <div className="card hidden w-[250px] p-4 lg:block">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime"><Icon name="clock" size={18} /></span>
              <div>
                <p className="text-[0.78rem] font-semibold">Support hours</p>
                <p className="text-[0.64rem] text-muted">Mon–Sat · 9am–7pm IST</p>
              </div>
            </div>
            <div className="mt-3 space-y-2 border-t border-line-soft pt-3">
              {[
                { label: "First reply", value: "< 4 hours" },
                { label: "Resolution average", value: "1.2 days" },
                { label: "Learner satisfaction", value: "96%" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between text-[0.7rem]">
                  <span className="text-muted">{stat.label}</span>
                  <span className="font-semibold text-ink">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-cream px-2.5 py-2 text-[0.64rem] text-ink-soft">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" /> Team online now
            </div>
          </div>
        }
      />

      <section className="wrap py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[.78fr_1.22fr] lg:gap-8">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {channels.map((channel, i) => (
                <Reveal key={channel.label} delay={i * 50}>
                  <a href={channel.href} className="card card-hover flex items-center gap-3 p-3.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: ["#CDF56A", "#B9ECD4", "#D9C8FF", "#A9DDF5"][i] }}>
                      <Icon name={channel.icon} size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted">{channel.label}</p>
                      <p className="truncate text-[0.8rem] font-semibold text-ink">{channel.value}</p>
                      <p className="text-[0.64rem] text-muted">{channel.helper}</p>
                    </div>
                    <Icon name="arrowUpRight" size={14} className="shrink-0 text-muted" />
                  </a>
                </Reveal>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-line">
              <img
                src="https://images.pexels.com/photos/7433837/pexels-photo-7433837.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=420&w=800"
                alt="The Elearn Hub learner support team"
                className="h-[170px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-plum/90 via-plum/60 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-4 text-white">
                <p className="eyebrow text-lime">Visit the studio</p>
                <p className="mt-1 max-w-[210px] text-[0.8rem] font-medium leading-snug">4th Floor, 12th Main, Indiranagar, Bengaluru 560038</p>
                <a href="https://maps.google.com/?q=Indiranagar+Bengaluru" target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 text-[0.66rem] font-semibold text-lime hover:underline">
                  Get directions <Icon name="arrowUpRight" size={11} />
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-paper p-3.5">
              <p className="flex items-center gap-1.5 text-[0.74rem] font-semibold"><Icon name="sparkle" size={13} /> Looking for quick advice?</p>
              <p className="mt-1 text-[0.68rem] leading-relaxed text-muted">Nova, our AI mentor, can answer curriculum and career questions instantly, any time.</p>
              <a href="#/dashboard" className="mt-1.5 inline-flex items-center gap-1 text-[0.68rem] font-semibold text-ink hover:underline">Chat with Nova <Icon name="arrowRight" size={11} /></a>
            </div>
          </div>

          <Reveal delay={60}>
            <div className="card p-5 md:p-7">
              {sent ? (
                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-lime text-ink">
                    <Icon name="check" size={28} strokeWidth={2.4} />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-semibold">Message received.</h2>
                  <p className="mt-2 max-w-sm text-[0.86rem] leading-relaxed text-muted">
                    Thanks {form.name.split(" ")[0] || "there"} — your reference is <span className="font-mono font-semibold text-ink">{sent}</span>. A learner support specialist will reply to{" "}
                    <span className="font-medium text-ink">{form.email}</span> within 4 working hours.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <a href="#/courses" className="btn btn-primary btn-sm">Browse courses</a>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(null);
                        setForm({ name: "", email: "", topic: topics[0], order: "", message: "", consent: false });
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="eyebrow">Contact form</p>
                  <h2 className="mt-1 font-display text-[1.4rem] font-semibold">Tell us what's going on</h2>
                  <p className="mt-1 text-[0.78rem] text-muted">Fields marked * are required. We reply to every message.</p>
                  <form onSubmit={submit} className="mt-5 space-y-3.5">
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div className="field">
                        <label htmlFor="contact-name">Full name *</label>
                        <input id="contact-name" value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Aditi Sharma" className="input" required />
                      </div>
                      <div className="field">
                        <label htmlFor="contact-email">Email *</label>
                        <input id="contact-email" type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@example.com" className="input" required />
                      </div>
                    </div>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div className="field">
                        <label htmlFor="contact-topic">What is this about?</label>
                        <select id="contact-topic" value={form.topic} onChange={(e) => set({ topic: e.target.value })} className="select">
                          {topics.map((topic) => <option key={topic}>{topic}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor="contact-order">Order ID (optional)</label>
                        <input id="contact-order" value={form.order} onChange={(e) => set({ order: e.target.value })} placeholder="EH-260218-3041" className="input" />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="contact-message">Your message *</label>
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={(e) => set({ message: e.target.value })}
                        rows={5}
                        placeholder="Share as much context as you can — course, what you've tried, and the outcome you need."
                        className="textarea resize-none"
                        required
                      />
                    </div>
                    <label className="flex cursor-pointer items-start gap-2 text-[0.7rem] leading-relaxed text-muted">
                      <input type="checkbox" checked={form.consent} onChange={(e) => set({ consent: e.target.checked })} className="mt-0.5 h-3.5 w-3.5 accent-ink" required />
                      <span>I agree to Elearn Hub storing these details to respond, as described in the{" "}
                        <a href="#/legal/privacy" className="font-medium text-ink underline underline-offset-2">Privacy Policy</a>.
                      </span>
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <button type="submit" className="btn btn-primary sm:flex-1">Send message <Icon name="send" size={14} /></button>
                      <span className="flex items-center justify-center gap-1.5 text-[0.64rem] text-muted"><Icon name="shieldCheck" size={12} /> Never shared or sold</span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-12 md:py-16">
        <div className="wrap grid gap-8 lg:grid-cols-[.7fr_1.2fr] lg:gap-14">
          <div>
            <SectionHead eyebrow="Before you write" title={<>Quick <span className="italic-accent text-plum">answers.</span></>} copy="These cover most of what lands in our inbox." />
            <div className="mt-4 rounded-xl border border-line bg-cream p-3.5">
              <p className="flex items-center gap-1.5 text-[0.74rem] font-semibold"><Icon name="phone" size={13} /> Urgent access issue?</p>
              <p className="mt-1 text-[0.68rem] text-muted">Call us on +91 80 4718 2200 and choose option 2 during support hours.</p>
            </div>
          </div>
          <div className="card px-5 py-2">
            <Accordion items={faqs.slice(1, 6)} />
          </div>
        </div>
      </section>
    </>
  );
}
