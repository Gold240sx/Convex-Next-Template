//components/ClientPortal.tsx

import React, { ReactNode } from "react"
import { useEffect, useRef } from "react"
import { Poppins } from "next/font/google"
import { createPortal } from "react-dom"
import { VoidFunction } from "@/utils/helperFunctions"

type CodePortalInterface = {
	children: ReactNode
	show?: boolean
	onClose?: VoidFunction
	selector: string
}

const CodePortal = ({ children, selector, show }: CodePortalInterface) => {
	const ref = useRef<Element | null>(null)
	useEffect(() => {
		ref.current = document.getElementById(selector)
	}, [selector])
	return show && ref.current ? createPortal(children, ref.current) : null
}

export default CodePortal

export const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
})
