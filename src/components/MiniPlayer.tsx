import {Play, Pause, Volume2, VolumeX, Music} from "lucide-react";
import {Slider} from "@/components/ui/slider";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";
import {defaultData, elapsedDefaultData, secondsToMMSS} from "@/lib/utils.ts";
import {usePlayer} from "@/contexts/PlayerContext";

const MiniPlayer = () => {
	const {data: nowplaying} = useQuery(defaultData);
	const {data: elapsed_time} = useQuery(elapsedDefaultData);
	const {isPlaying, toggle, volume, handleVolumeChange, toggleMute} = usePlayer();

	const progress = nowplaying && nowplaying.now_playing.duration
		? (elapsed_time / nowplaying.now_playing.duration) * 100
		: 0;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
			<div className="h-1 bg-secondary">
				<div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
					 style={{width: `${progress}%`}}/>
			</div>
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center gap-4">
					<button
						onClick={toggle}
						className="w-11 h-11 rounded-full bg-primary flex items-center justify-center glow-primary hover:scale-105 transition-transform flex-shrink-0"
					>
						{isPlaying ? (
							<Pause className="w-5 h-5 text-primary-foreground"/>
						) : (
							<Play className="w-5 h-5 text-primary-foreground ml-0.5"/>
						)}
					</button>

					{nowplaying ? (
						<Link
							to={`/track/${nowplaying.now_playing.song.id}`}
							className="w-11 h-11 rounded-lg bg-cover bg-center flex-shrink-0 hidden sm:block"
							style={{backgroundImage: `url(${nowplaying.now_playing.song.art})`}}
						/>
					) : (
						<div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 hidden sm:block">
							<Music className="w-5 h-5 text-muted-foreground"/>
						</div>
					)}

					<div className="flex-1 min-w-0">
						<p className="text-[10px] text-primary font-medium uppercase tracking-wider">Сейчас играет</p>
						{nowplaying ? (
							<Link to={`/track/${nowplaying.now_playing.song.id}`} className="block group">
								<p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
									{nowplaying.now_playing.song.title}
								</p>
								<p className="text-xs text-muted-foreground truncate">
									{nowplaying.now_playing.song.artist}
								</p>
							</Link>
						) : (
							<p className="text-sm text-muted-foreground truncate">Загрузка...</p>
						)}
					</div>

					<span className="text-xs text-muted-foreground hidden md:inline">
						{nowplaying ? secondsToMMSS(elapsed_time) : "00:00"} / {nowplaying ? secondsToMMSS(nowplaying.now_playing.duration) : "00:00"}
					</span>

					<div className="hidden md:flex items-center gap-2 w-40">
						<button onClick={toggleMute}
								className="p-1 text-muted-foreground hover:text-foreground transition-colors">
							{volume[0] === 0 ? <VolumeX className="w-4 h-4"/> : <Volume2 className="w-4 h-4"/>}
						</button>
						<Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1}
								className="flex-1"/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MiniPlayer;
