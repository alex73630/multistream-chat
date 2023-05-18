import { useMemo } from "react"
import { cn } from "../../lib/utils"

export default function FormButton({
	className,
	disabled,
	children,
	mode = "primary",
	...props
}: {
	mode?: "primary" | "secondary"
	className?: string
	disabled?: boolean
	children: string
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
	const buttonClasses = useMemo(() => {
		const classes: string[] = [
			"inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:ring-offset-0 disabled:ring-transparent"
		]

		if (mode === "primary") {
			classes.push("text-white bg-sky-600 hover:bg-sky-700 focus:ring-sky-500")
		} else {
			classes.push(
				"text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
			)
		}

		return cn(classes)
	}, [mode])

	return (
		<div className={className}>
			<span className="block w-full rounded-md shadow-sm">
				<button type={props.type ?? "button"} className={buttonClasses} disabled={disabled} {...props}>
					{children}
				</button>
			</span>
		</div>
	)
}
