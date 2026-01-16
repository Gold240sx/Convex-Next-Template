"use client"

import React, { useCallback, useRef, useState, useTransition } from "react"
import { FormElementInstance, FormElements } from "@/components/FormElements"
import { Button } from "./ui/button"
import { HiCursorClick } from "react-icons/hi"
import { toast } from "./ui/use-toast"
import { ImSpinner } from "react-icons/im"
import { SubmitForm } from "@/actions/form"

const FormSubmitComponent = ({
	formUrl,
	content,
}: {
	formUrl: string
	content: FormElementInstance[]
}) => {
	const formValues = useRef<{ [key: string]: string }>({})
	const formErrors = useRef<{ [key: string]: boolean }>({})
	const [renderKey, setRenderKey] = useState(new Date().getTime())
	const [submitted, setSubmitted] = useState(false)
	const [pending, startTransition] = useTransition()

	const validateForm: () => boolean = useCallback(() => {
		content.forEach((element) => {
			const actualValue = formValues.current[element.id] || ""
			const isValid = FormElements[element.type].validate(
				element,
				actualValue
			)
			if (!isValid) {
				formErrors.current[element.id] = true
			}
		})

		if (Object.keys(formErrors.current).length > 0) {
			return false
		}

		return true
	}, [content])
	const submitValue = useCallback((key: string, value: string) => {
		formValues.current[key] = value
	}, [])
	const submitForm = async () => {
		formErrors.current = {}
		const validForm = validateForm()

		if (!validForm) {
			setRenderKey(new Date().getTime())
			toast({
				title: "Error",
				description: "Please check the form for errors",
				variant: "destructive",
			})
			return
		}

		try {
			const jsonContent = JSON.stringify(formValues.current)
			await SubmitForm(formUrl, jsonContent)
			setSubmitted(true)
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong.",
				variant: "destructive",
			})
		}
		// console.log(formValues.current)
	}

	if (submitted) {
		return (
			<div className="flex justify-center w-full items-center p-4 md:p-8">
				<div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-4 sm:p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
					<h1 className="text-2xl font-bold">Form Submitted</h1>
					<p className="text-muted-foreground">
						Thank you for submitting the form. You can close this
						page now.
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex justify-center w-full items-center p-8">
			<div
				key={renderKey}
				className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
				{content.map((element, index) => {
					const FormElement = FormElements[element.type].formComponent
					return (
						<FormElement
							key={index}
							isInvalid={formErrors.current[element.id]}
							elementInstance={element}
							submitValue={submitValue}
							defaultValue={formValues.current[element.id]}
						/>
					)
				})}
				<Button
					onClick={() => startTransition(submitForm)}
					disabled={pending}
					className="mt-8"
					type="submit">
					{!pending && (
						<>
							<HiCursorClick className="mr-2" />
							Submit
						</>
					)}
					{pending && <ImSpinner className="animate-spin" />}
				</Button>
			</div>
		</div>
	)
}

export default FormSubmitComponent
