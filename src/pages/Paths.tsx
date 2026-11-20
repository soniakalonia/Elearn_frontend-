import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { Reveal } from "@/components/Primitives";
import { useShop } from "@/lib/store";
import { absoluteUploadUrl } from "@/lib/api";

export default function Paths() {
  const { paths, pathsLoading, categories } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");

  const filteredPaths = useMemo(() => {
    if (selectedCategory === "all") return paths;
    return paths.filter((p) => p.categoryId === selectedCategory);
  }, [paths, selectedCategory]);

  return (
    <>
   <section className="wrap pt-6 pb-14">
        {/* Filter bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold">Career tracks</h1>
            <p className="mt-1 text-[0.82rem] text-muted">
              {pathsLoading ? "Loading…" : `${filteredPaths.length} track${filteredPaths.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="path-category" className="text-[0.72rem] font-medium text-muted">Filter by</label>
            <select
              id="path-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="select w-full min-w-[180px] sm:w-auto"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {pathsLoading ? (
          <div className="text-center text-muted">Loading tracks...</div>
        ) : filteredPaths.length === 0 ? (
          <div className="text-center text-muted">
            {paths.length === 0 ? "No career tracks added yet." : "No tracks in this category."}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredPaths.map((path, index) => {
              const outcomesArr = (path.outcomes || "").split("\n").filter(Boolean);
              const stepsArr = (path.steps || "").split("\n").filter(Boolean);

              return (
                <Reveal key={path.id}>
                  <article className="card overflow-hidden p-0">
                    <div className={`grid lg:grid-cols-[.9fr_1.1fr] ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                      <div className="relative min-h-[280px] lg:min-h-[360px]">
                        {path.imageUrl ? (
                          <img src={absoluteUploadUrl(path.imageUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-plum" />
                        )}
                        <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/10" />
                        <div className="absolute inset-x-5 bottom-5">
                          <span className="rounded-full bg-lime px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-ink">
                            {path.duration} · {path.level}
                          </span>
                          <h2 className="mt-2.5 font-display text-[1.8rem] font-semibold text-white">{path.title}</h2>
                          <p className="mt-1 line-clamp-2 text-[0.78rem] text-white/65">{path.description}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {path.skills.map((skill) => (
                              <span key={skill} className="rounded-md border border-white/25 bg-white/10 px-2 py-0.5 text-[0.62rem] text-white backdrop-blur">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-5 md:p-7">
                        <div className="flex items-center justify-between">
                          <p className="eyebrow">{path.categoryName}</p>
                          <span className="flex items-center gap-1 text-[0.68rem] text-muted"><Icon name="award" size={13} /> Certificate</span>
                        </div>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {outcomesArr.map((outcome, i) => (
                            <p key={i} className="flex items-start gap-2 text-[0.78rem] leading-snug text-ink-soft">
                              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lime/50 text-ink">
                                <Icon name="check" size={9} strokeWidth={2.6} />
                              </span>
                              {outcome}
                            </p>
                          ))}
                        </div>
                        <div className="mt-5 rounded-xl bg-cream p-3">
                          <p className="mb-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted">The sequence</p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {stepsArr.map((step, i) => (
                              <span key={i} className="flex items-center gap-1.5">
                                <span className="rounded-md border border-line bg-paper px-2 py-1 text-[0.64rem] font-medium text-ink-soft">{step}</span>
                                {i < stepsArr.length - 1 && <Icon name="chevronRight" size={11} className="text-muted" />}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
                          <a href={`#/courses?category=${path.categoryId}`} className="btn btn-sm btn-outline">
                            See courses <Icon name="arrowRight" size={13} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}