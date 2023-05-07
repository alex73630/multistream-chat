import { useTheme } from "../../lib/ThemeProvider"
import SunIcon from "@heroicons/react/24/outline/SunIcon"
import MoonIcon from "@heroicons/react/24/outline/MoonIcon"
import ChatBubbleLeftRight from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon"

export default function Header() {
	const { theme, switchTheme } = useTheme()
	return (
		<header>
			<nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
				<div className="flex lg:flex-1">
					<a href="#" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded focus-visible:outline-sky-600 -m-1.5 p-1.5">
						<span className="sr-only">Multistream Chat</span>
						<ChatBubbleLeftRight className="h-10 w-10 text-sky-600" />
					</a>
				</div>
				<div className="flex flex-1 justify-end">
					<button
						type="button"
						className="rounded-full p-1.5 text-white shadow-sm hover:border-sky-400 border-2 border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
						onClick={switchTheme}
					>
						{theme === "light" ? (
							<MoonIcon className="h-8 w-8 text-gray-500" />
						) : (
							<SunIcon className="h-8 w-8 text-white" />
						)
						}
					</button>
				</div>
			</nav>
		</header>
	)
}
