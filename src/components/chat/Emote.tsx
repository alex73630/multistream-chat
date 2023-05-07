import Image from "next/image"

export default function Emote(url: string) {
	return <Image src={url} unoptimized alt="Chat Emote" height={32} width={32} className="inline" />
}
