import { Fragment, useState } from "react";
import Icon from "@/components/Icon";
import { Accordion, PageHero, Reveal, SectionHead } from "@/components/Primitives";
import { BillingToggle, PlanCard } from "@/components/PlanCards";
import { faqs, plans } from "@/lib/data";
import { cn } from "@/utils/cn";

const compareRows: { label: string; group: string; values: (string | boolean)[] }[] = [
  { group: "Learning", label: "Preview lessons", values: [true, true, true] },
  { group: "Learning", label: "Full course library", values: ["1 starter course", "Unlimited", "Unlimited"] },
  { group: "Learning", label: "Career tracks", values: [false, "All 3", "All 3 + custom"] },
  { group: "Learning", label: "Projects & downloadable files", values: [false, true, true] },
  { group: "Learning", label: "Offline lesson downloads", values: [false, true, true] },
  { group: "Mentorship", label: "AI career mentor", values: ["20 messages / mo", "Unlimited", "Unlimited"] },
  { group: "Mentorship", label: "Portfolio & project feedback", values: [false, true, true] },
  { group: "Mentorship", label: "Mock interviews", values: [false, "Monthly", "Monthly + coach"] },
  { group: "Mentorship", label: "Human mentor check-in", values: [false, "Add-on", "Quarterly"] },
  { group: "Proof", label: "Verified certificates", values: [false, true, true] },
  { group: "Proof", label: "Skills assessment report", values: [false, false, true] },
  { group: "Proof", label: "Live monthly workshops", values: [false, true, true] },
  { group: "Teams", label: "Admin & seat management", values: [false, false, true] },
  { group: "Teams", label: "Consolidated GST invoicing", values: [false, "Add-on", true] },
  { group: "Support", label: "Community access", values: [true, true, true] },
  { group: "Support", label: "Priority support", values: [false, "4-hour reply", "Dedicated manager"] },
];

const groups = ["Learning", "Mentorship", "Proof", "Teams", "Support"];

const pricingFaqs = [
  ...faqs.slice(0, 3),
  {
    q: "Can I switch or pause my plan?",
    a: "Yes. You can move between monthly and annual billing, pause for up to 60 days, or cancel from your dashboard at any time. Access continues until the end of the period you have paid for.",
  },
  {
    q: "What happens if I cancel during the trial?",
    a: "Nothing is charged. If you cancel within the 7-day trial, the card on file is not debited. If you cancel after the trial, your plan stays active until the next renewal date.",
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [showAllRows, setShowAllRows] = useState(false);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Pricing" }]}
        eyebrow="Membership & pricing"
        title={<>Invest in the version of you that's <span className="italic-accent text-plum">next.</span></>}
        copy="One membership, the whole catalogue, and an AI mentor that keeps you moving. Start free, switch to annual when you're sure, and cancel whenever you need to."
        aside={
          <div className="card hidden w-[250px] p-4 lg:block">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime"><Icon name="shieldCheck" size={18} /></span>
              <div>
                <p className="text-[0.78rem] font-semibold">Zero-risk trial</p>
                <p className="text-[0.64rem] text-muted">7 days, cancel anytime</p>
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {["No lock-in contract", "GST-compliant invoices", "Switch or pause your plan", "Money-back guarantee"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[0.7rem] text-ink-soft">
                  <Icon name="checkCircle" size={12} className="text-plum" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-1 border-t border-line-soft pt-2.5">
              <Icon name="star" size={11} className="text-gold" />
              <span className="text-[0.66rem] font-medium text-ink">4.9/5 from 3,240 learners</span>
            </div>
          </div>
        }
      />

      <section className="wrap section-pad">
        <Reveal>
          <div className="flex flex-col items-center gap-5 text-center">
            <BillingToggle billing={billing} onChange={setBilling} />
            <p className="max-w-md text-[0.76rem] leading-relaxed text-muted">
              Annual saves you <span className="font-semibold text-ink">23%</span> — that's about two free months each year. Prices below are in INR and include GST.
            </p>
          </div>
        </Reveal>
        <div className="mt-9 grid items-stretch gap-4 md:grid-cols-3 lg:gap-5">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 70}>
              <PlanCard plan={plan} billing={billing} />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "sparkle", title: "AI mentor included", copy: "Unlimited on all paid plans" },
              { icon: "graduation", title: "180+ courses", copy: "One pass, every discipline" },
              { icon: "shieldCheck", title: "7-day guarantee", copy: "No questions asked" },
              { icon: "receipt", title: "GST invoices", copy: "For individuals and teams" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-2.5 rounded-xl border border-line bg-paper px-3 py-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cream"><Icon name={item.icon} size={14} /></span>
                <span>
                  <span className="block text-[0.72rem] font-semibold">{item.title}</span>
                  <span className="block text-[0.62rem] text-muted">{item.copy}</span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-paper py-12 md:py-16">
        <div className="wrap">
          <SectionHead
            eyebrow="Compare plans"
            title={<>The details, <span className="italic-accent text-plum">side by side.</span></>}
            copy="No hidden limits on the things that matter. If it is in a paid plan, it is written here."
          />
          <div className="mt-7 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[640px] border-collapse bg-paper text-left">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="sticky left-0 z-10 bg-paper px-4 py-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.id} scope="col" className={cn("px-4 py-3.5 text-center", plan.popular && "bg-lime/25")}>
                      <span className="block font-display text-[0.92rem] font-semibold">{plan.name}</span>
                      <span className="mt-0.5 block text-[0.64rem] font-normal text-muted">
                        {plan.monthly === 0 ? "Free" : `₹${plan.annual.toLocaleString("en-IN")}/mo`}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(showAllRows ? groups : groups.slice(0, 3)).map((group) => (
                  <Fragment key={group}>
                    <tr className="bg-cream/70">
                      <th colSpan={4} scope="colgroup" className="px-4 py-2 text-left text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">{group}</th>
                    </tr>
                    {compareRows
                      .filter((row) => row.group === group)
                      .map((row) => (
                        <tr key={row.label} className="border-t border-line-soft">
                          <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-2.5 text-left text-[0.76rem] font-normal text-ink-soft">{row.label}</th>
                          {row.values.map((value, i) => (
                            <td key={i} className={cn("px-4 py-2.5 text-center text-[0.72rem]", i === 1 && "bg-lime/10")}>
                              {value === true ? (
                                <Icon name="check" size={15} className="mx-auto text-plum" strokeWidth={2.4} />
                              ) : value === false ? (
                                <span className="mx-auto block h-px w-3 bg-line" />
                              ) : (
                                <span className="text-ink-soft">{value}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[0.66rem] text-muted">Prices include GST. Annual plans are billed once for 12 months.</p>
            <button type="button" onClick={() => setShowAllRows((v) => !v)} className="text-[0.7rem] font-semibold text-ink underline-offset-2 hover:underline">
              {showAllRows ? "Show fewer details" : "Show full comparison"}
            </button>
          </div>
        </div>
      </section>

      <section className="wrap section-pad">
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="card flex h-full flex-col justify-between bg-plum p-6 text-white lg:p-8">
              <div>
                <p className="eyebrow mb-2 text-lime">For teams</p>
                <h2 className="display max-w-md text-[clamp(1.7rem,2.8vw,2.35rem)] text-white">Upskill the team that ships your roadmap.</h2>
                <p className="mt-3 max-w-md text-[0.84rem] leading-relaxed text-white/60">
                  Custom learning paths, skills assessments and consolidated billing. We onboard your team and report on
                  progress without adding to your admin load.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {["Custom career tracks", "Skills gap assessment", "Dedicated success manager", "Quarterly ROI reporting"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[0.74rem] text-white/70">
                      <Icon name="check" size={12} className="text-lime" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href="#/contact" className="btn btn-lime btn-sm">Talk to our team <Icon name="arrowRight" size={14} /></a>
                <span className="flex items-center text-[0.66rem] text-white/40">Volume pricing from 5 seats</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="card flex h-full flex-col justify-between bg-lime/35 p-6 lg:p-8">
              <div>
                <p className="eyebrow mb-2">For individuals</p>
                <h2 className="display max-w-md text-[clamp(1.7rem,2.8vw,2.35rem)]">Not ready for a membership?</h2>
                <p className="mt-3 max-w-md text-[0.84rem] leading-relaxed text-ink-soft">
                  Buy any individual course once and keep it for 12 months. You still get project files, a verified
                  certificate and the AI mentor for the first 30 days.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {["No recurring payment", "Lifetime course updates", "7-day refund window", "Mentor support included"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[0.74rem] text-ink-soft">
                      <Icon name="check" size={12} className="text-plum" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href="#/courses" className="btn btn-primary btn-sm">Browse single courses <Icon name="arrowRight" size={14} /></a>
                <a href="#/dashboard" className="btn btn-outline btn-sm">Ask the mentor first</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad border-t border-line bg-cream">
        <div className="wrap grid gap-9 lg:grid-cols-[.65fr_1.2fr] lg:gap-14">
          <div>
            <p className="eyebrow mb-3"><span className="h-1.5 w-1.5 rounded-full bg-coral" /> Membership questions</p>
            <h2 className="display text-[clamp(1.9rem,3.2vw,2.7rem)]">Before you commit.</h2>
            <p className="mt-3 max-w-sm text-[0.86rem] leading-relaxed text-muted">
              Straight answers about trials, switching and what happens when life gets busy.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-paper p-3">
              <Icon name="info" size={17} className="shrink-0 text-plum" />
              <p className="text-[0.7rem] leading-snug text-muted">Need a GST invoice or purchase order? Our team replies in under 4 working hours.</p>
            </div>
          </div>
          <div className="card px-5 py-2">
            <Accordion items={pricingFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}
