# Project conventions

- User-facing player preferences (volume, mute, soundbar visibility) live in `src/contexts/PlayerContext.tsx` and persist to `localStorage` under `player_*` keys, so the choice survives reloads and route changes; never store them per-page.
