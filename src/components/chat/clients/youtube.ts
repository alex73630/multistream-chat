import { useEffect, useMemo, useState } from "react"
import { type ChatItem, type MessageItem, type YoutubeId } from "youtube-chat/dist/types/data"
import { Platform, useChatStore } from "../ChatStore"
import { env } from "../../../env.mjs"

export const useYouTubeChat = (youtubeId: YoutubeId | undefined | 'undefined') => {
	const [isConnected, setIsConnected] = useState(false)
	const eventUrl = useMemo(() => {
		const eventUrl = new URL(`${env.NEXT_PUBLIC_YOUTUBE_SSE_CHAT}/yt-chat`)
		if (youtubeId === undefined || youtubeId === 'undefined') {
			return null
		}
		if ("handle" in youtubeId && youtubeId.handle === 'undefined') {
			return null
		}
		for (const [key, value] of Object.entries(youtubeId)) {
			eventUrl.searchParams.append(key, value)
		}
		return eventUrl
	}, [youtubeId])

	const addMessage = useChatStore((state) => state.addMessage)

	const youtubeChannel = useMemo<string>((): string => {
		if (youtubeId === undefined || youtubeId === 'undefined') {
			return ""
		}
		if ("channelId" in youtubeId) {
			return youtubeId.channelId
		}
		if ("videoId" in youtubeId) {
			return youtubeId.videoId as string
		}
		if ("handle" in youtubeId) {
			return youtubeId.handle
		}
		return ""
	}, [youtubeId])

	const [events, setEvents] = useState<EventSource | null>(() => null)
	useEffect(() => {
		let currEvents = events
		if (eventUrl !== null) {
			console.log(eventUrl.toString(), eventUrl.toString().includes("handle=undefined"))
			if ((currEvents === null || currEvents.url !== eventUrl.toString()) && !eventUrl.toString().includes("handle=undefined")) {
				if (currEvents !== null) {
					currEvents.close()
				}
				currEvents = new EventSource(eventUrl.toString())
				setEvents(currEvents)
			}

			if (currEvents) {
				currEvents.onmessage = (event: MessageEvent<string>) => {
					try {
						const parsedData = JSON.parse(event.data) as ChatItem | { connected: boolean }

						console.log(parsedData)
						if ("connected" in parsedData) {
							setIsConnected(parsedData.connected)
						}
						if (typeof parsedData === "object" && "id" in parsedData) {
							addMessage({
								id: parsedData.id,
								platform: Platform.YouTube,
								channel: youtubeChannel,
								text: parsedData.message
									.map((item: MessageItem) => {
										if ("text" in item) {
											return item.text
										}
										if ("emojiText" in item) {
											return item.emojiText
										}
									})
									.join(" "),
								user: parsedData.author.name,
								timestamp: new Date(parsedData.timestamp).getTime()
							})
						}
					} catch (error) {
						console.error(error)
					}
				}
			}
		}

	}, [eventUrl, events, addMessage, youtubeChannel])

	return { isConnected }
}
