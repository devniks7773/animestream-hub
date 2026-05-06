import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "./AnimeCard";
import type { Anime } from "@/services/api";

interface Props {
  title: string;
  subtitle?: string;
  items: Anime[];
}

export default function AnimeRow({ title, subtitle, items }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!items.length) return null;
  return (
    <section className="container py-6 md:py-10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll(-1)} className="p-2 rounded-full glass hover:bg-secondary transition" aria-label="Scroll left">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll(1)} className="p-2 rounded-full glass hover:bg-secondary transition" aria-label="Scroll right">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-6 px-6"
      >
        {items.map((a, i) => (
          <div key={a.id} className="snap-start shrink-0 w-[150px] sm:w-[170px] md:w-[190px]">
            <AnimeCard anime={a} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
