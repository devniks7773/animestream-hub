import p1 from "@/assets/poster-1.jpg";
import p2 from "@/assets/poster-2.jpg";
import p3 from "@/assets/poster-3.jpg";
import p4 from "@/assets/poster-4.jpg";
import p5 from "@/assets/poster-5.jpg";
import p6 from "@/assets/poster-6.jpg";
import p7 from "@/assets/poster-7.jpg";
import p8 from "@/assets/poster-8.jpg";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";

export type AnimeStatus = "Ongoing" | "Completed" | "Upcoming";
export type AnimeType = "TV" | "Movie" | "OVA" | "Special";

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
}

export interface Anime {
  id: string;
  title: string;
  englishTitle?: string;
  poster: string;
  banner: string;
  rating: number;
  year: number;
  status: AnimeStatus;
  type: AnimeType;
  studio: string;
  genres: string[];
  synopsis: string;
  episodeCount: number;
  episodes: Episode[];
  trending?: boolean;
  popular?: boolean;
}

const posters = [p1, p2, p3, p4, p5, p6, p7, p8];
const heroes = [h1, h2, h3];

const baseTitles = [
  { t: "Crimson Oath", e: "The Crimson Oath", s: "MAPPA", g: ["Action", "Supernatural", "Drama"] },
  { t: "Sakura Reverie", e: "Sakura no Reverie", s: "Kyoto Animation", g: ["Romance", "Slice of Life"] },
  { t: "Neon Phantom", e: "Neon Phantom 2099", s: "Trigger", g: ["Sci-Fi", "Cyberpunk", "Action"] },
  { t: "Shinobi Eclipse", e: "Shinobi: Eclipse Arc", s: "Bones", g: ["Action", "Adventure"] },
  { t: "Astral Lullaby", e: "Astral Lullaby", s: "ufotable", g: ["Fantasy", "Drama", "Mystery"] },
  { t: "Dragon's Vow", e: "Dragon's Vow", s: "Madhouse", g: ["Fantasy", "Adventure", "Action"] },
  { t: "Petal Promise", e: "A Petal's Promise", s: "P.A. Works", g: ["Romance", "School", "Drama"] },
  { t: "Iron Halo", e: "Iron Halo Squadron", s: "Sunrise", g: ["Mecha", "Sci-Fi", "Military"] },
];

function makeEpisodes(animeId: string, count: number): Episode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${animeId}-ep-${i + 1}`,
    number: i + 1,
    title: `Episode ${i + 1}: ${["Awakening", "Crossroads", "The Vow", "Echoes", "Storm Front", "Whispers", "Resolve", "Endgame", "Twilight", "Dawn", "Reverie", "Ashes"][i % 12]}`,
    duration: "24m",
    thumbnail: posters[(i + 1) % posters.length],
    description: "An exhilarating chapter unfolds as our heroes face new trials and uncover hidden truths in their journey.",
  }));
}

export const ANIME: Anime[] = baseTitles.map((b, i) => {
  const id = b.t.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const epCount = 8 + (i % 5) * 2;
  return {
    id,
    title: b.t,
    englishTitle: b.e,
    poster: posters[i],
    banner: heroes[i % heroes.length],
    rating: Number((7.8 + Math.random() * 1.7).toFixed(1)),
    year: 2023 + (i % 3),
    status: (["Ongoing", "Completed", "Upcoming"] as AnimeStatus[])[i % 3],
    type: (["TV", "TV", "Movie", "OVA"] as AnimeType[])[i % 4],
    studio: b.s,
    genres: b.g,
    synopsis:
      "In a world teetering between worlds seen and unseen, an unlikely hero rises to confront a creeping shadow. With allies forged through fire and a destiny carved by choice, they march toward a horizon that promises both ruin and rebirth.",
    episodeCount: epCount,
    episodes: makeEpisodes(id, epCount),
    trending: i < 5,
    popular: i % 2 === 0,
  };
});

export const HERO_SLIDES = [ANIME[0], ANIME[2], ANIME[5]].map((a, i) => ({
  ...a,
  banner: heroes[i],
}));

export const ALL_GENRES = Array.from(new Set(ANIME.flatMap((a) => a.genres))).sort();

export function getAnime(id: string) {
  return ANIME.find((a) => a.id === id);
}
export function searchAnime(q: string) {
  const s = q.toLowerCase().trim();
  if (!s) return ANIME;
  return ANIME.filter(
    (a) =>
      a.title.toLowerCase().includes(s) ||
      a.englishTitle?.toLowerCase().includes(s) ||
      a.genres.some((g) => g.toLowerCase().includes(s))
  );
}
