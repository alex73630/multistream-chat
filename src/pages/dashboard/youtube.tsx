import DashboardLayout from "~/components/dashboard/DashboardLayout";
import YoutubeGallery from "~/components/dashboard/YoutubeGallery";

export default function DashboardYoutube() {
	const navigation = [
		{ name: 'Chat', href: '/dashboard', current: false },
		{ name: 'Youtube', href: '/dashboard/youtube', current: true }
	]
	return (
		<DashboardLayout navigation={navigation} >
			<header>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Dashboard Youtube</h1>
				</div>
			</header>
			<main>
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<YoutubeGallery
						urls={[
							"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
							"https://www.youtube.com/watch?v=oHg5SJYRHA0",
							"https://www.youtube.com/watch?v=5BSl4h6FuKk",
							"https://www.youtube.com/watch?v=MzN2-V7NnWs",
							"https://www.youtube.com/watch?v=cOa1atv_dds",
							"https://www.youtube.com/watch?v=K0eW0lEDLfo"
						]}
					/>
				</div>
			</main>
		</DashboardLayout>
	)
}
