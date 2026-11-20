import { useEffect } from "react";
import Icon from "@/components/Icon";
import { Breadcrumbs } from "@/components/Primitives";
import { useShop } from "@/lib/store";

type Section = { id: string; heading: string; paras: string[]; bullets?: string[] };
type Doc = { title: string; kicker: string; updated: string; intro: string; sections: Section[] };

const docs: Record<string, Doc> = {
  privacy: {
    title: "Privacy policy",
    kicker: "Your data, handled with care",
    updated: "12 February 2026",
    intro:
      "Elearn Hub Education Pvt. Ltd. (\"Elearn Hub\", \"we\", \"us\") respects your privacy. This policy explains what we collect when you use elearnhub.in, why we collect it, and the control you have.",
    sections: [
      {
        id: "collect",
        heading: "1. Information we collect",
        paras: ["We collect only what we need to deliver learning and support you well."],
        bullets: [
          "Account details: name, email, phone number, hashed password and profile preferences.",
          "Learning data: courses enrolled, lesson progress, project submissions, quiz scores and certificates.",
          "Payment data: your payment method is processed by our PCI-DSS compliant partner Razorpay. We receive a transaction reference, amount, and billing details such as GSTIN — never your full card number.",
          "Support data: messages you send to our learner support team or to the AI mentor, used to resolve issues and improve guidance quality.",
          "Technical data: device type, browser, IP address and pages visited, used for security and aggregate analytics.",
        ],
      },
      {
        id: "use",
        heading: "2. How we use your information",
        paras: ["Your data helps us run the learning experience, not to sell attention."],
        bullets: [
          "Provide course access, issue certificates and restore your progress across devices.",
          "Personalise recommendations and mentor guidance based on the goals you share.",
          "Process payments, issue GST invoices and manage refunds.",
          "Send transactional emails (receipts, access, security) and, if you opt in, our weekly learning newsletter.",
          "Detect fraud, enforce our terms and meet legal obligations.",
        ],
      },
      {
        id: "ai",
        heading: "3. AI mentoring and your data",
        paras: [
          "Conversations with Nova, our AI mentor, are processed to generate guidance. We do not sell these conversations. Where we review sampled conversations for quality, they are de-identified and handled by authorised curriculum staff under confidentiality obligations.",
          "You can request export or deletion of mentor conversation history at any time from your account settings or by writing to privacy@elearnhub.in.",
        ],
      },
      {
        id: "cookies",
        heading: "4. Cookies and analytics",
        paras: [
          "We use strictly necessary cookies for login, cart and checkout security. With your consent, we use privacy-respecting analytics to understand which pages help learners. You can change your preference at any time using the cookie settings link in the footer.",
        ],
      },
      {
        id: "sharing",
        heading: "5. Who we share data with",
        paras: [
          "We share data only with processors who help us operate: cloud hosting (AWS), payments (Razorpay), email delivery and support tooling. These providers are bound by data processing agreements and may not use your data for their own marketing.",
          "We do not sell personal data. We may disclose information if legally required or to protect the rights and safety of learners and staff.",
        ],
      },
      {
        id: "rights",
        heading: "6. Your rights and choices",
        paras: ["Subject to applicable law, you can access, correct, export or delete your personal data and withdraw consent for marketing."],
        bullets: [
          "Write to privacy@elearnhub.in from your registered email for any request.",
          "Unsubscribe from marketing emails using the link in every email; transactional emails continue.",
          "Close your account from the dashboard. Course records are retained as required for tax and certificate verification, then deleted or anonymised.",
        ],
      },
      {
        id: "security",
        heading: "7. Security and retention",
        paras: [
          "Data is encrypted in transit and at rest. Access is limited to staff who need it for their role, with logging and regular review. We retain account data for the life of your account and for up to 7 years where tax law requires.",
        ],
      },
      {
        id: "contact",
        heading: "8. Contact",
        paras: [
          "Data protection queries: privacy@elearnhub.in. Postal address: 4th Floor, 12th Main, Indiranagar, Bengaluru 560038, India. If you are in the EU, you may also raise a concern with your local supervisory authority.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms & conditions",
    kicker: "The agreement between us",
    updated: "12 February 2026",
    intro:
      "These terms govern your use of Elearn Hub. By creating an account or purchasing a course, you agree to them. If you do not agree, please do not use the platform.",
    sections: [
      {
        id: "accounts",
        heading: "1. Accounts and eligibility",
        paras: [
          "You must be at least 18 years old, or have verifiable guardian consent, to purchase. You are responsible for keeping your login credentials secure and for all activity under your account.",
          "One account per learner. Sharing access, reselling courses or using a team seat for someone other than the named learner is not permitted.",
        ],
      },
      {
        id: "purchases",
        heading: "2. Course purchases and access",
        paras: [
          "Individual course purchases grant a personal, non-transferable licence to access that course and its resources for 12 months from the date of purchase, unless stated otherwise. Pro memberships grant access while the subscription remains active.",
          "Course content evolves. We may update lessons, replace tools or retire outdated material. Substantial changes are noted in the course changelog and never reduce the advertised learning outcomes during your access period.",
        ],
      },
      {
        id: "subscriptions",
        heading: "3. Subscriptions and billing",
        paras: [
          "Paid plans renew automatically at the interval you select. You authorise us and our payment partner to charge the saved method at each renewal. You can cancel at any time from the dashboard; access continues until the end of the paid period.",
          "If a renewal fails, we will retry and notify you. Access may be suspended until payment is resolved. Prices are in INR and include GST unless stated otherwise.",
        ],
      },
      {
        id: "use",
        heading: "4. Acceptable use",
        paras: ["We want a generous, serious learning community. You agree not to:"],
        bullets: [
          "Copy, record, download (except where enabled) or redistribute course content.",
          "Share solutions to assessed projects in public forums in a way that undermines learning.",
          "Harass instructors or learners, or use the platform for unlawful activity.",
          "Attempt to bypass access controls, scrape data or probe our infrastructure.",
        ],
      },
      {
        id: "ip",
        heading: "5. Intellectual property",
        paras: [
          "Course materials, assessments and platform design are owned by Elearn Hub or its licensors and are protected by law. You receive a personal learning licence only. Projects you create remain yours; you grant us permission to reference anonymised outcomes for quality reporting.",
        ],
      },
      {
        id: "certificates",
        heading: "6. Certificates and outcomes",
        paras: [
          "Certificates are issued on completion of the required lessons and projects and reflect applied work, not vendor accreditation unless expressly stated. Employment outcomes depend on many factors; we do not guarantee a job, salary or interview.",
        ],
      },
      {
        id: "ai",
        heading: "7. AI mentor",
        paras: [
          "Nova provides informational guidance and may occasionally be wrong. You remain responsible for decisions about your career, code and money. Do not share confidential employer material or sensitive personal data in chat. Human support is available for anything critical.",
        ],
      },
      {
        id: "liability",
        heading: "8. Limitation of liability and governing law",
        paras: [
          "To the extent permitted by law, our total liability for any claim is limited to the amount you paid in the 12 months before the claim. These terms are governed by the laws of India, with courts in Bengaluru having exclusive jurisdiction.",
        ],
      },
      {
        id: "contact",
        heading: "9. Questions",
        paras: ["Write to hello@elearnhub.in. We try to resolve concerns first — most issues never need to become a dispute."],
      },
    ],
  },
  refund: {
    title: "Cancellation & refund",
    kicker: "Simple, fair, no runaround",
    updated: "12 February 2026",
    intro:
      "We want you to start without pressure. If a course or membership isn't the right fit, tell us within seven days and we will refund you — subject to the fair-use conditions below.",
    sections: [
      {
        id: "window",
        heading: "1. The 7-day window",
        paras: [
          "Individual courses: request a refund within 7 days of purchase. Subscription plans: request within 7 days of your first payment for that plan. Renewal payments can be refunded if the request reaches us before you access content in the new billing period.",
        ],
      },
      {
        id: "eligibility",
        heading: "2. Eligibility",
        paras: ["To keep refunds fair for a small, independent team, the following conditions apply:"],
        bullets: [
          "You have completed less than 40% of the course or downloaded more than two project resource packs.",
          "No certificate has been issued for the course.",
          "The request is your first refund for that product; repeat refunds may be declined.",
          "You have not breached our acceptable use terms (for example, sharing or redistributing content).",
        ],
      },
      {
        id: "how",
        heading: "3. How to request a refund",
        paras: [
          "Email refund@elearnhub.in from your registered email with your order ID, or submit the request via the contact page selecting 'Access or refund'. We reply within 2 working days and do not require you to justify your decision.",
          "Approved refunds are issued to the original payment method within 5–7 working days for cards and UPI, and up to 10 working days for net banking. GST invoices are reversed by credit note.",
        ],
      },
      {
        id: "cancel",
        heading: "4. Cancelling a subscription",
        paras: [
          "Cancel any time from Dashboard → Billing → Manage plan. You will not be charged again. If you cancel during the 7-day trial, no charge is made at all. Pausing a plan for up to 60 days keeps your progress and does not generate a refund.",
        ],
      },
      {
        id: "exceptions",
        heading: "5. What is not refundable",
        paras: [
          "Live cohort seats that have already started, one-to-one paid coaching sessions that have taken place, gift cards that have been redeemed, and government taxes already remitted where a credit note cannot be issued.",
        ],
      },
      {
        id: "chargebacks",
        heading: "6. Chargebacks",
        paras: [
          "Please contact us before raising a chargeback with your bank. It is faster for you and cheaper for us. If a chargeback is raised after a refund has been processed, we may suspend the account until the duplicate payment is resolved.",
        ],
      },
      {
        id: "contact",
        heading: "7. Need a human?",
        paras: ["Call +91 80 4718 2200 (Mon–Sat, 9am–7pm IST) or email refund@elearnhub.in. Reference this policy and your order ID."],
      },
    ],
  },
  access: {
    title: "Access & delivery",
    kicker: "From payment to first lesson",
    updated: "12 February 2026",
    intro:
      "All Elearn Hub products are digital. This page explains exactly when and how access is delivered, what is included, and how to fix the most common access issues quickly.",
    sections: [
      {
        id: "delivery",
        heading: "1. Instant digital delivery",
        paras: [
          "Access is granted to your account immediately after successful payment. A receipt and access link are emailed to the address used at checkout, usually within two minutes. There is no shipping and no physical product.",
        ],
      },
      {
        id: "includes",
        heading: "2. What your purchase includes",
        paras: ["Unless a course page says otherwise, each course includes:"],
        bullets: [
          "Streaming access to all published lessons for 12 months from purchase.",
          "Downloadable project files, workbooks and resource lists.",
          "Project submission with AI mentor feedback.",
          "A verified certificate on completion of required work.",
          "Access on desktop, tablet and mobile, plus offline lesson downloads on the mobile app.",
          "Course updates published during your access period.",
        ],
      },
      {
        id: "issues",
        heading: "3. If you cannot access your course",
        paras: [
          "First check that you are signed in with the email used at purchase, then refresh your dashboard. If access still does not appear within 15 minutes, email access@elearnhub.in with your order ID — we can usually resolve it within 4 working hours.",
          "Payments sometimes remain pending at the bank. In that case, access is granted once the payment is confirmed; nothing is lost if you send us the reference.",
        ],
      },
      {
        id: "requirements",
        heading: "4. Technical requirements",
        paras: [
          "A modern browser (Chrome, Edge, Firefox or Safari within the last two versions) and a stable internet connection of 5 Mbps for video. Practical courses may require software we specify on the course page; wherever possible, we recommend free or trial-access tools.",
        ],
      },
      {
        id: "certificates",
        heading: "5. Certificates",
        paras: [
          "Certificates are available as a verifiable PDF and a shareable credential link. Employers can confirm the learner name, course, completion date and skills summary at elearnhub.in/verify using the credential ID.",
        ],
      },
      {
        id: "contact",
        heading: "6. Learning support",
        paras: [
          "Academic questions: post in the course discussion or ask Nova. Billing or access: hello@elearnhub.in. Teams: teams@elearnhub.in. Support hours are Monday to Saturday, 9am–7pm IST.",
        ],
      },
    ],
  },
};

const docOrder = ["privacy", "terms", "refund", "access"] as const;

export default function Legal({ doc: docKey }: { doc: string }) {
  const { route, navigate } = useShop();
  const doc = docs[docKey] ?? docs.terms;

  useEffect(() => {
    document.title = `${doc.title} · Elearn Hub`;
  }, [doc.title]);

  return (
    <div className="border-b border-line bg-cream">
      <div className="wrap py-6 md:py-9">
        <Breadcrumbs items={[{ label: "Policies" }, { label: doc.title }]} />
        <div className="mt-5 grid items-end gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <p className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-coral" /> {doc.kicker}</p>
            <h1 className="display mt-2.5 text-[clamp(2.2rem,4.5vw,3.4rem)]">{doc.title}</h1>
            <p className="mt-3 max-w-2xl text-[0.9rem] leading-relaxed text-muted">{doc.intro}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.68rem] text-muted">
              <span className="flex items-center gap-1.5"><Icon name="calendar" size={12} /> Updated {doc.updated}</span>
              <span className="flex items-center gap-1.5"><Icon name="clock" size={12} /> ~4 minute read</span>
              <span className="flex items-center gap-1.5"><Icon name="globe" size={12} /> Applies to elearnhub.in</span>
            </div>
          </div>
          <div className="hidden gap-2 justify-self-end rounded-2xl border border-line bg-paper p-3 lg:grid">
            {docOrder.map((key) => (
              <a
                key={key}
                href={`#/legal/${key}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-[0.74rem] font-medium transition-colors ${route.includes(key) ? "bg-ink text-white" : "text-ink-soft hover:bg-cream"}`}
              >
                {docs[key].title}
                <Icon name="chevronRight" size={12} />
              </a>
            ))}
            <a href="#/contact" className="mt-1 flex items-center justify-between border-t border-line-soft px-3 pt-2.5 text-[0.72rem] font-semibold text-ink hover:underline">
              Need help? Contact us <Icon name="arrowRight" size={12} />
            </a>
          </div>
        </div>
      </div>

      <div className="wrap pb-12">
        <div className="grid items-start gap-6 lg:grid-cols-[228px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[78px] rounded-xl border border-line bg-paper p-3 xl:top-[122px]">
              <p className="px-2 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted">On this page</p>
              <nav className="mt-2 space-y-0.5">
                {doc.sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-[0.7rem] leading-snug text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                  >
                    {section.heading}
                  </button>
                ))}
              </nav>
              <div className="mt-3 rounded-lg bg-lime/30 p-3">
                <p className="text-[0.7rem] font-semibold">Still unclear?</p>
                <p className="mt-1 text-[0.64rem] leading-relaxed text-ink-soft">Write to hello@elearnhub.in and a human will explain how the policy applies to you.</p>
                <button type="button" onClick={() => navigate("contact")} className="mt-2 text-[0.66rem] font-semibold text-ink hover:underline">Contact the team →</button>
              </div>
            </div>
          </aside>

          <article className="rounded-2xl border border-line bg-paper px-5 py-6 md:px-8 md:py-8">
            <div className="prose-elearn max-w-none">
              {doc.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-[100px]">
                  <h2 className="font-display text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{section.heading}</h2>
                  {section.paras.map((para) => <p key={para.slice(0, 30)}>{para}</p>)}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((bullet) => <li key={bullet.slice(0, 24)}>{bullet}</li>)}
                    </ul>
                  )}
                </section>
              ))}
            </div>
            <div className="mt-7 flex flex-col justify-between gap-3 rounded-xl bg-cream p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime"><Icon name="shieldCheck" size={15} /></span>
                <p className="text-[0.72rem] leading-snug text-ink-soft">We wrote this in plain language on purpose. If anything is ambiguous, tell us.</p>
              </div>
              <button type="button" onClick={() => navigate("contact")} className="btn btn-sm btn-primary shrink-0">Talk to us</button>
            </div>
            <div className="mt-5 flex items-center justify-between gap-2 border-t border-line-soft pt-4">
              <p className="text-[0.64rem] text-muted">Elearn Hub Education Pvt. Ltd. · Bengaluru, India</p>
              <div className="flex gap-2">
                {docOrder.filter((d) => d !== docKey).slice(0, 2).map((key) => (
                  <a key={key} href={`#/legal/${key}`} className="text-[0.66rem] font-medium text-ink underline-offset-2 hover:underline">{docs[key].title}</a>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
