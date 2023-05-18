import { useCallback, useState } from "react"
import { Switch } from "@headlessui/react"
import { cn } from "../../lib/utils"

interface FormToggleProps {
	onValueChange?: (value: boolean) => void
	label: string
	description?: string
	defaultValue?: boolean
	disabled?: boolean
}

export default function FormToggle({ onValueChange, label, description, defaultValue, disabled }: FormToggleProps) {
	const [enabled, setEnabled] = useState(defaultValue ?? false)

	const handleEnabledChange = useCallback(
		(value: boolean) => {
			setEnabled(value)
			onValueChange?.(value)
		},
		[onValueChange]
	)

	return (
		<Switch.Group as="div" className="my-2 flex items-center justify-between">
			<span className="flex flex-grow flex-col">
				<Switch.Label as="span" className="text-sm font-medium leading-6 text-gray-900 dark:text-white" passive>
					{label}
				</Switch.Label>
				{description && (
					<Switch.Description as="span" className="text-sm text-gray-500 dark:text-gray-400">
						{description}
					</Switch.Description>
				)}
			</span>
			<Switch
				checked={enabled}
				onChange={handleEnabledChange}
				disabled={disabled}
				className={cn(
					enabled ? "bg-sky-600" : "bg-gray-200 dark:bg-white/10",
					"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
				)}
			>
				<span
					aria-hidden="true"
					className={cn(
						enabled ? "translate-x-5" : "translate-x-0",
						"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
					)}
				/>
			</Switch>
		</Switch.Group>
	)
}
