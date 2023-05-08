import * as React from "react"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Label } from "../ui/label"

interface FormSelectProps {
	onValueChange?: (value: string) => void
	label: string
	placeholder: string
	values: {
		label: string
		value: string
	}[]
	defaultValue?: string
}

export function FormSelect({ onValueChange, values, defaultValue, label, placeholder }: FormSelectProps) {
	const [value, setValue] = React.useState<string>(defaultValue ?? "")

	const handleValueChange = React.useCallback(
		(value: string) => {
			setValue(value)
			onValueChange?.(value)
		},
		[onValueChange]
	)

	return (
		<div className="grid w-full max-w-sm items-center gap-1.5 pb-4">
			<Label>{label}</Label>
			<Select value={value} onValueChange={handleValueChange}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{values.map(({ label, value }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}
