import React from "react"
import useDesigner from "@/app/hooks/useDesigner"
import { FormElements } from "./FormElements"
import { FormElementInstance } from "./FormElements"
import { AiOutlineClose } from "react-icons/ai"
import { Button } from "./ui/button"
import { Separator } from "@/components/ui/separator"

const PropertiesFormSidebar = () => {
	const { selectedElement, setSelectedElement } = useDesigner()
	if (!selectedElement) return null

	const PropertiesForm =
		FormElements[selectedElement?.type].propertiesComponent

	return (
		<div className="flex flex-col p-2">
			<div className="flex justify-between items-center">
				<p className="text-sm text-foreground/70">Element Properties</p>
				<Button
					size={"icon"}
					variant={"ghost"}
					onClick={() => {
						setSelectedElement(null)
					}}
					className="">
					<AiOutlineClose className="" />
				</Button>
			</div>
			<Separator className="my-2" />
			<PropertiesForm
				elementInstance={selectedElement as FormElementInstance}
			/>
		</div>
	)
}

export default PropertiesFormSidebar
