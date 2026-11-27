import Icon from "@/components/Icon";
import { Breadcrumbs, CourseCard, EmptyState } from "@/components/Primitives";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/data";

export default function Wishlist() {
  const { wishlistIds, courses, navigate, addToCart } = useShop();

  const saved = courses.filter((c) => wishlistIds.includes(c.id));
  const total = saved.reduce((sum, c) => sum + c.discountPrice, 0);
  const totalSaved = saved.reduce((sum, c) => sum + Math.max(0, c.originalPrice - c.discountPrice), 0);
  const recommendations = courses.filter((c) => !wishlistIds.includes(c.id)).slice(0, 3);

  return (
    <div className="wrap py-6 md:py-9">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[clamp(2rem,4vw,2.9rem)]">
            Saved for <span className="italic-accent text-plum">later.</span>
          </h1>
          <p className="mt-1 text-[0.84rem] text-muted">
            {saved.length === 0 ? "Your shortlist starts here." : `${saved.length} course${saved.length > 1 ? "s" : ""} · add them to your bag whenever you're ready.`}
          </p>
        </div>
        <a href="/courses" className="btn btn-sm btn-outline"><Icon name="plus" size={14} /> Add more courses</a>
      </div>

      {saved.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon="heart"
            title="No courses saved yet"
            copy="Tap the heart on any course card to keep it here. Wishlisted courses stay saved to your account."
            action={<button type="button" onClick={() => navigate("courses")} className="btn btn-primary">Explore courses</button>}
          />
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_300px]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {saved.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
          <aside className="lg:sticky lg:top-[78px] xl:top-[122px]">
            <div className="card p-5">
              <p className="eyebrow">Your shortlist</p>
              <h2 className="mt-1 font-display text-[1.2rem] font-semibold">Ready when you are.</h2>
              <div className="mt-4 space-y-2">
                {saved.map((course) => (
                  <div key={course.id} className="flex items-center justify-between gap-2 text-[0.74rem]">
                    <span className="min-w-0 flex-1 truncate text-ink-soft">{course.title}</span>
                    <span className="shrink-0 font-medium">{formatINR(course.discountPrice)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                <span className="text-[0.76rem] font-semibold">Total</span>
                <span className="font-display text-lg font-semibold">{formatINR(total)}</span>
              </div>
              {totalSaved > 0 && (
                <p className="mt-1 text-[0.62rem] text-muted">Save {formatINR(totalSaved)} versus list price.</p>
              )}
              <button
                type="button"
                onClick={() => addToCart(saved[0].id)}
                className="btn btn-primary btn-block mt-4"
              >
                Add to bag <Icon name="bag" size={14} />
              </button>
            </div>
          </aside>
        </div>
      )}

      {recommendations.length > 0 && (
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-[1.3rem] font-semibold">You might also like</h2>
            <a href="/courses" className="text-[0.7rem] font-semibold text-ink hover:underline">View all courses</a>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        </section>
      )}
    </div>
  );
}