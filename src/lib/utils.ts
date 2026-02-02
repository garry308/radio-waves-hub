import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import heroBg from "@/assets/hero-bg.jpg";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function secondsToMMSS(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${mm}:${ss}`;
}

export function tsToHHMM(ms: number) {
  const date = new Date(ms * 1000);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export const defaultData = {
  queryKey: ['now_playing'],
  queryFn: () => {
    return {
      now_playing: {
        elapsed: 0,
        duration: 0,
        song: {
          art: heroBg,
          artist: 'Загрузка...',
          title: 'Загрузка...'
        }
      },
      song_history: []
    };
  },
  staleTime: Infinity,
}

export const elapsedDefaultData = {
  queryKey: ['elapsed_time'],
  queryFn: () => {
    return null;
  },
  staleTime: Infinity
}
