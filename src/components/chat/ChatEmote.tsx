import Image from "next/image"
import { type Emote } from "./ChatStore"
import { useMemo } from "react"
import { cn } from "../../lib/utils"

interface EmoteProps {
	emote: Emote
	emoteText: string
	size: "small" | "medium" | "large"
}

export default function ChatEmote({ emote, emoteText, size }: EmoteProps) {
	const calculatedSize = useMemo(() => {
		switch (size) {
			case "small":
				return 24
			case "medium":
				return 32
			case "large":
				return 48
			default:
				return 24
		}
	}, [size])

	const chatSize = useMemo(() => {
		switch (size) {
			case "small":
				return {
					leading: "leading-6",
					maxLineHeight: "max-h-6"
				}
			case "medium":
				return {
					leading: "leading-8",
					maxLineHeight: "max-h-8"
				}
			case "large":
				return {
					leading: "leading-10",
					maxLineHeight: "max-h-10"
				}
			default:
				return {
					leading: "leading-6",
					maxLineHeight: "max-h-6"
				}
		}
	}, [size])

	const emoteUrl = useMemo(() => {
		let parsedEmoteUrl: {
			url: string
			width: number
			height: number
		} | null = null

		if (emote.url.x4) {
			parsedEmoteUrl = emote.url.x4
		} else if (emote.url.x2) {
			parsedEmoteUrl = emote.url.x2
		} else if (emote.url.x1) {
			parsedEmoteUrl = emote.url.x1
		}

		return parsedEmoteUrl
	}, [emote])

	if (!emoteUrl) {
		return null
	}

	return (
		<Image
			unoptimized
			src={emoteUrl.url}
			alt={emoteText}
			width={emoteUrl.width}
			height={calculatedSize}
			className={cn("mx-1 inline h-auto w-auto", chatSize.maxLineHeight, chatSize.leading)}
		/>
	)
}
