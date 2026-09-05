import {ExternalLink} from "lucide-react";

type Props = {
	title?: string;
	artist?: string;
};

const services = [
	{
		name: "Яндекс Музыка",
		url: (q: string) => `https://music.yandex.ru/search?text=${q}`,
	},
	{
		name: "Spotify",
		url: (q: string) => `https://open.spotify.com/search/${q}`,
	},
	{
		name: "Apple Music",
		url: (q: string) => `https://music.apple.com/ru/search?term=${q}`,
	},
	{
		name: "YouTube Music",
		url: (q: string) => `https://music.youtube.com/search?q=${q}`,
	},
	{
		name: "VK Музыка",
		url: (q: string) => `https://vk.com/audio?q=${q}`,
	},
	{
		name: "Deezer",
		url: (q: string) => `https://www.deezer.com/search/${q}`,
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
						className="glass rounded-xl p-4 flex items-center justify-between gap-3 hover:border-primary/50 hover:text-primary transition-colors group"
					>
						<span className="text-sm font-medium">{s.name}</span>
						<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"/>
					</a>
				))}
			</div>
		</div>
	);
};
