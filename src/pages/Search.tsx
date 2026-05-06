import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, type Anime } from "@/services/api";
import { ALL_GENRES } from "@/data/anime";
import AnimeCard from "@/components/AnimeCard";
import { CardSkeleton } from "@/components/Skeletons";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TYPES = ["TV", "Movie", "OVA", "Special"];
const STATUSES = ["Ongoing", "Completed", "Upcoming"];
const YEARS = [2025, 2024, 2023];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [results, setResults] = useState<Anime[] | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get("q") ?? "";
  const genre = params.get("genre") ?? "";
  const year = params.get("year") ? Number(params.get("year")) : undefined;
  const type = params.get("type") ?? "";
  const status = params.get("status") ?? "";

  useEffect(() => {
    setResults(null);
    api.search(q, { genre: genre || undefined, year, type: type || undefined, status: status || undefined }).then(setResults);
  }, [q, genre, year, type, status]);

  const update = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
  };

  const activeFilters = useMemo(() => [genre, year, type, status].filter(Boolean).length, [genre, year, type, status]);

  return (
    <div className="container py-8 animate-fade-in">
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <SearchIcon className="w-5 h-5 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Search anime, genres, studios..."
          className="bg-transparent outline-none flex-1 text-base"
        />
        <button onClick={() => setFiltersOpen((v) => !v)} className="lg:hidden inline-flex items-center gap-2 bg-secondary px-3 py-2 rounded-full text-sm">
          <SlidersHorizontal className="w-4 h-4" /> Filters {activeFilters > 0 && <span className="bg-primary text-primary-foreground rounded-full px-2 text-xs">{activeFilters}</span>}
        </button>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 mt-6">
        <AnimatePresence>
          {(filtersOpen || typeof window !== "undefined") && (
            <motion.aside
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${filtersOpen ? "block" : "hidden"} lg:block glass rounded-2xl p-4 h-fit sticky top-24`}
            >
              <FilterGroup label="Genre" options={ALL_GENRES} value={genre} onChange={(v) => update("genre", v)} />
              <FilterGroup label="Year" options={YEARS.map(String)} value={year ? String(year) : ""} onChange={(v) => update("year", v)} />
              <FilterGroup label="Type" options={TYPES} value={type} onChange={(v) => update("type", v)} />
              <FilterGroup label="Status" options={STATUSES} value={status} onChange={(v) => update("status", v)} />
              {activeFilters > 0 && (
                <button onClick={() => setParams(q ? new URLSearchParams({ q }) : new URLSearchParams())} className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {results ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Searching..."}
          </p>
          {results ? (
            results.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="font-display text-xl">No anime matched your search.</p>
                <p className="text-muted-foreground text-sm mt-2">Try a different keyword or clear filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.map((a, i) => <AnimeCard key={a.id} anime={a} index={i} />)}
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(value === o ? "" : o)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${value === o ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary hover:bg-muted"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
