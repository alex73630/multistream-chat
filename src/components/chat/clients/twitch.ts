import { ChatClient } from "@twurple/chat"
import { useEffect, useState } from "react"
import { Platform, useChatStore } from "../ChatStore"

export const useTwitchChat = (channel: string) => {
	const [isConnected, setIsConnected] = useState(false)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_connecting, setConnecting] = useState(false)

	const addMessage = useChatStore((state) => state.addMessage)

	useEffect(() => {
		if (typeof window === "undefined") return
		const client = new ChatClient({
			channels: [channel],
			logger: {
				minLevel: "info"
			}
		})
		client.onConnect(() => {
			setIsConnected(true)
			setConnecting(false)
		})
		client.onDisconnect(() => {
			setIsConnected(false)
		})

		client.onMessage((channel, user, message) => {
			const timestamp = new Date().getTime()
			addMessage({
				id: `twitch-${timestamp}`,
				platform: Platform.Twitch,
				channel: channel.slice(1),
				text: message,
				user,
				timestamp: timestamp
			})
		})

		setConnecting(true)
		void client.connect()

		return () => {
			client?.quit()
		}
	}, [channel, addMessage])

	return { isConnected }
}
