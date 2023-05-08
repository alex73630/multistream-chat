import { type Platform, useChatStore, type ChatUser } from "./ChatStore"
import { useCallback, useEffect, useRef } from "react"
import { type Message } from "./ChatStore"
import ChatBadge from "./ChatBadge"
import Image from "next/image"
import dynamic from "next/dynamic"

interface ChatMessageProps {
	preview?: boolean
	messages?: Message[]
}

function ChatMessages(props: ChatMessageProps) {
	const [messages, emotes, badges] = useChatStore((state) => [state.messages, state.emotes, state.badges])

	const renderBadges = (platform: Platform, user: ChatUser) => {
		const badgesElems = [<ChatBadge key={0} platform={platform} size="small" />]

		if (user.badges) {
			for (const badge of user.badges) {
				const data = badges.find((b) => b.id === badge)
				if (!data) {
					continue
				}
				badgesElems.push(
					<ChatBadge key={badge} platform={platform} size="small" image={data.url.x2?.url as string} />
				)
			}
		}

		return badgesElems
	}
	const containerRef = useRef<HTMLDivElement>(null)

	const autoScroll = useCallback((event: Event) => {
		const { currentTarget: target } = event
		// @ts-expect-error - scroll is not in the types
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		target?.scroll({
			// @ts-expect-error - scroll is not in the types
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			top: target.scrollHeight,
			behavior: "smooth"
		})
	}, [])

	useEffect(() => {
		if (containerRef.current && !props.preview) {
			containerRef.current.addEventListener("DOMNodeInserted", autoScroll)
		}
	}, [autoScroll, props.preview])

	const renderMessageText = (msg: Message) => {
		if (!msg.emotes) {
			return msg.text
		}

		// return text with emotes replaced with images
		let currentIndex = 0
		const parsedText = []
		for (const emote of msg.emotes) {
			const data = emotes.find((e) => e.id === emote.id)
			if (!data) {
				continue
			}
			const [start, end] = emote.index
			const emoteText = msg.text.substring(start, end + 1)
			const emoteImage = (
				<Image
					key={start}
					unoptimized
					src={data.url.x2?.url as string}
					alt={emoteText}
					width={28}
					height={28}
					className="inline h-6 px-1 leading-6"
				/>
			)
			parsedText.push(msg.text.substring(currentIndex, start))
			parsedText.push(emoteImage)
			currentIndex = end + 1
		}
		parsedText.push(msg.text.substring(currentIndex))
		return parsedText
	}

	return (
		<div className="h-screen overflow-hidden p-4" ref={containerRef}>
			{(props.preview && props.messages ? props.messages : messages).map((message) => (
				<div key={message.id} className="my-2 items-center">
					<span className="inline h-6 leading-6">{renderBadges(message.platform, message.user)}</span>
					<span className="mr-1 align-middle text-lg font-bold">
						<span style={{ color: message.user.color }}>{message.user.name}</span>:
					</span>
					<span className="align-middle text-lg">{renderMessageText(message)}</span>
				</div>
			))}
		</div>
	)
}

export default dynamic(() => Promise.resolve(ChatMessages), {
	ssr: false
})
