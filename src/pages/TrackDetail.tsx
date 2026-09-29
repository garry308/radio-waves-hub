import {Link, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {ArrowLeft, Music, Clock, Disc3, Tag} from "lucide-react";
import {Layout} from "@/components/Layout";
import {Helmet} from "react-helmet-async";
import {defaultData, secondsToMMSS} from "@/lib/utils.ts";
import {useTrackById} from "@/hooks/use-track";
import {StreamingLinks} from "@/components/StreamingLinks";


const TrackDetail = () => {
	const {id} = useParams();
	const navigate = useNavigate();
	const {data: nowplaying} = useQuery(defaultData);
	const {track, isLoading} = useTrackById(id, nowplaying);

	return (
		<Layout>
			{track && (() => {
				const name = track.title || "Без названия";
				const artist = track.artist || "Неизвестный исполнитель";
				const url = `https://audio-atlas-site.lovable.app/track/${id}`;
				const title = `${artist} — ${name} | Твоя волна`;
				const desc = `«${name}» — ${artist}${track.album ? `, альбом «${track.album}»` : ""}. Слушайте в эфире «Твоей волны» и на стриминговых сервисах.`;
				const ld: Record<string, unknown> = {"@context": "https://schema.org", "@type": "MusicRecording", name, byArtist: {"@type": "MusicGroup", name: artist}, url};
				if (track.album) ld.inAlbum = {"@type": "MusicAlbum", name: track.album};
				if (track.duration) { const d = Math.round(track.duration); ld.duration = `PT${Math.floor(d / 60)}M${d % 60}S`; }
				if (track.isrc) ld.isrcCode = track.isrc;
				if (track.art) ld.image = track.art;
				return (
					<Helmet>
						<title>{title}</title>
						<meta name="description" content={desc}/>
						<link rel="canonical" href={url}/>
						<meta property="og:title" content={title}/>
						<meta property="og:description" content={desc}/>
						<meta property="og:url" content={url}/>
						<meta property="og:type" content="music.song"/>
						{track.art && <meta property="og:image" content={track.art}/>}
						{track.art && <meta name="twitter:image" content={track.art}/>}
						<script type="application/ld+json">{JSON.stringify(ld)}</script>
					</Helmet>
				);
			})()}
			<section className="py-16 md:py-24">
				<div className="container mx-auto px-4 max-w-4xl">
					<Link
						to="/"
						onClick={(e) => {
							if (window.history.state?.idx > 0) { e.preventDefault(); navigate(-1); }
						}}
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
					>
						<ArrowLeft className="w-4 h-4"/>
						На главную
					</Link>

					{isLoading && (
						<p className="text-muted-foreground">Загрузка трека...</p>
					)}

					{!isLoading && !track && (
						<div className="glass rounded-2xl p-8 text-center">
							<Music className="w-10 h-10 mx-auto mb-4 text-muted-foreground"/>
							<h1 className="font-display text-2xl text-gradient mb-2">Трек не найден</h1>
							<p className="text-muted-foreground">
								Информация об этом треке недоступна. Попробуйте открыть его из списка «Недавно играло».
							</p>
						</div>
					)}

					{track && (
						<>
							<div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start animate-slide-up">
								<div
									className="w-40 h-40 md:w-56 md:h-56 rounded-2xl bg-cover bg-center flex-shrink-0 glow-primary bg-gradient-to-br from-primary/40 to-accent/40"
									style={track.art ? {backgroundImage: `url(${track.art})`} : undefined}
								/>
								<div className="flex-1 min-w-0 text-center md:text-left">
									<p className="text-xs text-primary font-medium uppercase tracking-wider mb-2">Трек</p>
									<h1 className="font-display text-3xl md:text-4xl text-gradient mb-2 break-words">
										{track.title || "Без названия"}
									</h1>
									<p className="text-lg text-muted-foreground mb-6 break-words">
										{track.artist || "Неизвестный исполнитель"}
									</p>

									<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
										{track.album && (
											<div className="flex items-start gap-3">
												<Disc3 className="w-4 h-4 mt-1 text-primary flex-shrink-0"/>
												<div>
													<dt className="text-xs text-muted-foreground uppercase tracking-wider">Альбом</dt>
													<dd className="text-sm text-foreground break-words">{track.album}</dd>
												</div>
											</div>
										)}
										{track.genre && (
											<div className="flex items-start gap-3">
												<Tag className="w-4 h-4 mt-1 text-primary flex-shrink-0"/>
												<div>
													<dt className="text-xs text-muted-foreground uppercase tracking-wider">Жанр</dt>
													<dd className="text-sm text-foreground break-words">{track.genre}</dd>
												</div>
											</div>
										)}
										{track.duration ? (
											<div className="flex items-start gap-3">
												<Clock className="w-4 h-4 mt-1 text-primary flex-shrink-0"/>
												<div>
													<dt className="text-xs text-muted-foreground uppercase tracking-wider">Длительность</dt>
													<dd className="text-sm text-foreground">{secondsToMMSS(Math.round(track.duration))}</dd>
												</div>
											</div>
										) : null}
										{track.isrc && (
											<div className="flex items-start gap-3">
												<Music className="w-4 h-4 mt-1 text-primary flex-shrink-0"/>
												<div>
													<dt className="text-xs text-muted-foreground uppercase tracking-wider">ISRC</dt>
													<dd className="text-sm text-foreground">{track.isrc}</dd>
												</div>
											</div>
										)}
									</dl>
								</div>
							</div>

							<StreamingLinks title={track.title} artist={track.artist}/>


							{track.lyrics && (
								<div className="mt-10">
									<h2 className="font-display text-2xl text-gradient mb-4">Текст песни</h2>
									<pre className="glass rounded-xl p-6 whitespace-pre-wrap text-sm text-muted-foreground font-sans">
										{track.lyrics}
									</pre>
								</div>
							)}
						</>
					)}
				</div>
			</section>
		</Layout>
	);
};

export default TrackDetail;
