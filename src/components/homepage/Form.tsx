import { useState } from "react"
import Card from "../Card"
import FormInput from "../form/FormInput"
import { Button } from "../ui/button"
import { FormSelect } from "../form/FormSelect"
import ChatMessages from "../chat/ChatMessages"
import { type Message, Platform } from "../chat/ChatStore"

interface GeneratedState {
	overlay: string
	panel: string
}

const previewMessages: Message[] = [
	{
		id: "1",
		channel: "",
		platform: Platform.Twitch,
		text: "Hello world",
		user: {
			id: "1",
			name: "alex73630",
			platform: Platform.Twitch,
			color: "#FF0000",
			badges: []
		},
		emotes: [],
		timestamp: Date.now()
	},
	{
		id: "2",
		channel: "",
		platform: Platform.YouTube,
		text: "Hello world",
		user: {
			id: "1",
			name: "alex73630",
			platform: Platform.YouTube,
			color: "#FF0000",
			badges: []
		},
		emotes: [],
		timestamp: Date.now()
	},
	{
		id: "3",
		channel: "",
		platform: Platform.Twitch,
		text: "Hello world",
		user: {
			id: "1",
			name: "alex73630",
			platform: Platform.Twitch,
			color: "#FF0000",
			badges: []
		},
		emotes: [],
		timestamp: Date.now()
	}
]

export default function Form() {
	const [generated, setGenerated] = useState<GeneratedState | null>(null)

	const fontSizes = [
		{ label: "Small", value: "small" },
		{ label: "Medium", value: "medium" },
		{ label: "Large", value: "large" }
	]

	const fonts = [
		{ label: "Roboto", value: "roboto" },
		{ label: "Inter", value: "inter" },
		{ label: "Poppins", value: "poppins" }
	]

	return (
		<div className="mb-32 w-full py-16">
			<Card>
				<form className="flex flex-col">
					<div className="flex items-start justify-around align-middle">
						<FormInput id="twitch" label="Twitch username" placeholder="alex73630" />
						<FormInput
							id="youtube"
							label="YouTube handle"
							placeholder="@alex73630"
							description="You can find it under your channel name, it starts with an @"
						/>
					</div>
					<div className="grid place-items-center sm:grid-cols-2">
						<FormSelect
							label="Font size"
							placeholder="Select font size"
							values={fontSizes}
							defaultValue="small"
						/>
						<FormSelect label="Font" placeholder="Select font" values={fonts} defaultValue="roboto" />
					</div>
					<div className="flex justify-center">
						<Button>Create my chat</Button>
					</div>
				</form>

				{generated && (
					<div className="flex flex-col items-center justify-center">
						<p className="text-2xl font-bold">Your chat is ready!</p>
						<p className="text-xl">You can use the following links to add your chat to your stream</p>
						<div className="flex flex-col items-center justify-center">
							<div className="flex flex-col items-center justify-center">
								<p className="text-xl">Overlay</p>
								<input className="w-96" type="text" value={generated.overlay} />
							</div>
							<div className="flex flex-col items-center justify-center">
								<p className="text-xl">Panel</p>
								<input className="w-96" type="text" value={generated.panel} />
							</div>
						</div>
					</div>
				)}
			</Card>

			<div className="flex w-full flex-col items-center px-0 sm:px-6">
				<div
					className={
						"mt-8 max-h-96 w-full max-w-7xl overflow-hidden bg-white shadow dark:border dark:border-slate-700 dark:bg-slate-900 sm:rounded-lg"
					}
				>
					<ChatMessages preview={true} messages={previewMessages} />
				</div>
			</div>
		</div>
	)
}
