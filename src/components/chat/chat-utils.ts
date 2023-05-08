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
		return bestColor.toString({ format: "hex" })
	}
}
