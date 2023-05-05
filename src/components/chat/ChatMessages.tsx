import { Platform, useChatStore } from "./ChatStore"
import YoutubeBadge from "./badges/YoutubeBadge"
import TwitchBadge from "./badges/TwitchBadge"
import { useCallback, useEffect, useRef } from "react"

export default function ChatMessages() {
	const messages = useChatStore((state) => state.messages)

	const renderBadges = (platform: Platform) => {
		if (platform === Platform.YouTube) {
			return <YoutubeBadge />
		} else if (platform === Platform.Twitch) {
			return <TwitchBadge />
		}
	}
	const containerRef = useRef<HTMLDivElement>(null)

	const autoScroll = useCallback((event: Event) => {
		const { currentTarget: target } = event
		// @ts-expect-error - scroll is not in the types
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		target?.scroll({
			// @ts-expect-error - scroll is not in the types
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			top: target.scrollHeight, behavior: "smooth"
		})
	}, [])

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.addEventListener("DOMNodeInserted", autoScroll)
		}
	}, [autoScroll])

	return (
		<div className="h-screen overflow-hidden p-1" ref={containerRef}>
			{messages.map((message) => (
				<div key={message.id} className="my-1">
					<span className="mr-1">{renderBadges(message.platform)}</span>
					<span>{message.user}: </span>
					<span>{message.text}</span>
				</div>
			))}
		</div>
	)
}
