import React from "react"
import { FormElementInstance } from "../../FormElements"
import { VoidFunction } from "@/utils/helperFunctions"

type CodeLibProps = {
	element: FormElementInstance
	dynamicCode: boolean
}

export const NumberFieldElementsCode = ({
	element,
	dynamicCode,
}: CodeLibProps) => {
	const { label, helperText, required, variant } =
		element.extraAttributes as {
			label: string
			helperText: string
			required: boolean
			variant: string
		}
	let code: string = ""
	let imports: string[] = [""]

	switch (variant) {
		case "basic":
			switch (dynamicCode) {
				case false: // Dynamic
					code = `<div className="flex flex-col gap-2 w-full text-white">
	<Label>
		${label}
		${required ? "*" : ""}
	</Label>
	<Input readOnly disabled type="number" placeholder={placeHolder} />
	${
		helperText
			? `<p className="text-muted-foreground text-[0.8rem]">${helperText}</p>`
			: ""
	}
</div>`
					break
				case true: // Static
					;(code = `<div className="flex flex-col gap-2 w-full text-white">
	<Label>
		\${label}
		\${required ? "*" : ""}
	</Label>
	<Input readOnly disabled type="number" placeholder={placeHolder} />
	${
		helperText
			? `<p className="text-muted-foreground text-[0.8rem]">${helperText}</p>`
			: ""
	}
</div>`),
						(imports = [
							"label",
							"Input",
							"placeHolder",
							"required",
							"helperText",
						])
					break
				default:
					code = ""
					break
			}
			// case "floatingLabel":
			// 	switch (dynamicCode) {
			// 		case true: // Dynamic
			// 			code = `
			// 				<div className="flex flex-col gap-2 w-full text-white">
			// 					<Label>
			// 						${label}
			// 						${required ? "*" : ""}
			// 					</Label>
			// 					<Input readOnly disabled placeholder={placeHolder} />
			// 					${
			// 						helperText
			// 							? `<p className="text-muted-foreground text-[0.8rem]">${helperText}</p>`
			// 							: ""
			// 					}
			// 				</div>
			// 			`
			// 			break
			// 		case false: // Static
			// 			code = `
			// 				<div className="flex flex-col gap-2 w-full text-white">
			// 					<Label>
			// 						\${label}
			// 						\${required ? "*" : ""}
			// 					</Label>
			// 					<Input readOnly disabled placeholder={placeHolder} />
			// 					${
			// 						helperText
			// 							? `<p className="text-muted-foreground text-[0.8rem]">${helperText}</p>`
			// 							: ""
			// 					}
			// 				</div>
			// 			`
			// 			break
			// 		default:
			// 			code = ""
			// 			break
			// 	}
			return { code, imports }
	}
}
