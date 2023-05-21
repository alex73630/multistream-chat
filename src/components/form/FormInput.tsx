import { ExclamationCircleIcon } from "@heroicons/react/20/solid"
import { cn } from "../../lib/utils"
import { type DetailedHTMLProps, type InputHTMLAttributes, useMemo } from "react"

interface FormInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	id?: string
	label?: string
	placeholder?: string
	description?: string
	autoComplete?: string
	error?: string
	disabled?: boolean
	required?: boolean
}

export default function FormInput({
	id,
	label,
	description,
	placeholder,
	className,
	itemType,
	error,
	disabled,
	required,
	...props
}: FormInputProps) {
	const inputClasses = useMemo(() => {
		const classes: string[] = [
			"block w-full rounded-md border-0 py-1.5 ring-1 ring-inset focus:ring-2 focus:ring-inset dark:bg-white/5 sm:text-sm sm:leading-6"
		]

		if (error) {
			classes.push(
				"text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 dark:text-red-500 dark:ring-red-400"
			)
		}
		if (disabled) {
			classes.push(
				"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 dark:disabled:bg-gray-900 dark:disabled:text-gray-500 dark:disabled:ring-gray-600"
			)
		}

		if (!error && !disabled) {
			classes.push(
				"text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-sky-600 dark:text-white dark:ring-white/10 dark:focus:ring-sky-500"
			)
		}

		return cn(classes)
	}, [error, disabled])

	return (
		<div className={className}>
			{label && (
				<label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
					{label}
					{required && <span className="text-red-500">*</span>}
				</label>
			)}
			<div className="relative mt-2 rounded-md shadow-sm">
				<input
					type={itemType ? itemType : "text"}
					name={id}
					id={id}
					placeholder={placeholder}
					autoComplete={props.autoComplete ? props.autoComplete : "off"}
					{...props}
					disabled={disabled}
					required={required}
					className={inputClasses}
				/>
				{error && (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
						<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
					</div>
				)}
			</div>
			{error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
			{description && <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{description}</p>}
		</div>
	)
}
