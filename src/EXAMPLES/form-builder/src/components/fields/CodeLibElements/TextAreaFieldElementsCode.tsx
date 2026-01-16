import React from "react"
import { FormElementInstance } from "../../FormElements"
import { VoidFunction } from "@/utils/helperFunctions"

type CodeLibProps = {
	element: FormElementInstance
	dynamicCode: boolean
}

export const TextAreaFieldElementsCode = ({
	element,
	dynamicCode,
}: CodeLibProps) => {
	const { label, helperText, required, variant, rows, placeHolder } =
		element.extraAttributes as {
			label: string
			helperText: string
			placeHolder: string
			required: boolean
			rows: number
			variant: string
		}
	let code: string = ""
	let imports: string[] = [""]

	switch (variant) {
		case "basic":
			switch (dynamicCode) {
				case false: // Static
					code = `<div className="flex flex-col gap-2 w-full text-white">
	<Label>
		${label}
		${required ? "*" : ""}
	</Label>
	<Textarea rows={${rows}} placeholder="${placeHolder}" />
	${
		helperText
			? `<p className="text-muted-foreground text-[0.8rem]">${helperText}</p>`
			: ""
	}
</div>`
					break
				case true: // Dynamic
					;(code = `<div className="flex flex-col gap-2 w-full text-white">
	<Label>
		\${label}
		\${required ? "*" : ""}
	</Label>
	<Textarea rows={rows} placeholder={placeHolder} />
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
							"rows",
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
