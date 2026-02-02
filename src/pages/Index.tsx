import {Layout} from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";
import {defaultData, elapsedDefaultData, secondsToMMSS, tsToHHMM} from "@/lib/utils.ts";
import {useQuery} from "@tanstack/react-query";
import Player from "@/components/Player.tsx";
import TrackHistory from "@/components/TrackHistory.tsx";
import RecentTracks from "@/components/RecentTracks.tsx";

let playInterval;
const Index = () => {
	return (
		<Layout>
			<Player></Player>
			<RecentTracks></RecentTracks>
			<TrackHistory></TrackHistory>
		</Layout>
	);
};

export default Index;
