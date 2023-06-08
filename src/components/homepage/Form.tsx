import { useState } from "react"
import Card from "../Card"
import FormInput from "../form/FormInput"
import { FormSelect } from "../form/FormSelect"
import ChatMessages from "../chat/ChatMessages"
import { type Message, Platform } from "../chat/ChatStore"
import FormButton from "../form/FormButton"
import FormToggle from "../form/FormToggle"
import { type ChatConfig, getInitialChatConfig } from "../chat/chat-config"

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

	const [config, setConfig] = useState<ChatConfig>(getInitialChatConfig())

	return (
		<div className="mb-32 grid w-full max-w-7xl items-stretch gap-8 py-16 sm:px-8 lg:grid-cols-3">
			<div className="h-full lg:col-span-2">
				<Card>
					<form className="grid gap-8 sm:grid-cols-2">
						<div className="grid gap-8 sm:col-span-2 sm:grid-cols-2">
							<FormInput
								className="w-full"
								id="twitch"
								label="Twitch username"
								placeholder="alex73630"
								required
							/>
							<FormInput
								className="w-full"
								id="youtube"
								label="YouTube handle"
								placeholder="@alex73630"
								description="You can find it under the channel name on your page, it always starts with an @"
							/>
						</div>
						<div className="grid gap-8 sm:col-span-2 sm:grid-cols-2">
							<FormSelect
								label="Font size"
								placeholder="Select font size"
								values={fontSizes}
								defaultValue={fontSizes[0]}
								required
							/>
							<FormSelect label="Font" placeholder="Select font" values={fonts} required />
							<FormToggle label="Dark mode" description="Enable dark mode" />
						</div>
						<div className="flex justify-center sm:col-span-2">
							<FormButton
								onClick={() => {
									setGenerated({
										overlay:
											"https://chat-overlay.vercel.app/overlay?channel=alex73630&platform=twitch&fontSize=small&font=roboto",
										panel: "https://chat-overlay.vercel.app/panel?channel=alex73630&platform=twitch&fontSize=small&font=roboto"
									})
								}}
							>
								Create my chat
							</FormButton>
						</div>
					</form>
				</Card>
				{generated && (
					<Card className="mt-8">
						<div className="flex flex-col items-center justify-center text-black dark:text-white">
							<p className="text-2xl font-bold">Your chat is ready!</p>
							<p className="text-xl">You can use the following links to add your chat to your stream</p>
							<div className="mt-8 flex w-full flex-col items-center justify-center gap-4">
								<div className="flex w-full flex-col items-center justify-center">
									<p className="text-xl">Overlay</p>
									<FormInput className="w-full" value={generated.overlay} readOnly />
								</div>
								<div className="flex w-full flex-col items-center justify-center">
									<p className="text-xl">Panel (for OBS)</p>
									<FormInput className="w-full" value={generated.panel} readOnly />
								</div>
							</div>
						</div>
					</Card>
				)}
			</div>
			<div className="flex h-full w-full flex-col items-center">
				<div
					className={
						"h-full w-full overflow-hidden bg-white shadow dark:border dark:border-slate-700 dark:bg-slate-900 sm:rounded-lg"
					}
				>
					<ChatMessages config={config} preview={true} messages={previewMessages} />
				</div>
			</div>
		</div>
	)
}
