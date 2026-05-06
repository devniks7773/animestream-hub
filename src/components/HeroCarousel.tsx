import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Star, Info } from "lucide-react";
import { Link } from "react-router-dom";
import type { Anime } from "@/services/api";
import { useUserStore } from "@/store/useUserStore";

export default function HeroCarousel({ slides }: { slides: Anime[] }) {
  const [i, setI] = useState(0);
  const { toggleWatchlist, isInWatchlist } = useUserStore();

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length]);

  const a = slides[i];
  if (!a) return null;

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={a.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img src={a.banner} alt={a.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container h-full flex items-end md:items-center pb-24 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-accent">Featured</span>
              <span className="h-px w-12 bg-accent" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] mb-4">
              {a.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-accent font-semibold">
                <Star className="w-4 h-4 fill-current" /> {a.rating}
              </span>
              <span>•</span>
              <span>{a.year}</span>
              <span>•</span>
              <span>{a.type}</span>
              <span>•</span>
              <span>{a.episodeCount} Episodes</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {a.genres.map((g) => (
                <span key={g} className="glass px-3 py-1 rounded-full text-xs font-medium">{g}</span>
              ))}
            </div>
            <p className="text-sm md:text-base text-foreground/80 mb-8 line-clamp-3 max-w-xl">
              {a.synopsis}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/watch/${a.id}/${a.episodes[0]?.id}`}
                className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-semibold px-6 py-3 rounded-full shadow-glow hover:scale-105 transition"
              >
                <Play className="w-5 h-5 fill-current" /> Watch Now
              </Link>
              <Link
                to={`/anime/${a.id}`}
                className="inline-flex items-center gap-2 glass font-semibold px-6 py-3 rounded-full hover:bg-secondary transition"
              >
                <Info className="w-5 h-5" /> Details
              </Link>
              <button
                onClick={() => toggleWatchlist(a.id)}
                className="inline-flex items-center gap-2 glass font-semibold px-4 py-3 rounded-full hover:bg-secondary transition"
                aria-label="Add to list"
              >
                <Plus className={`w-5 h-5 transition ${isInWatchlist(a.id) ? "rotate-45 text-primary" : ""}`} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-10 container flex items-center gap-2">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-10 bg-gradient-primary" : "w-5 bg-foreground/30"}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
