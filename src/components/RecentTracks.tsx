import {Link} from "react-router-dom";
import {defaultData, tsToHHMM} from "@/lib/utils.ts";
import {useQuery} from "@tanstack/react-query";

const RecentTracks = () => {
	const {data: nowplaying} = useQuery(defaultData);

	return (
		<section className="py-20 bg-card/30" id="recent">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between mb-8">
					<h2 className="font-display text-3xl md:text-4xl text-gradient">Недавно играло</h2>
					<Link
						to="/history" style={{opacity: 0}}
						className="text-sm font-medium text-primary hover:text-accent transition-colors"
					>
						Вся история →
					</Link>
				</div>

				<div className="grid gap-4 grid-cols-1">

					{nowplaying && nowplaying.song_history.length > 0 ? nowplaying.song_history.map((track, index) => (
						<div
							key={track.sh_id}
							className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors animate-slide-up"
							style={{animationDelay: `${index * 0.1}s`}}
						>
							<div
								className="bg-contain w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0"
								style={{backgroundImage: `url(${track.song.art})`}}>
							</div>
							<div className="flex-1 min-w-0">
								<h4 className="text-sm md:text-base font-medium text-foreground truncate">{track.song.title}</h4>
								<p className="text-sm text-muted-foreground truncate">{track.song.artist}</p>
							</div>
							<span
								className="text-xs text-muted-foreground flex-shrink-0">{tsToHHMM(track.played_at)}</span>
						</div>
					)) : 'Загрузка...'}
				</div>
			</div>
		</section>
	);
};

export default RecentTracks;
