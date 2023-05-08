import { useCallback, useEffect, useMemo, useState } from "react"
import { type ChatItem, type MessageItem, type YoutubeId } from "youtube-chat/dist/types/data"
import { type Emote, EmoteSource, Platform, useChatStore, type Badge, BadgeSource } from "../ChatStore"
import { env } from "../../../env.mjs"
import { getRandomUsernameColor } from "../chat-utils"

export const useYouTubeChat = (youtubeId: YoutubeId | undefined | "undefined") => {
	const [isConnected, setIsConnected] = useState(false)
	const [emotes, addEmotes, badges, addBadges] = useChatStore((state) => [state.emotes, state.addEmotes, state.badges, state.addBadges])
	const eventUrl = useMemo(() => {
		const eventUrl = new URL(`${env.NEXT_PUBLIC_YOUTUBE_SSE_CHAT}/yt-chat`)
		if (youtubeId === undefined || youtubeId === "undefined") {
			return null
		}
		if ("handle" in youtubeId && youtubeId.handle === "undefined") {
			return null
		}
		for (const [key, value] of Object.entries(youtubeId)) {
			eventUrl.searchParams.append(key, value)
		}
		return eventUrl
	}, [youtubeId])

	const addMessage = useChatStore((state) => state.addMessage)

	const youtubeChannel = useMemo<string>((): string => {
		if (youtubeId === undefined || youtubeId === "undefined") {
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

	const randomColorsList = useMemo(() => new Map<string, string>(), [])

	const randomColor = useCallback(
		(username: string): string => {
			return getRandomUsernameColor(username, randomColorsList)
		},
		[randomColorsList]
	)

	const parseEmotes = useCallback(
		(message: ChatItem) => {
			const emotesToAdd: Emote[] = []
			const parsedMsgEmotes: {
				id: string
				index: [number, number]
			}[] = []

			const msgParts = message.message.reduce<
				{
					text: string
					isEmote: boolean
					url: string | null
					start: number
					end: number
				}[]
			>((acc, item) => {
				const prevItem = acc[acc.length - 1]
				const start = prevItem ? prevItem.end + 1 : 0
				acc.push({
					text: "text" in item ? item.text : item.emojiText,
					isEmote: "emojiText" in item && item.isCustomEmoji,
					url: "emojiText" in item ? item.url : null,
					start: start,
					end: start + ("text" in item ? item.text.length : item.emojiText.length)
				})
				return acc
			}, [])

			msgParts.forEach((item) => {
				if (item.isEmote) {
					const found = emotes.find((e) => e.id === item.text && e.platform === Platform.YouTube)
					if (!found) {
						emotesToAdd.push({
							id: item.text,
							name: item.text,
							platform: Platform.YouTube,
							source: EmoteSource.YouTube,
							bucket: "channel",
							channel: youtubeChannel,
							type: "static",
							meta: {
								zeroWidth: false,
								isEffect: false
							},
							url: {
								x1: {
									url: item.url as string,
									width: 24,
									height: 24
								},
								x2: {
									url: (item.url as string).replace("=w24-h24", "=w32-h32"),
									width: 32,
									height: 32
								},
								x4: {
									url: (item.url as string).replace("=w24-h24", "=w64-h64"),
									width: 64,
									height: 64
								}
							}
						})
					}
					parsedMsgEmotes.push({
						id: item.text,
						index: [item.start, item.end]
					})
				}
			})

			if (emotesToAdd.length > 0) {
				addEmotes(emotesToAdd)
			}

			return parsedMsgEmotes
		},
		[emotes, addEmotes, youtubeChannel]
	)

	const parseBadges = useCallback(
		(message: ChatItem) => {
			const badgesToAdd: Badge[] = []
			const parsedBadges: string[] = []

			if (message.isOwner) {
				const found = badges.find((b) => b.id === "owner" && b.platform === Platform.YouTube)
				if (!found) {
					badgesToAdd.push({
						id: "youtube-owner",
						name: "Owner",
						platform: Platform.YouTube,
						source: BadgeSource.YouTube,
						bucket: "global",
						channel: null,
						url: {
							x1: null,
							x2: null,
							x4: {
								url: "/badges/youtube/owner.png",
								width: 64,
								height: 64
							}
						}
					})
				}
				parsedBadges.push("youtube-owner")
			}

			if (message.isModerator) {
				const found = badges.find((b) => b.id === "moderator" && b.platform === Platform.YouTube)
				if (!found) {
					badgesToAdd.push({
						id: "youtube-moderator",
						name: "Moderator",
						platform: Platform.YouTube,
						source: BadgeSource.YouTube,
						bucket: "global",
						channel: null,
						url: {
							x1: null,
							x2: null,
							x4: {
								url: "/badges/youtube/mod.png",
								width: 64,
								height: 64
							}
						}
					})
				}
				parsedBadges.push("youtube-moderator")
			}

			if (message.isMembership) {
				const membershipId = Buffer.from(`${youtubeChannel}-${message.author.badge?.label as string}`).toString("base64")
				const found = badges.find((b) => b.id === membershipId && b.platform === Platform.YouTube)
				if (!found) {
					badgesToAdd.push({
						id: membershipId,
						name: message.author.badge?.label as string,
						platform: Platform.YouTube,
						source: BadgeSource.YouTube,
						bucket: "channel",
						channel: youtubeChannel,
						url: {
							x1: null,
							x2: null,
							x4: {
								url: message.author.badge?.thumbnail.url as string,
								width: 64,
								height: 64
							}
						}
					})
				}
				parsedBadges.push(membershipId)
			}

			if (badgesToAdd.length > 0) {
				addBadges(badgesToAdd)
			}
			return parsedBadges
		}, [addBadges, badges, youtubeChannel])

	const [events, setEvents] = useState<EventSource | null>(() => null)
	useEffect(() => {
		let currEvents = events
		if (eventUrl !== null && !!youtubeChannel) {
			if (
				(currEvents === null || currEvents.url !== eventUrl.toString()) &&
				!eventUrl.toString().includes("handle=undefined")
			) {
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
							const msgString = parsedData.message
								.map((item: MessageItem) => {
									if ("text" in item) {
										return item.text
									}
									if ("emojiText" in item) {
										return item.emojiText
									}
								})
								.join(" ")

							addMessage({
								id: parsedData.id,
								platform: Platform.YouTube,
								channel: youtubeChannel,
								text: msgString,
								user: {
									id: parsedData.author.channelId,
									name: parsedData.author.name,
									platform: Platform.YouTube,
									color: randomColor(parsedData.author.channelId),
									badges: parseBadges(parsedData),
								},
								emotes: parseEmotes(parsedData),
								timestamp: new Date(parsedData.timestamp).getTime()
							})
						}
					} catch (error) {
						console.error(error)
					}
				}
			}
		}
	}, [eventUrl, events, addMessage, youtubeChannel, randomColor, parseEmotes, parseBadges])

	return { isConnected }
}
