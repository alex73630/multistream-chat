import Image, { type ImageProps } from "next/image"

export default function ChatBadge(image: ImageProps["src"]) {
	return <Image src={image} alt="Chat Badge" height={32} width={32} />
}
