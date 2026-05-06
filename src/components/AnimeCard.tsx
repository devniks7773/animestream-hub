import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { motion } from "framer-motion";
import type { Anime } from "@/services/api";

export default function AnimeCard({ anime, index = 0 }: { anime: Anime; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link to={`/anime/${anime.id}`} className="anime-card block group">
        <div className="aspect-[2/3] relative">
          <img
            src={anime.poster}
            alt={anime.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-card opacity-90" />
          <div className="absolute top-2 right-2 glass px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-accent text-accent" /> {anime.rating}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="font-display font-semibold text-sm line-clamp-2">{anime.title}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              {anime.type} • {anime.episodeCount} eps
            </p>
          </div>
          <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-primary grid place-items-center shadow-glow">
              <Play className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
