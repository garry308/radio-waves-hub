import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Плавно прокручивает страницу наверх; появляется после прокрутки вниз. */
const ScrollToTopButton = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 400);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	if (!visible) return null;

	return (
		<button
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			aria-label="Наверх"
			className="fixed bottom-28 right-4 z-40 p-3 rounded-full glass text-primary glow-primary hover:text-accent transition-all animate-fade-in"
		>
			<ArrowUp className="w-5 h-5" />
		</button>
	);
};

export default ScrollToTopButton;
