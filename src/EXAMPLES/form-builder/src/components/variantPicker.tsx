import React, { useState } from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

const VariantPicker = ({
	items,
	pickedVariant,
	setPickedVariant,
}: VariantPickerProps) => {
	const [showStatusBar, setShowStatusBar] = useState<Checked>(true)
	const [showActivityBar, setShowActivityBar] = useState<Checked>(false)
	const [showPanel, setShowPanel] = useState<Checked>(true)

	const handlePickerChange = (value: string) => {
		showStatusBar ? setShowStatusBar(false) : setShowStatusBar(true)
		showActivityBar ? setShowActivityBar(false) : setShowActivityBar(true)
		showPanel ? setShowPanel(false) : setShowPanel(true)
		setPickedVariant(value)
	}

	return (
		<DropdownMenuContent className="mr-[96px] mt-2">
			<DropdownMenuLabel>Variant</DropdownMenuLabel>
			<DropdownMenuSeparator />
			{items.map((item, index) => (
				<DropdownMenuCheckboxItem
					key={index}
					checked={pickedVariant === item.value}
					onCheckedChange={() => handlePickerChange(item.value)}>
					{item.label}
				</DropdownMenuCheckboxItem>
			))}
		</DropdownMenuContent>
	)
}

type item = {
	label: string
	value: string
}

type VariantPickerProps = {
	items: item[]
	pickedVariant: string
	setPickedVariant: (variant: string) => void
}

export default VariantPicker
