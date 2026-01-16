"use client"
import { MessagesContext } from "@/context/ChatbotContext"
import React, { FC, HTMLAttributes, useContext } from "react"
import MarkdownLite from "./MarkdownLite"
import { cn } from "@/lib/utils"

interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode
}

const ChatMessages: FC<ChatMessagesProps> = ({ className, children, ...props }) => {
	const { messages } = useContext(MessagesContext)
	const inverseMessages = [...messages].reverse()

	return (
		<div
			{...props}
			className={cn(
				"flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pr-2",
				className
			)}>
			{children}
			{inverseMessages.map((message, i) => (
				<div key={message.id || i} className="chat-message">
					<div
						className={cn("flex items-end", {
							"justify-end": message.role === "user",
						})}>
						<div
							className={cn(
								"flex flex-col space-y-2 text-sm max-w-[85%] mx-2 overflow-hidden",
								{
									"order-1 items-end": message.role === "user",
									"order-2 items-start": message.role !== "user",
								}
							)}>
							<div
								className={cn("px-4 py-2 rounded-2xl shadow-sm", {
									"bg-teal-600 text-white rounded-br-none":
										message.role === "user",
									"bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700":
										message.role !== "user",
								})}>
								<MarkdownLite text={message.content} />
							</div>
							<span className="text-[10px] text-zinc-500 px-1">
								{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default ChatMessages
