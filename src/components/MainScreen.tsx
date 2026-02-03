import heroBg from "@/assets/hero-bg.jpg";
import Player from "@/components/Player.tsx";

const MainScreen = () => {

	return (
		<section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden" id="header">
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
					{/* Title */}
					<h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-gradient mb-6 animate-slide-up">
						Твоя волна
					</h1>
					<p className="font-body text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-slide-up"
					   style={{animationDelay: "0.1s"}}>
						Твой портал в мир красивой музыки.
					</p>

					{/* Now Playing Card */}
					<Player></Player>
				</div>
			</div>
		</section>
	);
};

export default MainScreen;
