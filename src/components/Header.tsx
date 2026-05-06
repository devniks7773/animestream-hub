import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Bookmark, Sun, Moon, Menu, X, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();
  const { theme, setTheme } = useUserStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/search", label: "Browse" },
    { to: "/watchlist", label: "My List" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-card" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center gap-4 h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <Play className="w-4 h-4 text-primary-foreground fill-current" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight">
            Aniwave<span className="text-gradient">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-6">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden sm:flex items-center glass rounded-full px-4 h-10 w-64 lg:w-80">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search anime, genres..."
            className="bg-transparent outline-none text-sm px-3 w-full placeholder:text-muted-foreground"
          />
        </form>

        <button
          aria-label="Watchlist"
          onClick={() => navigate("/watchlist")}
          className="p-2 rounded-full hover:bg-secondary transition"
        >
          <Bookmark className="w-5 h-5" />
        </button>

        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-secondary transition"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          className="md:hidden p-2 rounded-full hover:bg-secondary"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="container py-4 flex flex-col gap-2">
              <form onSubmit={submit} className="flex items-center bg-secondary rounded-full px-4 h-10 sm:hidden">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm px-3 w-full"
                />
              </form>
              {navItems.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg ${isActive ? "bg-secondary" : "hover:bg-secondary"}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
