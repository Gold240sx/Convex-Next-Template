"use client"
import React, { useEffect, useState, FormEvent } from "react"
import Stepper from "@/components/customInputs/stepper"
import { Button } from "@/components/ui/button"
import { useForm, Resolver, SubmitHandler, Controller } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"

const ComponentTester = () => {
	const { handleSubmit, control, register } = useForm()

	const onSubmit = (data: any) => {
		toast({
			title: "submitted",
			description: JSON.stringify(data, null, 2),
		})
		return
	}

	return (
		<>
			<div className="w-full p-8 bg-zinc-600 h-screen">
				<div className="flex flex-col items-center gap-4 border p-6 w-full">
					<h1 className="text-4xl">Component Tester</h1>
					<form
						id="form"
						onSubmit={handleSubmit(onSubmit)}
						className="flex gap-4 min-h-fit flex-col p-4 mx-auto w-full max-w-[800px]">
						<div className="grid grid-cols-3 gap-4 justify-between w-full  items-center">
							<Stepper
								register={register}
								type={"blockInput"}
								min={0}
								max={100}
								step={1}
								start={50}
								unit="%"
								className="w-48"
								name="gary"
								handleOnChange={(value, name) =>
									// console.log(value, name)
									console.log()
								}
							/>
							<Stepper
								register={register}
								type={"inlineMinimal"}
								min={0}
								max={100}
								step={1}
								start={50}
								unit="%"
								className="w-48"
								name="bob"
								handleOnChange={(value, name) =>
									// console.log(value, name)
									console.log()
								}
							/>
							<Stepper
								register={register}
								type={"inlineMinimalBlock"}
								min={0}
								max={100}
								step={1}
								start={50}
								unit="%"
								className="w-48 border  border-white"
								name="darla"
								handleOnChange={(value, name) =>
									// console.log(value, name)
									console.log()
								}
							/>
							<Stepper
								register={register}
								type={"inlineMinimalPill"}
								min={0}
								max={100}
								step={1}
								start={50}
								unit="%"
								className="w-48 border  border-white"
								name="Luis"
								handleOnChange={(value, name) =>
									// console.log(value, name)
									console.log()
								}
							/>
							<Stepper
								register={register}
								type={"inlineMinimalPillIntegrated"}
								min={0}
								max={100}
								step={1}
								start={50}
								unit="%"
								className="w-48 border  border-white"
								name="andy"
								handleOnChange={(value, name) =>
									// console.log(value, name)
									console.log()
								}
							/>
						</div>
						<Button type="submit" className="">
							Submit
						</Button>
					</form>
				</div>
			</div>
		</>
	)
}

export default ComponentTester
