import Icon from "@/components/Icon";
import { PageHero, Reveal, SectionHead, Stars } from "@/components/Primitives";
import { INSTRUCTORS, stats } from "@/lib/data";

const values = [
  { icon: "target", title: "Employability over entertainment", copy: "A course only earns its place if it ends in something a hiring manager can evaluate. Every module builds toward a project or a decision you can defend." },
  { icon: "users", title: "Practitioners at the front", copy: "Our instructors still do the work they teach. No career trainers reading yesterday's slide deck for the first time on camera." },
  { icon: "sparkle", title: "AI with a point of view", copy: "A mentor should tell you when your plan is weak. Nova is designed to challenge, not flatter — and human coaches review its guidance every month." },
  { icon: "globe", title: "Access is the product", copy: "Hindi subtitles, low-bandwidth downloads, learner-friendly pricing and income-linked scholarships. Talent is everywhere; opportunity should be too." },
];

export default function About() {
  const team = [INSTRUCTORS.meg, INSTRUCTORS.ishita, INSTRUCTORS.tara, INSTRUCTORS.kabir];
  return (
    <>
      <PageHero
        crumbs={[{ label: "About us" }]}
        eyebrow="Our story"
        title={<>We build careers, <span className="italic-accent text-plum">not just courses.</span></>}
        copy="Elearn Hub started in 2022 with a simple frustration: talented people were being locked out of good roles by learning that stopped at theory. We built the school we wished existed."
        aside={
          <div className="relative hidden w-[268px] lg:block">
            <div className="absolute -inset-2 rotate-2 rounded-2xl bg-lime/50" />
            <img
              src="https://images.pexels.com/photos/4126751/pexels-photo-4126751.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=760&w=600"
              alt="A learner working through a project at home"
              className="relative h-[270px] w-full rounded-2xl border border-line object-cover shadow-lg"
            />
            <div className="absolute -bottom-5 -left-4 flex items-center gap-2 rounded-xl border border-line bg-paper p-2.5 shadow-lg">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime"><Icon name="users" size={15} /></span>
              <div>
                <p className="text-[0.68rem] font-semibold">42,000+ learners</p>
                <p className="text-[0.56rem] text-muted">in 38 countries</p>
              </div>
            </div>
          </div>
        }
      />

      <section className="wrap section-pad">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7433837/pexels-photo-7433837.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000"
                alt="The Elearn Hub team reviewing learner outcomes"
                className="h-[300px] w-full rounded-2xl border border-line object-cover md:h-[380px]"
              />
              <div className="absolute -bottom-6 right-4 max-w-[220px] rounded-2xl border border-line bg-plum p-4 text-white shadow-xl">
                <p className="font-display text-[1.6rem] font-semibold leading-none text-lime">78%</p>
                <p className="mt-1 text-[0.68rem] leading-snug text-white/60">of surveyed learners report a role change within 9 months</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={70}>
            <p className="eyebrow mb-3"><span className="h-1.5 w-1.5 rounded-full bg-coral" /> Why we exist</p>
            <h2 className="display text-[clamp(2rem,3.5vw,2.9rem)]">
              Skills are learnable. <br />
              <span className="italic-accent text-plum">Access is the hard part.</span>
            </h2>
            <div className="mt-4 space-y-3 text-[0.88rem] leading-relaxed text-muted">
              <p>
                Our founders met while mentoring career switchers on weekends. The pattern was impossible to ignore:
                people were not short on effort. They were short on sequencing, feedback and the confidence that comes
                from shipping real work.
              </p>
              <p>
                So we built Elearn Hub around projects, practitioners and a mentor that remembers your context. We kept
                prices honest, made refunds uncomplicated and wrote courses for the job — not the algorithm.
              </p>
              <p>
                Four years later, 42,000 learners have used the platform to move into cloud, design, data, security and
                product roles. We are still small on purpose: every course is reviewed by a working professional before
                it goes live.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Founded 2022", "Bengaluru, India", "Learner-first", "B Corp pending"].map((tag) => (
                <span key={tag} className="chip bg-paper text-[0.7rem]">{tag}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-plum py-12 text-white">
        <div className="wrap grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l border-white/10 pl-4 first:border-0 first:pl-0 md:pl-6">
              <p className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-semibold leading-none text-lime">{stat.value}</p>
              <p className="mt-1.5 text-[0.72rem] text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap section-pad">
        <SectionHead
          eyebrow="What we believe"
          title={<>Four principles we <span className="italic-accent text-plum">won't trade.</span></>}
          copy="These are not wall posters. They decide which courses we launch and which we retire."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 60}>
              <div className="card flex h-full gap-4 p-5">
                <span className="icon-tile shrink-0" style={{ background: ["#CDF56A", "#D9C8FF", "#A9DDF5", "#FFD3C7"][i] }}>
                  <Icon name={value.icon} size={19} />
                </span>
                <div>
                  <h3 className="font-display text-[1.02rem] font-semibold">{value.title}</h3>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted">{value.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper py-12 md:py-16">
        <div className="wrap">
          <SectionHead
            eyebrow="The people behind the hub"
            title={<>Mentors who have <span className="italic-accent text-plum">done the work.</span></>}
            copy="A small faculty of working practitioners, supported by career coaches and a curriculum team."
            action={<a href="#/courses" className="btn btn-outline">Learn from them <Icon name="arrowRight" size={15} /></a>}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 60}>
                <div className="group card card-hover overflow-hidden p-0 text-center">
                  <div className="relative aspect-[4/3.4] overflow-hidden bg-cream-deep">
                    <img src={member.avatar} alt={member.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-paper/90 px-2 py-1 text-[0.58rem] font-semibold backdrop-blur">
                      <Icon name="star" size={10} className="text-gold" /> {member.rating}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-[1rem] font-semibold">{member.name}</h3>
                    <p className="mt-0.5 text-[0.66rem] leading-snug text-muted">{member.role}</p>
                    <p className="mt-2 text-[0.62rem] text-ink-soft">{(member.students ?? 0).toLocaleString("en-IN")} learners taught</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section-pad">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <p className="eyebrow mb-3"><span className="h-1.5 w-1.5 rounded-full bg-coral" /> How we got here</p>
            <h2 className="display text-[clamp(2rem,3.5vw,2.8rem)]">Quietly, deliberately, <span className="italic-accent text-plum">in public.</span></h2>
            <p className="mt-3 max-w-md text-[0.88rem] leading-relaxed text-muted">
              We share our learner outcomes every year — including the ones that disappoint. It keeps the curriculum
              honest.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-paper p-3">
              <Stars rating={4.9} size={14} />
              <p className="text-[0.7rem] text-muted">Rated 4.9 by 3,240 verified learners</p>
            </div>
          </div>
          <div className="space-y-0">
            {[
              { year: "2022", title: "A weekend cohort of 12", copy: "Two mentors, one rented classroom and a DevOps curriculum built from real on-call incidents." },
              { year: "2023", title: "The first career track", copy: "We sequenced courses into a 5-month DevOps Launchpad. 64% of the first cohort changed roles within a year." },
              { year: "2024", title: "Nova joins the team", copy: "Our AI mentor launched with a refusal-friendly design: it recommends less, but with better reasoning." },
              { year: "2026", title: "42,000 learners strong", copy: "Eight disciplines, 180+ courses, three career tracks and a scholarship fund covering 500 learners a year." },
            ].map((item, i) => (
              <div key={item.year} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-paper font-display text-[0.62rem] font-semibold">{item.year}</span>
                  {i < 3 && <span className="mt-1 w-px flex-1 bg-line" />}
                </div>
                <div className="pt-1">
                  <h3 className="font-display text-[0.98rem] font-semibold">{item.title}</h3>
                  <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl bg-lime p-6 sm:flex-row sm:items-center md:p-8">
          <div>
            <p className="eyebrow text-ink/60">Come learn with us</p>
            <h2 className="display mt-1.5 text-[clamp(1.6rem,3vw,2.2rem)]">Your next chapter starts with one honest goal.</h2>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a href="#/courses" className="btn btn-primary">Explore courses <Icon name="arrowRight" size={15} /></a>
            <a href="#/contact" className="btn btn-white">Say hello</a>
          </div>
        </div>
      </section>
    </>
  );
}
