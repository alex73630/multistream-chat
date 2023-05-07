export default function Hero() {
	return (
		<div className="px-6 py-16 sm:py-16 lg:px-8">
			<div className="mx-auto max-w-2xl text-center">
				<h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
					All your chat in one, with no compromises
				</h2>
				<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
					Get your Twitch and YouTube chat in the same overlay or window with support for emotes (including
					custom and animated), custom username color and badges.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<a
						href="#"
						className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Get started
					</a>
					<a href="#" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
						Learn more <span aria-hidden="true">→</span>
					</a>
				</div>
			</div>
		</div>
	)
}
