import { useEffect, useRef, useState } from "react";

const WS_URL = "wss://demo.azuracast.com/api/live/nowplaying/websocket";

export function useAzuraNowPlaying(station = "station:azuratest_radio") {
	const [nowplaying, setNowplaying] = useState(null);
	const [currentTime, setCurrentTime] = useState(0);
	const socketRef = useRef(null);

	useEffect(() => {
		const socket = new WebSocket(WS_URL);
		socketRef.current = socket;

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
				setCurrentTime(jsonData.current_time);
			}

			if (jsonData.np) {
				setNowplaying(jsonData.np);
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
						setCurrentTime(Math.floor(connectData.time / 1000));
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

		return () => {
			if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
				socketRef.current.close();
			}
		};
	}, [station]);

	return { nowplaying, currentTime };
}
