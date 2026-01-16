"use client"
import React, { useEffect } from "react"
import { ElementsType, FormElement, FormElementInstance } from "../FormElements"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useDesigner from "@/app/hooks/useDesigner"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form"
import { Slider } from "../ui/slider"
import { LuSeparatorHorizontal } from "react-icons/lu"

const type: ElementsType = "SpacerField"
const extraAttributes = {
	height: 20, // px
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
	const { height } = element.extraAttributes
	return (
		<div className="flex flex-col gap-2 w-full text-white">
			<Label className="text-muted-foreground">
				Spacer Field: {height} px
			</Label>
			<LuSeparatorHorizontal className="h-8 w-8" />
		</div>
	)
}

const FormComponent = ({
	elementInstance,
}: {
	elementInstance: FormElementInstance
}) => {
	const element = elementInstance as CustomInstance

	const { height } = element.extraAttributes
	return <div style={{ height, width: "100%" }} />
}

const propertiesSchema = z.object({
	height: z.number().int().positive().max(200),
})

export const SpacerFieldFormElement: FormElement = {
	type,
	construct: (id: string) => {
		return {
			id,
			type,
			extraAttributes: {
				height: 20,
				variant: "basic",
			},
		}
	},

	designerButtonElement: {
		// @ts-expect-error: Icon import expects wierd type
		icon: LuSeparatorHorizontal,
		label: "Spacer Field",
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	validate: () => true, // No validation needed
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
			height: element.extraAttributes.height,
		},
	})
	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const applyChanges = (values: propertiesFormSchemaType) => {
		const { height } = values

		updateElement(element.id, {
			...element,
			extraAttributes: {
				height,
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
					name="height"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Height (px): {form.watch("height")}
							</FormLabel>
							<FormControl className="pt-2">
								<Slider
									defaultValue={[field.value]}
									min={5}
									max={200}
									step={1}
									onValueChange={(value) => {
										field.onChange(value[0])
									}}
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
