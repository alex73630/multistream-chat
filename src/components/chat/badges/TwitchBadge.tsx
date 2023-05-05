import Image from "next/image";
import TwBadge from "~/images/twitch-icon-square.svg"

export default function TwitchBadge() {
	return (
		<Image src={TwBadge} alt="Chat Badge" height={32} width={32} className="inline rounded" />
	)
}
