import { Fragment } from 'react'
import { Disclosure, Menu } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import ChatBubbleLeftRight from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon"
import { useTheme } from "../../lib/ThemeProvider"
import SunIcon from "@heroicons/react/24/outline/SunIcon"
import MoonIcon from "@heroicons/react/24/outline/MoonIcon"
import Link from "next/link"

interface NavigationItem {
	name: string,
	href: string,
	current: boolean
}

export interface DashboardLayoutProps {
	navigation: NavigationItem[];
	children: React.ReactNode;
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

export default function DashboardLayout({ navigation, children }: DashboardLayoutProps) {
	const { theme, switchTheme } = useTheme()
	return (
		<>
			<div className="min-h-full">
				<Disclosure as="nav" className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
					{({ open }) => (
						<>
							<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
								<div className="flex h-16 justify-between">
									<div className="flex">
										<div className="flex flex-shrink-0 items-center">
											<Link
												href="/dashboard"
												className="-m-1.5 rounded p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
											>
												<span className="sr-only">Multistream Chat</span>
												<ChatBubbleLeftRight className="h-10 w-10 text-sky-600" />
											</Link>
										</div>
										<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
											{navigation.map((item) => (
												<Link href={item.href} key={item.name} legacyBehavior>
													<a
														key={item.name}
														className={classNames(
															item.current
																? 'border-sky-600 text-gray-900 dark:text-white'
																: 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700',
															'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
														)}
														aria-current={item.current ? 'page' : undefined}
													>
														{item.name}
													</a>
												</Link>
											))}
										</div>
									</div>
									<div className="hidden sm:ml-6 sm:flex sm:items-center">
										{/* Profile dropdown */}
										<Menu as="div" className="relative ml-3">
											<div>
												<div className="flex flex-1 justify-end">
													<button
														type="button"
														className="rounded-full border-2 border-transparent p-1.5 text-white shadow-sm hover:border-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
														onClick={switchTheme}
													>
														{theme === "light" ? (
															<MoonIcon className="h-8 w-8 text-gray-500" />
														) : (
															<SunIcon className="h-8 w-8 text-white" />
														)}
													</button>
												</div>
											</div>
										</Menu>
									</div>
									<div className="flex items-center sm:hidden">
										{/* Mobile menu button */}
										<Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white dark:bg-slate-800 p-2 text-gray-400 dark:text-slate-200 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
											<span className="sr-only">Open main menu</span>
											{open ? (
												<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
											) : (
												<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
											)}
										</Disclosure.Button>
									</div>
								</div>
							</div>

							<Disclosure.Panel className="sm:hidden">
								<div className="space-y-1 pb-3 pt-2">
									{navigation.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											className={classNames(
												item.current
													? 'border-sky-600 bg-sky-50 dark:bg-slate-900 text-sky-700 dark:text-white'
													: 'border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 hover:bg-sky-50 dark:hover:bg-slate-800',
												'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
											)}
											aria-current={item.current ? 'page' : undefined}
										>
											{item.name}
										</Link>
									))}
								</div>
								<div className="border-t border-gray-200 dark:border-slate-700 pb-3 pt-4">
									<div className="flex items-center px-4">
										<button
											type="button"
											className="ml-auto rounded-full border-2 border-transparent p-1.5 text-white shadow-sm hover:border-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
											onClick={switchTheme}
										>
											{theme === "light" ? (
												<MoonIcon className="h-8 w-8 text-gray-500" />
											) : (
												<SunIcon className="h-8 w-8 text-white" />
											)}
										</button>
									</div>
								</div>
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>

				<div className="py-10">
					{children}
				</div>
			</div>
		</>
	)
}
