import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { cn } from "../../lib/utils"
import { Fragment, useCallback, useMemo, useState } from "react"

interface FormSelectProps {
	onValueChange?: (value: FormSelectValue) => void
	label: string
	placeholder: string
	values: FormSelectValue[]
	defaultValue?: FormSelectValue
	error?: string
	disabled?: boolean
	required?: boolean
}

interface FormSelectValue {
	label: string
	value: string
}

export function FormSelect({
	onValueChange,
	values,
	defaultValue,
	label,
	placeholder,
	error,
	disabled,
	required
}: FormSelectProps) {
	const [selected, setValue] = useState<FormSelectValue | undefined>(defaultValue ?? undefined)

	const handleValueChange = useCallback(
		(value: FormSelectValue) => {
			setValue(value)
			onValueChange?.(value)
		},
		[onValueChange]
	)

	const buttonClasses = useMemo(() => {
		const classes: string[] = [
			"relative h-full w-full cursor-default rounded-md py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 sm:text-sm sm:leading-6 dark:bg-white/5"
		]

		if (error) {
			classes.push("border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500")
		}
		if (disabled) {
			classes.push(
				"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 dark:disabled:bg-gray-900 dark:disabled:text-gray-500 dark:disabled:ring-gray-600"
			)
		}
		if (!error && !disabled) {
			classes.push(
				"text-gray-900 ring-gray-300 focus:ring-sky-600 dark:text-white dark:ring-white/10 dark:focus:ring-sky-500"
			)
		}
		return cn(classes)
	}, [error, disabled])

	return (
		<div className="flex justify-center">
			<div className="w-full max-w-sm gap-1.5 pb-4">
				<Listbox value={selected} onChange={handleValueChange} disabled={disabled}>
					{({ open }) => (
						<>
							<Listbox.Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
								{label}
								{required && <span className="text-red-500">*</span>}
							</Listbox.Label>
							<div className="relative mt-2">
								<Listbox.Button className={buttonClasses}>
									<span className={cn("block truncate", !selected?.label && "text-gray-400")}>
										{selected?.label || placeholder}
									</span>
									<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
										<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
									</span>
								</Listbox.Button>

								<Transition
									show={open}
									as={Fragment}
									leave="transition ease-in duration-100"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<Listbox.Options className="z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-white/5 dark:text-white dark:ring-white/10 dark:ring-opacity-5 sm:text-sm">
										{values.map((value) => (
											<Listbox.Option
												key={value.value}
												className={({ active }) =>
													cn(
														active
															? "bg-sky-600 text-white"
															: "text-gray-900 dark:text-white",
														"relative cursor-default select-none py-2 pl-3 pr-9"
													)
												}
												value={value}
											>
												{({ selected, active }) => (
													<>
														<span
															className={cn(
																selected ? "font-semibold" : "font-normal",
																"block truncate"
															)}
														>
															{value.label}
														</span>

														{selected ? (
															<span
																className={cn(
																	active ? "text-white" : "text-sky-600",
																	"absolute inset-y-0 right-0 flex items-center pr-4"
																)}
															>
																<CheckIcon className="h-5 w-5" aria-hidden="true" />
															</span>
														) : null}
													</>
												)}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</Transition>
							</div>
						</>
					)}
				</Listbox>
			</div>
		</div>
	)
}
