import Image, { type ImageProps } from "next/image"
import { Platform } from "./ChatStore"
import { useMemo } from "react"
import TwBadge from "~/images/twitch-icon-square.svg"
import YtBadge from "~/images/yt-icon-square.svg"
import { cn } from "../../lib/utils"

interface BadgeProps {
	size: "small" | "medium" | "large"
}

interface CustomBadgeProps extends BadgeProps {
	image: ImageProps["src"]
}

interface PlatformBadgeProps extends BadgeProps {
	platform: Platform
}

type Props = CustomBadgeProps | PlatformBadgeProps

export default function ChatBadge(props: Props) {
	const calculatedSize = useMemo(() => {
		switch (props.size) {
			case "small":
				return 24
			case "medium":
				return 32
			case "large":
				return 48
			default:
				return 24
		}
	}, [props.size])

	const chatSize = useMemo(() => {
		switch (props.size) {
			case "small":
				return {
					maxLineHeight: "max-h-6"
				}
			case "medium":
				return {
					maxLineHeight: "max-h-8"
				}
			case "large":
				return {
					maxLineHeight: "max-h-10"
				}
			default:
				return {
					maxLineHeight: "max-h-6"
				}
		}
	}, [props.size])

	const badgeClasses = useMemo(() => {
		return cn("mr-1 inline h-auto w-auto min-w-[1.5rem] rounded", chatSize.maxLineHeight)
	}, [chatSize])

	if ("image" in props) {
		return (
			<Image
				unoptimized
				src={props.image}
				alt="Chat Badge"
				height={calculatedSize}
				width={calculatedSize}
				className={badgeClasses}
			/>
		)
	}

	switch (props.platform) {
		case Platform.Twitch:
			return (
				<Image
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					src={TwBadge}
					alt="Twitch Chat Badge"
					height={calculatedSize}
					width={calculatedSize}
					className={badgeClasses}
				/>
			)
		case Platform.YouTube:
			return (
				<Image
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					src={YtBadge}
					alt="YouTube Chat Badge"
					height={calculatedSize}
					width={calculatedSize}
					className={badgeClasses}
				/>
			)
	}
}
