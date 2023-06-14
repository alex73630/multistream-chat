import { useMemo } from "react"
import { type Platform, type Badge, type Emote, type Message } from "./ChatStore"
import ChatBadge from "./ChatBadge"
import { type ChatConfig } from "./chat-config"
import ChatEmote from "./ChatEmote"
import { cn } from "../../lib/utils"

interface ChatMessageProps {
	message: Message
	emotes: Emote[]
	badges: Badge[]
	activePlatforms?: Platform[]
	config: ChatConfig
}

export default function ChatMessage({ message, emotes, badges, activePlatforms, config }: ChatMessageProps) {
	const chatSize = useMemo(() => {
		switch (config.font.size) {
			case "small":
				return {
					lineHeight: "h-6",
					leading: "leading-6",
					maxLineHeight: "max-h-6",
					fontSize: "text-lg"
				}
			case "medium":
				return {
					lineHeight: "h-8",
					leading: "leading-8",
					maxLineHeight: "max-h-8",
					fontSize: "text-xl"
				}
			case "large":
				return {
					lineHeight: "h-10",
					leading: "leading-10",
					maxLineHeight: "max-h-10",
					fontSize: "text-2xl"
				}
			default:
				return {
					lineHeight: "h-6",
					leading: "leading-6",
					maxLineHeight: "max-h-6",
					fontSize: "text-lg"
				}
		}
	}, [config.font.size])

	const renderBadges = useMemo(() => {
		const badgesElems =
			activePlatforms && activePlatforms.length > 1
				? [<ChatBadge key={message.platform} platform={message.platform} size={config.font.size} />]
				: []

		if (message.user.badges) {
			for (const badge of message.user.badges) {
				const data = badges.find((b) => b.id === badge && b.platform === message.platform)
				if (!data) {
					continue
				}
				let badgeUrl: {
					url: string
					width: number
					height: number
				}

				if (data.url.x4) {
					badgeUrl = data.url.x4
				} else if (data.url.x2) {
					badgeUrl = data.url.x2
				} else if (data.url.x1) {
					badgeUrl = data.url.x1
				} else {
					continue
				}

				badgesElems.push(
					<ChatBadge key={data.id} platform={message.platform} size={config.font.size} image={badgeUrl.url} />
				)
			}
		}

		return badgesElems
	}, [badges, message.platform, message.user.badges, activePlatforms, config.font.size])

	const renderMessageText = useMemo(() => {
		if (!message.emotes) {
			return message.text
		}

		// return text with emotes replaced with images
		let currentIndex = 0
		const parsedText = []
		for (const emote of message.emotes) {
			const data = emotes.find((e) => e.id === emote.id && e.platform === message.platform)
			if (!data) {
				continue
			}
			const [start, end] = emote.index
			const emoteText = message.text.substring(start, end + 1)

			const emoteImage = <ChatEmote key={start} emote={data} emoteText={emoteText} size={config.font.size} />
			parsedText.push(message.text.substring(currentIndex, start))
			parsedText.push(emoteImage)
			currentIndex = end + 1
		}
		parsedText.push(message.text.substring(currentIndex).trimEnd())
		return parsedText
	}, [message.emotes, message.text, emotes, message.platform, config.font.size])

	return (
		<div className="my-2 items-center text-black dark:text-white">
			<span className={cn("inline", chatSize.lineHeight, chatSize.leading)}>{renderBadges}</span>
			<span className={cn("mr-1 align-middle font-bold", chatSize.fontSize)}>
				<span style={{ color: message.user.color }}>{message.user.name}</span>:
			</span>
			<span className={cn("align-middle", chatSize.fontSize)}>{renderMessageText}</span>
		</div>
	)
}
