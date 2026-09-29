import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const KEY = "scroll_positions";
const read = (): Record<string, number> => {
	try { return JSON.parse(sessionStorage.getItem(KEY) || "{}"); } catch { return {}; }
};

/** Remembers scroll position per history entry and restores it on Back/Forward. */
export const ScrollManager = () => {
	const location = useLocation();
	const navType = useNavigationType();

	useEffect(() => {
		if ("scrollRestoration" in history) history.scrollRestoration = "manual";
	}, []);

	// Save position of the current entry while scrolling
	useEffect(() => {
		let t: number | undefined;
		const save = () => {
			window.clearTimeout(t);
			t = window.setTimeout(() => {
				const all = read();
				all[location.key] = window.scrollY;
				sessionStorage.setItem(KEY, JSON.stringify(all));
			}, 100);
		};
		window.addEventListener("scroll", save, { passive: true });
		return () => { window.clearTimeout(t); window.removeEventListener("scroll", save); };
	}, [location.key]);

	useLayoutEffect(() => {
		if (location.hash) return;
		const target = navType === "POP" ? read()[location.key] : undefined;
		if (target === undefined) { window.scrollTo(0, 0); return; }
		// Content loads asynchronously — retry until the page is tall enough
		let tries = 0;
		let raf = 0;
		const attempt = () => {
			window.scrollTo(0, target);
			if (Math.abs(window.scrollY - target) > 2 && tries++ < 60) {
				raf = window.setTimeout(attempt, 50);
			}
		};
		attempt();
		return () => window.clearTimeout(raf);
	}, [location.key, navType, location.hash]);

	return null;
};
