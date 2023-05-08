import { ChatClient } from "@twurple/chat"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { EmoteSource, Platform, useChatStore } from "../ChatStore"
import { parseChatMessage } from "@twurple/common"
import { useTheme } from "../../../lib/ThemeProvider"
import { api } from "../../../utils/api"
import { ensureContrast, getRandomUsernameColor } from "../chat-utils"
import { type TwitchPrivateMessage } from "@twurple/chat/lib/commands/TwitchPrivateMessage"
import { type Listener } from "@d-fischer/typed-event-emitter/lib"

export const useTwitchChat = (channel: string) => {
	const { theme } = useTheme()

	const twitchChannel = useMemo(() => channel, [channel])

	const [emotes, addEmotes, badges, addBadges] = useChatStore((state) => [
		state.emotes,
		state.addEmotes,
		state.badges,
		state.addBadges
	])

	const { data: globalBadges } = api.twitch.getGlobalBadges.useQuery(undefined, {
		staleTime: Infinity,
		enabled: !!channel
	})

	useEffect(() => {
		if (globalBadges) {
			addBadges(globalBadges)
		}
	}, [globalBadges, addBadges])

	const { data: channelBadges } = api.twitch.getChannelBadges.useQuery(
		{ channel },
		{
			staleTime: Infinity,
			enabled: !!channel
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
			staleTime: Infinity,
			enabled: !!channel
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
			staleTime: Infinity,
			enabled: !!channel
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

	const parseEmotes = useCallback((text: string, emoteOffsets: Map<string, string[]>): { id: string; index: [number, number] }[] => {
		const msgEmotes: { id: string; index: [number, number] }[] = []

		const twitchEmotes = parseChatMessage(text, emoteOffsets)

		for (const emote of twitchEmotes) {
			if (emote.type === "emote") {
				msgEmotes.push({
					id: emote.id,
					index: [emote.position, emote.position + emote.length]
				})

				if (!emotes.find((e) => e.id === emote.id && e.platform === Platform.Twitch)) {
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
	}, [addEmotes, emotes, theme])

	const parseBadges = useCallback((badgesMsg: [string, string][]): string[] => {
		return badgesMsg.map(([id, version]) => {
			let badgeId = `${id}-${twitchChannel}-${version}`
			let badge = badges.find((b) => b.id === badgeId && b.platform === Platform.Twitch)
			if (!badge) {
				badgeId = `${id}-${version}`
				badge = badges.find((b) => b.id === badgeId && b.platform === Platform.Twitch)
				if (!badge) {
					return null
				}
			}
			return badgeId
		})
			.filter((b) => b !== null) as string[]
	}, [badges, twitchChannel])

	const addMessage = useChatStore((state) => state.addMessage)

	const handleMessages = useCallback((channel: string, user: string, message: string, msg: TwitchPrivateMessage) => {
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
				badges: parseBadges(Array.from(msg.userInfo.badges)),
			},
			emotes: parseEmotes(message, msg.emoteOffsets),
			timestamp: timestamp
		})
	}, [addMessage, randomColor, theme, parseBadges, parseEmotes])

	const clientRef = useRef<ChatClient>()
	const listenerRef = useRef<Listener>()

	useEffect(() => {
		if (typeof window === "undefined" || !twitchChannel || typeof twitchChannel === "undefined") return
		if (clientRef.current === null || clientRef.current === undefined) {
			clientRef.current = new ChatClient({
				channels: [twitchChannel],
				logger: {
					minLevel: "info"
				}
			})
		}

		if (clientRef.current) {
			const currClient = clientRef.current
			console.log(currClient.currentChannels, twitchChannel)
			if (!currClient.currentChannels.includes(`#${twitchChannel}`) && !!twitchChannel) {
				void currClient.join(twitchChannel)
			}

			if (!currClient.isConnected && !currClient.isConnecting) {
				void currClient.connect()
			}
		}

	}, [twitchChannel, clientRef, listenerRef])


	useEffect(() => {
		if (clientRef.current) {
			if (listenerRef.current) {
			clientRef.current.removeListener(listenerRef.current)
			}
			listenerRef.current = clientRef.current.onMessage(
				handleMessages
			)
		}
	}, [handleMessages])

	useEffect(() => {
		return () => {
			if (clientRef.current) {
				clientRef.current.quit()
				if (listenerRef.current) {
					clientRef.current.removeListener(listenerRef.current)
					listenerRef.current = undefined
				}
				clientRef.current = undefined
			}
		}
	}, [clientRef])

	return {
		isConnected: clientRef.current?.isConnected ?? false,
	}
}
