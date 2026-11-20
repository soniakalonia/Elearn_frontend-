import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { CourseCard, EmptyState, PageHero, Reveal } from "@/components/Primitives";
import { useShop, type UiCategory, type UiCourse } from "@/lib/store";
import { formatINR } from "@/lib/data";
import { cn } from "@/utils/cn";

const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "newest", label: "Newest first" },
];

const MAX_PRICE = 100000;
const PAGE_SIZE = 9;

type FilterState = { cats: number[]; maxPrice: number; query: string; sort: string };

function FilterPanel({
  filters, update, reset, categories, courses,
}: {
  filters: FilterState;
  update: (patch: Partial<FilterState>) => void;
  reset: () => void;
  categories: UiCategory[];
  courses: UiCourse[];
}) {
  const activeCount = filters.cats.length + (filters.maxPrice < MAX_PRICE ? 1 : 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-display text-[0.95rem] font-semibold">
          Filters
          {activeCount > 0 && (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-lime px-1 text-[0.58rem] font-bold text-ink">{activeCount}</span>
          )}
        </p>
        <button type="button" onClick={reset} className="text-[0.7rem] font-medium text-muted underline-offset-2 hover:text-ink hover:underline">Reset all</button>
      </div>

      <div>
        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">Search</p>
        <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-2.5">
          <Icon name="search" size={14} className="text-muted" />
          <input value={filters.query} onChange={(e) => update({ query: e.target.value })} placeholder="Course title" className="w-full bg-transparent py-2 text-[0.78rem] outline-none placeholder:text-muted/70" />
        </div>
      </div>

      <div className="hairline" />

      <div>
        <p className="mb-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">Category</p>
        <div className="space-y-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[0.78rem] text-ink-soft hover:text-ink">
            <input type="checkbox" checked={filters.cats.length === 0} onChange={() => update({ cats: [] })} className="h-3.5 w-3.5 accent-ink" />
            All courses <span className="ml-auto text-[0.64rem] text-muted">{courses.length}</span>
          </label>
          {categories.map((cat) => {
            const checked = filters.cats.includes(cat.id);
            return (
              <label key={cat.id} className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[0.78rem] text-ink-soft hover:text-ink">
                <input type="checkbox" checked={checked} onChange={() => update({ cats: checked ? filters.cats.filter((c) => c !== cat.id) : [...filters.cats, cat.id] })} className="h-3.5 w-3.5 accent-ink" />
                {cat.name} <span className="ml-auto text-[0.64rem] text-muted">{cat.count}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="hairline" />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">Max price</p>
          <span className="text-[0.68rem] font-medium text-ink">{formatINR(filters.maxPrice)}</span>
        </div>
        <input type="range" min={0} max={MAX_PRICE} step={500} value={filters.maxPrice} onChange={(e) => update({ maxPrice: Number(e.target.value) })} className="range" />
      </div>
    </div>
  );
}

export default function Courses() {
  const { route, searchTerm, setSearchTerm, toast, categories, courses, coursesLoading } = useShop();
  const [filters, setFilters] = useState<FilterState>({ cats: [], maxPrice: MAX_PRICE, query: searchTerm, sort: "recommended" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(route.split("?")[1] ?? "");
    const cat = params.get("category");
    const q = params.get("q");
    if (cat) {
      const found = categories.find((c) => c.id === Number(cat) || c.name.toLowerCase() === cat.toLowerCase());
      setFilters((f) => ({ ...f, cats: found ? [found.id] : [], query: q ?? "" }));
    } else if (q) {
      setFilters((f) => ({ ...f, query: q, cats: [] }));
    }
  }, [route, categories]);

  useEffect(() => { if (searchTerm) { setFilters((f) => ({ ...f, query: searchTerm })); setPage(1); } }, [searchTerm]);
  useEffect(() => { document.body.style.overflow = filtersOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [filtersOpen]);

  const update = (patch: Partial<FilterState>) => { setFilters((f) => ({ ...f, ...patch })); setPage(1); };
  const reset = () => { setFilters({ cats: [], maxPrice: MAX_PRICE, query: "", sort: "recommended" }); setSearchTerm(""); setPage(1); toast("Filters cleared", "info"); };

  const filtered = useMemo(() => {
    const list = courses.filter((c) => {
      if (filters.cats.length && !filters.cats.includes(c.categoryId)) return false;
      if (c.discountPrice > filters.maxPrice) return false;
      if (filters.query.trim()) {
        const hay = `${c.title} ${c.shortDescription} ${c.categoryName}`.toLowerCase();
        if (!hay.includes(filters.query.trim().toLowerCase())) return false;
      }
      return true;
    });
    switch (filters.sort) {
      case "price-low": return [...list].sort((a, b) => a.discountPrice - b.discountPrice);
      case "price-high": return [...list].sort((a, b) => b.discountPrice - a.discountPrice);
      case "newest": return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      default: return list;
    }
  }, [courses, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, filtered.length);

  const activeCatNames = filters.cats.map((id) => categories.find((c) => c.id === id)?.name).filter(Boolean) as string[];

  return (
    <>
      <PageHero crumbs={[{ label: "Courses" }]} eyebrow="Course catalogue" title={<>Every skill. <span className="italic-accent text-plum">One hub.</span></>} copy="Browse real, live courses. Each one is built around a project and taught by a practitioner." />

      <section className="wrap py-7 md:py-9">
        <div className="grid gap-7 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[84px] max-h-[calc(100vh-104px)] overflow-y-auto rounded-2xl border border-line bg-paper p-4 shadow-sm">
              <FilterPanel filters={filters} update={update} reset={reset} categories={categories} courses={courses} />
            </div>
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.8rem] text-muted">
                  Showing <span className="font-semibold text-ink">{filtered.length === 0 ? 0 : startIdx + 1}–{endIdx}</span> of <span className="font-semibold text-ink">{filtered.length}</span> courses
                </p>
                {activeCatNames.length > 0 && <p className="mt-0.5 text-[0.68rem] text-muted">in {activeCatNames.join(", ")}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setFiltersOpen(true)} className="btn btn-sm btn-outline lg:hidden"><Icon name="filter" size={14} /> Filters</button>
                <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })} className="rounded-full border border-line bg-paper px-3 py-2 text-[0.72rem] font-medium outline-none">
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {coursesLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card h-64 animate-pulse bg-cream-deep/30" />)}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState icon="search" title="No courses match those filters" copy="Try a wider price range or clear the category filters." action={<button type="button" onClick={reset} className="btn btn-primary">Clear filters</button>} />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.slice(startIdx, endIdx).map((course, i) => (
                    <Reveal key={course.id} delay={Math.min(i, 5) * 40}>
                      <CourseCard course={course} />
                    </Reveal>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="mt-7 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
                    <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="btn btn-sm btn-outline disabled:opacity-40">
                      <Icon name="arrowLeft" size={12} /> Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const n = i + 1;
                      const active = n === safePage;
                      return (
                        <button key={n} type="button" onClick={() => setPage(n)} aria-current={active ? "page" : undefined} className={cn("grid h-8 min-w-8 place-items-center rounded-full px-2.5 text-[0.72rem] font-semibold transition", active ? "bg-ink text-white" : "border border-line bg-paper text-ink-soft hover:border-ink hover:text-ink")}>
                          {n}
                        </button>
                      );
                    })}
                    <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="btn btn-sm btn-outline disabled:opacity-40">
                      Next <Icon name="arrowRight" size={12} />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog">
          <button type="button" aria-label="Close" onClick={() => setFiltersOpen(false)} className="absolute inset-0 bg-ink/45" />
          <div className="absolute bottom-0 right-0 top-0 flex w-[min(340px,90vw)] flex-col bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="font-display text-lg font-semibold">Filters</p>
              <button type="button" onClick={() => setFiltersOpen(false)} className="grid h-8 w-8 place-items-center rounded-full border border-line"><Icon name="x" size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterPanel filters={filters} update={update} reset={reset} categories={categories} courses={courses} />
            </div>
            <div className="border-t border-line p-4">
              <button type="button" onClick={() => setFiltersOpen(false)} className={cn("btn btn-primary btn-block")}>Show {filtered.length} courses</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}