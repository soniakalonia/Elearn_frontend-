import { useEffect } from "react";
import { ShopProvider, useShop } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartDrawer, Toasts } from "@/components/Overlays";
import { AuthModal } from "@/components/Auth";
import Admin from "@/pages/Admin";
import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Paths from "@/pages/Paths";
import Mentor from "@/pages/Mentor";
import Reviews from "@/pages/Reviews";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import CartPage from "@/pages/CartPage";
import Wishlist from "@/pages/Wishlist";
import Dashboard from "@/pages/Dashboard";
import Legal from "@/pages/Legal";
import Icon from "@/components/Icon";

const titles: Record<string, string> = {
  home: "Elearn Hub — Learn today's skills. Build tomorrow's career.",
  courses: "Courses · Elearn Hub",
  paths: "Career tracks · Elearn Hub",
  mentor: "AI career mentor · Elearn Hub",
  reviews: "Learner reviews · Elearn Hub",
  about: "About us · Elearn Hub",
  contact: "Contact us · Elearn Hub",
  cart: "Your bag · Elearn Hub",
  wishlist: "Wishlist · Elearn Hub",
  dashboard: "My learning · Elearn Hub",
  admin: "Admin console · Elearn Hub",
};

function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-lime text-ink">
        <Icon name="compass" size={28} />
      </span>
      <p className="eyebrow mt-5">404 · Off the syllabus</p>
      <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">This page hasn't been built yet.</h1>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <a href="#/courses" className="btn btn-primary">Browse courses</a>
        <a href="#/home" className="btn btn-outline">Back home</a>
      </div>
    </div>
  );
}

function Router() {
  const { route } = useShop();
  const base = route.split("?")[0];

  useEffect(() => {
    const key = base.split("/")[0] || "home";
    document.title = titles[key] ?? "Elearn Hub";
  }, [base]);

  const renderPage = () => {
    if (base === "" || base === "home") return <Home />;
    if (base === "courses") return <Courses />;
    if (base.startsWith("course/")) {
      const id = Number(base.split("/")[1] ?? 0);
      return <CourseDetail id={id} />;
    }
    if (base === "paths") return <Paths />;
    if (base === "mentor") return <Mentor />;
    if (base === "reviews") return <Reviews />;
    if (base === "about") return <About />;
    if (base === "contact" || base === "teams") return <Contact />;
    if (base === "cart") return <CartPage />;
    if (base === "wishlist") return <Wishlist />;
    if (base === "dashboard") return <Dashboard />;
    if (base === "admin") return <Admin />;
    if (base.startsWith("legal/")) {
      const doc = base.split("/")[1] ?? "terms";
      return <Legal doc={doc} />;
    }
    return <NotFound />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {renderPage()}
      </main>
      {base !== "dashboard" && base !== "admin" && <Footer />}
      <CartDrawer />
      <AuthModal />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <Router />
    </ShopProvider>
  );
}