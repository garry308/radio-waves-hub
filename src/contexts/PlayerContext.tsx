import {createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode} from "react";
import {useQuery} from "@tanstack/react-query";
import {defaultData} from "@/lib/utils";

const STREAM_URL = "https://backend.your-wave.ru/listen/your_wave/radio.mp3";

interface PlayerContextValue {
	isPlaying: boolean;
	volume: number[];
	play: () => void;
	pause: () => void;
	toggle: () => void;
	handleVolumeChange: (v: number[]) => void;
	toggleMute: () => void;
	registerCanvas: (canvas: HTMLCanvasElement | null) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export const PlayerProvider = ({children}: {children: ReactNode}) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const analyserRef = useRef<any>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const rafIdRef = useRef<number | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState([75]);
	const [lastVolume, setLastVolume] = useState([75]);
	const {data: nowplaying} = useQuery(defaultData);
	const playRef = useRef<() => void>(() => {});
	const pauseRef = useRef<() => void>(() => {});

	const visualize = useCallback(() => {
		rafIdRef.current = requestAnimationFrame(visualize);

		const {analyser, bufferLength, dataArray} = analyserRef.current || {};
		const canvas = canvasRef.current;
		if (!analyser || !canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		analyser.getByteFrequencyData(dataArray);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const barWidth = canvas.width / bufferLength;
		let x = 0;
		for (let i = 0; i < bufferLength; i++) {
			const barHeight = (dataArray[i] / 255) * canvas.height;
			ctx.fillStyle = `rgb(66, 170, 255)`;
			ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
			x += barWidth + 1;
		}
	}, []);

	const initializeVisualizer = () => {
		const audio = audioRef.current;
		if (!audio || analyserRef.current) return;

		try {
			const context = new (window.AudioContext || (window as any).webkitAudioContext)();
			const analyser = context.createAnalyser();
			analyser.fftSize = 256;
			const bufferLength = analyser.frequencyBinCount;
			analyserRef.current = {analyser, bufferLength, dataArray: new Uint8Array(bufferLength)};
			const source = context.createMediaElementSource(audio);
			source.connect(analyser);
			analyser.connect(context.destination);
		} catch (e) {
			// visualizer unavailable
		}

		if (rafIdRef.current === null) visualize();
	};

	const play = () => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.src = STREAM_URL + "?" + new Date().getTime();
		audio.load();
		audio.volume = volume[0] / 100;
		audio.play();
		setIsPlaying(true);
		initializeVisualizer();
	};

	const pause = () => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.pause();
		audio.removeAttribute("src");
		audio.load();
		setIsPlaying(false);
	};

	const toggle = () => (isPlaying ? pause() : play());

	const handleVolumeChange = (v: number[]) => {
		if (v[0] > 0) setLastVolume(v);
		setVolume(v);
		if (audioRef.current) audioRef.current.volume = v[0] / 100;
	};

	const toggleMute = () => handleVolumeChange(volume[0] > 0 ? [0] : lastVolume);

	const registerCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
		canvasRef.current = canvas;
	}, []);

	useEffect(() => {
		return () => {
			if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
		};
	}, []);

	// --- Media Session API ---
	const song = nowplaying?.now_playing?.song;

	useEffect(() => {
		if (!("mediaSession" in navigator) || !song?.title) return;

		navigator.mediaSession.metadata = new MediaMetadata({
			title: song.title || "Твоя волна",
			artist: song.artist || "Твоя волна",
			album: "Твоя волна",
			artwork: song.art
				? [
					{src: song.art, sizes: "512x512", type: "image/jpeg"},
					{src: song.art, sizes: "256x256", type: "image/jpeg"},
					{src: song.art, sizes: "96x96", type: "image/jpeg"},
				]
				: [],
		});
	}, [song?.title, song?.artist, song?.art]);

	useEffect(() => {
		if (!("mediaSession" in navigator)) return;

		navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
		navigator.mediaSession.setActionHandler("play", () => playRef.current());
		navigator.mediaSession.setActionHandler("pause", () => pauseRef.current());
		navigator.mediaSession.setActionHandler("stop", () => pauseRef.current());
		// Радиоэфир: перемотка и переключение треков недоступны
		for (const action of ["seekbackward", "seekforward", "seekto", "previoustrack", "nexttrack"] as const) {
			try {
				navigator.mediaSession.setActionHandler(action, null);
			} catch {
				// действие не поддерживается браузером
			}
		}
	}, [isPlaying]);

	return (
		<PlayerContext.Provider
			value={{isPlaying, volume, play, pause, toggle, handleVolumeChange, toggleMute, registerCanvas}}>
			<audio ref={audioRef} preload="none" crossOrigin="anonymous"/>
			{children}
		</PlayerContext.Provider>
	);
};

export const usePlayer = () => {
	const ctx = useContext(PlayerContext);
	if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
	return ctx;
};
