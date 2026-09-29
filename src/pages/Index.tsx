import {Layout} from "@/components/Layout";
import {Helmet} from "react-helmet-async";
import Player from "@/components/Player.tsx";
import TrackHistory from "@/components/TrackHistory.tsx";
import RecentTracks from "@/components/RecentTracks.tsx";
import {Header} from "@/components/Header.tsx";
import MainScreen from "@/components/MainScreen.tsx";
const Index = () => {
	return (
		<Layout>
			<Helmet>
				<title>Твоя волна — онлайн-радио красивой музыки 24/7</title>
				<meta name="description" content="Слушайте «Твою волну» онлайн: прямой эфир 24/7, недавно игравшие треки и история эфира по дням и часам."/>
				<link rel="canonical" href="https://audio-atlas-site.lovable.app/"/>
				<meta property="og:url" content="https://audio-atlas-site.lovable.app/"/>
				<script type="application/ld+json">{JSON.stringify({"@context": "https://schema.org", "@type": "RadioStation", name: "Твоя волна", description: "Интернет-радио с красивой музыкой 24/7", url: "https://audio-atlas-site.lovable.app/", image: "https://audio-atlas-site.lovable.app/og-image.jpg"})}</script>
			</Helmet>
			<MainScreen></MainScreen>
			<RecentTracks></RecentTracks>
			<TrackHistory></TrackHistory>
		</Layout>
	);
};

export default Index;
