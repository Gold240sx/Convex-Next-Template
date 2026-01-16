import React from "react"
import { FormElementInstance } from "../../FormElements"

type CodeLibProps = {
	element: FormElementInstance
	dynamicCode: boolean
}

export const ParagraphFieldElementsCode = ({
	element,
	dynamicCode,
}: CodeLibProps) => {
	const { text, variant } = element.extraAttributes as {
		text: string
		variant: string
	}
	let code: string = ""
	let imports: string[] = [""]

	switch (variant) {
		case "basic":
			switch (dynamicCode) {
				case false: // Dynamic
					code = `<p>\${text}</p>`
					break
				case true: // Static
					;(code = `<p>${text}</p>`), (imports = [""])
					break
				default:
					code = ""
					break
			}
			return { code, imports }
	}
}
