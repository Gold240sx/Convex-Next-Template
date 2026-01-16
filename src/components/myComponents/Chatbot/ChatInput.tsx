"use client"
import React, { FC, HTMLAttributes, useContext, useState, useRef } from "react"
import { MessagesContext, Message } from "@/context/ChatbotContext"
import { cn } from "@/lib/utils"
import TextareaAutosize from "react-textarea-autosize"
import { nanoid } from "nanoid"
import { CornerDownLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAction, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { isRateLimitError } from "@convex-dev/rate-limiter"

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
	const textAreaRef = useRef<null | HTMLTextAreaElement>(null)
	const [input, setInput] = useState<string>("")
	const [isPending, setIsPending] = useState(false)
	const {
		messages,
		addMessage,
		updateMessage,
		isResolved,
		setIsResolved,
		suggestedFormSlug,
		setSuggestedFormSlug,
	} = useContext(MessagesContext)

	const chatAction = useAction(api.chatbot.chat)
	const submitContactForm = useMutation(api.myFunctions.submitChatbotMessageForm)

	const handleSend = async () => {
		if (!input.trim() || isPending) return

		const userMessage: Message = {
			id: nanoid(),
			role: "user",
			content: input,
			createdAt: Date.now(),
		}

		addMessage(userMessage)
		setInput("")
		setIsPending(true)

		try {
			// Get last few messages for context
			const chatMessages = messages.map(m => ({
				role: m.role,
				content: m.content
			})).concat({ role: "user", content: input })

			const response = await chatAction({ messages: chatMessages })
			
			let cleanResponse = (response as string) || "";
			const formMatch = cleanResponse.match(/\[\[SHOW_FORM:([^\]]+)\]\]/);
			
			if (formMatch) {
				const slug = formMatch[1];
				setSuggestedFormSlug(slug);
				// Automatically consider it "not resolved yet" because they need to fill the form
				setIsResolved(false); 
				// Remove the signal from the displayed text
				cleanResponse = cleanResponse.replace(/\[\[SHOW_FORM:[^\]]+\]\]/, "").trim();
			}

			const assistantMessage: Message = {
				id: nanoid(),
				role: "assistant",
				content: cleanResponse,
				createdAt: Date.now(),
			}

			addMessage(assistantMessage)

			// After every AI response, we could ask if it helped, 
			// but usually we wait for a bit or ask after a specific number of turns.
			// The user said "before asking if the issue was resolved".
			// I'll add a button to trigger the "resolved" check or do it automatically.
			if (messages.length >= 2) {
				// Show the resolution check after at least one exchange
				if (isResolved === null) {
					// We'll let the user click a "Did this help?" button which is handled in ChatContents
				}
			}

		} catch (error) {
			if (isRateLimitError(error)) {
				toast.error(`Rate limit exceeded. Please wait ${Math.ceil(error.data.retryAfter / 1000)}s.`)
			} else {
				toast.error("Something went wrong. Please try again")
				console.error(error)
			}
		} finally {
			setIsPending(false)
			setTimeout(() => {
				textAreaRef.current?.focus()
			}, 10)
		}
	}

	if (isResolved === false) {
		// If not resolved, ChatInput will be replaced by a contact form in ChatContents
		return null
	}

	return (
		<div {...props} className={cn("px-2 pb-4", className)}>
			<div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
				<TextareaAutosize
					ref={textAreaRef}
					rows={2}
					value={input}
					maxRows={4}
					disabled={isPending}
					autoFocus
					onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault()
							handleSend()
						}
					}}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
					placeholder="Write a message..."
					className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-900 py-3 px-4 text-gray-100 focus:ring-0 text-sm sm:leading-6 rounded-xl"
				/>
				<div
					className={`absolute inset-y-0 right-0 flex py-1.5 pr-3 items-center`}>
					<button 
						disabled={isPending || !input.trim()}
						onClick={handleSend}
						className="inline-flex items-center rounded-lg bg-teal-600 hover:bg-teal-500 p-1.5 text-white disabled:opacity-50 transition-colors"
					>
						{isPending ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<CornerDownLeft className="w-4 h-4" />
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ChatInput
