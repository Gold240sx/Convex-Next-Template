import React from "react"
import { FormElementInstance } from "../../FormElements"
import { VoidFunction } from "@/utils/helperFunctions"

type CodeLibProps = {
	element: FormElementInstance
	dynamicCode: boolean
}

export const SubTitleFieldElementsCode = ({
	element,
	dynamicCode,
}: CodeLibProps) => {
	const { subTitle, variant } = element.extraAttributes as {
		subTitle: string
		variant: string
	}
	let code: string = ""
	let imports: string[] = [""]

	switch (variant) {
		case "basic":
			switch (dynamicCode) {
				case false: // Dynamic
					code = `<p className="text-sm">Sub Title</p>`
					break
				case true: // Static
					;(code = `<p className="text-sm">\${subTitle}</p>`),
						(imports = ["subTitle"])
					break
				default:
					code = ""
					break
			}
			return { code, imports }
	}
}
