import { QueryClient } from "@tanstack/react-query";

const WS_URL = "wss://back.your-wave.ru/api/live/nowplaying/websocket";


export function AzuraNowPlaying(queryClient: QueryClient, station = "station:your_wave") {
	const socket = new WebSocket(WS_URL);

	socket.onopen = () => {
		socket.send(
			JSON.stringify({
				subs: {
					[station]: { recover: true },
				},
			})
		);
	};

	function handleSseData(ssePayload, useTime = true) {
		const jsonData = ssePayload.data;


		if (useTime && "current_time" in jsonData) {
			queryClient.setQueryData(['current_time'], () => {
				return jsonData.current_time;
			});
		}

		if (jsonData.np) {
			queryClient.setQueryData(['now_playing'], () => {
				return jsonData.np;
			});
		}
	}

	socket.onmessage = (e) => {
		const jsonData = JSON.parse(e.data);
		console.log(jsonData);

		if ("connect" in jsonData) {
			const connectData = jsonData.connect;

			if ("data" in connectData) {
				// Legacy SSE data
				connectData.data.forEach((initialRow) => handleSseData(initialRow));
			} else {
				// New Centrifugo time format
				if ("time" in connectData) {
					queryClient.setQueryData(['current_time'], () => {
						return Math.floor(connectData.time / 1000);
					});
				}

				// New Centrifugo cached NowPlaying initial push.
				for (const subName in connectData.subs) {
					const sub = connectData.subs[subName];
					if ("publications" in sub && sub.publications.length > 0) {
						sub.publications.forEach((initialRow) =>
							handleSseData(initialRow, false)
						);
					}
				}
			}
		} else if ("pub" in jsonData) {
			handleSseData(jsonData.pub);
		}
	};

	socket.onerror = (err) => {
		console.error("WebSocket error", err);
	};

	socket.onclose = () => {
		console.log("WebSocket closed");
	};

	return {queryClient};
}
