import React from "react"
import { FormElementInstance } from "../../FormElements"

type CodeLibProps = {
	element: FormElementInstance
	dynamicCode: boolean
}

export const SeparatorFieldElementsCode = ({
	element,
	dynamicCode,
}: CodeLibProps) => {
	const { variant } = element.extraAttributes as {
		title: string
		variant: string
	}
	let code: string = ""
	let imports: string[] = [""]

	switch (variant) {
		case "basic":
			switch (dynamicCode) {
				case false: // Dynamic
					code = `<Separator />`
					break
				case true: // Static
					;(code = `<Separator />`), (imports = [""])
					break
				default:
					code = ""
					break
			}
			return { code, imports }
	}
}
