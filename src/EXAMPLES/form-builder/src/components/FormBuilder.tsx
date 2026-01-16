"use client"
import { Form } from "@prisma/client"
import PreviewDialogButton from "@/components/buttons/PreviewDialogButton"
import PublishFormButton from "@/components/buttons/PublishFormButton"
import SaveFormButton from "@/components/buttons/SaveFormButton"
import DragOverlayWrapper from "@/components/DragOverlayWrapper"
import Designer from "@/components/Designer"
import React, { useEffect, useLayoutEffect, useState } from "react"
import {
	DndContext,
	MouseSensor,
	useSensor,
	useSensors,
	TouchSensor,
} from "@dnd-kit/core"
import ViewCodeButton from "./buttons/ViewCodeButton"
import CodePortal from "./codePortal"
import { useToast } from "@/components/ui/use-toast"
import useDesigner from "@/app/hooks/useDesigner"
import CodePreviewer from "./CodePreviewer"
import { CodeLib } from "./fields/CodeLib"
import { FormElementInstance } from "./FormElements"
import { ImSpinner } from "react-icons/im"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { toast } from "./ui/use-toast"
import Link from "next/link"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"
import Confetti from "react-confetti"

const FormBuilder = ({ form }: { form: Form }) => {
	const [showPortal, setShowPortal] = useState<boolean>(false)
	const { elements, setElements, setSelectedElement } = useDesigner()
	const [isReady, setIsReady] = useState<boolean>(false)
	const [formattedCode, setFormattedCode] = useState<string>("")
	const [dynamicCode, setDynamicCode] = useState<boolean>(false)
	const [dynamicImports, setDynamicImports] = useState<string[]>([])

	const { toast } = useToast()

	useLayoutEffect(() => {
		setFormattedCode(
			elements
				?.map((element: FormElementInstance) => {
					return CodeLib({ element, dynamicCode })?.code
				})
				.join("\n")
		)

		setDynamicImports(
			// unique values only
			Array.from(
				new Set(
					elements
						?.flatMap((element: FormElementInstance) => {
							return CodeLib({ element, dynamicCode })?.imports
						})
						.filter(Boolean) as string[]
				)
			)
		)
	}, [elements, formattedCode, dynamicCode])

	const handleModal = () => {
		setShowPortal(!showPortal)
	}

	const copyCode = () => {
		navigator.clipboard.writeText(formattedCode)
		toast({
			title: "Code Copied Successfully!",
			description: `Copied code: ${formattedCode}`,
		})
	}

	const copyImports = () => {
		// no repeated values
		const noDupes = dynamicImports.filter(
			(value, index, self) => self.indexOf(value) === index
		)
		const dynImpString =
			"const { " + noDupes.join(", \n") + " } = item.props"
		navigator.clipboard.writeText(dynImpString)
		toast({
			title: "Code Copied Successfully!",
			description: `Copied code: ${dynImpString}`,
		})
	}

	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 10, // 10px tolerance to define a drag (less than 10 is a click),
		},
	})

	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			delay: 300, // 250ms hold to define a drag
			tolerance: 5, // 10px tolerance to define a drag (less than 10 is a click)
		},
	})

	const sensors = useSensors(mouseSensor, touchSensor)

	useEffect(() => {
		if (isReady) return
		const elements = JSON.parse(form.content)
		setElements(elements)
		setSelectedElement(null)
		const readyTimeout = setTimeout(() => setIsReady(true), 500)
		return () => clearTimeout(readyTimeout)
	}, [form, setElements])

	if (!isReady) {
		return (
			<div className="flex flex-col items-center w-full h-full">
				<ImSpinner className="animate-spin h-12 w-12" />
			</div>
		)
	}

	// custom ui if the form is published
	const shareURL = `${window.location.origin}/submit/${form.shareURL}`
	if (form.published) {
		return (
			<>
				<Confetti
					width={window.innerWidth}
					height={window.innerHeight}
					numberOfPieces={1000}
					recycle={false}
				/>
				<div className="flex flex-col items-center justify-center h-full w-full mt-10">
					<div className="max-w-md">
						<h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
							🎉 🎉 Form Published 🎉🎉
						</h1>
						<h2 className="text-2xl">Share this form</h2>
						<h3 className="text-xl text-muted-foreground border-b pb-10 ">
							Anyone with the link can view and submit responses
						</h3>
						<div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
							<Input
								className="w-full"
								readOnly
								value={shareURL}
							/>
							<Button
								className="mt-2 w-full"
								onClick={() => {
									navigator.clipboard.writeText(shareURL)
									toast({
										title: "Link Copied",
										description:
											"The link has been copied to your clipboard!",
									})
								}}>
								Copy Link
							</Button>
						</div>
						<div className="flex justify-between mb-10">
							<Button
								className="bg-background text-primary"
								variant={"link"}>
								<Link
									href={"/"}
									className="gap-2 flex items-center">
									<BsArrowLeft />
									Go back home
								</Link>
							</Button>
							<Button
								className="bg-background text-primary"
								variant={"link"}>
								<Link
									href={`/forms/${form.id}`}
									className="gap-2 flex items-center">
									Form Details
									<BsArrowRight />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</>
		)
	}

	return (
		<DndContext id="builder-dnd" sensors={sensors}>
			<main className="flex flex-col w-full ">
				<header className="flex justify-between border-b-2 p-4 gap-3 items-center">
					<h2 className="truncate font-medium">
						<span className="text-muted-foreground mr-2">
							Form:
						</span>
						{form.name}
					</h2>
					<div className="flex items-center gap-2">
						<ViewCodeButton
							handleModal={handleModal}
							formattedCode={formattedCode}
						/>
						<PreviewDialogButton />
						{!form.published && (
							<>
								<SaveFormButton id={form.id} />
								<PublishFormButton id={form.id} />
							</>
						)}
					</div>
				</header>
				<div className="flex flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/QR-bg.svg)] dark:bg-[url(/QR-bg-dark.svg)]">
					<Designer />
				</div>
			</main>
			<DragOverlayWrapper />
			<CodePortal selector="codePortal" show={showPortal}>
				<CodePreviewer
					dynamicCode={dynamicCode}
					dynamicImports={dynamicImports}
					setDynamicCode={setDynamicCode}
					formattedCode={formattedCode}
					handleModal={handleModal}
					showPortal={showPortal}
					copyImports={copyImports}
					copyCode={copyCode}
				/>
			</CodePortal>
		</DndContext>
	)
}

export default FormBuilder
