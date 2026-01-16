export function capitalizeFirstLetters(str: string): string {
	return str?.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}
