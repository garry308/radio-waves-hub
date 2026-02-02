import {Play, Pause, Volume2, VolumeX, Music} from "lucide-react";
import {Slider} from "@/components/ui/slider";
import {useState, useRef} from "react";
import {Link} from "react-router-dom";
import {Layout} from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";
import {useAzuraNowPlaying} from "@/lib/radio-socket";
import {secondsToMMSS, tsToHHMM} from "@/lib/utils.ts";

const Index = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState([75]);
	const {nowplaying} = useAzuraNowPlaying();
	const audioRef = useRef(null);
	const [lastVolume, setLastVolume] = useState([75]);
	const play = () => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.src = "https://demo.azuracast.com/listen/azuratest_radio/radio.mp3";
		audio.load();
		audio.play();
		setIsPlaying(true);
	};

	const pause = () => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.pause();
		audio.removeAttribute("src");
		audio.load();

		setIsPlaying(false);
	};

	const handleVolumeChange = (v) => {
		if (v > 0)
			setLastVolume(v);
		setVolume(v);
		if (audioRef.current) {
			audioRef.current.volume = (v / 100);
		}
	};

	return (
		<Layout>
			{/* Hero Section */}
			<section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
				{/* Background Image */}
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat"
					style={{backgroundImage: `url(${heroBg})`}}
				>
					<div className="absolute inset-0 bg-background/60"/>
				</div>

				{/* Content */}
				<div className="relative z-10 container mx-auto px-4 py-20">
					<div className="max-w-4xl mx-auto text-center">
						{/* Live Badge */}
						<div
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 mb-8 animate-fade-in">
							<span className="w-2 h-2 rounded-full bg-primary animate-pulse"/>
							<span className="text-sm font-medium text-primary">В эфире</span>
						</div>

						{/* Title */}
						<h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-gradient mb-6 animate-slide-up">
							Твоя волна
						</h1>
						<p className="font-body text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-slide-up"
						   style={{animationDelay: "0.1s"}}>
							Твой портал в мир красивой музыки.
						</p>

						{/* Now Playing Card */}
						<div className="max-w-md mx-auto glass rounded-2xl p-6 animate-slide-up"
							 style={{animationDelay: "0.2s"}}>
							<div className="flex items-center gap-4">
								{/* Album Art Placeholder */}
								{nowplaying ? (
									<div
										className="bg-contain w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 glow-primary"
										style={{backgroundImage: `url(${nowplaying.now_playing.song.art})`}}>
									</div>
								) : (
									<div
										className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 glow-primary">
										<Music className="w-8 h-8 text-primary-foreground"/>
									</div>
								)}
								{/* Track Info */}
								<div className="flex-1 text-left min-w-0">
									<p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">Сейчас
										играет</p>
									<h3 className="font-display text-xl text-foreground truncate">{
										nowplaying ? nowplaying.now_playing.song.title : 'Загрузка...'}
									</h3>
									<p className="text-sm text-muted-foreground truncate">{
										nowplaying ? nowplaying.now_playing.song.artist : 'Загрузка...'
									}
									</p>
								</div>
							</div>

							{/* Progress Bar */}
							<div className="mt-4">
								<div className="h-1 bg-secondary rounded-full overflow-hidden">
									<div
										className="h-full w-2/3 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
										style={{
											width: nowplaying
												? (nowplaying.now_playing.elapsed / nowplaying.now_playing.duration * 100) + '%'
												: '0px'
										}}/>
								</div>
								<div className="flex justify-between mt-1">
						<span
							className="text-xs text-muted-foreground">{nowplaying ? secondsToMMSS(nowplaying.now_playing.elapsed) : '00:00'}</span>
									<span
										className="text-xs text-muted-foreground">{nowplaying ? secondsToMMSS(nowplaying.now_playing.duration) : '00:00'}</span>
								</div>
							</div>

							{/* Controls */}
							<div className="flex items-center justify-center gap-6 mt-4">
								<audio ref={audioRef}
									   preload="none">
								</audio>
								<button
									onClick={isPlaying ? pause : play}
									className="w-14 h-14 rounded-full bg-primary flex items-center justify-center glow-primary hover:scale-105 transition-transform"
								>
									{isPlaying ? (
										<Pause className="w-6 h-6 text-primary-foreground"/>
									) : (
										<Play className="w-6 h-6 text-primary-foreground ml-1"/>
									)}
								</button>
							</div>

							{/* Volume Slider */}
							<div className="flex items-center gap-3 mt-4">
							<button
									onClick={() => handleVolumeChange(volume[0] > 0 ? [0] : [lastVolume])}
									className="p-1 text-muted-foreground hover:text-foreground transition-colors"
								>
									{volume[0] === 0 ? (
										<VolumeX className="w-4 h-4"/>
									) : (
										<Volume2 className="w-4 h-4"/>
									)}
								</button>
								<Slider
									value={volume}
									onValueChange={handleVolumeChange}
									max={100}
									step={1}
									className="flex-1"
								/>
								<span className="text-xs text-muted-foreground w-8 text-right">{volume[0]}%</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Recent Tracks Section */
			}
			<section className="py-20 bg-card/30">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between mb-8">
						<h2 className="font-display text-3xl md:text-4xl text-gradient">Недавно играло</h2>
						<Link
							to="/history"
							className="text-sm font-medium text-primary hover:text-accent transition-colors"
						>
							Вся история →
						</Link>
					</div>

					<div className="grid gap-4">

						{nowplaying ? nowplaying.song_history.map((track, index) => (
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
									<h4 className="font-medium text-foreground truncate">{track.song.title}</h4>
									<p className="text-sm text-muted-foreground truncate">{track.song.artist}</p>
								</div>
								<span className="text-xs text-muted-foreground flex-shrink-0">{tsToHHMM(track.played_at)}</span>
							</div>
						)) : 'Загрузка...'}
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default Index;
