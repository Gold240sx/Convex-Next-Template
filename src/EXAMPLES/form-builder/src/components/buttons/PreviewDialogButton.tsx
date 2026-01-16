import React from "react"
import { Button } from "../ui/button"
import { MdPreview } from "react-icons/md"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import useDesigner from "@/app/hooks/useDesigner"
import { FormElements } from "../FormElements"

const PreviewDialogButton = () => {
	const { elements } = useDesigner()
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className="gap-2 bg-primary text-secondary"
					variant={"outline"}>
					<MdPreview className="h-6 w-6" />
					Preview
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-gradient-to-r h-fit from-indigo-500 to-sky-500 w-screen max-h-screen my-8  p-0.5  shadow-2xl dark:shadow-teal-400/40 [backdrop-filter: blur(2px)]">
				<div className=" w-full max-w-full flex flex-col flex-grow p-0 gap-0 overflow-y-scroll bg-background rounded-md pt-[.4rem] pb-4 relative">
					<div className="px-4 py-2 border-b bg-background">
						<p className="text-lg font-bold text-white">
							Form Preview
						</p>
						<p className="text-sm  text-muted-foreground">
							This is how your form will look like to other users
						</p>
					</div>
					<div className="absolute bg-[url(/QR-bg.svg)] dark:bg-[url(/QR-bg-dark.svg)] h-full w-full opacity-5"></div>
					<div className="bg-black/80 flex flex-col flex-grow items-center justify-center p-4 h-fit ">
						<div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background/90 w-full h-fit rounded-lg p-8 z-10">
							{elements.map((element, index) => {
								const FormComponent =
									FormElements[element.type].formComponent
								return (
									<FormComponent
										key={index}
										elementInstance={element}
									/>
								)
							})}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default PreviewDialogButton
