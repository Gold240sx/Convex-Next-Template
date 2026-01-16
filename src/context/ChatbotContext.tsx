import { ConversationMessage } from "@/types/messages";
import { nanoid } from "nanoid";
import { createContext, useState, ReactNode } from "react";

export type Message = ConversationMessage & { id: string };

export const MessagesContext = createContext<{
	messages: Message[];
	isMessageUpdating: boolean;
	addMessage: (message: Message) => void;
	removeMessage: (id: string) => void;
	updateMessage: (id: string, updateFn: (prevText: string) => string) => void;
	setIsMessageUpdating: (isUpdating: boolean) => void;
	isResolved: boolean | null;
	setIsResolved: (status: boolean | null) => void;
	suggestedFormSlug: string | null;
	setSuggestedFormSlug: (slug: string | null) => void;
}>({
	messages: [],
	isMessageUpdating: false,
	addMessage: () => {},
	removeMessage: () => {},
	updateMessage: () => {},
	setIsMessageUpdating: () => {},
	isResolved: null,
	setIsResolved: () => {},
	suggestedFormSlug: null,
	setSuggestedFormSlug: () => {},
});

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
	const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false);
	const [isResolved, setIsResolved] = useState<boolean | null>(null);
	const [suggestedFormSlug, setSuggestedFormSlug] = useState<string | null>(null);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "initial-assistant-message",
			role: "assistant",
			content: "Hello! I'm Michael's AI assistant. How can I help you today?",
			createdAt: 1736985600000,
		},
	]);

	const addMessage = (message: Message) => {
		setMessages((prevMessages) => [...prevMessages, message]);
	};

	const removeMessage = (id: string) => {
		setMessages((prevMessages) =>
			prevMessages.filter((message) => message.id !== id)
		);
	};

	const updateMessage = (
		id: string,
		updateFn: (prevText: string) => string
	) => {
		setMessages((prevMessages) =>
			prevMessages.map((message) => {
				if (message.id === id) {
					return { ...message, content: updateFn(message.content) };
				}
				return message;
			})
		);
	};

	return (
		<MessagesContext.Provider
			value={{
				messages,
				addMessage,
				removeMessage,
				updateMessage,
				isMessageUpdating,
				setIsMessageUpdating,
				isResolved,
				setIsResolved,
				suggestedFormSlug,
				setSuggestedFormSlug,
			}}>
			{children}
		</MessagesContext.Provider>
	);
};
