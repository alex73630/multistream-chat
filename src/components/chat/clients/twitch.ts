import { ChatClient } from "@twurple/chat"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EmoteSource, Platform, useChatStore } from "../ChatStore"
import { parseChatMessage } from "@twurple/common"
import { useTheme } from "../../../lib/ThemeProvider"
import { api } from "../../../utils/api"
import { ensureContrast, getRandomUsernameColor } from "../chat-utils"

export const useTwitchChat = (channel: string) => {
	const { theme } = useTheme()

	const [emotes, addEmotes, badges, addBadges] = useChatStore((state) => [
		state.emotes,
		state.addEmotes,
		state.badges,
		state.addBadges
	])

	const { data: globalBadges } = api.twitch.getGlobalBadges.useQuery(undefined, {
		staleTime: Infinity
	})

	useEffect(() => {
		if (globalBadges) {
			addBadges(globalBadges)
		}
	}, [globalBadges, addBadges])

	const { data: channelBadges } = api.twitch.getChannelBadges.useQuery(
		{ channel },
		{
			staleTime: Infinity
		}
	)

	useEffect(() => {
		if (channelBadges) {
			addBadges(channelBadges)
		}
	}, [channelBadges, addBadges])

	const { data: globalEmotes } = api.twitch.getGlobalEmotes.useQuery(
		{ theme },
		{
			staleTime: Infinity
		}
	)

	useEffect(() => {
		if (globalEmotes) {
			addEmotes(globalEmotes)
		}
	}, [globalEmotes, addEmotes])

	const { data: channelEmotes } = api.twitch.getChannelEmotes.useQuery(
		{ channel, theme },
		{
			staleTime: Infinity
		}
	)

	useEffect(() => {
		if (channelEmotes) {
			addEmotes(channelEmotes)
		}
	}, [channelEmotes, addEmotes])

	const randomColorsList = useMemo(() => new Map<string, string>(), [])

	const randomColor = useCallback(
		(username: string): string => {
			return getRandomUsernameColor(username, randomColorsList)
		},
		[randomColorsList]
	)

	const parseEmotes = useCallback(
		(text: string, emoteOffsets: Map<string, string[]>): { id: string; index: [number, number] }[] => {
			const msgEmotes: { id: string; index: [number, number] }[] = []

			const twitchEmotes = parseChatMessage(text, emoteOffsets)

			for (const emote of twitchEmotes) {
				if (emote.type === "emote") {
					msgEmotes.push({
						id: emote.id,
						index: [emote.position, emote.position + emote.length]
					})

					if (!emotes.find((e) => e.id === emote.id)) {
						addEmotes([
							{
								id: emote.id,
								name: emote.name,
								platform: Platform.Twitch,
								source: EmoteSource.Twitch,
								bucket: "channel",
								channel: null,
								meta: {
									zeroWidth: false,
									isEffect: false
								},
								type: "default",
								url: {
									x1: {
										width: 18,
										height: 18,
										url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/${theme}/1.0`
									},
									x2: {
										width: 36,
										height: 36,
										url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/${theme}/2.0`
									},
									x4: {
										width: 72,
										height: 72,
										url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/${theme}/3.0`
									}
								}
							}
						])
					}
				}
			}

			return msgEmotes
		},
		[addEmotes, emotes, theme]
	)

	// const parseBadges = useCallback((badges: string): string[] => {}, [])

	const [isConnected, setIsConnected] = useState(false)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_connecting, setConnecting] = useState(false)

	const addMessage = useChatStore((state) => state.addMessage)

	useEffect(() => {
		if (typeof window === "undefined") return
		const client = new ChatClient({
			channels: [channel],
			logger: {
				minLevel: "info"
			}
		})
		client.onConnect(() => {
			setIsConnected(true)
			setConnecting(false)
		})
		client.onDisconnect(() => {
			setIsConnected(false)
		})

		client.onMessage((channel, user, message, msg) => {
			const timestamp = new Date().getTime()

			const userColor =
				typeof msg.userInfo.color === "undefined" || msg.userInfo.color === ""
					? randomColor(user)
					: msg.userInfo.color

			addMessage({
				id: msg.id,
				platform: Platform.Twitch,
				channel: channel.slice(1),
				text: message,
				user: {
					id: msg.userInfo.userId,
					name: msg.userInfo.displayName,
					platform: Platform.Twitch,
					color: ensureContrast(userColor, theme === "light" ? "#e9f6fe" : "#10182d"),
					badges: Array.from(msg.userInfo.badges ?? [])
						.map(([id, version]) => {
							let badgeId = `${id}-${channel.slice(1)}-${version}`
							let badge = badges.find((b) => b.id === badgeId)
							if (!badge) {
								badgeId = `${id}-${version}`
								badge = badges.find((b) => b.id === badgeId)
								if (!badge) {
									return null
								}
							}
							return badgeId
						})
						.filter((b) => b !== null) as string[]
				},
				emotes: parseEmotes(message, msg.emoteOffsets),
				timestamp: timestamp
			})
		})

		setConnecting(true)
		void client.connect()

		return () => {
			client?.quit()
		}
	}, [channel, addMessage, randomColor, parseEmotes, badges, theme])

	return { isConnected }
}
