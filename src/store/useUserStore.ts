import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ContinueItem {
  animeId: string;
  episodeId: string;
  episodeNumber: number;
  progress: number; // 0-1
  updatedAt: number;
}

interface UserState {
  watchlist: string[];
  continueWatching: ContinueItem[];
  recentlyViewed: string[];
  theme: "dark" | "light";
  autoplayNext: boolean;
  toggleWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  addRecent: (id: string) => void;
  updateContinue: (item: ContinueItem) => void;
  removeContinue: (animeId: string) => void;
  setTheme: (t: "dark" | "light") => void;
  toggleAutoplay: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      continueWatching: [],
      recentlyViewed: [],
      theme: "dark",
      autoplayNext: true,
      toggleWatchlist: (id) =>
        set((s) => ({
          watchlist: s.watchlist.includes(id)
            ? s.watchlist.filter((x) => x !== id)
            : [id, ...s.watchlist],
        })),
      isInWatchlist: (id) => get().watchlist.includes(id),
      addRecent: (id) =>
        set((s) => ({
          recentlyViewed: [id, ...s.recentlyViewed.filter((x) => x !== id)].slice(0, 12),
        })),
      updateContinue: (item) =>
        set((s) => ({
          continueWatching: [
            item,
            ...s.continueWatching.filter((c) => c.animeId !== item.animeId),
          ].slice(0, 10),
        })),
      removeContinue: (animeId) =>
        set((s) => ({ continueWatching: s.continueWatching.filter((c) => c.animeId !== animeId) })),
      setTheme: (t) => set({ theme: t }),
      toggleAutoplay: () => set((s) => ({ autoplayNext: !s.autoplayNext })),
    }),
    { name: "anime-stream-user" }
  )
);
