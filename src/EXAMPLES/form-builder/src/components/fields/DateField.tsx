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
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useDesigner from "@/app/hooks/useDesigner"
import { BsCalendar2Date } from "react-icons/bs"
import { BiCalendarCheck } from "react-icons/bi"
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
import { format } from "date-fns"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Calendar } from "../ui/calendar"

const type: ElementsType = "DateField"
const extraAttributes = {
	label: "Date Field",
	helperText: "Pick a date",
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
	return (
		<div className="flex flex-col gap-2 w-full text-white">
			<Label>
				{label}
				{required && "*"}
			</Label>
			<Button
				variant={"outline"}
				className="w-full justify-start text-left font-normal">
				<BiCalendarCheck className="mr-2 h-4 w-4" />
				<span>Pick a date</span>
			</Button>
			{helperText && (
				<p className="text-muted-foreground text-[0.8rem]">
					{helperText}
				</p>
			)}
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
	const [date, setDate] = useState<Date | undefined>(
		defaultValue ? new Date(defaultValue) : undefined
	)
	const [error, setError] = useState(false)

	useEffect(() => {
		setError(isInvalid === true)
	}, [isInvalid])

	const { label, required, helperText } = element.extraAttributes
	return (
		<div className="flex flex-col gap-2 w-full text-white">
			<Label>
				{label}
				{required && "*"}
			</Label>
			<Label className={cn(error && "border-red-500")}>
				{error ? "This field is required" : ""}
			</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"w-full justify-start text-left font-normal",
							!date && "text-muted-foreground",
							error && "border-red-500"
						)}>
						<BiCalendarCheck className="mr-2 h-4 w-4" />
						{date ? format(date, "PPP") : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<Calendar
						mode="single"
						selected={date}
						onSelect={(date) => {
							setDate(date)
							if (!submitValue) return
							const value = date?.toUTCString() || ""
							const valid = DateFieldFormElement.validate(
								element,
								value
							)
							setError(!valid)
							submitValue(element.id, value)
						}}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
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
	)
}

const propertiesSchema = z.object({
	label: z.string().min(2).max(50),
	required: z.boolean().default(false),
	helperText: z.string().max(200),
})

export const DateFieldFormElement: FormElement = {
	type,
	construct: (id: string) => {
		return {
			id,
			type,
			extraAttributes: {
				label: "Date Field",
				helperText: "Pick a date",
				required: false,
				variant: "basic",
			},
		}
	},

	designerButtonElement: {
		// @ts-expect-error: Icon import expects wierd type
		icon: BsCalendar2Date,
		label: "Date Field",
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
								The label for the Date Field ( displayed above
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
								The Helper Text for the Date Field ( displayed
								below the field)
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
