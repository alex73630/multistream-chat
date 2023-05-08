import DashboardLayout from "~/components/dashboard/DashboardLayout";
import TwitchChatSummary from "~/components/dashboard/TwitchChatSummary";

export default function DashboardAI() {
	const navigation = [
		{ name: 'Chat', href: '/dashboard', current: false },
		{ name: 'Youtube', href: '/dashboard/youtube', current: false },
		{ name: 'AI', href: '/dashboard/ai', current: true }
	]
	return (
		<DashboardLayout navigation={navigation} >
			<header>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Dashboard IA</h1>
				</div>
			</header>
			<main>
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-10"><TwitchChatSummary videoId="1234" /></div>
			</main>
		</DashboardLayout>
	)
}
