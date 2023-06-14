import { useTwitchChat } from "./clients/twitch"
import { useYouTubeChat } from "./clients/youtube"
import dynamic from "next/dynamic"
import { useEffect, useMemo } from "react"
import ChatMessages from "./ChatMessages"
import { Platform } from "./ChatStore"
import { type ChatConfig } from "./chat-config"

function ChatComponent(config: ChatConfig) {
	useYouTubeChat(config.youtube ? { handle: config.youtube } : undefined)
	useTwitchChat(config.twitch)

	useEffect(() => {
		if (config.overlay === true) {
			const bgClasses = Array.from(document.body.classList).filter((c) => c.includes("bg-"))
			bgClasses.forEach((c) => document.body.classList.remove(c))

			document.body.classList.add("bg-transparent")
		}
	}, [config.overlay])

	const activePlatforms = useMemo(() => {
		const platforms: Platform[] = []

		if (typeof config.twitch === "string") {
			platforms.push(Platform.Twitch)
		}

		if (typeof config.youtube === "string") {
			platforms.push(Platform.YouTube)
		}

		return platforms
	}, [config.twitch, config.youtube])

	if (typeof config.youtube !== "string" && typeof config.twitch !== "string") {
		return <div>No chat provider setup</div>
	}

	return (
		<div className={"flex h-screen w-screen flex-col"}>
			<ChatMessages config={config} activePlatforms={activePlatforms} />
		</div>
	)
}

export default dynamic(() => Promise.resolve(ChatComponent), {
	ssr: false
})
