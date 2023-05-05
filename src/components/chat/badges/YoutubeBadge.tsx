import Image from "next/image"
import YtBadge from "~/images/yt-icon-square.svg"

export default function YoutubeBadge() {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	return <Image src={YtBadge} alt="Chat Badge" height={32} width={32} className="inline rounded" />
}
