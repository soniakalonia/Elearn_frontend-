import Icon from "@/components/Icon";
import { Logo, NewsletterForm } from "@/components/Primitives";

const columns = [
  {
    title: "Learn",
    links: [
      { label: "All courses", href: "/courses" },
      { label: "Career tracks", href: "/paths" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Elearn Hub", href: "/about" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "/contact" },
      { label: "Access & delivery", href: "/legal/access" },
      { label: "Cancellation & refund", href: "/legal/refund" },
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Terms & conditions", href: "/legal/terms" },
      { label: "Report a concern", href: "/contact" },
    ],
  },
];

const trust = [
  { icon: "graduation", title: "Career-first curriculum", copy: "Built with hiring managers" },
  { icon: "sparkle", title: "Guidance included", copy: "Roadmaps that know your goals" },
  { icon: "award", title: "Verifiable certificates", copy: "Proof of applied skills" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="border-y border-white/10 bg-plum">
        <div className="wrap grid grid-cols-2 gap-y-6 py-8 md:grid-cols-3 md:gap-0 md:py-9">
          {trust.map((item, i) => (
            <div
              key={item.title}
              className={`flex items-center gap-3 md:justify-center ${i > 0 ? "md:border-l md:border-white/10" : ""}`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-lime/25 bg-lime/10 text-lime">
                <Icon name={item.icon} size={17} />
              </span>
              <div>
                <p className="text-[0.76rem] font-semibold leading-tight text-white">{item.title}</p>
                <p className="mt-0.5 text-[0.64rem] leading-tight text-white/45">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap pb-8 pt-12 lg:pt-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.45fr_.75fr_.8fr_.9fr_1.35fr] lg:gap-8">
          <div>
            <div className="inline-flex max-h-10 items-center justify-center rounded-lg bg-white px-2 py-1.5">
              <Logo light compact />
            </div>
            <p className="mt-4 max-w-[15rem] text-[0.8rem] leading-relaxed text-white/55">
              A career school for the work that is coming next. Practitioner-led courses, real projects and a roadmap
              in your corner.
            </p>
            <ul className="mt-5 space-y-2.5 text-[0.76rem] text-white/65">
              <li className="flex items-start gap-2">
                <Icon name="mapPin" size={14} className="mt-0.5 shrink-0 text-lime" />
                <span>4th Floor, Indiranagar<br />Bengaluru 560038, India</span>
              </li>
              <li>
                <a href="mailto:hello@elearnhub.in" className="flex items-center gap-2 transition-colors hover:text-lime">
                  <Icon name="mail" size={14} className="shrink-0 text-lime" /> hello@elearnhub.in
                </a>
              </li>
              <li>
                <a href="tel:+918047182200" className="flex items-center gap-2 transition-colors hover:text-lime">
                  <Icon name="phone" size={14} className="shrink-0 text-lime" /> +91 80 4718 2200
                </a>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-2">
              {[
                { name: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com" },
                { name: "instagram", label: "Instagram", url: "https://www.instagram.com" },
                { name: "twitter", label: "X", url: "https://x.com" },
                { name: "youtube", label: "YouTube", url: "https://www.youtube.com" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/65 transition-all hover:border-lime hover:bg-lime hover:text-ink"
                >
                  <Icon name={s.name} size={14} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-[0.86rem] font-semibold tracking-[-0.01em] text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[0.76rem] text-white/55 transition-colors hover:text-lime">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-[1rem] font-semibold text-white">Stay curious.</h3>
            <p className="mb-4 mt-1.5 text-[0.76rem] leading-relaxed text-white/55">
              Career notes, new course drops and quiet discounts. Straight to your inbox.
            </p>
            <NewsletterForm light />
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-lime/20 bg-lime/5 p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lime text-ink">
                <Icon name="sparkle" size={15} />
              </span>
              <div>
                <p className="text-[0.7rem] font-semibold text-white">Not sure where to start?</p>
                <a href="/dashboard" className="mt-0.5 inline-flex items-center gap-1 text-[0.68rem] text-lime hover:underline">
                  See your roadmap <Icon name="arrowRight" size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6">
          <div className="flex flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="text-[0.7rem] text-white/40">
              © 2026 Elearn Hub Education Pvt. Ltd. All rights reserved. Made with intent in Bengaluru.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.66rem] text-white/40">
            <a href="/legal/privacy" className="hover:text-lime">Privacy</a>
            <a href="/legal/terms" className="hover:text-lime">Terms</a>
            <a href="/legal/refund" className="hover:text-lime">Refund policy</a>
            <a href="/legal/access" className="hover:text-lime">Access & delivery</a>
            <span className="ml-auto max-w-2xl text-white/30">
              Elearn Hub is an independent learning platform. Course certificates reflect completed project work and are not
              affiliated with any vendor unless stated. Trademarks belong to their respective owners.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}