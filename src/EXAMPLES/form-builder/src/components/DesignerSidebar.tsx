import React from "react"
import { FormElements } from "./FormElements"
import SidebarButtonElement from "./SidebarButtonElement"
import useDesigner from "@/app/hooks/useDesigner"
import FormElementsSidebar from "./FormElementsSidebar"
import PropertiesFormSidebar from "./PropertiesFormSidebar"

const DesignerSidebar = () => {
	const { selectedElement } = useDesigner()
	return (
		<aside className="w-[400px] max-w-[400px]  flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background opacity-90 overflow-y-auto h-full">
			{!selectedElement && <FormElementsSidebar />}
			{selectedElement && <PropertiesFormSidebar />}
		</aside>
	)
}

export default DesignerSidebar
