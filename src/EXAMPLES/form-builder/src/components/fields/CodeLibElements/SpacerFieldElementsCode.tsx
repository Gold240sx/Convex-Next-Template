import React from "react"
import { FormElementInstance } from "../../FormElements"

type CodeLibProps = {
	element: FormElementInstance
	dynamicCode: boolean
}

export const SpacerFieldElementsCode = ({
	element,
	dynamicCode,
}: CodeLibProps) => {
	const { height, variant } = element.extraAttributes as {
		height: number
		variant: string
	}
	let code: string = ""
	let imports: string[] = [""]

	switch (variant) {
		case "basic":
			switch (dynamicCode) {
				case false: // Dynamic
					code = `<Separator className={\`h-[${height}px]\`} />`
					break
				case true: // Static
					code = `<Separator className={h-[\${height}px]} />`
					imports = ["height"] // No imports needed for static code
					break
				default:
					code = ""
					break
			}
			return { code, imports }
	}
}
