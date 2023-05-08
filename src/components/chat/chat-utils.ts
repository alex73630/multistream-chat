import Color from "colorjs.io"

export function ensureContrast(textColor: string, bgColor: string): string {
	// Define the APCA contrast ratio recommendation
	const APCA_CONTRAST_RATIO = 75

	const text = new Color(textColor)
	const bg = new Color(bgColor)

	// Compute contrast ratio
	const contrast = Color.contrast(bg, text, "APCA")

	// Check if the contrast meets the APCA recommendation
	if (contrast >= APCA_CONTRAST_RATIO) {
		// If it does, return the original text color
		return textColor
	} else {
		// calculate the luminance required to meet the APCA recommendation
		const targetLuminance = (APCA_CONTRAST_RATIO * text.luminance + bg.luminance) / (APCA_CONTRAST_RATIO + 1)

		// calculate the required shift in luminance
		const shift = (targetLuminance - text.luminance) * 255

		// shift the color
		const bestColor = new Color("hsl", [
			text.hsl[0] as number,
			text.hsl[1] as number,
			(text.hsl[2] as number) + shift
		])

		// Return the color with the better contrast ratio
		return bestColor.to("srgb").toString({ format: "hex" })
	}
}

const usernameColors = [
	"#ff0000",
	"#0000ff",
	"#008000",
	"#b22222",
	"#ff7f50",
	"#9acd32",
	"#ff4500",
	"#2e8b57",
	"#daa520",
	"#d2691e",
	"#5f9ea0",
	"#1e90ff",
	"#ff69b4",
	"#8a2be2",
	"#00ff7f"
]

export const getRandomUsernameColor = (username: string, randomColorsList: Map<string, string>): string => {
	if (randomColorsList.has(username)) {
		return randomColorsList.get(username) as string
	}
	const color = usernameColors[Math.floor(Math.random() * usernameColors.length)] as string
	randomColorsList.set(username, color)
	return color
}
