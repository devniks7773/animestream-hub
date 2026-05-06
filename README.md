# Aniwave — Modern Anime Streaming Frontend

A polished, dark-themed anime discovery and streaming UI inspired by Netflix and AniList. Built as a frontend-only demo — designed to plug into a HiAnime-style API backend.

## Stack
- **React + TypeScript + Vite**
- **Tailwind CSS** with custom design tokens (HSL semantic palette, glassmorphism, gradients)
- **React Router v6**
- **Framer Motion** for cinematic transitions
- **Zustand** (with `persist`) for watchlist, continue-watching and recently-viewed state in `localStorage`
- **HLS.js** for adaptive video playback

## Pages
- `/` — Home: hero carousel, trending, latest, popular, continue watching, genre chips
- `/search` — Search with filter sidebar (genre, year, type, status)
- `/anime/:id` — Details with overview / episodes / related tabs
- `/watch/:animeId/:episodeId` — HLS player, episode sidebar, server/subtitle/autoplay controls, theater mode
- `/watchlist` — Saved list, continue watching, recently viewed

## Connecting a real backend

All data flows through `src/services/api.ts`. Currently it returns mocked data from `src/data/anime.ts`. To use a real HiAnime-style API:

1. Add `VITE_API_BASE_URL` to a `.env` file:
   ```
   VITE_API_BASE_URL=https://your-hianime-api.example.com/api/v1
   ```
2. Replace each mock function in `src/services/api.ts` with `fetch` calls. Example:
   ```ts
   getHome: async () => {
     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/home`);
     return res.json();
   },
   ```
3. Match the response shape to the existing `Anime` / `Episode` types — or adapt the components if your API differs.
4. For streaming, `getEpisodeStream` should return `{ url, type: 'hls', servers, subtitles }`. The watch page consumes this directly with HLS.js.

## Important
- This project ships with no copyrighted content. Posters and banners are AI-generated placeholders.
- The default HLS source is a public Mux test stream. Replace with backend output before any real use.
- Respect the licensing of any third-party API you connect.

## Scripts
```bash
bun install
bun dev
bun run build
```
