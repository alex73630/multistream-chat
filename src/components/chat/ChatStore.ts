import { create } from "zustand"

export enum Platform {
	YouTube = "YouTube",
	Twitch = "Twitch"
}

export enum EmoteSource {
	Twitch = "Twitch",
	BTTV = "BTTV",
	FFZ = "FFZ",
	SevenTV = "7TV",
	YouTube = "YouTube"
}

export enum BadgeSource {
	Twitch = "Twitch",
	BTTV = "BTTV",
	FFZ = "FFZ",
	FFZAP = "FFZAP",
	SevenTV = "7TV",
	Chatterino = "Chatterino",
	YouTube = "YouTube"
}

export interface ChatUser {
	id: string
	name: string
	platform: Platform
	color: string
	badges: string[]
}

export interface Message {
	id: string
	channel: string
	platform: Platform
	timestamp: number
	user: ChatUser
	emotes: {
		id: string
		index: [number, number]
	}[]
	cheermotes?: {
		id: string
		amount: number
		index: [number, number]
	}[]
	superchat?: {
		amount: string
		color: string
		sticker?: string
	}
	text: string
	event?: {
		type: "subscription" | "gift" | "raid" | "donation" | "announcement" | "slash-me" | "reply" | "badge-upgrade"
		highlightColor?: string
	}
}

export interface Emote {
	id: string
	name: string
	url: {
		x1: {
			width: number
			height: number
			url: string
		} | null
		x2: {
			width: number
			height: number
			url: string
		} | null
		x4: {
			width: number
			height: number
			url: string
		} | null
	}
	platform: Platform
	bucket: "global" | "channel"
	channel: string | null
	source: EmoteSource
	type: "static" | "animated" | "default"
	meta: {
		zeroWidth: boolean
		isEffect: boolean
	}
}

export interface Cheermote {
	id: string
	prefix: string
	minBits: number
	color: string
	images: {
		dark: {
			animated: {
				"1": string
				"1.5": string
				"2": string
				"3": string
				"4": string
			}
			static: {
				"1": string
				"1.5": string
				"2": string
				"3": string
				"4": string
			}
		}
		light: {
			animated: {
				"1": string
				"1.5": string
				"2": string
				"3": string
				"4": string
			}
			static: {
				"1": string
				"1.5": string
				"2": string
				"3": string
				"4": string
			}
		}
	}
	platform: Platform.Twitch
	bucket: "global" | "channel"
	channel: string | null
}

export interface Badge {
	id: string
	setId?: string
	name: string
	url: {
		x1: {
			width: number
			height: number
			url: string
		} | null
		x2: {
			width: number
			height: number
			url: string
		} | null
		x4: {
			width: number
			height: number
			url: string
		} | null
	}
	platform: Platform
	bucket: "global" | "channel"
	channel: string | null
	source: BadgeSource
}

export interface ChatStore {
	messages: Message[]
	badges: Badge[]
	emotes: Emote[]
	cheermotes: Cheermote[]
	addMessage: (message: Message) => void
	deleteMessage: (id: string) => void
	deleteUserMessages: (userId: string, platform: Platform) => void
	clearMessages: (platform?: Platform) => void
	addBadge: (badge: Badge) => void
	addBadges: (badges: Badge[]) => void
	addEmote: (emote: Emote) => void
	addEmotes: (emotes: Emote[]) => void
	updateEmote: (sourceId: string, emote: Emote) => void
	addCheermote: (cheermote: Cheermote) => void
	addCheermotes: (cheermotes: Cheermote[]) => void
}

export const useChatStore = create<ChatStore>()((set) => ({
	messages: [],
	badges: [],
	emotes: [],
	cheermotes: [],
	addMessage: (message) =>
		set((state) => {
			if (state.messages.some((m) => m.id === message.id)) {
				return state
			}
			if (state.messages.length >= 100) {
				state.messages.shift()
			}
			return { messages: [...state.messages, message] }
		}),
	deleteMessage: (id) =>
		set((state) => {
			state.messages = state.messages.filter((message) => message.id !== id)
			return { messages: [...state.messages] }
		}),
	deleteUserMessages: (userId, platform) =>
		set((state) => {
			state.messages = state.messages.filter(
				(message) => !(message.user.id === userId && message.platform === platform)
			)
			return { messages: [...state.messages] }
		}),
	clearMessages: (platform) =>
		set((state) => {
			if (platform) {
				state.messages = state.messages.filter((message) => message.platform !== platform)
			} else {
				state.messages = []
			}
			return { messages: [...state.messages] }
		}),
	addBadge: (badge) =>
		set((state) => {
			if (!state.badges.some((b) => b.id === badge.id && b.source === badge.source)) {
				state.badges.push(badge)
			}
			return { badges: [...state.badges] }
		}),
	addBadges: (badges) =>
		set((state) => {
			const toAdd = badges.filter(
				(badge) => !state.badges.some((b) => b.id === badge.id && b.source === badge.source)
			)
			state.badges.push(...toAdd)
			return { badges: [...state.badges] }
		}),
	addEmote: (emote) =>
		set((state) => {
			if (!state.emotes.some((e) => e.id === emote.id && e.source === emote.source)) {
				state.emotes.push(emote)
			}
			return { emotes: [...state.emotes] }
		}),
	addEmotes: (emotes) =>
		set((state) => {
			const toAdd = emotes.filter(
				(emote) => !state.emotes.some((e) => e.id === emote.id && e.source === emote.source)
			)
			state.emotes.push(...toAdd)
			return { emotes: [...state.emotes] }
		}),
	updateEmote: (sourceId, emote) =>
		set((state) => {
			const index = state.emotes.findIndex((e) => e.id === sourceId && e.source === emote.source)
			if (index !== -1) {
				state.emotes[index] = emote
			}
			return { emotes: [...state.emotes] }
		}),
	addCheermote: (cheermote) =>
		set((state) => {
			if (!state.cheermotes.some((c) => c.id === cheermote.id)) {
				state.cheermotes.push(cheermote)
			}
			return { cheermotes: [...state.cheermotes] }
		}),
	addCheermotes: (cheermotes) =>
		set((state) => {
			const toAdd = cheermotes.filter((cheermote) => !state.cheermotes.some((c) => c.id === cheermote.id))
			state.cheermotes.push(...toAdd)
			return { cheermotes: [...state.cheermotes] }
		})
}))
