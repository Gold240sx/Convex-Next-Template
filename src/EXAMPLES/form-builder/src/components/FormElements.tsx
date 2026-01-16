import exp from "constants"
import React, { FC, ReactElement } from "react"
import { TextFieldFormElement } from "./fields/TextField"
import { TextAreaFieldFormElement } from "./fields/TextAreaField"
import { TitleFieldFormElement } from "./fields/TitleField"
import { SubTitleFieldFormElement } from "./fields/SubTitleField"
import { ParagraphFieldFormElement } from "./fields/ParagraphField"
import { SeparatorFieldFormElement } from "./fields/SeperatorField"
import { SpacerFieldFormElement } from "./fields/SpacerField"
import { NumberFieldFormElement } from "./fields/NumberField"
import { DateFieldFormElement } from "./fields/DateField"
import { SelectFieldFormElement } from "./fields/SelectField"
import { CheckBoxFieldFormElement } from "./fields/CheckBoxField"

export type ElementsType =
	| "TextField"
	| "TextAreaField"
	| "TitleField"
	| "SubTitleField"
	| "ParagraphField"
	| "SeperatorField"
	| "SpacerField"
	| "NumberField"
	| "DateField"
	| "SelectField"
	| "CheckBoxField"
// | "RadioField"
// | "SwitchField"
// | "StepperField"

export type SubmitFunction = (key: string, value: string) => void
export type FormElement = {
	type: ElementsType

	construct: (id: string) => FormElementInstance

	designerButtonElement: {
		icon: ReactElement | SetConstructor
		label: string
		extraAttributes: Record<string, any>
	}
	designerComponent: FC<{ elementInstance: FormElementInstance }>
	formComponent: FC<{
		elementInstance: FormElementInstance
		submitValue?: SubmitFunction
		isInvalid?: boolean
		defaultValue?: string
	}>
	propertiesComponent: FC<{ elementInstance: FormElementInstance }>

	validate: (
		formElement: FormElementInstance,
		currentValue: string
	) => boolean
}

type FormElementsType = {
	[key in ElementsType]: FormElement
}

export type FormElementInstance = {
	id: string
	type: ElementsType
	extraAttributes?: Record<string, any>
}

export const FormElements: FormElementsType = {
	TextField: TextFieldFormElement,
	TextAreaField: TextAreaFieldFormElement,
	TitleField: TitleFieldFormElement,
	SubTitleField: SubTitleFieldFormElement,
	ParagraphField: ParagraphFieldFormElement,
	SeperatorField: SeparatorFieldFormElement,
	SpacerField: SpacerFieldFormElement,
	NumberField: NumberFieldFormElement,
	DateField: DateFieldFormElement,
	SelectField: SelectFieldFormElement,
	CheckBoxField: CheckBoxFieldFormElement,
}
