"use client"
import React, { FC, useContext, useState } from "react"
import ChatInput from "./ChatInput"
import ChatMessages from "./ChatMessages"
import { MessagesContext } from "@/context/ChatbotContext"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { toast } from "sonner"
import { Loader2, CheckCircle2, XCircle, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { SendAllEmailsViaAPI } from "@/functions/sendAllEmails"
import APP_CONFIG from "@/app-config"

const ChatContents: FC = () => {
	const { messages, isResolved, setIsResolved } = useContext(MessagesContext)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [contactInfo, setContactInfo] = useState({ name: "", email: "", message: "" })
	
	const submitForm = useMutation(api.myFunctions.submitChatbotMessageForm)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		try {
			await submitForm({
				name: contactInfo.name,
				email: contactInfo.email,
				message: contactInfo.message,
				conversation: {
					messages: messages.map(m => ({
						role: m.role as any,
						content: m.content,
						createdAt: m.createdAt
					}))
				},
				consent: true,
				contactReason: "support"
			})
			toast.success("Message sent! I'll get back to you soon.")
			setIsResolved(true) 

			// Send Emails
			try {
				const adminEmail = APP_CONFIG.adminContext?.adminEmail || "240designworks@gmail.com"
				toast.loading("Sending email confirmation...", { id: "email-sending" })
				await SendAllEmailsViaAPI([
					{
						label: "User Confirmation",
						from: "Michael Martell <michael@michaelmartell.com>",
						to: contactInfo.email,
						subject: "Message Received - Michael Martell",
						text: `Hi ${contactInfo.name}, I received your message: ${contactInfo.message}`,
						templateName: "gen-inquiry",
						templateProps: { firstName: contactInfo.name, email: adminEmail, message: contactInfo.message }
					},
					{
						label: "Admin Notification",
						from: "Michael Martell <michael@michaelmartell.com>",
						to: adminEmail,
						replyTo: contactInfo.email,
						subject: `New Message from ${contactInfo.name}`,
						text: `New message from ${contactInfo.name} (${contactInfo.email}): ${contactInfo.message}`,
						templateName: "chat-message",
						templateProps: { firstName: contactInfo.name, email: contactInfo.email, message: contactInfo.message }
					}
				])
				toast.dismiss("email-sending")
				toast.success(`Confirmation email sent to ${contactInfo.email}`)
			} catch (emailError) {
				console.error("Failed to send emails:", emailError)
				toast.dismiss("email-sending")
				toast.error("Failed to send email notification")
			} 
		} catch (error) {
			console.error("Submission error:", error)
			toast.error("Failed to send message.")
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleTestEmail = async () => {
		try {
			toast.loading("Sending test email...")
			const adminEmail = APP_CONFIG.adminContext?.adminEmail || "240designworks@gmail.com"
			await SendAllEmailsViaAPI([
				{
					label: "Test Email",
					from: "Michael Martell <michael@michaelmartell.com>",
					to: "schassisweekly@gmail.com",
					subject: "Test Email from Portfolio",
					text: "This is a test email triggered by the button.",
					templateName: "gen-inquiry",
					templateProps: { firstName: "Test User", email: adminEmail, message: "This is a test message." }
				}
			])
			toast.dismiss()
			toast.success("Test email sent!")
		} catch (error) {
			console.error("Test email failed:", error)
			toast.dismiss()
			toast.error("Failed to send test email")
		}
	}

	return (
		<div className="flex flex-col flex-1 min-h-0">
			{/* Dev Tools Header */}
            {process.env.NODE_ENV === 'development' && (
                <div className="p-2 border-b border-zinc-800 flex justify-end">
                    <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleTestEmail}
                        className="text-[10px] h-6 px-2 text-zinc-500 hover:text-white"
						title="Send Test Email (Dev Only)"
                    >
                        Test Email
                    </Button>
                </div>
            )}

			<div className="flex-1 overflow-hidden flex flex-col">
				<ChatMessages className="flex-1">
					{isResolved === true && messages.length > 2 && (
						<div className="p-6 text-center animate-in zoom-in duration-500">
							<div className="w-14 h-14 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
								<CheckCircle2 className="w-8 h-8 text-teal-400" />
							</div>
							<p className="text-sm text-white font-bold">Awesome! All set.</p>
							<p className="text-xs text-zinc-400 mt-2 leading-relaxed">
								Glad I could help. Michael is usually available via LinkedIn or Email as well.
							</p>
							<Button 
								variant="ghost" 
								className="text-teal-400 text-xs mt-4 hover:bg-teal-400/10 hover:text-teal-300"
								onClick={() => setIsResolved(null)}
							>
								Ask something else
							</Button>
						</div>
					)}

					{isResolved === false && (
						<div className="p-4 bg-zinc-900 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-t-xl mx-1 shrink-0">
							<h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
								<Send className="w-4 h-4 text-teal-500" />
								Leave a Message
							</h3>
							<form onSubmit={handleSubmit} className="space-y-3">
								<Input 
									placeholder="Your Name" 
									required 
									value={contactInfo.name}
									onChange={e => setContactInfo({...contactInfo, name: e.target.value})}
									className="bg-zinc-950 border-zinc-800 text-xs h-9 focus:border-teal-500/50"
								/>
								<Input 
									placeholder="Your Email" 
									type="email" 
									required 
									value={contactInfo.email}
									onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
									className="bg-zinc-950 border-zinc-800 text-xs h-9 focus:border-teal-500/50"
								/>
								<textarea 
									placeholder="What can I help you with? (Context from our chat is included)" 
									required 
									value={contactInfo.message}
									onChange={e => setContactInfo({...contactInfo, message: e.target.value})}
									className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-3 text-xs min-h-[80px] text-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500/50 placeholder:text-zinc-600"
								/>
								<Button 
									type="submit" 
									disabled={isSubmitting}
									className="w-full h-9 text-xs bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all"
								>
									{isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Send className="w-3 h-3 mr-2" />}
									Submit to Michael
								</Button>


							</form>
						</div>
					)}

					{messages.length > 2 && isResolved === null && (
						<div className="p-4 bg-zinc-900/80 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-t-xl mx-1 shrink-0">
							<p className="text-xs text-zinc-300 mb-3 text-center font-medium">Did this answer your question?</p>
							<div className="flex gap-2 justify-center">
								<Button 
									size="sm" 
									variant="outline" 
									className="h-8 text-xs border-teal-500/30 bg-teal-500/5 text-teal-400 hover:bg-teal-500/20 hover:text-teal-300 transition-all"
									onClick={() => setIsResolved(true)}
								>
									<CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
									Yes, thanks!
								</Button>
								<Button 
									size="sm" 
									variant="outline" 
									className="h-8 text-xs border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all"
									onClick={() => setIsResolved(false)}
								>
									<XCircle className="w-3.5 h-3.5 mr-1.5" />
									No, I need help
								</Button>
							</div>
						</div>
					)}
				</ChatMessages>
			</div>
			
			{isResolved === null && (
				<div className="mt-auto shrink-0 bg-zinc-800">
					<ChatInput />
				</div>
			)}
		</div>
	)
}

export default ChatContents
