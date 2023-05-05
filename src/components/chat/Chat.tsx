import { useRouter } from "next/router"
import { useTwitchChat } from "./clients/twitch"
import { useYouTubeChat } from "./clients/youtube"
import dynamic from "next/dynamic"
import { useMemo } from "react"
import ChatMessages from "./ChatMessages"

function ChatComponent() {
	const router = useRouter()
	const youtubeId = useMemo(() => ({ handle: router.query.youtube as string }), [router.query])
	useYouTubeChat(youtubeId)
	useTwitchChat(router.query.twitch as string)

	if (typeof router.query.youtube !== "string") {
		return <div>Invalid YouTube handle</div>
	}

	if (typeof router.query.twitch !== "string") {
		return <div>Invalid Twitch handle</div>
	}

	return (
		<div className="flex flex-col w-screen h-screen">
			<ChatMessages />
		</div>
	)
}

export default dynamic(() => Promise.resolve(ChatComponent), {
	ssr: false
})
