import React from "react"
import { FormElementInstance } from "../FormElements"
import { TextFieldElementsCode } from "./CodeLibElements/TextFieldElementsCode"
import { TextAreaFieldElementsCode } from "./CodeLibElements/TextAreaFieldElementsCode"
import { TitleFieldElementsCode } from "./CodeLibElements/TitleFieldElementsCode"
import { SubTitleFieldElementsCode } from "./CodeLibElements/SubTitleFieldElementsCode"
import { ParagraphFieldElementsCode } from "./CodeLibElements/ParagraphFieldElementsCode"
import { SeparatorFieldElementsCode } from "./CodeLibElements/SeparatorFieldElementsCode"
import { SpacerFieldElementsCode } from "./CodeLibElements/SpacerFieldElementsCode"
import { NumberFieldElementsCode } from "./CodeLibElements/NumberFieldElementsCode"
import { DateFieldElementsCode } from "./CodeLibElements/DateFieldElementsCode"
import { SelectFieldElementsCode } from "./CodeLibElements/SelectFieldElementsCode"
import { CheckBoxFieldElementsCode } from "./CodeLibElements/CheckBoxFieldElementsCode"

export type ElementItem = Record<string, string>
export type ElementLibrary = {
	[ElementName: string]: ElementItem[]
}

export const elementLibrary: ElementLibrary = {
	TextField: [
		{ label: "Basic", value: "basic" },
		{ label: "Outlined", value: "outlined" },
	],
	TextAreaField: [
		{ label: "Basic", value: "basic" },
		{ label: "Outlined", value: "outlined" },
	],
	TitleField: [
		{ label: "Basic", value: "basic" },
		{ label: "Outlined", value: "outlined" },
	],
	SubTitleField: [{ label: "Basic", value: "basic" }],
	ParagraphField: [
		{ label: "Basic", value: "basic" },
		{ label: "Centered", value: "centered" },
	],
	SeperatorField: [{ label: "Basic", value: "basic" }],
	SpacerField: [{ label: "Basic", value: "basic" }],
	Dropdown: [
		{ label: "Basic", value: "basic" },
		{ label: "absolute", value: "absolute" },
	],
	NumberField: [
		{ label: "Basic", value: "basic" },
		{ label: "Outlined", value: "outlined" },
	],
	DateField: [{ label: "Basic", value: "basic" }],
	SelectField: [
		{ label: "Basic", value: "basic" },
		{ label: "Outlined", value: "outlined" },
	],
	CheckBoxField: [
		{ label: "Basic", value: "basic" },
		{ label: "Outlined", value: "outlined" },
	],
	// | "RadioField"
	// | "SwitchField"
	// | "StepperField"
}

type CodeLibProps = {
	element: FormElementInstance
	dynamicCode: boolean
}

export const CodeLib = ({ element, dynamicCode }: CodeLibProps) => {
	const elementType = element.type
	switch (elementType) {
		case "TextField":
			return {
				code: TextFieldElementsCode({ element, dynamicCode })?.code,
				imports: TextFieldElementsCode({ element, dynamicCode })
					?.imports,
			}
			break
		case "TitleField":
			return {
				// replace with TitleFieldElementsCode when available
				code: TitleFieldElementsCode({ element, dynamicCode })?.code,
				imports: TitleFieldElementsCode({ element, dynamicCode })
					?.imports,
			}
			break
		case "SubTitleField":
			// replace with SubTitleFieldElementsCode when available
			return {
				code: SubTitleFieldElementsCode({ element, dynamicCode })?.code,
				imports: SubTitleFieldElementsCode({ element, dynamicCode })
					?.imports,
			}

			break
		case "ParagraphField":
			return {
				code: ParagraphFieldElementsCode({ element, dynamicCode })
					?.code,
				imports: ParagraphFieldElementsCode({ element, dynamicCode })
					?.imports,
			}
			break
		case "TextAreaField":
			return {
				code: TextAreaFieldElementsCode({ element, dynamicCode })?.code,
				imports: TextAreaFieldElementsCode({ element, dynamicCode })
					?.imports,
			}
			break
		case "SeperatorField":
			return {
				code: SeparatorFieldElementsCode({ element, dynamicCode })
					?.code,
				imports: SeparatorFieldElementsCode({ element, dynamicCode })
					?.imports,
			}
			break
		case "SpacerField":
			return {
				code: SpacerFieldElementsCode({ element, dynamicCode })?.code,
				imports: SpacerFieldElementsCode({ element, dynamicCode })
					?.imports,
			}
			break
		case "NumberField":
			return {
				code: NumberFieldElementsCode({ element, dynamicCode })?.code,
				imports: NumberFieldElementsCode({ element, dynamicCode })
					?.imports,
			}
			break
		case "DateField":
			return {
				code: DateFieldElementsCode({ element, dynamicCode })?.code,
				imports: DateFieldElementsCode({ element, dynamicCode })
					?.imports,
			}
			break
		case "SelectField":
			return {
				code: SelectFieldElementsCode({ element, dynamicCode })?.code,
				imports: SelectFieldElementsCode({ element, dynamicCode })
					?.imports,
			}
			break
		case "CheckBoxField":
			return {
				code: CheckBoxFieldElementsCode({ element, dynamicCode })?.code,
				imports: CheckBoxFieldElementsCode({ element, dynamicCode })
					?.imports,
			}
			break
		default:
			return
		// | "RadioField"
		// | "SwitchField"
		// | "StepperField"
	}
}
