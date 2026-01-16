import React, { ReactNode } from "react"
import Navbar from "@/components/navbar"

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<main className="flex w-full flex-grow flex-col mx-auto ">
			<Navbar />
			<section className="flex flex-grow h-full justify-center">
				{children}
			</section>
		</main>
	)
}

export default layout
