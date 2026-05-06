import { useUserStore } from "@/store/useUserStore";
import { getAnime } from "@/data/anime";
import AnimeCard from "@/components/AnimeCard";
import { Bookmark, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function Watchlist() {
  const { watchlist, continueWatching, recentlyViewed } = useUserStore();
  const list = watchlist.map(getAnime).filter(Boolean);
  const cont = continueWatching.map((c) => ({ c, a: getAnime(c.animeId) })).filter((x) => x.a);
  const recent = recentlyViewed.map(getAnime).filter(Boolean);

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-display text-4xl font-extrabold mb-2">My Library</h1>
      <p className="text-muted-foreground mb-8">Your personal anime collection, saved on this device.</p>

      <Section icon={<Bookmark className="w-5 h-5" />} title="Watchlist" empty="You haven't saved any anime yet.">
        {list.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {list.map((a, i) => <AnimeCard key={a!.id} anime={a!} index={i} />)}
          </div>
        )}
      </Section>

      <Section icon={<Clock className="w-5 h-5" />} title="Continue Watching" empty="Start watching to see your progress here.">
        {cont.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cont.map(({ c, a }) => (
              <Link key={c.animeId} to={`/watch/${a!.id}/${c.episodeId}`} className="glass rounded-xl p-3 flex gap-3 hover:bg-secondary transition">
                <img src={a!.poster} alt="" className="w-20 aspect-[2/3] object-cover rounded-md" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold line-clamp-1">{a!.title}</p>
                  <p className="text-xs text-muted-foreground">Episode {c.episodeNumber}</p>
                  <div className="mt-3 h-1 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${Math.round(c.progress * 100)}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section icon={<Eye className="w-5 h-5" />} title="Recently Viewed" empty="Browse some titles to start your history.">
        {recent.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {recent.map((a, i) => <AnimeCard key={a!.id} anime={a!} index={i} />)}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ icon, title, empty, children }: { icon: React.ReactNode; title: string; empty: string; children: React.ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.some(Boolean) : Boolean(children);
  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary">{icon}</span>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
      </div>
      {hasChildren ? children : (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">{empty}</div>
      )}
    </section>
  );
}
