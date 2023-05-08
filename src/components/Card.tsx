import { cn } from "../lib/utils"

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div className="flex w-full flex-col items-center px-0 sm:px-6">
			<div
				className={cn(
					"w-full max-w-7xl overflow-hidden bg-white shadow dark:border dark:border-slate-700 dark:bg-slate-900 sm:rounded-lg",
					className
				)}
			>
				<div className="px-4 py-5 sm:p-6">{children}</div>
			</div>
		</div>
	)
}
