"use client"
import React, {
	useState,
	ReactNode,
	createContext,
	Dispatch,
	SetStateAction,
} from "react"
import { FormElementInstance } from "@/components/FormElements"
import { format } from "path"

type DesignerContextType = {
	elements: FormElementInstance[]
	addElement: (index: number, element: FormElementInstance) => void
	removeElement: (index: string) => void
	setElements: Dispatch<SetStateAction<FormElementInstance[]>>
	selectedElement: FormElementInstance | null
	setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>

	updateElement: (id: string, element: FormElementInstance) => void
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export const DesignerContextProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const [elements, setElements] = useState<FormElementInstance[]>([])
	const [selectedElement, setSelectedElement] =
		useState<FormElementInstance | null>(null)

	const addElement = (index: number, element: FormElementInstance) => {
		setElements((prev) => {
			const newElements = [...prev]
			newElements.splice(index, 0, element)
			return newElements
		})
	}

	const removeElement = (id: string) => {
		setElements((prev) => prev.filter((element) => element.id !== id))
	}

	const updateElement = (id: string, element: FormElementInstance) => {
		setElements((prev) => {
			const newElements = [...prev]
			const index = newElements.findIndex((element) => element.id === id)
			newElements[index] = element
			return newElements
		})
	}

	return (
		<DesignerContext.Provider
			value={{
				elements,
				addElement,
				removeElement,
				setElements,
				selectedElement,
				setSelectedElement,

				updateElement,
			}}>
			{children}
		</DesignerContext.Provider>
	)
}
