import React from "react"
import { FormElementInstance } from "../../FormElements"
import { VoidFunction } from "@/utils/helperFunctions"

type CodeLibProps = {
	element: FormElementInstance
	dynamicCode: boolean
}

export const TitleFieldElementsCode = ({
	element,
	dynamicCode,
}: CodeLibProps) => {
	const { title, variant } = element.extraAttributes as {
		title: string
		variant: string
	}
	let code: string = ""
	let imports: string[] = [""]

	switch (variant) {
		case "basic":
			switch (dynamicCode) {
				case false: // Dynamic
					code = `<p className="text-xl">Form Title</p>`
					break
				case true: // Static
					;(code = `<p className="text-xl">\${title}</p>`),
						(imports = ["title"])
					break
				default:
					code = ""
					break
			}
			return { code, imports }
	}
}
