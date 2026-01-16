"use client"
import React, { useEffect, useState } from "react"
import {
	ElementsType,
	FormElement,
	FormElementInstance,
	SubmitFunction,
} from "../FormElements"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Switch } from "../ui/switch"
import { Checkbox } from "../ui/checkbox"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useDesigner from "@/app/hooks/useDesigner"
import { IoMdCheckboxOutline } from "react-icons/io"
import { cn } from "@/lib/utils"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form"

const type: ElementsType = "CheckBoxField"
const extraAttributes = {
	label: "CheckBox Field",
	helperText: "Helper text",
	required: false,
	variant: "basic",
}

type CustomInstance = FormElementInstance & {
	extraAttributes: typeof extraAttributes
}

const DesignerComponent = ({
	elementInstance,
}: {
	elementInstance: FormElementInstance
}) => {
	const element = elementInstance as CustomInstance
	const { label, required, helperText } = element.extraAttributes
	const id = `checkbox-${element.id}`
	return (
		<div className="flex items-top space-x-2">
			<Checkbox id={id} />
			<div className="grid gap-1.5 leading-none">
				<Label htmlFor={id}>
					{label}
					{required && "*"}
				</Label>
				{helperText && (
					<p className="text-muted-foreground text-[0.8rem]">
						{helperText}
					</p>
				)}
			</div>
		</div>
	)
}

const FormComponent = ({
	elementInstance,
	submitValue,
	isInvalid,
	defaultValue,
}: {
	elementInstance: FormElementInstance
	submitValue?: SubmitFunction
	isInvalid?: boolean
	defaultValue?: string
}) => {
	const element = elementInstance as CustomInstance
	const [value, setValue] = useState<boolean>(
		defaultValue === "true" ? true : false
	)
	const [error, setError] = useState(false)

	useEffect(() => {
		setError(isInvalid === true)
	}, [isInvalid])

	const { label, required, helperText } = element.extraAttributes
	const id = `checkbox-${element.id}`
	return (
		<div className="flex items-top space-x-2">
			<Checkbox
				id={id}
				checked={value}
				className={cn(error && "border-red-500")}
				onCheckedChange={(checked) => {
					let value = false
					if (checked) {
						value = true
					}
					setValue(value)
					if (!submitValue) return
					const stringValue = value ? "true" : "false"
					const valid = CheckBoxFieldFormElement.validate(
						element,
						stringValue
					)
					setError(!valid)
					submitValue(element.id, stringValue)
				}}
			/>
			<div className="grid gap-1.5 leading-none">
				<Label htmlFor={id} className={cn(error && "text-red-500")}>
					{label}
					{required && "*"}
				</Label>
				{helperText && (
					<p
						className={cn(
							"text-muted-foreground text-[0.8rem]",
							error && "text-red-500"
						)}>
						{helperText}
					</p>
				)}
			</div>
		</div>
	)
}

const propertiesSchema = z.object({
	label: z.string().min(2).max(50),
	required: z.boolean().default(false),
	helperText: z.string().max(200),
})

export const CheckBoxFieldFormElement: FormElement = {
	type,
	construct: (id: string) => {
		return {
			id,
			type,
			extraAttributes: {
				label: "CheckBox Field",
				helperText: "Enter your text here",
				required: false,
				variant: "basic",
			},
		}
	},

	designerButtonElement: {
		// @ts-expect-error: Icon import expects wierd type
		icon: IoMdCheckboxOutline,
		label: "CheckBox Field",
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	validate: (
		formElement: FormElementInstance,
		currentValue: string
	): boolean => {
		const element = formElement as CustomInstance
		if (element.extraAttributes.required) {
			return currentValue === "true"
		}
		return true
	},
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function PropertiesComponent({
	elementInstance,
}: {
	elementInstance: FormElementInstance
}) {
	const element = elementInstance as CustomInstance
	const { updateElement } = useDesigner()
	const form = useForm<propertiesFormSchemaType>({
		resolver: zodResolver(propertiesSchema),
		mode: "onBlur",
		defaultValues: {
			label: element.extraAttributes.label,
			required: element.extraAttributes.required,
			helperText: element.extraAttributes.helperText,
		},
	})
	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const applyChanges = (values: propertiesFormSchemaType) => {
		const { label, required, helperText } = values

		updateElement(element.id, {
			...element,
			extraAttributes: {
				label,
				required,
				helperText,
			},
		})
	}

	return (
		<Form {...form}>
			<form
				onBlur={() => applyChanges(form.getValues())}
				onSubmit={(e) => e.preventDefault()}
				className="space-y-3">
				<FormField
					control={form.control}
					name="label"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Label</FormLabel>
							<FormControl>
								<Input
									{...field}
									className="focus-visible:ring-sky-500 bg-white dark:bg-black/80"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.currentTarget.blur()
										}
									}}
								/>
							</FormControl>
							<FormDescription>
								The label for the CheckBox Field ( displayed
								above the field)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="helperText"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Helper Text</FormLabel>
							<FormControl>
								<Input
									{...field}
									className="focus-visible:ring-sky-500 bg-white dark:bg-black/80"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.currentTarget.blur()
										}
									}}
								/>
							</FormControl>
							<FormDescription>
								The Helper Text for the CheckBox Field (
								displayed below the field)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="required"
					render={({ field }) => (
						<FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
							<div className="space-y-0.5">
								<FormLabel>Required</FormLabel>
								<FormDescription>
									Set if this form field is required
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
