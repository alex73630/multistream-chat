import { type Dispatch } from "react"
import { type SetStateAction, useState } from "react"

function useLocalStorage<T = string>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
	const [state, setState] = useState<T>(() => {
		// Initialize the state
		try {
			const value = window.localStorage.getItem(key)
			// Check if the local storage already has any values,
			// otherwise initialize it with the passed initialValue
			const parsedValue: T = value ? (JSON.parse(value) as T) : initialValue

			return parsedValue
		} catch (error) {
			if (typeof window !== "undefined") {
				console.log(error)
			}
			return initialValue
		}
	})

	const setValue: Dispatch<SetStateAction<T>> = (value) => {
		try {
			// If the passed value is a callback function,
			//  then call it with the existing state.
			const valueToStore = value instanceof Function ? value(state) : value
			window.localStorage.setItem(key, JSON.stringify(valueToStore))
			setState(value)
		} catch (error) {
			console.log(error)
		}
	}

	return [state, setValue]
}

export default useLocalStorage
