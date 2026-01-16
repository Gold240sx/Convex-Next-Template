"use client"
import React, { useEffect, Dispatch, SetStateAction } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { BiInfoCircle } from "react-icons/bi"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shadcn/form"
import { Label } from "@/shadcn/label"
import { Button } from "@/shadcn/button"
import { Switch } from "@/shadcn/switch"
import { Input } from "@/shadcn/input"
import { VoidFunction } from "@/types/functionTypes"

const formSchema = z.object({
	neccessaryCookies: z.boolean(),
	functionalCookies: z.boolean(),
	analyticsCookies: z.boolean(),
	cookiesSaved: z.boolean(),
	rememberDevice: z.boolean(),
	userEmail: z.string().email(),
	isFirstVisit: z.boolean(),
})

type setStateFormAction = Dispatch<
	SetStateAction<{
		neccessaryCookies: boolean
		functionalCookies: boolean
		analyticsCookies: boolean
		cookiesSaved: boolean
		rememberDevice: boolean
		userEmail: string
		isFirstVisit: boolean
	}>
>
type formSchemaType = z.infer<typeof formSchema>

const CookiesForm = ({
	cookies,
	setCookies,
	showPopup,
	setShowPopup,
}: {
	cookies: formSchemaType
	setCookies: setStateFormAction
	showPopup: boolean
	setShowPopup: Dispatch<SetStateAction<boolean>>
}) => {
	const form = useForm<formSchemaType>({
		defaultValues: cookies,
		resolver: zodResolver(formSchema),
	})

	const onSubmit = async (data: formSchemaType) => {
		setCookies({ ...data, cookiesSaved: true })
		setShowPopup(false)
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className=" max-w-[400px] px-4 ease-in-out-duration-300 transition-all w-full">
					<div className="flex items-center my-2 w-full flex-col gap-2 pt-6">
						<FormField
							control={form.control}
							name="neccessaryCookies"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center w-full justify-between rounded-lg bg-zinc-850 p-3 shadow-sm gap-6">
									<div className="space-y-0.5 flex w-fit items-center">
										<FormLabel className="whitespace-nowrap">
											Necessary Cookies
										</FormLabel>
										<FormDescription>
											<button
												type="button"
												className="text-xl mx-1">
												<Link
													scroll={true}
													href="/cookie-policy/neccessary"
													target="_blank">
													<BiInfoCircle className="my-auto text-center align-center flex text-2xl text-zinc-600 hover:text-white translate-y-[2px]" />
												</Link>
											</button>
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											className="space-y-0 data-[state=checked]:bg-lime-600 data-[state=unchecked]:bg-zinc-1000 ease-in-out duration-300"
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled
											aria-readonly
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="functionalCookies"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center w-full justify-between rounded-lg bg-zinc-850 p-3 shadow-sm gap-6">
									<div className="space-y-0.5 flex w-fit items-center">
										<FormLabel className="whitespace-nowrap">
											Functional Cookies
										</FormLabel>
										<FormDescription>
											<button
												type="button"
												className="text-xl mx-1">
												<Link
													scroll={true}
													href="/cookie-policy/functional"
													target="_blank">
													<BiInfoCircle className="my-auto text-center align-center flex text-2xl text-zinc-600 hover:text-white translate-y-[2px]" />
												</Link>
											</button>
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											className="space-y-0 data-[state=checked]:bg-lime-600 data-[state=unchecked]:bg-zinc-1000 ease-in-out duration-300"
											checked={field.value}
											onCheckedChange={field.onChange}
											aria-readonly
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="analyticsCookies"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center w-full justify-between rounded-lg bg-zinc-850 p-3 shadow-sm gap-6">
									<div className="space-y-0.5 flex w-fit items-center">
										<FormLabel className="whitespace-nowrap">
											Analytics Cookies
										</FormLabel>
										<FormDescription>
											<button
												type="button"
												className="text-xl mx-1">
												<Link
													scroll={true}
													href="/cookie-policy/analytics"
													target="_blank">
													<BiInfoCircle className="my-auto text-center align-center flex text-2xl text-zinc-600 hover:text-white translate-y-[2px]" />
												</Link>
											</button>
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											className="space-y-0 data-[state=checked]:bg-lime-600 data-[state=unchecked]:bg-zinc-1000 ease-in-out duration-300"
											checked={field.value}
											onCheckedChange={field.onChange}
											aria-readonly
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="cookiesSaved"
							render={({ field }) => (
								<FormItem className="hidden translate-x-[999]">
									<FormControl>
										<Switch
											className="space-y-0 data-[state=checked]:bg-lime-600 data-[state=unchecked]:bg-zinc-1000 ease-in-out duration-300"
											checked={true}
											onCheckedChange={field.onChange}
											disabled
											aria-readonly
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isFirstVisit"
							render={({ field }) => (
								<FormItem className="hidden translate-x-[999]">
									<FormControl>
										<Switch
											className="space-y-0 data-[state=checked]:bg-lime-600 data-[state=unchecked]:bg-zinc-1000 ease-in-out duration-300"
											checked={true}
											onCheckedChange={field.onChange}
											disabled
											hidden
											aria-readonly
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="rounded-xl bg-black hover:bg-zinc-950 w-full my-1">
							Submit
						</Button>
					</div>
				</form>
			</Form>
		</>
	)
}

export default CookiesForm
