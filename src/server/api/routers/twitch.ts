import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { type Emote, EmoteSource, Platform, type Badge, BadgeSource } from "../../../components/chat/ChatStore"

export const twitchRouter = createTRPCRouter({
	getGlobalEmotes: publicProcedure
		.input(
			z.object({
				theme: z.enum(["light", "dark"])
			})
		)
		.query(async ({ ctx, input }) => {
			const globalEmotes = await ctx.twitchClient.chat.getGlobalEmotes()
			const mappedEmotes: Emote[] = globalEmotes.map((emote) => {
				const format = emote.formats.includes("animated") ? "animated" : "static"

				return {
					id: emote.id,
					name: emote.name,
					url: {
						x1: emote.scales.includes("1.0")
							? {
									width: 28,
									height: 28,
									url: emote.getFormattedImageUrl("1.0", format, input.theme)
							  }
							: null,
						x2: emote.scales.includes("2.0")
							? {
									width: 56,
									height: 56,
									url: emote.getFormattedImageUrl("2.0", format, input.theme)
							  }
							: null,
						x4: emote.scales.includes("3.0")
							? {
									width: 112,
									height: 112,
									url: emote.getFormattedImageUrl("3.0", format, input.theme)
							  }
							: null
					},
					platform: Platform.Twitch,
					bucket: "global",
					channel: null,
					source: EmoteSource.Twitch,
					type: format,
					meta: {
						zeroWidth: false,
						isEffect: false
					}
				}
			})

			return mappedEmotes
		}),
	getChannelEmotes: publicProcedure
		.input(
			z.object({
				channel: z.string().min(1),
				theme: z.enum(["light", "dark"])
			})
		)
		.query(async ({ ctx, input }) => {
			const user = await ctx.twitchClient.users.getUserByName(input.channel)
			if (!user) {
				throw new Error(`User ${input.channel} not found`)
			}

			const channelEmotes = await ctx.twitchClient.chat.getChannelEmotes(user.id)
			const mappedEmotes: Emote[] = channelEmotes.map((emote) => {
				const format = emote.formats.includes("animated") ? "animated" : "static"

				return {
					id: emote.id,
					name: emote.name,
					url: {
						x1: emote.scales.includes("1.0")
							? {
									width: 28,
									height: 28,
									url: emote.getFormattedImageUrl("1.0", format, input.theme)
							  }
							: null,
						x2: emote.scales.includes("2.0")
							? {
									width: 56,
									height: 56,
									url: emote.getFormattedImageUrl("2.0", format, input.theme)
							  }
							: null,
						x4: emote.scales.includes("3.0")
							? {
									width: 112,
									height: 112,
									url: emote.getFormattedImageUrl("3.0", format, input.theme)
							  }
							: null
					},
					platform: Platform.Twitch,
					bucket: "channel",
					channel: input.channel,
					source: EmoteSource.Twitch,
					type: format,
					meta: {
						zeroWidth: false,
						isEffect: false
					}
				}
			})

			return mappedEmotes
		}),
	getGlobalBadges: publicProcedure.query(async ({ ctx }) => {
		const globalBadges = await ctx.twitchClient.chat.getGlobalBadges()
		const mappedBadges: Badge[] = globalBadges.flatMap((badge) => {
			return badge.versions.map((version) => {
				return {
					id: `${badge.id}-${version.id}`,
					setId: badge.id,
					name: version.title,
					url: {
						x1: {
							width: 18,
							height: 18,
							url: version.getImageUrl(1)
						},
						x2: {
							width: 36,
							height: 36,
							url: version.getImageUrl(2)
						},
						x4: {
							width: 72,
							height: 72,
							url: version.getImageUrl(4)
						}
					},
					platform: Platform.Twitch,
					bucket: "global",
					channel: null,
					source: BadgeSource.Twitch
				}
			})
		})

		return mappedBadges
	}),
	getChannelBadges: publicProcedure
		.input(
			z.object({
				channel: z.string().min(1)
			})
		)
		.query(async ({ ctx, input }) => {
			const user = await ctx.twitchClient.users.getUserByName(input.channel)
			if (!user) {
				throw new Error(`User ${input.channel} not found`)
			}

			const channelBadges = await ctx.twitchClient.chat.getChannelBadges(user.id)
			const mappedBadges: Badge[] = channelBadges.flatMap((badge) => {
				return badge.versions.map((version) => {
					return {
						id: `${badge.id}-${input.channel}-${version.id}`,
						setId: badge.id,
						name: version.title,
						url: {
							x1: {
								width: 18,
								height: 18,
								url: version.getImageUrl(1)
							},
							x2: {
								width: 36,
								height: 36,
								url: version.getImageUrl(2)
							},
							x4: {
								width: 72,
								height: 72,
								url: version.getImageUrl(4)
							}
						},
						platform: Platform.Twitch,
						bucket: "channel",
						channel: input.channel,
						source: BadgeSource.Twitch
					}
				})
			})

			return mappedBadges
		})
})
