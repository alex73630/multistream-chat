import { useMemo } from "react"
import { type Badge, type Emote, type Message } from "./ChatStore"
import Image from "next/image"
import ChatBadge from "./ChatBadge"

interface ChatMessageProps {
	message: Message
	emotes: Emote[]
	badges: Badge[]
}

export default function ChatMessage({ message, emotes, badges }: ChatMessageProps) {
	const renderBadges = useMemo(() => {
		const badgesElems = [<ChatBadge key={message.platform} platform={message.platform} size="small" />]

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
					<ChatBadge key={data.id} platform={message.platform} size="small" image={badgeUrl.url} />
				)
			}
		}

		return badgesElems
	}, [badges, message.platform, message.user.badges])

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
			let emoteUrl: {
				url: string
				width: number
				height: number
			}

			if (data.url.x4) {
				emoteUrl = data.url.x4
			} else if (data.url.x2) {
				emoteUrl = data.url.x2
			} else if (data.url.x1) {
				emoteUrl = data.url.x1
			} else {
				continue
			}

			const emoteImage = (
				<Image
					key={start}
					unoptimized
					src={emoteUrl.url}
					alt={emoteText}
					width={emoteUrl.width}
					height={emoteUrl.height}
					className="mx-1 inline h-auto max-h-6 w-auto leading-6"
				/>
			)
			parsedText.push(message.text.substring(currentIndex, start))
			parsedText.push(emoteImage)
			currentIndex = end + 1
		}
		parsedText.push(message.text.substring(currentIndex).trimEnd())
		return parsedText
	}, [message.emotes, message.text, emotes, message.platform])

	return (
		<div className="my-2 items-center text-black dark:text-white">
			<span className="inline h-6 leading-6">{renderBadges}</span>
			<span className="mr-1 align-middle text-lg font-bold">
				<span style={{ color: message.user.color }}>{message.user.name}</span>:
			</span>
			<span className="align-middle text-lg">{renderMessageText}</span>
		</div>
	)
}
