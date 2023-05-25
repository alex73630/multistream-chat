import { useTwitchChat } from "./clients/twitch"
import { useYouTubeChat } from "./clients/youtube"
import dynamic from "next/dynamic"
import { useEffect } from "react"
import ChatMessages from "./ChatMessages"

interface ChatComponentProps {
	theme?: string
	overlay?: boolean
	youtube?: string
	twitch?: string
}

function ChatComponent(config: ChatComponentProps) {
	useYouTubeChat(config.youtube ? { handle: config.youtube } : undefined)
	useTwitchChat(config.twitch)

	useEffect(() => {
		if (config.overlay === true) {
			const bgClasses = Array.from(document.body.classList).filter((c) => c.includes("bg-"))
			bgClasses.forEach((c) => document.body.classList.remove(c))

			document.body.classList.add("bg-transparent")
		}
	}, [config.overlay])

	if (typeof config.youtube !== "string" && typeof config.twitch !== "string") {
		return <div>No chat provider setup</div>
	}

	return (
		<div className={"flex h-screen w-screen flex-col"}>
			<ChatMessages />
		</div>
	)
}

export default dynamic(() => Promise.resolve(ChatComponent), {
	ssr: false
})
