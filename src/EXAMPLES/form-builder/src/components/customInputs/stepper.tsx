"use client"
import React, { useEffect, useState } from "react"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { BsPlusCircle, BsDashCircle } from "react-icons/bs"
import { FiPlus, FiMinus } from "react-icons/fi"
import { BiSolidMinusSquare, BiSolidPlusSquare } from "react-icons/bi"
import { cn } from "@/lib/utils"
import { set } from "date-fns"
import { useFormContext, useForm } from "react-hook-form"
import { get } from "http"

const Stepper = ({
	register,
	min,
	max,
	step,
	start,
	unit,
	className,
	name,
	type,
	handleOnChange,
}: StepperProps) => {
	const [value, setValue] = useState(start)
	const { setValue: setRHFValue, getValues } = useForm()
	const values = getValues()

	const handleClick = (button: string) => {
		let newValue = 0
		if (button === "plus") {
			if (value < max) {
				setValue(value + step)
				handleOnChange(value + step, "root")
				newValue = value + step
			}
		} else {
			if (value > min) {
				setValue(value - step)
				handleOnChange(value - step, "root")
				newValue = value - step
			}
		}
		setRHFValue(name, value)
		handleOnChange(newValue, name)
	}

	useEffect(() => {
		console.log("values", values)
	}, [value])

	return (
		<>
			{type === "blockInput" && (
				<div>
					<p className="text-center">blockInput</p>
					<BlockInput
						register={register}
						handleClick={handleClick}
						min={min}
						max={max}
						unit={unit}
						step={step}
						start={start}
						value={value}
						className={className}
						name={name}
					/>
				</div>
			)}
			{(type === "inlineMinimal" || type === "inlineMinimalBlock") && (
				<div>
					<p className="text-center">inlineMinimal</p>
					<InlineMinimal
						register={register}
						handleClick={handleClick}
						min={min}
						max={max}
						unit={unit}
						step={step}
						start={start}
						value={value}
						type={type}
						className={className}
						name={name}
					/>
				</div>
			)}
			{(type === "inlineMinimalPill" ||
				type === "inlineMinimalPillIntegrated") && (
				<div>
					<p className="text-center">inlineMinimal</p>
					<InlineMinimalPill
						register={register}
						handleClick={handleClick}
						min={min}
						max={max}
						unit={unit}
						step={step}
						start={start}
						value={value}
						type={type}
						className={className}
						name={name}
					/>
				</div>
			)}
		</>
	)
}

type BtnClickVoid = (button: string) => void
type StepperProps = {
	register: any
	// setValue: any
	min: number
	max: number
	step: number
	start: number
	unit: string
	className: string
	name: string
	type:
		| "blockInput"
		| "inlineBlock"
		| "inlineMinimal"
		| "inlineMinimalOutline"
		| "inlineMinimalBlock"
		| "verticalMinimal"
		| "inlineMinimalPill"
		| "inlineMinimalPillIntegrated"
	handleOnChange: (e: number, name: string) => void
}

export default Stepper

const InlineMinimalPill = ({
	handleClick,
	className,
	name,
	min,
	max,
	step,
	value,
	type,
	register,
	unit,
}: {
	register: any
	handleClick: BtnClickVoid
	className: string
	name: string
	min: number
	max: number
	step: number
	start: number
	type?: string
	value: number
	unit: string
}) => {
	const isIntegratedStyle = type === "inlineMinimalPillIntegrated"
	return (
		<div
			className={`${className} select-none grid grid-cols-7 mx-auto shadow-xs relative shadow-black/20 items-center h-fit rounded-full overflow-hidden text-zinc-800`}>
			<button
				type="button"
				className="col-span-2 text-foreground/80 hover:text-primary/100 cursor-pointer duration-300 ease-in-out transition-all active:text-zinc-700 dark:active:text-zinc-300"
				onClick={() => handleClick("minus")}>
				{isIntegratedStyle && (
					<FiMinus className="flex mx-auto text-3xl " />
				)}
				{!isIntegratedStyle && (
					<BsDashCircle className="flex mx-auto text-3xl " />
				)}
			</button>
			<div
				className={cn(
					"col-span-3 flex text-5xl justify-center h-fit text-primary pl-2 flex-grow w-full",
					isIntegratedStyle &&
						"border-l-2 border-r-2 text-4xl pr-1.5 border-primary/30"
				)}>
				<p className="w-full">{value}</p>
				<span className="flex mt-auto text-2xl font-semibold text-right text-primary">
					{unit}
				</span>
			</div>
			<button
				type="button"
				className="col-span-2 text-foreground/80 hover:text-primary/100 cursor-pointer duration-300 ease-in-out transition-all active:text-zinc-700 dark:active:text-zinc-300"
				onClick={() => handleClick("plus")}>
				{isIntegratedStyle && (
					<FiPlus className="flex mx-auto text-3xl " />
				)}
				{!isIntegratedStyle && (
					<BsPlusCircle
						className={`rounded-full flex text-3xl mx-auto`}
					/>
				)}
			</button>

			<input
				{...register(name)}
				name={name}
				type="number"
				min={min}
				max={max}
				step={step}
				value={value}
				className="hidden"
			/>
		</div>
	)
}

const InlineMinimal = ({
	handleClick,
	className,
	name,
	min,
	max,
	step,
	value,
	register,
	type,
	unit,
}: {
	handleClick: BtnClickVoid
	className: string
	name: string
	min: number
	max: number
	step: number
	start: number
	register: any
	type?: string
	value: number
	unit: string
}) => {
	const isBlockStyle = type === "inlineMinimalBlock"
	return (
		<div
			className={`${className} select-none grid grid-cols-7 mx-auto shadow-xs relative shadow-black/20 items-center h-20 overflow-hidden rounded-md text-zinc-800`}>
			<button
				type="button"
				className="col-span-2 text-foreground/80 hover:text-primary/100 cursor-pointer duration-300 ease-in-out transition-all active:text-zinc-700 dark:active:text-zinc-300"
				onClick={() => handleClick("minus")}>
				{isBlockStyle && (
					<BiSolidMinusSquare className="flex mx-auto text-3xl " />
				)}
				{!isBlockStyle && (
					<BsDashCircle className="flex mx-auto text-3xl " />
				)}
			</button>
			<div className="col-span-3 flex text-5xl justify-center h-fit text-primary pl-2 flex-grow w-full">
				<p className="w-full">{value}</p>
				<span className="flex mt-auto text-2xl font-semibold text-right text-primary">
					{unit}
				</span>
			</div>
			<button
				type="button"
				className="col-span-2 text-foreground/80 hover:text-primary/100 cursor-pointer duration-300 ease-in-out transition-all active:text-zinc-700 dark:active:text-zinc-300"
				onClick={() => handleClick("plus")}>
				{isBlockStyle && (
					<BiSolidPlusSquare className="flex mx-auto text-3xl " />
				)}
				{!isBlockStyle && (
					<BsPlusCircle
						className={`rounded-full flex text-3xl mx-auto`}
					/>
				)}
			</button>

			<input
				{...register(name)}
				type="number"
				name={name}
				min={min}
				max={max}
				step={step}
				value={value}
				className="hidden"
			/>
		</div>
	)
}

const BlockInput = ({
	handleClick,
	className,
	name,
	min,
	max,
	register,
	start,
	step,
	value,
	unit,
}: {
	handleClick: BtnClickVoid
	className: string
	name: string
	min: number
	max: number
	step: number
	start: number
	register: any
	value: number
	unit: string
}) => {
	return (
		<div
			className={` ${className} bg-white mx-auto select-none shadow-xs relative shadow-black/20 flex items-center h-20 overflow-hidden border border-zinc-300 rounded-md text-zinc-800`}>
			<div className="flex w-full px-4 text-5xl items-right h-fit text-zinc-700">
				<p className="w-full ml-auto text-right">{value}</p>
				<span className="flex mt-auto mr-12 text-2xl font-semibold text-right text-zinc-500">
					{unit}
				</span>
			</div>
			<div className="absolute right-0 flex flex-col items-center h-full text-2xl text-center cursor-pointer w-14 bg-zinc-600">
				<div
					onClick={() => handleClick("plus")}
					className="flex w-full h-full text-4xl text-center text-white active:text-zinc-300 bg-zinc-600 hover:bg-zinc-500 ">
					<IoIosArrowUp className="flex mx-auto" />
				</div>
				<hr className="w-full border border-black" />
				<div
					onClick={() => handleClick("minus")}
					className="flex w-full h-full text-4xl text-white active:text-zinc-300 bg-zinc-600 hover:bg-zinc-500 ">
					<IoIosArrowDown className="flex mx-auto" />
				</div>
			</div>

			<input
				{...register(name)}
				type="number"
				name={name}
				min={min}
				max={max}
				step={step}
				value={value}
				className="hidden"
			/>
		</div>
	)
}
