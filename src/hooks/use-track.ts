import {useQuery} from "@tanstack/react-query";

const API_URL = "https://backend.your-wave.ru/api/nowplaying/your_wave";

export type AzuraSong = {
	id: string;
	art?: string;
	artist?: string;
	title?: string;
	album?: string;
	genre?: string;
	isrc?: string;
	lyrics?: string;
};

export type TrackDetails = AzuraSong & { duration?: number };

type SongRow = { sh_id?: number; played_at?: number; duration?: number; song: AzuraSong };

function collect(payload: any): SongRow[] {
	if (!payload) return [];
	const rows: SongRow[] = [];
	if (payload.now_playing?.song) rows.push(payload.now_playing);
	if (payload.playing_next?.song) rows.push(payload.playing_next);
	if (Array.isArray(payload.song_history)) rows.push(...payload.song_history);
	return rows.filter((r) => r?.song?.id);
}

/**
 * Resolves a track by its AzuraCast song id. Uses live socket data from the
 * cache when available and falls back to the public AzuraCast API so that
 * direct links (/track/:id) work on a cold page load.
 */
export function useTrackById(id: string | undefined, cachedPayload: any) {
	const cachedRows = collect(cachedPayload);
	const cachedMatch = cachedRows.find((r) => r.song.id === id);

	const {data: apiPayload, isLoading} = useQuery({
		queryKey: ["azura_nowplaying_api", id],
		queryFn: async () => {
			const res = await fetch(API_URL);
			if (!res.ok) throw new Error("Не удалось загрузить данные о треке");
			return res.json();
		},
		enabled: Boolean(id) && !cachedMatch,
		staleTime: 30_000,
		retry: 1,
	});

	const rows = cachedMatch ? cachedRows : collect(apiPayload);
	const matches = rows.filter((r) => r.song.id === id);
	const primary = matches[0];

	const track: TrackDetails | null = primary
		? {...primary.song, duration: primary.duration}
		: null;

	const plays = matches
		.filter((r) => typeof r.played_at === "number" && r.sh_id)
		.map((r) => ({
			sh_id: r.sh_id as number,
			played_at: r.played_at as number,
			label: r === (cachedPayload?.now_playing ?? apiPayload?.now_playing) ? "Играет сейчас" : "В эфире",
		}));

	return {track, plays, isLoading: isLoading && !cachedMatch};
}
