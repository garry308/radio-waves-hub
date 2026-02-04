import {Play, Pause, Volume2, VolumeX, Music} from "lucide-react";
import {Slider} from "@/components/ui/slider";
import {useState, useRef} from "react";
import {defaultData, elapsedDefaultData, secondsToMMSS} from "@/lib/utils.ts";
import {useQuery} from "@tanstack/react-query";

const Player = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState([75]);
	const {data: nowplaying} = useQuery(defaultData);
	const {data: elapsed_time} = useQuery(elapsedDefaultData);
	const audioRef = useRef(null);
	const [lastVolume, setLastVolume] = useState([75]);
	const analyserRef = useRef(null);
	const canvasRef = useRef(null);
	const rafIdRef = useRef(null);
	const [isLoadedAnalyser, setIsLoadedAnalyser] = useState(false);

	const initializeVisualizer = () => {
		const audio = audioRef.current;
		if (!audio) return;

		const context = new (window.AudioContext)();
		const analyser = context.createAnalyser();
		analyser.fftSize = 256;
		const bufferLength = analyser.frequencyBinCount;
		analyserRef.current = { analyser, bufferLength, dataArray: new Uint8Array(bufferLength) };
		const source = context.createMediaElementSource(audio);
		source.connect(analyser);
		analyser.connect(context.destination);

		setIsLoadedAnalyser(true);
		visualize();
	}
	const play = () => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.src = "https://back.your-wave.ru/listen/your_wave/radio.mp3?" + new Date().getTime();
		audio.load();
		audio.play();
		setIsPlaying(true);

		if (!isLoadedAnalyser)
			initializeVisualizer()
	};

	const visualize = () => {
		const { analyser, bufferLength, dataArray } = analyserRef.current || {};
		const canvas = canvasRef.current;
		if (!analyser || !canvas) return;

		const ctx = canvas.getContext('2d');
		analyser.getByteFrequencyData(dataArray);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const barWidth = (canvas.width / bufferLength);
		let barHeight: number;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			barHeight = (dataArray[i] / 255) * canvas.height;
			ctx.fillStyle = `rgb(66, 170, 255)`;
			ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
			x += barWidth + 1;
		}

		rafIdRef.current = requestAnimationFrame(visualize);
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
		<div className="max-w-md mx-auto glass rounded-2xl p-6 pb-0 animate-slide-up"
			 style={{animationDelay: "0.2s"}}>
			<div className="flex items-center gap-4">
				{/* Album Art Placeholder */}
				{nowplaying ? (
					<div
						className="bg-contain w-10 md:w-20 h-10 md:h-20 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 glow-primary"
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
					<h3 className="font-display text-sm md:text-xl text-foreground truncate">{
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
								? (elapsed_time / nowplaying.now_playing.duration * 100) + '%'
								: '0px'
						}}/>
				</div>
				<div className="flex justify-between mt-1">
						<span
							className="text-xs text-muted-foreground">{nowplaying ? secondsToMMSS(elapsed_time) : '00:00'}</span>
					<span
						className="text-xs text-muted-foreground">{nowplaying ? secondsToMMSS(nowplaying.now_playing.duration) : '00:00'}</span>
				</div>
			</div>

			{/* Controls */}
			<div className="flex items-center justify-center gap-6 mt-4">
				<audio ref={audioRef}
					   preload="none"
					   crossOrigin="anonymous">
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
			<canvas
				ref={canvasRef}
				className="w-full mx-auto max-w-md rounded-2xl h-10 bg-transparent"
				style={{width: 'calc(100% + 3rem)', marginLeft: '-1.5rem'}}
			/>
		</div>
	);
};

export default Player;
