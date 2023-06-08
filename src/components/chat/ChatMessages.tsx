import { type Platform, useChatStore } from "./ChatStore"
import { useCallback, useEffect, useRef } from "react"
import { type Message } from "./ChatStore"
import dynamic from "next/dynamic"
import ChatMessage from "./ChatMessage"
import { cn } from "../../lib/utils"
import { type ChatConfig } from "./chat-config"

interface ChatMessageProps {
	preview?: boolean
	activePlatforms?: Platform[]
	messages?: Message[]
	config: ChatConfig
}

function ChatMessages(props: ChatMessageProps) {
	const [messages, emotes, badges] = useChatStore((state) => [state.messages, state.emotes, state.badges])

	const containerRef = useRef<HTMLDivElement>(null)

	const autoScroll = useCallback((event: Event) => {
		const { currentTarget: target } = event
		// @ts-expect-error - scroll is not in the types
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		target?.scroll({
			// @ts-expect-error - scroll is not in the types
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			top: target.scrollHeight
			// behavior: "smooth"
		})
	}, [])

	useEffect(() => {
		if (containerRef.current && !props.preview) {
			containerRef.current.addEventListener("DOMNodeInserted", autoScroll)
		}
	}, [autoScroll, props.preview])

	return (
		<div className={cn("overflow-hidden p-4", props.preview ? "h-full" : "h-screen")} ref={containerRef}>
			{(props.preview && props.messages ? props.messages : messages).map((message) => (
				<ChatMessage
					key={message.id}
					message={message}
					emotes={emotes}
					badges={badges}
					config={props.config}
					activePlatforms={props.activePlatforms}
				/>
			))}
		</div>
	)
}

export default dynamic(() => Promise.resolve(ChatMessages), {
	ssr: false
})
