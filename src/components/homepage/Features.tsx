import {
	PaintBrushIcon,
	WrenchScrewdriverIcon,
	FaceSmileIcon,
	SwatchIcon,
	ChatBubbleLeftRightIcon,
	BoltIcon
} from "@heroicons/react/20/solid"

const features = [
	{
		name: "All the chat at once",
		description: "Get your Twitch and YouTube chat in the same overlay or window with with no compromises",
		icon: ChatBubbleLeftRightIcon
	},
	{
		name: "Real-time YouTube chat",
		description:
			"No more messages comming in blocks, get your YouTube chat in real-time and in sync with Twitch chat",
		icon: BoltIcon
	},
	{
		name: "Emotes support, all of them",
		description:
			"Get all your emotes, including custom and animated, from Twitch and YouTube, but also from custom providers like 7TV, BTTV and FFZ",
		icon: FaceSmileIcon
	},
	{
		name: "Easy to use, get ready in a few clicks",
		description:
			"Get your chat in a few clicks, no need to install anything, just fill the form and get a URL to use in OBS or your streaming software",
		icon: WrenchScrewdriverIcon
	},
	{
		name: "Custom username color and badges",
		description:
			"Are you an avid 7TV or BTTV user? Show your custom username color and badges in style to your viewers",
		icon: PaintBrushIcon
	},
	{
		name: "Your chat, your way",
		description:
			"Get your chat in a window or overlay, with a custom background and font, and with the size you want",
		icon: SwatchIcon
	}
]

export default function Features() {
	return (
		<div className="pb-16">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-gray-600 dark:text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
					{features.map((feature) => (
						<div key={feature.name} className="relative pl-9">
							<dt className="inline font-semibold text-gray-900 dark:text-white">
								<feature.icon
									className="absolute left-1 top-1 h-5 w-5 text-sky-500"
									aria-hidden="true"
								/>
								{feature.name}
							</dt>
							<dd>{feature.description}</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	)
}
