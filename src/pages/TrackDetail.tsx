import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {ArrowLeft, Music, Clock, Disc3, Tag} from "lucide-react";
import {Layout} from "@/components/Layout";
import {defaultData, secondsToMMSS, tsToHHMM} from "@/lib/utils.ts";
import {useTrackById} from "@/hooks/use-track";

const TrackDetail = () => {
	const {id} = useParams();
	const {data: nowplaying} = useQuery(defaultData);
	const {track, isLoading, plays} = useTrackById(id, nowplaying);

	return (
		<Layout>
			<section className="py-16 md:py-24">
				<div className="container mx-auto px-4 max-w-4xl">
					<Link
						to="/"
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

							{plays.length > 0 && (
								<div className="mt-10">
									<h2 className="font-display text-2xl text-gradient mb-4">Когда играл</h2>
									<div className="grid gap-3">
										{plays.map((p) => (
											<div key={p.sh_id} className="glass rounded-xl p-4 flex items-center justify-between">
												<span className="text-sm text-foreground">{p.label}</span>
												<span className="text-xs text-muted-foreground">{tsToHHMM(p.played_at)}</span>
											</div>
										))}
									</div>
								</div>
							)}

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
