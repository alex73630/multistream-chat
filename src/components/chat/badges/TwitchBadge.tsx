import Image from "next/image"
import TwBadge from "~/images/twitch-icon-square.svg"

export default function TwitchBadge() {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	return <Image src={TwBadge} alt="Chat Badge" height={32} width={32} className="inline rounded" />
}
