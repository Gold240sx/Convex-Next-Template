"use client"
import React, { useState } from "react"
import { FormElement } from "./FormElements"
import { Button } from "./ui/button"
import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { AiOutlineDown } from "react-icons/ai"
import VariantPicker from "./variantPicker"
import { elementLibrary as tempItems, ElementItem } from "./fields/CodeLib"
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const SidebarButtonElement = ({
	formElement,
}: {
	formElement: FormElement
}) => {
	const {
		label,
		icon: Icon,
		extraAttributes,
	} = formElement.designerButtonElement
	const [pickedVariant, setPickedVariant] = useState("basic")
	const [showPicker, setShowPicker] = useState(false)
	const variant = extraAttributes?.variant || "basic"
	const draggable = useDraggable({
		id: `designer-button-${formElement.type}`,
		data: {
			type: formElement.type,
			isDesignerBtnElement: true,
			isDraggableButtonElement: true,
		},
	})
	const itemsArray = Array.from(tempItems[formElement.type]).map(
		(item: ElementItem) => ({
			label: item.label,
			value: item.value,
		})
	)

	return (
		<div className="h-[120px] w-[120px] relative">
			<Button
				className={cn(
					"flex group h-full w-full flex-col gap-2 cursor-grab bg-primary-foreground relative",
					draggable.isDragging && "ring-2 ring-primary"
				)}
				ref={draggable.setNodeRef}
				variant={"outline"}
				{...draggable.attributes}
				{...draggable.listeners}>
				{/* @ts-expect-error: Icon import expects wierd type */}
				<Icon className="h-8 w-8 text-primary cursor-grab group-hover:text-primary" />
				<p className="text-xs group-hover:text-primary">{label}</p>
			</Button>

			<DropdownMenu>
				<div className="h-full w-[110px]">
					<div
						id="variant-picker-and-pill"
						className="flex gap-1 ml-auto absolute right-2 bottom-2 flex-grow">
						<p
							key={pickedVariant}
							className="text-xs text-right  text-[#e7955e] bg-black/50 w-autol px-1 rounded-full">
							{pickedVariant}
						</p>
						{itemsArray.length > 1 && (
							<DropdownMenuTrigger asChild>
								<p
									onClick={() => setShowPicker(!showPicker)}
									className={`text-xs text-black text-center bg-white border-2 border-transparent hover:border-sky-600 w-[18px] h-[18px] items-center cursor-pointer rounded-full`}>
									<AiOutlineDown
										className={`mt-[2px] ml-[0.7px] cursor-pointer`}
									/>
								</p>
							</DropdownMenuTrigger>
						)}
					</div>

					<VariantPicker
						items={itemsArray}
						pickedVariant={pickedVariant}
						setPickedVariant={setPickedVariant}
					/>
				</div>
			</DropdownMenu>
		</div>
	)
}

export const SidebarButtonDragOverlay = ({
	formElement,
}: {
	formElement: FormElement
}) => {
	const {
		label,
		icon: Icon,
		extraAttributes,
	} = formElement.designerButtonElement
	const variant = extraAttributes?.variant || "basic"
	const draggable = useDraggable({
		id: `designer-button-${formElement.type}`,
		data: {
			type: formElement.type,
			isDraggableButtonElement: true,
		},
	})
	const itemsArray = Array.from(tempItems[formElement.type]).map(
		(item: ElementItem) => ({
			label: item.label,
			value: item.value,
		})
	)

	return (
		<Button
			className="flex group flex-col gap-2 h-[120px] w-[120px] cursor-grab bg-primary-foreground"
			variant={"outline"}>
			{/* @ts-expect-error: Icon import expects wierd type */}
			<Icon className="h-8 w-8 text-primary cursor-grab group-hover:text-primary" />
			<p className="text-xs group-hover:text-primary">{label}</p>
			<div className="flex gap-1 ml-auto absolute right-2 bottom-2">
				<p className="text-xs  text-[#D37639] bg-black px-1 rounded-full">
					{variant}
				</p>
				{itemsArray.length > 1 && (
					<p className="text-xs  text-black text-center bg-white px-0.5 cursor-pointer rounded-full">
						<AiOutlineDown className="my-auto flex mt-[3px]" />
					</p>
				)}
			</div>
		</Button>
	)
}

export default SidebarButtonElement
