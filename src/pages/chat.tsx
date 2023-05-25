import { type NextPage } from "next"
import ChatComponent from "../components/chat/Chat"
import Head from "next/head"
import { useRouter } from "next/router"
import { useMemo } from "react"

const Chat: NextPage = () => {
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
