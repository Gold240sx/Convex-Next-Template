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
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useDesigner from "@/app/hooks/useDesigner"
import { cn } from "@/lib/utils"
import { Textarea } from "../ui/textarea"
import { BsTextareaT } from "react-icons/bs"
import { Slider } from "../ui/slider"

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form"

const type: ElementsType = "TextAreaField"
const extraAttributes = {
	label: "Text Area Field",
	helperText: "Enter your response below",
	required: false,
	placeHolder: "Value here...",
	variant: "basic",
	rows: 3,
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
	const { label, text, required, placeHolder, helperText, rows } =
		element.extraAttributes
	return (
		<div className="flex flex-col gap-2 w-full text-white h-fit">
			<Label>
				{label}
				{required && "*"}
			</Label>
			<p className="text-xl">{text}</p>
			{helperText && (
				<p className="text-muted-foreground text-[0.8rem]">
					{helperText}
				</p>
			)}
			<Textarea rows={rows} readOnly disabled placeholder={placeHolder} />
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
	const [value, setValue] = useState(defaultValue || "")
	const [error, setError] = useState(false)

	useEffect(() => {
		setError(isInvalid === true)
	}, [isInvalid])

	const { label, required, placeHolder, helperText, rows } =
		element.extraAttributes
	return (
		<div className="flex flex-col gap-2 w-full text-white">
			<Label>
				{label}
				{required && "*"}
			</Label>
			<Label className={cn(error && "border-red-500")}>
				{error ? "This field is required" : ""}
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
			<Textarea
				rows={rows}
				placeholder={placeHolder}
				onChange={(e) => setValue(e.target.value)}
				onBlur={(e) => {
					if (!submitValue) return
					const valid = TextAreaFieldFormElement.validate(
						element,
						e.target.value
					)
					setError(!valid)
					if (!valid) return
					submitValue(element.id, e.target.value)
				}}
				value={value}
			/>
		</div>
	)
}

const propertiesSchema = z.object({
	label: z.string().min(2).max(500),
	required: z.boolean().default(false),
	helperText: z.string().max(200),
	placeHolder: z.string().max(50),
	rows: z.number().min(1).max(10).default(3),
})

export const TextAreaFieldFormElement: FormElement = {
	type,
	construct: (id: string) => {
		return {
			id,
			type,
			extraAttributes: {
				label: "TextArea Field",
				helperText: "Enter your response below",
				required: false,
				placeHolder: "Value here...",
				rows: 3,
				variant: "basic",
			},
		}
	},

	designerButtonElement: {
		// @ts-expect-error: Icon import expects wierd type
		icon: BsTextareaT,
		label: "Text Area Field",
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	validate: (
		formElement: FormElementInstance,
		currentValue: string
	): boolean => {
		const element = formElement as CustomInstance
		if (element.extraAttributes.required && !currentValue) {
			return currentValue.length > 0
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
			label: element.extraAttributes.text,
			required: element.extraAttributes.required,
			placeHolder: element.extraAttributes.placeHolder,
			helperText: element.extraAttributes.helperText,
			rows: element.extraAttributes.rows,
		},
	})
	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const applyChanges = (values: propertiesFormSchemaType) => {
		const { label, required, placeHolder, helperText, rows } = values

		updateElement(element.id, {
			...element,
			extraAttributes: {
				label,
				required,
				placeHolder,
				helperText,
				rows,
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
								The label for the Text Area Field ( displayed
								above the field)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="placeHolder"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Placeholder</FormLabel>
							<FormControl>
								<Input
									className="focus-visible:ring-sky-500 bg-white dark:bg-black/80"
									{...field}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.currentTarget.blur()
										}
									}}
								/>
							</FormControl>
							<FormDescription>
								The placeholder for the field ( displayed within
								the field)
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
								The Helper Text for the Text Area Field (
								displayed below the field)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="rows"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Rows {form.watch("rows")}</FormLabel>
							<FormControl>
								<Slider
									defaultValue={[field.value]}
									min={1}
									max={10}
									step={1}
									onValueChange={(value) => {
										field.onChange(value[0])
									}}
								/>
							</FormControl>
							<FormDescription>
								The Helper Text for the Text Area Field (
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
