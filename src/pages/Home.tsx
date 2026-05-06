import { useEffect, useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import AnimeRow from "@/components/AnimeRow";
import { api } from "@/services/api";
import type { Anime } from "@/services/api";
import { ALL_GENRES, getAnime } from "@/data/anime";
import { useUserStore } from "@/store/useUserStore";
import { RowSkeleton } from "@/components/Skeletons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const [data, setData] = useState<{ hero: Anime[]; trending: Anime[]; latest: Anime[]; popular: Anime[] } | null>(null);
  const continueWatching = useUserStore((s) => s.continueWatching);

  useEffect(() => {
    api.getHome().then(setData);
  }, []);

  const continueItems = continueWatching
    .map((c) => getAnime(c.animeId))
    .filter((a): a is Anime => Boolean(a));

  return (
    <div className="animate-fade-in">
      {data ? <HeroCarousel slides={data.hero} /> : <div className="h-[78vh] bg-secondary animate-pulse" />}

      <section className="container pt-10">
        <h2 className="font-display text-xl font-semibold mb-3 text-muted-foreground">Browse by genre</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_GENRES.map((g, i) => (
            <motion.div
              key={g}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/search?genre=${encodeURIComponent(g)}`}
                className="glass px-4 py-2 rounded-full text-sm font-medium hover:bg-gradient-primary hover:text-primary-foreground hover:shadow-glow transition-all"
              >
                {g}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {continueItems.length > 0 && (
        <AnimeRow title="Continue Watching" subtitle="Pick up where you left off" items={continueItems} />
      )}

      {data ? (
        <>
          <AnimeRow title="Trending Now" subtitle="What everyone's watching" items={data.trending} />
          <AnimeRow title="Latest Episodes" subtitle="Fresh from the studios" items={data.latest} />
          <AnimeRow title="Popular This Season" items={data.popular} />
        </>
      ) : (
        <>
          <RowSkeleton />
          <RowSkeleton />
        </>
      )}
    </div>
  );
}
