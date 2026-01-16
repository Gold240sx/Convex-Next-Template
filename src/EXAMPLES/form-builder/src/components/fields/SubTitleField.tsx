"use client"
import React, { useEffect, useState } from "react"
import {
	ElementsType,
	FormElement,
	FormElementInstance,
	SubmitFunction,
} from "../FormElements"
import { MdTextFields } from "react-icons/md"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Switch } from "../ui/switch"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useDesigner from "@/app/hooks/useDesigner"
import { cn } from "@/lib/utils"

const type: ElementsType = "SubTitleField"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form"
import { LuHeading1, LuHeading3 } from "react-icons/lu"

const extraAttributes = {
	subTitle: "",
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
	const { subTitle } = element.extraAttributes
	return (
		<div className="flex flex-col gap-2 w-full text-white">
			<Label className="text-muted-foreground">Sub Title Field</Label>
			<p className="text-lg">
				{subTitle === "" ? "No SubTitle Value" : subTitle}
			</p>
		</div>
	)
}

const FormComponent = ({
	elementInstance,
}: {
	elementInstance: FormElementInstance
}) => {
	const element = elementInstance as CustomInstance

	const { subTitle } = element.extraAttributes
	return (
		<p className="text-lg">
			{subTitle === "" ? "No SubTitle Value" : subTitle}
		</p>
	)
}

const propertiesSchema = z.object({
	subTitle: z.string().min(2).max(50),
})

export const SubTitleFieldFormElement: FormElement = {
	type,
	construct: (id: string) => {
		return {
			id,
			type,
			extraAttributes: {
				subTitle: "",
				variant: "basic",
			},
		}
	},

	designerButtonElement: {
		// @ts-expect-error: Icon import expects wierd type
		icon: LuHeading3,
		label: "SubTitle Field",
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
			subTitle: element.extraAttributes.subTitle,
		},
	})
	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const applyChanges = (values: propertiesFormSchemaType) => {
		const { subTitle } = values

		updateElement(element.id, {
			...element,
			extraAttributes: {
				subTitle,
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
					name="subTitle"
					render={({ field }) => (
						<FormItem>
							<FormLabel>SubTitle</FormLabel>
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
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
