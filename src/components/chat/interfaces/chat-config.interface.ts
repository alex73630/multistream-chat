export interface ChatConfig {
	theme?: "light" | "dark"
	overlay: boolean
	youtube?: string
	twitch?: string
	font: {
		size: "small" | "medium" | "large"
		family: string
		shadow: "off" | "small" | "medium" | "large"
		borders: "off" | "small" | "medium" | "large"
	}
	username: {
		staticColor: boolean
		customPaint: boolean
	}
	badges: {
		twitch: boolean
		youtube: boolean
		sevenTV: boolean
		bttv: boolean
		ffz: boolean
		chatterino: boolean
	}
	emotes: {
		customPersonalEmotes: boolean
		customGlobalEmotes: boolean
	}
	chat: {
		newLine: boolean
		animate: boolean
		fade: number
		hideBots: boolean
		botsList: string[]
		hideCommands: boolean
		commandsPrefixes: string[]
	}
}
