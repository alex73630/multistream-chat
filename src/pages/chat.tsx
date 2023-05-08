import { type NextPage } from "next"
import ChatComponent from "../components/chat/Chat"
import Head from "next/head"

const Chat: NextPage = () => {
	return (
		<>
			<Head>
				<title>Multistream Chat</title>
				<meta name="description" content="The best multistream chat ever" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<ChatComponent />
			</main>
		</>
	)
}

export default Chat
