import {Layout} from "@/components/Layout";
import Player from "@/components/Player.tsx";
import TrackHistory from "@/components/TrackHistory.tsx";
import RecentTracks from "@/components/RecentTracks.tsx";
import {Header} from "@/components/Header.tsx";
import MainScreen from "@/components/MainScreen.tsx";
const Index = () => {
	return (
		<Layout>
			<MainScreen></MainScreen>
			<RecentTracks></RecentTracks>
			<TrackHistory></TrackHistory>
		</Layout>
	);
};

export default Index;
