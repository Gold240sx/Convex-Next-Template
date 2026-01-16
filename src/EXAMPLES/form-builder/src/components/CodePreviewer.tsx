"use client"
import { VoidFunction } from "@/utils/helperFunctions"
import React, { useLayoutEffect, useEffect, useState } from "react"
import { BiCodeAlt } from "react-icons/bi"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BiCopyAlt } from "react-icons/bi"
import SyntaxHighlighter from "react-syntax-highlighter"
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark"

const CodePreviewer = ({
	handleModal,
	formattedCode,
	showPortal,
	copyCode,
	copyImports,
	dynamicCode,
	dynamicImports,
	setDynamicCode,
}: CodePreviewerProps) => {
	const [finalCode, setFinalCode] = useState<string>("")

	useEffect(() => {
		function process(string: string) {
			let lines = string.split("\n")
			let indentation: string | RegExp | null = null

			if (lines[0] === "") lines.shift()
			const matches = /^[\s\t]+/.exec(lines[0])
			if (matches) indentation = matches[0]
			if (indentation) {
				lines = lines.map(function (line) {
					return line
						.replace(indentation || "", "")
						.replace(/\t/g, "    ")
				})
			}

			// Wrap existing code with a <></> fragment
			lines.unshift("/////* added code */////")
			lines.unshift("<>")
			lines.push("</>")

			return indentation ? lines.join("\n").trim() : string
		}
		setFinalCode(process(formattedCode))
	}, [formattedCode, dynamicCode])

	return (
		<div
			className={`absolute  h-screen w-screen left-0 top-0 p-8 text-white ${
				showPortal
					? "bg-white/50 dark:bg-black/80 [backdrop-filter: blur(2px)] flex items-center "
					: "hidden"
			}`}
			onClick={handleModal}>
			<div
				id="code-preview-body"
				onClick={(e) => e.stopPropagation()}
				className=" relative overflow-y-scroll  mt-16 mx-auto w-full max-h-screen from-indigo-500 to-sky-500 text-primary rounded-lg p-0.5 shadow-2xl dark:shadow-teal-400/40">
				<div className="flex flex-col items-start relative h-full w-full bg-background rounded-md justify-center gap-8 px-4 pt-[.4rem] pb-4">
					<div className="bg-[url(/QR-bg.svg)] dark:bg-[url(/QR-bg-dark.svg)] absolute top-0 left-0 w-full h-full bg-center z-0 opacity-5"></div>
					<div className="flex-col md:flex-row z-10 flex justify-between w-full text-2xl md:text-4xl text-zinc-400 dark:text-primary">
						<div className="bg-gradient-to-r to-indigo-300 from-sky-400  mt-4 p-0.5 rounded-lg">
							<div className="bg-background rounded-md">
								<h4 className="flex gap-4 items-center bg-gradient-to-r from-indigo-500/50 to-sky-500/50 p-4 py-2 rounded-md pr-8">
									<BiCodeAlt className="text-sky-400 mt-0.5" />
									<span>Form Code Output</span>
								</h4>
							</div>
						</div>
						<div className="flex gap-4 items-center ml-auto mt-2 md:mt-5">
							<div className="flex items-center space-x-2">
								<Label
									htmlFor="dynamic-toggle"
									className="cursor-pointer text-white">
									<span className="text-indigo-300">
										{dynamicCode && "Dynamic "}
									</span>
									<span className="text-teal-300">
										{!dynamicCode && "Static "}
									</span>
									Code Output
								</Label>
								<Switch
									id="dynamic-toggle"
									checked={dynamicCode}
									onCheckedChange={() =>
										setDynamicCode(!dynamicCode)
									}
								/>
							</div>
							<button onClick={handleModal} className="h-full">
								<svg
									className="fill-teal-600 hover:fill-teal-500 border-2 border-primary text-[32px] px-1 rounded-md hover:border-teal-500/20"
									xmlns="http://www.w3.org/2000/svg"
									height="1em"
									viewBox="0 0 384 512">
									<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
								</svg>
							</button>
						</div>
					</div>

					{dynamicCode && (
						<div className="w-full flex flex-col gap-2">
							<div className="flex justify-between w-full z-10">
								<h2 className="text-2xl">
									Dynamic Values Used:
								</h2>
								<button
									onClick={copyImports}
									className="border-2 rounded-md text-sm px-1 border-muted-foreground py-1 text-muted-foreground cursor-pointer hover:text-primary hover:border-primary hover:bg-zinc-800">
									<BiCopyAlt className="text-2xl hover:text-primary" />
								</button>
							</div>
							<div
								id="code-preview-textarea"
								className="w-full h-full rounded-md  z-10 overflow-x-scroll bg-[#282C33] p-4 text-teal-600 flex whitespace-nowrap">
								<p className="text-fuchsia-500">const &nbsp;</p>
								<p>&#123; &nbsp;</p>
								{/* make only the commas in white text */}
								{dynamicImports.map((item, index) => (
									<div key={index} className="flex">
										<span className="text-teal-300">
											{item}
										</span>
										{index !==
											dynamicImports.length - 1 && (
											<span className="text-white pr-2 pl-0.5">
												,{" "}
											</span>
										)}
									</div>
								))}
								<p>&nbsp; &#125;</p>
								<p className="text-white">
									&nbsp; ={" "}
									<span className="text-lime-300">item</span>.
									<span className="text-teal-500">props</span>
								</p>
							</div>
						</div>
					)}

					<div className="w-full flex flex-col gap-2">
						<div className="flex justify-between w-full z-10">
							<h2 className="text-2xl">Code</h2>
							<button
								onClick={copyCode}
								className="border-2 rounded-md text-sm px-1 border-muted-foreground text-muted-foreground hover:text-primary py-1 hover:border-primary cursor-pointer hover:bg-zinc-800">
								<BiCopyAlt className="text-2xl hover:text-primary" />
							</button>
						</div>
						<div
							id="code-preview-textarea"
							className="w-full h-full rounded-md  z-10 block overflow-x-auto">
							<SyntaxHighlighter
								language="javascript"
								style={atomOneDark}
								customStyle={{
									padding: "1rem",
								}}>
								{finalCode}
							</SyntaxHighlighter>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

type CodePreviewerProps = {
	handleModal: VoidFunction
	formattedCode: string
	dynamicImports: string[]
	showPortal: boolean
	copyCode: VoidFunction
	copyImports: VoidFunction
	dynamicCode: boolean
	setDynamicCode: React.Dispatch<React.SetStateAction<boolean>>
}

export default CodePreviewer
