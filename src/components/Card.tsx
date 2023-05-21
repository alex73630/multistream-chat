import { cn } from "../lib/utils"

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div className={cn("flex w-full flex-col items-center", className)}>
			<div className="h-full w-full overflow-hidden bg-white shadow dark:border dark:border-slate-700 dark:bg-slate-900 sm:rounded-lg">
				<div className="h-full w-full px-4 py-5 sm:p-6">{children}</div>
			</div>
		</div>
	)
}
