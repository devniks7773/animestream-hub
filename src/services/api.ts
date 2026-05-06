/**
 * Service abstraction layer.
 *
 * Replace the mock implementations below with real calls to a HiAnime-style
 * API by setting VITE_API_BASE_URL in .env and wiring fetch calls in each
 * function. Component code only depends on this module.
 *
 * Example real impl:
 *   const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/anime/home`)
 *   return await res.json()
 */
import { ANIME, getAnime, searchAnime, HERO_SLIDES, type Anime } from "@/data/anime";

const delay = <T,>(data: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(data), ms));

export const api = {
  getHome: () =>
    delay({
      hero: HERO_SLIDES,
      trending: ANIME.filter((a) => a.trending),
      latest: [...ANIME].reverse().slice(0, 8),
      popular: ANIME.filter((a) => a.popular),
    }),
  getAnime: (id: string) => delay(getAnime(id) ?? null),
  search: (q: string, filters?: { genre?: string; year?: number; type?: string; status?: string }) => {
    let r = searchAnime(q);
    if (filters?.genre) r = r.filter((a) => a.genres.includes(filters.genre!));
    if (filters?.year) r = r.filter((a) => a.year === filters.year);
    if (filters?.type) r = r.filter((a) => a.type === filters.type);
    if (filters?.status) r = r.filter((a) => a.status === filters.status);
    return delay(r);
  },
  getEpisodeStream: (_animeId: string, _episodeId: string) =>
    // Placeholder. Real API would return { sources: [{ url, quality }], subtitles: [...] }
    delay({
      // Public test HLS stream (Mux). Replace with real backend response.
      url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      type: "hls" as const,
      servers: ["Vidstream", "Megacloud", "StreamSB"],
      subtitles: ["English", "Spanish", "Japanese", "Off"],
    }),
};

export type { Anime };
