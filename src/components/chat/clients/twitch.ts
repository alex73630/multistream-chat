import {
	ChatClient,
	type UserNotice,
	type ChatCommunitySubInfo,
	type ChatSubGiftInfo,
	parseChatMessage,
	type ChatMessage
} from "@twurple/chat"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { EmoteSource, Platform, useChatStore } from "../ChatStore"
import { useTheme } from "../../../lib/ThemeProvider"
import { api } from "../../../utils/api"
import { ensureContrast, getRandomUsernameColor } from "../chat-utils"
import { type Listener } from "@d-fischer/typed-event-emitter/lib"

export const useTwitchChat = (channel: string | undefined) => {
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
		{ channel: twitchChannel ?? "" },
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
		{ channel: twitchChannel ?? "", theme },
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

	const parseEmotes = useCallback(
		(
			text: string,
			emoteOffsets: Map<string, string[]>
		): [{ id: string; index: [number, number] }[], { id: string; amount: number; index: [number, number] }[]] => {
			const msgEmotes: { id: string; index: [number, number] }[] = []
			const msgCheermote: {
				id: string
				amount: number
				index: [number, number]
			}[] = []

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
				if (emote.type === "cheer") {
					msgCheermote.push({
						id: emote.name,
						amount: emote.amount,
						index: [emote.position, emote.position + emote.length]
					})
				}
			}

			return [msgEmotes, msgCheermote]
		},
		[addEmotes, emotes, theme]
	)

	const parseBadges = useCallback(
		(badgesMsg: [string, string][]): string[] => {
			return badgesMsg
				.map(([id, version]) => {
					let badgeId = `${id}-${twitchChannel ?? ""}-${version}`
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
		},
		[badges, twitchChannel]
	)

	const addMessage = useChatStore((state) => state.addMessage)

	const handleMessages = useCallback(
		(channel: string, user: string, message: string, msg: ChatMessage) => {
			const timestamp = new Date().getTime()

			const userColor =
				typeof msg.userInfo.color === "undefined" || msg.userInfo.color === ""
					? randomColor(user)
					: msg.userInfo.color

			const [parsedEmotes, parsedCheermotes] = parseEmotes(message, msg.emoteOffsets)

			addMessage({
				id: msg.id,
				platform: Platform.Twitch,
				channel,
				text: message,
				user: {
					id: msg.userInfo.userId,
					name: msg.userInfo.displayName,
					platform: Platform.Twitch,
					color: ensureContrast(userColor, theme === "light" ? "#e9f6fe" : "#10182d"),
					badges: parseBadges(Array.from(msg.userInfo.badges))
				},
				emotes: parsedEmotes,
				...(parsedCheermotes.length > 0
					? {
							cheermotes: parsedCheermotes,
							event: {
								type: "donation"
							}
					  }
					: {}),
				timestamp: timestamp
			})
		},
		[addMessage, randomColor, theme, parseBadges, parseEmotes]
	)

	const deleteMessage = useChatStore((state) => state.deleteMessage)

	const handleMessageDeletion = useCallback(
		(channel: string, messageId: string) => {
			deleteMessage(messageId)
		},
		[deleteMessage]
	)

	const deleteUserMessages = useChatStore((state) => state.deleteUserMessages)

	const handleUserMessageDeletion = useCallback(
		(channel: string, user: string) => {
			deleteUserMessages(user, Platform.Twitch)
		},
		[deleteUserMessages]
	)

	const clearMessages = useChatStore((state) => state.clearMessages)

	const handleClearMessages = useCallback(() => {
		clearMessages(Platform.Twitch)
	}, [clearMessages])

	const giftCounts = useMemo(() => new Map<string | undefined, number>(), [])

	const handleGiftSubs = useCallback(
		(channel: string, user: string, subInfo: ChatCommunitySubInfo, msg: UserNotice) => {
			const timestamp = new Date().getTime()

			const userColor =
				typeof msg.userInfo.color === "undefined" || msg.userInfo.color === ""
					? randomColor(user)
					: msg.userInfo.color

			const previousGiftCount = giftCounts.get(user) ?? 0
			giftCounts.set(user, previousGiftCount + subInfo.count)

			const message = `${msg.userInfo.displayName} is gifting ${subInfo.count} subs!${
				subInfo.gifterGiftCount && subInfo.gifterGiftCount > 0
					? ` They've gifted ${subInfo.gifterGiftCount} subs to the channel!`
					: ""
			}`

			addMessage({
				id: `${Platform.Twitch}-${channel}-${timestamp}`,
				platform: Platform.Twitch,
				channel,
				text: message,
				user: {
					id: msg.userInfo.userId,
					name: msg.userInfo.displayName,
					platform: Platform.Twitch,
					color: ensureContrast(userColor, theme === "light" ? "#e9f6fe" : "#10182d"),
					badges: parseBadges(Array.from(msg.userInfo.badges))
				},
				emotes: [],
				event: {
					type: "gift",
					highlightColor: "#ff0000"
				},
				timestamp: timestamp
			})
		},
		[addMessage, randomColor, theme, giftCounts, parseBadges]
	)

	const handleGiftSub = useCallback(
		(channel: string, recipient: string, subInfo: ChatSubGiftInfo, msg: UserNotice) => {
			const user = subInfo.gifter
			const previousGiftCount = giftCounts.get(user) ?? 0

			if (previousGiftCount > 0) {
				giftCounts.set(user, previousGiftCount - 1)
			} else {
				const timestamp = new Date().getTime()

				const userColor =
					typeof msg.userInfo.color === "undefined" || msg.userInfo.color === ""
						? randomColor(msg.userInfo.userName)
						: msg.userInfo.color

				const tier =
					subInfo.plan === "1000"
						? " Tier 1 "
						: subInfo.plan === "2000"
						? " Tier 2 "
						: subInfo.plan === "3000"
						? " Tier 3 "
						: " "

				const message = `${msg.userInfo.displayName} gifted a${tier}sub to ${recipient}!${
					subInfo.gifterGiftCount && subInfo.gifterGiftCount > 0
						? ` They've gifted ${subInfo.gifterGiftCount} subs to the channel!`
						: ""
				}`

				addMessage({
					id: `${Platform.Twitch}-${channel}-${timestamp}`,
					platform: Platform.Twitch,
					channel,
					text: message,
					user: {
						id: msg.userInfo.userId,
						name: msg.userInfo.displayName,
						platform: Platform.Twitch,
						color: ensureContrast(userColor, theme === "light" ? "#e9f6fe" : "#10182d"),
						badges: parseBadges(Array.from(msg.userInfo.badges))
					},
					emotes: [],
					event: {
						type: "gift",
						highlightColor: "#ff0000"
					},
					timestamp: timestamp
				})
			}
		},
		[addMessage, randomColor, theme, giftCounts, parseBadges]
	)

	const clientRef = useRef<ChatClient>()
	const onMessageListenerRef = useRef<Listener>()
	const onMessageDeletionListenerRef = useRef<Listener>()
	const onUserTimeoutListenerRef = useRef<Listener>()
	const onUserBanListenerRef = useRef<Listener>()
	const onClearMessagesListenerRef = useRef<Listener>()
	const onGiftSubsListenerRef = useRef<Listener>()
	const onGiftSubListenerRef = useRef<Listener>()

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
	}, [twitchChannel, clientRef])

	useEffect(() => {
		if (clientRef.current) {
			if (onMessageListenerRef.current) {
				clientRef.current.removeListener(onMessageListenerRef.current)
			}
			onMessageListenerRef.current = clientRef.current.onMessage(handleMessages)

			if (onMessageDeletionListenerRef.current) {
				clientRef.current.removeListener(onMessageDeletionListenerRef.current)
			}
			onMessageDeletionListenerRef.current = clientRef.current.onMessageRemove(handleMessageDeletion)

			if (onUserTimeoutListenerRef.current) {
				clientRef.current.removeListener(onUserTimeoutListenerRef.current)
			}
			onUserTimeoutListenerRef.current = clientRef.current.onTimeout(handleUserMessageDeletion)

			if (onUserBanListenerRef.current) {
				clientRef.current.removeListener(onUserBanListenerRef.current)
			}
			onUserBanListenerRef.current = clientRef.current.onBan(handleUserMessageDeletion)

			if (onClearMessagesListenerRef.current) {
				clientRef.current.removeListener(onClearMessagesListenerRef.current)
			}
			onClearMessagesListenerRef.current = clientRef.current.onChatClear(handleClearMessages)

			if (onGiftSubsListenerRef.current) {
				clientRef.current.removeListener(onGiftSubsListenerRef.current)
			}
			onGiftSubsListenerRef.current = clientRef.current.onCommunitySub(handleGiftSubs)

			if (onGiftSubListenerRef.current) {
				clientRef.current.removeListener(onGiftSubListenerRef.current)
			}
			onGiftSubListenerRef.current = clientRef.current.onSubGift(handleGiftSub)
		}
	}, [
		clientRef,
		handleMessages,
		handleMessageDeletion,
		handleUserMessageDeletion,
		handleClearMessages,
		handleGiftSubs,
		handleGiftSub
	])

	useEffect(() => {
		return () => {
			if (clientRef.current) {
				clientRef.current.quit()
				if (onMessageListenerRef.current) {
					clientRef.current.removeListener(onMessageListenerRef.current)
					onMessageListenerRef.current = undefined
				}

				if (onMessageDeletionListenerRef.current) {
					clientRef.current.removeListener(onMessageDeletionListenerRef.current)
					onMessageDeletionListenerRef.current = undefined
				}

				if (onUserTimeoutListenerRef.current) {
					clientRef.current.removeListener(onUserTimeoutListenerRef.current)
					onUserTimeoutListenerRef.current = undefined
				}

				if (onUserBanListenerRef.current) {
					clientRef.current.removeListener(onUserBanListenerRef.current)
					onUserBanListenerRef.current = undefined
				}

				if (onClearMessagesListenerRef.current) {
					clientRef.current.removeListener(onClearMessagesListenerRef.current)
					onClearMessagesListenerRef.current = undefined
				}

				if (onGiftSubsListenerRef.current) {
					clientRef.current.removeListener(onGiftSubsListenerRef.current)
					onGiftSubsListenerRef.current = undefined
				}

				if (onGiftSubListenerRef.current) {
					clientRef.current.removeListener(onGiftSubListenerRef.current)
					onGiftSubListenerRef.current = undefined
				}

				clientRef.current = undefined
			}
		}
	}, [clientRef])

	return {
		isConnected: clientRef.current?.isConnected ?? false
	}
}
