import DashboardLayout from "~/components/dashboard/DashboardLayout";

export default function DashboardChat() {
	const navigation = [
		{ name: 'Chat', href: '/dashboard', current: true },
		{ name: 'Youtube', href: '/dashboard/youtube', current: false },
		{ name: 'AI', href: '/dashboard/ai', current: false }
	]
	return (
		<DashboardLayout navigation={navigation} >
			<header>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Dashboard Chat</h1>
				</div>
			</header>
			<main>
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{/* Your content */}</div>
			</main>
		</DashboardLayout>
	)
}
