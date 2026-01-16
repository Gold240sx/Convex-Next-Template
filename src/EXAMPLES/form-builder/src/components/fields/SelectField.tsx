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
import { TbSelect } from "react-icons/tb"
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
import { Separator } from "../ui/separator"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "../ui/select"
import { Button } from "../ui/button"
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai"
import { toast } from "@/components/ui/use-toast"

const type: ElementsType = "SelectField"

const extraAttributes = {
	label: "Select Field",
	helperText: "Helper text",
	required: false,
	placeHolder: "Value here...",
	options: [],
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
	const { label, required, placeHolder, helperText } = element.extraAttributes
	return (
		<div className="flex flex-col gap-2 w-full text-white">
			<Label>
				{label}
				{required && "*"}
			</Label>
			<Select>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeHolder} />
				</SelectTrigger>
			</Select>
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
	const [value, setValue] = useState(defaultValue || "")
	const [error, setError] = useState(false)

	useEffect(() => {
		setError(isInvalid === true)
	}, [isInvalid])

	const { label, required, placeHolder, helperText, options } =
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
			<Select
				defaultValue={value}
				onValueChange={(value) => {
					setValue(value)
					if (!submitValue) return
					const valid = SelectFieldFormElement.validate(
						element,
						value
					)
					setError(!valid)
					submitValue(element.id, value)
				}}>
				<SelectTrigger
					className={cn("w-full", error && "border-red-500")}>
					<SelectValue placeholder={placeHolder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
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
	placeHolder: z.string().max(50),
	options: z.array(z.string()).default([]),
	variant: z.string().default("basic"),
})

export const SelectFieldFormElement: FormElement = {
	type,
	construct: (id: string) => {
		return {
			id,
			type,
			extraAttributes: {
				label: "Select Field",
				helperText: "Enter your text here",
				required: false,
				placeholder: "Value here...",
				variant: "basic",
				options: [],
			},
		}
	},

	designerButtonElement: {
		// @ts-expect-error: Icon import expects wierd type
		icon: TbSelect,
		label: "Select Field",
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
	const { updateElement, setSelectedElement } = useDesigner()
	const form = useForm<propertiesFormSchemaType>({
		resolver: zodResolver(propertiesSchema),
		mode: "onSubmit",
		defaultValues: {
			label: element.extraAttributes.label,
			required: element.extraAttributes.required,
			placeHolder: element.extraAttributes.placeHolder,
			helperText: element.extraAttributes.helperText,
			options: element.extraAttributes.options,
		},
	})
	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const applyChanges = (values: propertiesFormSchemaType) => {
		const { label, required, placeHolder, helperText, options } = values

		updateElement(element.id, {
			...element,
			extraAttributes: {
				label,
				required,
				placeHolder,
				helperText,
				options,
			},
		})

		toast({
			title: "Success",
			description: "Select Field options updated successfully",
		})
	}

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					applyChanges(form.getValues())
				}}
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
								The label for the Select Field ( displayed above
								the field)
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
								The Helper Text for the Select Field ( displayed
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
				<Separator />
				<FormField
					control={form.control}
					name="options"
					render={({ field }) => (
						<FormItem>
							<div className="flex justify-between items-center">
								<FormLabel>Options</FormLabel>
								<Button
									variant={"outline"}
									className="gap-2"
									onClick={(e) => {
										e.preventDefault()
										form.setValue(
											"options",
											field.value.concat("New Option")
										)
									}}>
									<AiOutlinePlus className="" />
									Add
								</Button>
							</div>
							<div className="flex flex-col gap-2">
								{form.watch("options").map((option, index) => (
									<div
										key={index}
										className="flex items-center gap-1 justify-between">
										<Input
											placeholder=""
											value={option}
											onChange={(e) => {
												field.value[index] =
													e.target.value
												field.onChange(field.value)
											}}
											className="focus-visible:ring-sky-500 bg-white dark:bg-black/80"
										/>
										<Button
											// delete any unwanted options button
											variant={"outline"}
											size={"icon"}
											onClick={(e) => {
												e.preventDefault()
												const newOptions = [
													...field.value,
												]
												newOptions.splice(index, 1)
												field.onChange(newOptions)
											}}>
											<AiOutlineClose />
										</Button>
									</div>
								))}
							</div>
							<FormDescription>
								The Helper Text for the Select Field ( displayed
								below the field)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Separator />
				<Button className="w-full" type="submit">
					Save Changes
				</Button>
			</form>
		</Form>
	)
}
