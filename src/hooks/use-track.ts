import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/integrations/supabase/client";

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

	const {data: apiTrack, isLoading} = useQuery({
		queryKey: ["track_info", id],
		queryFn: async () => {
			const {data, error} = await supabase.functions.invoke("track-info", {body: {id}});
			if (error) throw error;
			return (data?.track ?? null) as TrackDetails | null;
		},
		enabled: Boolean(id),
		staleTime: 5 * 60_000,
		retry: 1,
	});

	const matches = cachedRows.filter((r) => r.song.id === id);
	const primary = matches[0];

	const track: TrackDetails | null = apiTrack
		?? (primary ? {...primary.song, duration: primary.duration} : null);

	const plays = matches
		.filter((r) => typeof r.played_at === "number" && r.sh_id)
		.map((r) => ({
			sh_id: r.sh_id as number,
			played_at: r.played_at as number,
			label: r === cachedPayload?.now_playing ? "Играет сейчас" : "В эфире",
		}));

	return {track, plays, isLoading: isLoading && !primary};
}
