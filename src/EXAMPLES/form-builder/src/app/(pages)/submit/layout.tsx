import React, { ReactNode } from "react"
import Navbar from "@/components/navbar"
import CardStatsWrapper from "../(dashboard)/dashboard/CardStatsWrapper"

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<main className="flex max-w-screen w-full flex-grow flex-col mx-auto ">
			<Navbar />
			<section className="flex flex-col flex-grow h-screen md:container">
				{children}
			</section>
		</main>
	)
}

export default layout
