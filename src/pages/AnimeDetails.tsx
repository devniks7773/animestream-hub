import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, type Anime } from "@/services/api";
import { ANIME } from "@/data/anime";
import AnimeRow from "@/components/AnimeRow";
import { useUserStore } from "@/store/useUserStore";
import { Play, Plus, Star, Calendar, Tv, Building2, Clock } from "lucide-react";
import { motion } from "framer-motion";

type Tab = "overview" | "episodes" | "related";

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const { toggleWatchlist, isInWatchlist, addRecent } = useUserStore();

  useEffect(() => {
    if (!id) return;
    api.getAnime(id).then((a) => {
      setAnime(a);
      if (a) addRecent(a.id);
    });
  }, [id, addRecent]);

  const recommended = useMemo(
    () => (anime ? ANIME.filter((a) => a.id !== anime.id && a.genres.some((g) => anime.genres.includes(g))).slice(0, 8) : []),
    [anime]
  );

  if (!anime) {
    return <div className="container py-20 animate-pulse h-96 bg-secondary rounded-2xl" />;
  }

  return (
    <div className="animate-fade-in">
      <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <img src={anime.banner} alt="" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="container -mt-40 md:-mt-48 relative z-10">
        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            src={anime.poster}
            alt={anime.title}
            className="w-44 md:w-full rounded-2xl shadow-cinematic mx-auto md:mx-0"
          />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold mb-2">{anime.title}</h1>
            {anime.englishTitle && (
              <p className="text-muted-foreground mb-4">{anime.englishTitle}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
              <span className="flex items-center gap-1 text-accent font-semibold">
                <Star className="w-4 h-4 fill-current" /> {anime.rating}
              </span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {anime.year}</span>
              <span className="flex items-center gap-1"><Tv className="w-4 h-4" /> {anime.type}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {anime.episodeCount} eps</span>
              <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {anime.studio}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                anime.status === "Ongoing" ? "bg-accent/20 text-accent" : anime.status === "Completed" ? "bg-primary/20 text-primary" : "bg-secondary"
              }`}>{anime.status}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres.map((g) => (
                <Link key={g} to={`/search?genre=${g}`} className="glass px-3 py-1 rounded-full text-xs hover:bg-secondary transition">{g}</Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={`/watch/${anime.id}/${anime.episodes[0].id}`} className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-semibold px-6 py-3 rounded-full shadow-glow hover:scale-105 transition">
                <Play className="w-5 h-5 fill-current" /> Watch Episode 1
              </Link>
              <button onClick={() => toggleWatchlist(anime.id)} className="inline-flex items-center gap-2 glass px-5 py-3 rounded-full hover:bg-secondary transition font-semibold">
                <Plus className={`w-5 h-5 transition ${isInWatchlist(anime.id) ? "rotate-45 text-primary" : ""}`} />
                {isInWatchlist(anime.id) ? "In My List" : "Add to List"}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 border-b border-border flex gap-1 overflow-x-auto scrollbar-hide">
          {(["overview", "episodes", "related"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 capitalize text-sm font-semibold border-b-2 transition ${
                tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="py-8">
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
              <h3 className="font-display text-xl font-semibold mb-3">Synopsis</h3>
              <p className="text-foreground/80 leading-relaxed">{anime.synopsis}</p>
            </motion.div>
          )}
          {tab === "episodes" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {anime.episodes.map((ep, i) => (
                <motion.div
                  key={ep.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link to={`/watch/${anime.id}/${ep.id}`} className="group flex gap-3 p-3 rounded-xl glass hover:bg-secondary transition">
                    <div className="relative w-32 aspect-video rounded-lg overflow-hidden shrink-0">
                      <img src={ep.thumbnail} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      <div className="absolute inset-0 grid place-items-center bg-background/30 opacity-0 group-hover:opacity-100 transition">
                        <Play className="w-6 h-6 fill-current" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">EP {ep.number} • {ep.duration}</p>
                      <p className="font-semibold text-sm line-clamp-2">{ep.title}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          {tab === "related" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommended.map((a, i) => (
                <Link key={a.id} to={`/anime/${a.id}`} className="anime-card block">
                  <img src={a.poster} alt={a.title} loading="lazy" className="aspect-[2/3] w-full object-cover" />
                  <div className="p-3"><p className="text-sm font-semibold line-clamp-1">{a.title}</p></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {recommended.length > 0 && <AnimeRow title="You may also like" items={recommended} />}
    </div>
  );
}
