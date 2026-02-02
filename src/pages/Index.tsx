import {Layout} from "@/components/Layout";
import Player from "@/components/Player.tsx";
import TrackHistory from "@/components/TrackHistory.tsx";
import RecentTracks from "@/components/RecentTracks.tsx";
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
