import { type Config } from "tailwindcss"

export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: ["class"],
	theme: {},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")]
} satisfies Config
