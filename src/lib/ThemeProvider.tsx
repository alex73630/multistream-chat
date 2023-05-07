"use client"

import { type FunctionComponent, type ReactElement, createContext, useEffect, useContext } from "react";
import useLocalStorage from "./useLocalStorage";
import { getCurrentMode } from "./dark-mode";

export interface ThemeContextProps {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
	switchTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({ theme: "light", setTheme: () => { return "light" }, switchTheme: () => { return "light" } })

export const ThemeProvider: FunctionComponent<{ children: ReactElement | ReactElement[] }> = ({ children }) => {
	const defaultTheme = getCurrentMode()
	const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", defaultTheme)

	useEffect(() => {
		const root = window.document.documentElement
		root.classList.remove("light", "dark")
		root.classList.add(theme)
	}, [theme])

	const switchTheme = () => {
		setTheme(theme === "light" ? "dark" : "light")
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, switchTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider")
	}
	return context
}
