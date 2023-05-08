import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface FormInputProps extends React.HTMLAttributes<HTMLInputElement> {
	id: string
	label: string
	placeholder: string
	description?: string
}

export default function FormInput({ id, label, description, ...props }: FormInputProps) {
	return (
		<div className="grid w-full max-w-sm items-center gap-1.5 pb-4">
			<Label htmlFor={id}>{label}</Label>
			<Input id={id} {...props} />
			{description && <p className="text-sm text-muted-foreground">{description}</p>}
		</div>
	)
}
