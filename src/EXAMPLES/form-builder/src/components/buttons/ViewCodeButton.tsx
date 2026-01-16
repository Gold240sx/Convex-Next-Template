import { BiCodeAlt } from "react-icons/bi"
import React from "react"
import { Button } from "../ui/button"
import { VoidFunction } from "@/utils/helperFunctions"

const ViewCodeButton = ({
	handleModal,
	formattedCode,
}: {
	handleModal: VoidFunction
	formattedCode: string
}) => {
	return (
		<button
			onClick={handleModal}
			disabled={formattedCode === ""}
			className={`${
				formattedCode === ""
					? "bg-zinc-500 text-muted-foreground cursor-not-allowed "
					: "bg-gradient-to-r from-indigo-500 to-sky-500 "
			} text-primary rounded-md p-0.5 cursor-pointer duration-700 transition-all ease-in-out`}>
			<span
				className={` ${
					formattedCode !== "" &&
					"hover:text-white hover:bg-transparent"
				} flex h-full w-full whitespace-nowrap duration-200 transition-all ease-in-out bg-background rounded items-center justify-center gap-2 px-4 py-[.4rem]`}>
				<BiCodeAlt className="h-4 w-4" />
				View Code
			</span>
		</button>

		// 		<button class="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded p-1">
		//   <span class="flex w-full bg-gray-900 text-white rounded p-2">
		//   Gradient border
		//      </span>
		// </button>
	)
}

export default ViewCodeButton
