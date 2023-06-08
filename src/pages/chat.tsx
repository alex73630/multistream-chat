import { type NextPage } from "next"
import ChatComponent from "../components/chat/Chat"
import Head from "next/head"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { parseChatConfig } from "../components/chat/chat-config"

const Chat: NextPage = () => {
	const router = useRouter()
	const config = useMemo(() => {
		const { theme, overlay, youtube, twitch, fontSize } = router.query
		return parseChatConfig({
			theme: theme as "light" | "dark",
			overlay: overlay === "true",
			youtube: youtube as string,
			twitch: twitch as string,
			font: {
				size: (fontSize as "small" | "medium" | "large") ?? "small",
				borders: "off",
				shadow: "off"
			}
		})
	}, [router.query])

	return (
		<>
			<Head>
				<title>Multistream Chat</title>
				<meta name="description" content="The best multistream chat ever" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<ChatComponent {...config} />
			</main>
		</>
	)
}

export default Chat
