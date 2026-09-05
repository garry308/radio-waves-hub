import {ExternalLink} from "lucide-react";

type Props = {
	title?: string;
	artist?: string;
};

type Service = {
	name: string;
	url: (q: string) => string;
	brand: string;
	icon: JSX.Element;
};

const services: Service[] = [
	{
		name: "Яндекс Музыка",
		url: (q: string) => `https://music.yandex.ru/search?text=${q}`,
		brand: "#FFCC00",
		icon: (
			<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
				<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm2.7 18.6h-1.94V7.62h-.86c-1.58 0-2.41.79-2.41 1.97 0 1.34.57 1.96 1.75 2.76l.97.65-2.8 4.2H7.02l2.52-3.75c-1.45-1.04-2.26-2.05-2.26-3.76 0-2.14 1.49-3.6 4.32-3.6h3.1V18.6z"/>
			</svg>
		),
	},
	{
		name: "Spotify",
		url: (q: string) => `https://open.spotify.com/search/${q}`,
		brand: "#1DB954",
		icon: (
			<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
				<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z"/>
			</svg>
		),
	},
	{
		name: "Apple Music",
		url: (q: string) => `https://music.apple.com/ru/search?term=${q}`,
		brand: "#FA243C",
		icon: (
			<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
				<path d="M23.99 6.12c0-.5-.05-1-.14-1.49a5.02 5.02 0 00-.47-1.4A4.75 4.75 0 0021.3.68a5.2 5.2 0 00-1.4-.47c-.5-.09-1-.14-1.5-.15H5.6c-.5.01-1 .06-1.5.15a5.2 5.2 0 00-1.4.47A4.75 4.75 0 00.62 3.23c-.22.45-.38.92-.47 1.4-.09.5-.14 1-.14 1.49v11.76c0 .5.05 1 .14 1.49.09.48.25.95.47 1.4a4.75 4.75 0 002.08 2.08c.45.22.92.38 1.4.47.5.09 1 .14 1.5.15h12.8c.5-.01 1-.06 1.5-.15a5.2 5.2 0 001.4-.47 4.75 4.75 0 002.08-2.08c.22-.45.38-.92.47-1.4.09-.5.14-1 .14-1.49V6.12zM17.2 4.9v10.3c0 .38-.03.75-.17 1.1a2.2 2.2 0 01-1.35 1.3c-.3.1-.62.16-.94.2-1.22.13-2.13-.66-2.23-1.75-.08-.9.42-1.72 1.35-2.06.36-.13.75-.2 1.13-.27.4-.07.8-.14 1.2-.22.24-.06.4-.2.42-.46V8.06c0-.3-.13-.4-.42-.35l-6.1 1.23c-.28.06-.38.18-.38.48v8.4c0 .38-.04.75-.18 1.1a2.2 2.2 0 01-1.35 1.3c-.3.1-.62.16-.94.2-1.22.13-2.13-.66-2.23-1.75-.08-.9.42-1.72 1.35-2.06.36-.13.75-.2 1.13-.27l1.2-.23c.25-.05.4-.2.42-.45V6.5c0-.14.02-.28.06-.4.1-.28.32-.42.6-.48l.5-.1 7.4-1.5c.06-.01.13-.02.2-.02.28-.02.47.15.5.43l.01.47z"/>
			</svg>
		),
	},
	{
		name: "YouTube Music",
		url: (q: string) => `https://music.youtube.com/search?q=${q}`,
		brand: "#FF0033",
		icon: (
			<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
				<path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104A7.104 7.104 0 1119.104 12 7.11 7.11 0 0112 19.104zM9.6 7.8l6.6 4.2-6.6 4.2V7.8z"/>
			</svg>
		),
	},
	{
		name: "VK Музыка",
		url: (q: string) => `https://vk.com/audio?q=${q}`,
		brand: "#0077FF",
		icon: (
			<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
				<path d="M13.16 18.06c-6.84 0-10.74-4.69-10.9-12.5h3.43c.11 5.73 2.64 8.16 4.64 8.66V5.56h3.23v4.95c1.98-.21 4.05-2.46 4.75-4.95h3.23c-.54 3.06-2.79 5.31-4.39 6.24 1.6.75 4.17 2.71 5.14 6.26h-3.55c-.76-2.37-2.65-4.2-5.18-4.45v4.45h-.4z"/>
			</svg>
		),
	},
	{
		name: "Deezer",
		url: (q: string) => `https://www.deezer.com/search/${q}`,
		brand: "#A238FF",
		icon: (
			<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
				<path d="M18.81 4.16h5.02v2.55h-5.02V4.16zm0 3.94h5.02v2.55h-5.02V8.1zm0 3.93h5.02v2.55h-5.02v-2.55zm-6.32 0h5.02v2.55h-5.02v-2.55zm0 3.94h5.02v2.55h-5.02v-2.55zm6.32 0h5.02v2.55h-5.02v-2.55zM6.17 12.03h5.02v2.55H6.17v-2.55zm0 3.94h5.02v2.55H6.17v-2.55zm-6.02 0h5.02v2.55H.15v-2.55z"/>
			</svg>
		),
	},
];

export const StreamingLinks = ({title, artist}: Props) => {
	const query = [artist, title].filter(Boolean).join(" ").trim();

	if (!query) return null;

	const encoded = encodeURIComponent(query);

	return (
		<div className="mt-10">
			<h2 className="font-display text-2xl text-gradient mb-2">Слушать в стримингах</h2>
			<p className="text-sm text-muted-foreground mb-4">
				Поиск «{query}» в популярных музыкальных сервисах
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{services.map((s) => (
					<a
						key={s.name}
						href={s.url(encoded)}
						target="_blank"
						rel="noopener noreferrer"
						style={{
							borderColor: `${s.brand}59`,
							background: `linear-gradient(135deg, ${s.brand}26, transparent 70%)`,
						}}
						className="rounded-xl p-4 border flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 group"
					>
						<span
							className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-transform group-hover:scale-110"
							style={{backgroundColor: `${s.brand}26`, color: s.brand}}
						>
							{s.icon}
						</span>
						<span className="text-sm font-medium flex-1">{s.name}</span>
						<ExternalLink
							className="w-4 h-4 opacity-60 transition-opacity group-hover:opacity-100"
							style={{color: s.brand}}
						/>
					</a>
				))}
			</div>
		</div>
	);
};
