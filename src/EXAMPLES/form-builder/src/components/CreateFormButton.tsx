"use client"
import React from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BsFileEarmarkPlus } from "react-icons/bs"
import { ImSpinner2 } from "react-icons/im"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormLabel,
	FormMessage,
	FormItem,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { toast } from "./ui/use-toast"
import { formSchema, type formSchemaType } from "@/schemas/form"
import { CreateForm } from "@/actions/form"
import { useRouter } from "next/navigation"

const CreateFormButton = () => {
	const router = useRouter()

	const form = useForm<formSchemaType>({
		resolver: zodResolver(formSchema),
	})

	const onSubmit = async (values: formSchemaType) => {
		try {
			const formId = await CreateForm(values)
			toast({
				title: "Success",
				description: "Form created successfully! ⚡ 💪",
			})
			// console.log("Form ID", formId)
			router.push(`/builder/`)
			// router.push(`/builder/${formId}`)
		} catch (error) {
			toast({
				title: "Error",
				description: "An error occurred while creating the form 👾",
				variant: "destructive",
			})
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4 bg-background dark:hover:bg-zinc-900 hover:bg-zinc-100">
					<BsFileEarmarkPlus className="mr-2 h-8 w-8 text-muted-foreground group-hover:text-primary" />
					<p className="font-bold text-xl text-muted-foreground group-hover:text-primary">
						Create New Form
					</p>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Form</DialogTitle>
					<DialogDescription>
						Click the button below to create a new form
					</DialogDescription>
				</DialogHeader>
				{/* <div className="flex flex-col gap-4 py-4"></div> */}
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-2">
						{/* Name */}
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="name">
										Form Name
									</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										Please enter a name for your form
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}></FormField>
						{/* Description*/}
						<FormField
							name="description"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="name">
										Form Description
									</FormLabel>
									<FormControl>
										<Textarea rows={5} {...field} />
									</FormControl>
									<FormDescription>
										Please enter a description for your form
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}></FormField>
					</form>
				</Form>
				<DialogFooter>
					<Button
						type="submit"
						className="btn btn-primary w-full"
						disabled={form.formState.isSubmitting}
						onClick={form.handleSubmit(onSubmit)}>
						{form.formState.isSubmitting && (
							<ImSpinner2 className="animate-spin mr-2.5" />
						)}
						{!form.formState.isSubmitting && <span>Save</span>}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default CreateFormButton
