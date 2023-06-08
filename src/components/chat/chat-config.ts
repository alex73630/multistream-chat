import { z } from "zod"

export const ChatConfigParser = z.object({
	theme: z.enum(["light", "dark"]).optional().default("light"),
	overlay: z.boolean().default(false),
	youtube: z.string().optional(),
	twitch: z.string().optional(),
	font: z
		.object({
			size: z.enum(["small", "medium", "large"]).default("small"),
			family: z.string().optional(),
			shadow: z.enum(["off", "small", "medium", "large"]).default("off"),
			borders: z.enum(["off", "small", "medium", "large"]).default("off")
		})
		.default({
			size: "small",
			shadow: "off",
			borders: "off"
		}),
	username: z
		.object({
			staticColor: z.boolean().default(false),
			customPaint: z.boolean().default(true)
		})
		.default({
			staticColor: false,
			customPaint: true
		}),
	badges: z
		.object({
			twitch: z.boolean().default(true),
			youtube: z.boolean().default(true),
			sevenTV: z.boolean().default(true),
			bttv: z.boolean().default(true),
			ffz: z.boolean().default(true),
			chatterino: z.boolean().default(true)
		})
		.default({
			twitch: true,
			youtube: true,
			sevenTV: true,
			bttv: true,
			ffz: true,
			chatterino: true
		}),
	emotes: z
		.object({
			customPersonalEmotes: z.boolean().default(true),
			customGlobalEmotes: z.boolean().default(true)
		})
		.default({
			customPersonalEmotes: true,
			customGlobalEmotes: true
		}),
	chat: z
		.object({
			newLine: z.boolean().default(false),
			animate: z.boolean().default(false),
			fade: z.number().default(0),
			hideBots: z.boolean().default(false),
			botsList: z.array(z.string()).default([]),
			hideCommands: z.boolean().default(false),
			commandsPrefixes: z.array(z.string()).default([])
		})
		.default({
			newLine: false,
			animate: false,
			fade: 0,
			hideBots: false,
			botsList: [],
			hideCommands: false,
			commandsPrefixes: []
		})
})

export type ChatConfig = z.infer<typeof ChatConfigParser>

export const getInitialChatConfig = () => ChatConfigParser.nullable().parse({}) as ChatConfig

export const parseChatConfig = (config: Partial<ChatConfig>) => ChatConfigParser.parse(config)
