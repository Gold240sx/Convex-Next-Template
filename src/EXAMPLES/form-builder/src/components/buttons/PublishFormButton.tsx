import React, { startTransition, useTransition } from "react"
import { Button } from "../ui/button"
import { MdOutlinePublish } from "react-icons/md"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert } from "../ui/alert"
import { FaSpinner } from "react-icons/fa"
import { toast } from "@/components/ui/use-toast"
import { PublishForm } from "@/actions/form"
import { useRouter } from "next/navigation"

const PublishFormButton = ({ id }: { id: number }) => {
	const [loading, startTransition] = useTransition()
	const router = useRouter()

	const publishForm = async () => {
		try {
			await PublishForm(id)
			toast({
				title: "Success",
				description: "Your form is now available to the public!",
			})
			router.refresh()
		} catch (error) {
			toast({
				title: "An error occurred",
				description: "something went wrong",
			})
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					className="gap-2  text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600"
					variant={"outline"}>
					<MdOutlinePublish className="h-4 w-4" />
					Publish
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. After publishing, you will not
					be able to edit this form.
					<br />
					<br />
					<span className="font-medium">
						By publishing this form, you will make it available to
						the public and you will be able to collect submissions.
					</span>
				</AlertDialogDescription>
				<AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							disabled={loading}
							onClick={(e) => {
								e.preventDefault()
								startTransition(publishForm)
							}}>
							Proceed{" "}
							{loading && <FaSpinner className="animate-spin" />}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogHeader>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default PublishFormButton
