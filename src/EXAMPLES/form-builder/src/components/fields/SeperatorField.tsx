"use client"
import React, { useEffect } from "react"
import { ElementsType, FormElement, FormElementInstance } from "../FormElements"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useDesigner from "@/app/hooks/useDesigner"
import { RiSeparator } from "react-icons/ri"

const type: ElementsType = "SeperatorField"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form"
import { LuHeading1 } from "react-icons/lu"
import { Separator } from "../ui/separator"

const DesignerComponent = ({
	elementInstance,
}: {
	elementInstance: FormElementInstance
}) => {
	return (
		<div className="flex flex-col gap-2 w-full text-white">
			<Label className="text-muted-foreground">Separator Field</Label>
			<Separator />
		</div>
	)
}

const FormComponent = ({
	elementInstance,
}: {
	elementInstance: FormElementInstance
}) => {
	return <Separator />
}

const propertiesSchema = z.object({
	title: z.string().min(2).max(50),
})

export const SeparatorFieldFormElement: FormElement = {
	type,
	construct: (id: string) => {
		return {
			id,
			type,
			extraAttributes: {
				title: "",
				variant: "basic",
			},
		}
	},

	designerButtonElement: {
		// @ts-expect-error: Icon import expects wierd type
		icon: RiSeparator,
		label: "Separator Field",
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
	return <p>No properties for this element</p>
}
