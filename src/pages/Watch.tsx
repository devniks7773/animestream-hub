import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { api, type Anime } from "@/services/api";
import { useUserStore } from "@/store/useUserStore";
import { ChevronLeft, ChevronRight, ListVideo, Subtitles, Server, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Watch() {
  const { animeId, episodeId } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [stream, setStream] = useState<{ url: string; servers: string[]; subtitles: string[] } | null>(null);
  const [server, setServer] = useState("Vidstream");
  const [subtitle, setSubtitle] = useState("English");
  const [theater, setTheater] = useState(false);
  const { autoplayNext, toggleAutoplay, updateContinue } = useUserStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!animeId) return;
    api.getAnime(animeId).then(setAnime);
  }, [animeId]);

  useEffect(() => {
    if (!animeId || !episodeId) return;
    api.getEpisodeStream(animeId, episodeId).then(setStream);
  }, [animeId, episodeId]);

  useEffect(() => {
    if (!stream || !videoRef.current) return;
    const video = videoRef.current;
    let hls: Hls | undefined;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(stream.url);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream.url;
    }
    return () => { hls?.destroy(); };
  }, [stream]);

  const ep = anime?.episodes.find((e) => e.id === episodeId);
  const epIdx = anime?.episodes.findIndex((e) => e.id === episodeId) ?? -1;
  const prev = anime && epIdx > 0 ? anime.episodes[epIdx - 1] : null;
  const next = anime && epIdx >= 0 && epIdx < (anime.episodes.length - 1) ? anime.episodes[epIdx + 1] : null;

  useEffect(() => {
    if (!anime || !ep) return;
    updateContinue({
      animeId: anime.id,
      episodeId: ep.id,
      episodeNumber: ep.number,
      progress: 0.05,
      updatedAt: Date.now(),
    });
  }, [anime, ep, updateContinue]);

  const onEnded = () => {
    if (autoplayNext && next) navigate(`/watch/${anime!.id}/${next.id}`);
  };

  if (!anime || !ep) return <div className="container py-20 animate-pulse h-96 bg-secondary rounded-2xl" />;

  return (
    <div className="animate-fade-in">
      <div className={`container py-6 grid gap-6 ${theater ? "" : "lg:grid-cols-[1fr_340px]"}`}>
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-cinematic"
          >
            <video
              ref={videoRef}
              controls
              autoPlay
              onEnded={onEnded}
              poster={anime.banner}
              className="w-full h-full"
            />
          </motion.div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Link to={`/anime/${anime.id}`} className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to {anime.title}
            </Link>
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                onClick={() => prev && navigate(`/watch/${anime.id}/${prev.id}`)}
                disabled={!prev}
                className="inline-flex items-center gap-1 glass px-4 py-2 rounded-full text-sm disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => next && navigate(`/watch/${anime.id}/${next.id}`)}
                disabled={!next}
                className="inline-flex items-center gap-1 glass px-4 py-2 rounded-full text-sm disabled:opacity-40"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheater((v) => !v)}
                className="inline-flex items-center gap-1 glass px-4 py-2 rounded-full text-sm"
              >
                {theater ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {theater ? "Exit Theater" : "Theater"}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="font-display text-2xl font-bold">{ep.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">Episode {ep.number} • {ep.duration}</p>
            <p className="mt-3 text-foreground/80">{ep.description}</p>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Server className="w-3 h-3" /> Server</div>
              <div className="flex flex-wrap gap-2">
                {stream?.servers.map((s) => (
                  <button key={s} onClick={() => setServer(s)} className={`px-3 py-1 rounded-full text-xs font-medium ${server === s ? "bg-gradient-primary text-primary-foreground" : "bg-secondary"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Subtitles className="w-3 h-3" /> Subtitles</div>
              <div className="flex flex-wrap gap-2">
                {stream?.subtitles.map((s) => (
                  <button key={s} onClick={() => setSubtitle(s)} className={`px-3 py-1 rounded-full text-xs font-medium ${subtitle === s ? "bg-gradient-primary text-primary-foreground" : "bg-secondary"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Auto-play next</div>
                <div className="text-sm font-semibold">{autoplayNext ? "On" : "Off"}</div>
              </div>
              <button
                onClick={toggleAutoplay}
                className={`w-12 h-7 rounded-full p-1 transition ${autoplayNext ? "bg-gradient-primary" : "bg-secondary"}`}
                aria-label="Toggle autoplay"
              >
                <div className={`w-5 h-5 rounded-full bg-background transition-transform ${autoplayNext ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {!theater && (
          <aside className="glass rounded-2xl p-3 max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="flex items-center gap-2 px-2 py-2 text-sm font-semibold sticky top-0">
              <ListVideo className="w-4 h-4" /> Episodes
            </div>
            <div className="flex flex-col gap-1">
              {anime.episodes.map((e) => (
                <Link
                  key={e.id}
                  to={`/watch/${anime.id}/${e.id}`}
                  className={`flex gap-3 p-2 rounded-xl transition ${e.id === ep.id ? "bg-gradient-primary text-primary-foreground" : "hover:bg-secondary"}`}
                >
                  <div className="w-20 aspect-video rounded-md overflow-hidden shrink-0">
                    <img src={e.thumbnail} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs opacity-80">EP {e.number}</p>
                    <p className="text-sm font-medium line-clamp-2">{e.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
