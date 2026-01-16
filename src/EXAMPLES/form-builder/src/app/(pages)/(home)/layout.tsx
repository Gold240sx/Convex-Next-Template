import React, { ReactNode } from "react"
import Navbar from "@/components/navbar"

const HomeLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex flex-col h-screen min-w-full bg-background">
			<Navbar />
			{/* <main className="flex items-center justify-center h-screen bg-green-400"> */}
			{children}
			{/* </main> */}
		</div>
	)
}

export default HomeLayout
