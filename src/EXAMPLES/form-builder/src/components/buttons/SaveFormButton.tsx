import React, { useTransition } from "react"
import { Button } from "../ui/button"
import { HiSaveAs } from "react-icons/hi"
import useDesigner from "@/app/hooks/useDesigner"
import { UpdateFormContent } from "@/actions/form"
import { toast } from "../ui/use-toast"
import { FaSpinner } from "react-icons/fa"

const SaveFormButton = ({ id }: { id: number }) => {
	const { elements } = useDesigner()
	const [loading, startTransition] = useTransition()

	const updateFormContent = async () => {
		try {
			const JSONElements = JSON.stringify(elements)
			await UpdateFormContent(id, JSONElements)
			toast({
				title: "Form saved successfully",
				description: "Your form has been saved successfully",
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong",
				variant: "destructive",
			})
		}
	}

	return (
		<Button
			variant={"outline"}
			disabled={loading}
			onClick={() => startTransition(updateFormContent)}
			className="gap-2 bg-primary text-secondary">
			<HiSaveAs className="h-4 w-4" />
			Save
			{loading && <FaSpinner className="animate-spin h-4 w-4" />}
		</Button>
	)
}

export default SaveFormButton
