import { useRouter } from "next/router"
import { useTwitchChat } from "./clients/twitch"
import { useYouTubeChat } from "./clients/youtube"
import dynamic from "next/dynamic"
import { useEffect, useMemo } from "react"
import ChatMessages from "./ChatMessages"

function ChatComponent() {
	const router = useRouter()
	const config = useMemo(() => {
		const { theme, overlay, youtube, twitch } = router.query
		return {
			theme: theme as string,
			overlay: overlay === "true",
			youtube: youtube as string,
			twitch: twitch as string
		}
	}, [router.query])
	useYouTubeChat({ handle: config.youtube })
	useTwitchChat(config.twitch)

	useEffect(() => {
		if (router.query.overlay === "true") {
			const bgClasses = Array.from(document.body.classList).filter((c) => c.includes("bg-"))
			bgClasses.forEach((c) => document.body.classList.remove(c))

			document.body.classList.add("bg-transparent")
		}
	}, [router.query])

	if (typeof router.query.youtube !== "string" && typeof router.query.twitch !== "string") {
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
