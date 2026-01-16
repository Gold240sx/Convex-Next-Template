"use client"
import React, { FC, Fragment, useState } from "react"
import Image from "next/image"
import { IoClose } from "react-icons/io5"
import { BiChevronDown } from "bi-icons/bi" // Fixed this import later if needed, but keeping user's bi
import { BiChevronDown as ChevronDown } from "react-icons/bi"
import { GiPlainCircle } from "react-icons/gi"
import ChatbotImage from "@/assets/gifs/chatbot-2.gif"
import APP_CONFIG from "@/app-config"
import { AnimatePresence, motion } from "framer-motion"
import { MessagesProvider } from "@/context/ChatbotContext"
import ChatContents from "@/components/myComponents/Chatbot/ChatContents"

const ChatBotWidget: FC = () => {
	const [showChatWidget, setShowChatWidget] = useState(false)
	const [headerMinimized, setHeaderMinimized] = useState(false)
	const [mounted, setMounted] = useState(false)

	React.useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return (
		<MessagesProvider>
			{!showChatWidget && (
				<button
					className={`fixed opacity-50 hover:opacity-100 z-[999999] right-4 group bottom-4 shadow-2xl active:h-20 active:w-20 h-12 w-12 hover:h-24 hover:w-24 bg-zinc-800 rounded-full ease-in-out transition-all duration-300`}
					onClick={() => {
						setShowChatWidget(true)
					}}>
					<Image
						src={ChatbotImage}
						unoptimized
						alt="Chatbot icon"
						className="h-full w-full object-cover bg-center pr-[4px] rounded-full repeat-infinite"
					/>
					<h1
						className={` ${
							!showChatWidget
								? "-right-[100px] group-hover:right-[120px]"
								: ""
						} bottom-1 p-2 text-white fixed font-light ease-in-out duration-300 transition-all delay-300`}>
						Chat
					</h1>
				</button>
			)}
			<AnimatePresence>
				{showChatWidget && (
					<>
						{/* Overlay to close when clicking outside */}
						<div 
							className="fixed inset-0 z-30" 
							onClick={() => setShowChatWidget(false)}
						/>
						<motion.div
							initial={{ x: "100%", y: "100%", scale: 0 }}
							animate={{
								x: "0%",
								y: "0%",
								scale: 1,
								transition: { duration: 0.3, ease: "easeInOut" },
							}}
							//@ts-ignore
							exit={{
								x: "100%",
								y: "100%",
								scale: 0,
								opacity: 0,
								transition: {
									duration: 0.2,
									ease: "linear",
									zIndex: 50,
								},
							}}
							className={`${
								headerMinimized ? "pt-12" : "pt-4"
							} bg-zinc-800 w-80 shadow-xl group z-40 max-w-[90vw] h-[600px] max-h-[80vh] fixed right-4 bottom-4 rounded-xl overflow-hidden flex flex-col`}>
							<div className="relative flex-1 flex flex-col px-1 h-full min-h-0">
								<div className="bg-zinc-800 z-50 shadow-black/30 shadow-xl w-full min-h-24 h-fit px-2 relative shrink-0">
									<h1 className="text-white font-thin leading-8 text-3xl ">
										Chat
									</h1>
									<button
										className="absolute top-0 right-0 px-2 text-zinc-500 hover:text-white -translate-y-2"
										onClick={() => {
											setShowChatWidget(false)
										}}>
										<ChevronDown className="text-4xl m-2 mr-0 hover:scale-110 ease-in-out duration-300 transition-all" />
									</button>
									<div className="flex items-center gap-2 px-2 my-4">
										<GiPlainCircle className="text-lime-600 h-2 w-2 animate-pulse" />
										<p className="text-white whitespace-nowrap">
											{APP_CONFIG.companyName.length
												? APP_CONFIG.companyName
												: "Company"}{" "}
											is online.
										</p>
										<div className="flex -space-x-2 ml-auto">
											{APP_CONFIG.siteContent.widgets.ChatBot.supportStaff.map(
												(staff, index) => (
													<Fragment key={index}>
														<Image
															src={staff.photo}
															alt="Staff photo"
															width={24}
															height={24}
															className="w-6 h-6 rounded-full ring ring-zinc-950"
														/>
													</Fragment>
												)
											)}
										</div>
									</div>
								</div>
								<div
									id="chat-space"
									className="px-2 z-10 bg-zinc-850 rounded-lg flex-1 flex flex-col overflow-hidden min-h-0">
									<ChatContents />
								</div>
								<div
									id="contacts-section"
									className="flex w-full justify-evenly rounded-lg h-fit bg-gradient-to-b from-zinc-800 to-zinc-850">
									{APP_CONFIG.siteContent.widgets.ChatBot.socialMedia.map(
										(social, index) => {
											return (
												<Fragment key={index}>
													<a
														href={social.url}
														target="_blank"
														rel="noreferrer"
														className="flex items-center shadow-t-inner-lg text-white shadow-black/20 hover:shadow-black/40 justify-center w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full m-2">
														<Image 
															src={social.icon} 
															alt={social.name}
															width={16}
															height={16}
															className="w-4 h-4 object-contain invert"
														/>
													</a>
												</Fragment>
											)
										}
									)}
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</MessagesProvider>
	)
}

export default ChatBotWidget
