import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { Breadcrumbs, CourseCard, Reveal } from "@/components/Primitives";
import { useShop, type UiCourse } from "@/lib/store";
import { absoluteUploadUrl } from "@/lib/api";
import { formatINR } from "@/lib/data";
import { cn } from "@/utils/cn";

export default function CourseDetail({ id }: { id: number }) {
  const { courses, addToCart, inWishlist, toggleWishlist, navigate, cartItems } = useShop();
  const [course, setCourse] = useState<UiCourse | null>(null);

  useEffect(() => {
    setCourse(courses.find((c) => c.id === id) ?? null);
  }, [courses, id]);

  if (!course) {
    return (
      <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="mt-5 font-display text-3xl font-semibold">Course not found</h1>
        <button type="button" onClick={() => navigate("courses")} className="btn btn-primary mt-6">Browse courses</button>
      </div>
    );
  }

  const discountPct = course.originalPrice > 0 && course.discountPrice < course.originalPrice
    ? Math.round(((course.originalPrice - course.discountPrice) / course.originalPrice) * 100)
    : 0;
  const saved = inWishlist(course.id);
  const inCart = cartItems.some((c) => c.courseId === course.id);
  const related = courses.filter((c) => c.categoryId === course.categoryId && c.id !== course.id).slice(0, 3);

  // Split objectives by newline and remove empty lines
  const objectivesList = (course.objectives || "").split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <section className="border-b border-line bg-cream pt-5 pb-7">
        <div className="wrap">
          <Breadcrumbs items={[{ label: "Courses", href: "courses" }, { label: course.categoryName }, { label: course.title }]} />
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag bg-lime/45 text-ink">{course.categoryName}</span>
                {course.offerText && <span className="tag bg-coral text-white">{course.offerText}</span>}
                {discountPct > 0 && <span className="tag bg-coral text-white">Save {discountPct}%</span>}
              </div>
              <h1 className="display mt-3 max-w-3xl text-[clamp(1.9rem,4vw,3rem)]">{course.title}</h1>
              {/* Short Description */}
              <p className="mt-2 max-w-2xl text-[0.92rem] text-muted">
                {course.shortDescription || "No short description provided."}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.74rem] text-muted">
                <span className="flex items-center gap-1.5"><Icon name="clock" size={13} /> {course.courseLength || "—"}</span>
                <span className="flex items-center gap-1.5"><Icon name="award" size={13} /> Certificate included</span>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:flex-col lg:items-end">
              <button type="button" onClick={() => toggleWishlist(course.id)} className={cn("btn btn-sm btn-white", saved && "border-ink bg-lime")}>
                <Icon name="heart" size={14} /> {saved ? "Wishlisted" : "Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap grid items-start gap-8 py-8 lg:grid-cols-[1fr_336px]">
        <div className="min-w-0">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-cream-deep">
            {course.imageUrl ? (
              <img src={absoluteUploadUrl(course.imageUrl)} alt={course.title} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-muted">No image</div>
            )}
          </div>

          {/* Objectives / What you'll learn */}
          <div className="mt-6 card p-5 md:p-6">
            <h2 className="font-display text-xl font-semibold">What you'll learn</h2>
            {objectivesList.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {objectivesList.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[0.82rem] leading-snug text-ink-soft">
                    <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-lime/60 text-ink">
                      <Icon name="check" size={10} strokeWidth={2.8} />
                    </span>
                    {obj}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[0.82rem] text-muted italic">No objectives provided for this course.</p>
            )}
          </div>

          {/* Long Description */}
          <div className="mt-6 card p-5 md:p-6">
            <h2 className="font-display text-xl font-semibold">About this course</h2>
            <div className="prose-elearn mt-3 whitespace-pre-line text-[0.9rem] leading-relaxed text-ink-soft">
              {course.description || <span className="italic text-muted">No full description provided yet.</span>}
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-cream/60 p-4 sm:grid-cols-3">
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">Course duration</p>
              <p className="mt-1 font-display text-[1.05rem] font-semibold">{course.courseLength || "—"}</p>
            </div>
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">Category</p>
              <p className="mt-1 font-display text-[1.05rem] font-semibold">{course.categoryName}</p>
            </div>
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">Certificate</p>
              <p className="mt-1 font-display text-[1.05rem] font-semibold">Included</p>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-[84px]">
          <div className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-end gap-2">
              <span className="font-display text-[2rem] font-semibold leading-none">{formatINR(course.discountPrice)}</span>
              {discountPct > 0 && <span className="pb-0.5 text-[0.8rem] text-muted line-through">{formatINR(course.originalPrice)}</span>}
            </div>
            <button
              type="button"
              onClick={() => inCart ? navigate("cart") : addToCart(course.id)}
              className={cn("btn btn-block mt-4", inCart ? "btn-lime" : "btn-primary")}
            >
              {inCart ? <><Icon name="check" size={15} /> Added to cart</> : <>Add to cart <Icon name="arrowRight" size={15} /></>}
            </button>
            <div className="mt-3 flex items-center justify-center gap-3 text-[0.63rem] text-muted">
              <button type="button" onClick={() => toggleWishlist(course.id)} className="hover:text-ink hover:underline">
                {saved ? "Saved to wishlist" : "Save for later"}
              </button>
            </div>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper section-pad">
          <div className="wrap">
            <h2 className="display text-[clamp(1.6rem,3vw,2.2rem)]">Related courses</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c, i) => <Reveal key={c.id} delay={i * 60}><CourseCard course={c} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}