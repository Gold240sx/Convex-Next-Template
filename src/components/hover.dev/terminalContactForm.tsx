import { FiCheckCircle } from "react-icons/fi"
import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	Fragment,
	MutableRefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
	useCallback,
} from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AiOutlineMinus } from "react-icons/ai"
import { CgClose, CgExpand } from "react-icons/cg"
import { TbFolderFilled } from "react-icons/tb"
import { useToast } from "@/hooks/use-toast"
import { submitContactForm } from "@/app/actions/contact"
import APP_CONFIG from "@/app-config"

interface TerminalContactProps {
	onClose: () => void
	isMaximized: boolean
	setIsMaximized: Dispatch<SetStateAction<boolean>>
	isMinimized: boolean
	setIsMinimized: (minimized: boolean) => void
	onMinimize: () => void
	launchpadButtonRef: React.RefObject<HTMLButtonElement | null>
}

// define this as a function that outputs a string
// 1. Simple schema for the RHF resolver (satisfies the "3 strings" requirement)
const formSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").trim(),
	email: z.string().email("Invalid email address").trim(),
	message: z
		.string()
		.min(10, "Message must be at least 10 characters")
		.trim(),
})

type FormValues = {
	name: string
	email: string
	message: string
}

// 2. Advanced validation for the terminal step-by-step (with transforms)
const nameValidation = z
	.string()
	.min(2, "Name must be at least 2 characters")
	.regex(
		/^[A-Za-z]+(\s+[A-Za-z]+)+$/,
		"Please enter both first and last name"
	)
	.trim()
	.transform((val) =>
		val
			.split(" ")
			.map(
				(word) =>
					word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
			)
			.join(" ")
	)
	.catch("") // Fallback value as per user suggestion

const TerminalContact = ({
	onClose,
	isMaximized,
	setIsMaximized,
	isMinimized,
	setIsMinimized,
	onMinimize,
	launchpadButtonRef,
}: TerminalContactProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const {
		handleSubmit,
		formState: { errors },
		setValue,
		trigger,
	} = useForm<FormValues>({
		// @ts-expect-error
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
	})

	const [questions, setQuestions] = useState(QUESTIONS)

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsMinimized(true)
				onClose()
			}
		}

		window.addEventListener("keydown", handleEscape)
		return () => window.removeEventListener("keydown", handleEscape)
	}, [setIsMinimized, onClose])

	const handleClose = () => {
		setQuestions(
			QUESTIONS.map((q) => ({ ...q, complete: false, value: "" }))
		)
		onClose()
	}

	return (
		<section
			style={{
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
			className={`px-4 py-12 	${isMaximized && "h-full"}`}>
			<div
				ref={containerRef}
				onClick={() => {
					inputRef.current?.focus()
				}}
				className={`${isMaximized ? "h-full w-auto m-4 lg:m-8" : "h-96 max-w-4xl "} bg-neutral-950/70 rounded-b-xl overflow-hidden backdrop-blur rounded-lg w-full mx-auto overflow-y-scroll shadow-2xl shadow-black/50 cursor-text font-mono`}>
				<TerminalHeader
					onClose={handleClose}
					setIsMaximized={setIsMaximized}
					setIsMinimized={setIsMinimized}
					onMinimize={onMinimize}
				/>
				<TerminalBody
					inputRef={inputRef}
					containerRef={containerRef}
					onClose={onClose}
					onMinimize={onMinimize}
				/>
			</div>
		</section>
	)
}

const TerminalHeader = ({
	onClose,
	setIsMaximized,
	setIsMinimized,
	onMinimize,
}: {
	onClose: () => void
	setIsMaximized: Dispatch<SetStateAction<boolean>>
	setIsMinimized: (minimized: boolean) => void
	onMinimize: () => void
}) => {
	// Memoize handlers
	const handleClose = useCallback(() => {
		onClose()
		setIsMinimized(false)
		setIsMaximized(false)
	}, [onClose, setIsMinimized, setIsMaximized])

	const handleMinimize = useCallback(() => {
		setIsMinimized(true)
		onClose()
		onMinimize()
	}, [setIsMinimized, onClose, onMinimize])

	const handleMaximize = useCallback(() => {
		setIsMaximized(true)
	}, [setIsMaximized])

	return (
		<div className="w-auto p-3 bg-zinc-900 flex items-center gap-1 sticky top-0 rounded-t-xl overflow-hidden border-t-zinc-800 border-t">
			<div className="flex gap-1 group">
				<div
					className="w-3 h-3 rounded-full bg-red-500 cursor-pointer"
					onClick={handleClose}>
					<CgClose className="text-black/50 w-3 h-3 stroke-0.5 hidden group-hover:block" />
				</div>
				<div
					className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer"
					onClick={handleMinimize}>
					<AiOutlineMinus className="text-black/50 w-3 h-3 stroke-2 hidden group-hover:block" />
				</div>
				<div
					className="w-3 h-3 rounded-full bg-green-500 cursor-pointer"
					onClick={handleMaximize}>
					<CgExpand className="text-black/50 w-3 h-3 rotate-90 stroke-0.5 hidden group-hover:block" />
				</div>
			</div>
			<div className="text-sm flex gap-2 text-neutral-400 font-semibold absolute left-[50%] -translate-x-[50%]">
				<span>
					<TbFolderFilled className="text-blue-400 text-base mt-0.5" />
				</span>
				{APP_CONFIG.applicationName}
			</div>
		</div>
	)
}

const TerminalBody = ({
	containerRef,
	inputRef,
	onClose,
	onMinimize,
}: TerminalBodyProps) => {
	const [focused, setFocused] = useState(false)
	const [text, setText] = useState("")

	const [questions, setQuestions] = useState(QUESTIONS)

	const curQuestion = questions.find((q) => !q.complete)
	const handleSubmitLine = (value: string, currentQuestion: QuestionType) => {
		const validationResult = currentQuestion.validation.safeParse(value)

		if (!validationResult.success) {
			// Handle error - you might want to show it in the UI
			return false
		}

		// Proceed with existing submission logic
		const updatedQuestions = questions.map((q) => {
			if (q.key === currentQuestion.key) {
				return { ...q, complete: true, value }
			}
			return q
		})

		setQuestions(updatedQuestions)
		setText("")
		return true
	}

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
				behavior: "smooth",
			})
		}
	}, [questions])

	return (
		<div className="p-6 text-slate-100 text-lg">
			<InitialText />
			<PreviousQuestions questions={questions} />
			<CurrentQuestion curQuestion={curQuestion} />
			{curQuestion ? (
				<CurLine
					text={text}
					focused={focused}
					setText={setText}
					setFocused={setFocused}
					inputRef={inputRef}
					command={curQuestion?.key || ""}
					handleSubmitLine={handleSubmitLine}
					containerRef={containerRef}
					currentQuestion={curQuestion}
					questions={questions}
					setQuestions={setQuestions}
				/>
			) : (
				<Summary
					questions={questions}
					setQuestions={setQuestions}
					onClose={onClose}
				/>
			)}
		</div>
	)
}

const InitialText = () => {
	return (
		<>
			<p className="">Hey there! I'm excited to hear from you!🦻</p>
			<p className="whitespace-nowrap overflow-hidden font-light">
				------------------------------------------------------------------------
			</p>
		</>
	)
}

const PreviousQuestions = ({ questions }: PreviousQuestionProps) => {
	return (
		<>
			{questions.map((q, i) => {
				if (q.complete) {
					return (
						<Fragment key={i}>
							<p>
								{q.text || ""}
								{q.postfix && (
									<span className="text-purple-300">
										{q.postfix}
									</span>
								)}
							</p>
							<p className="text-teal-300">
								<FiCheckCircle className="inline-block mr-2" />
								<span>{q.value}</span>
							</p>
						</Fragment>
					)
				}
				return <Fragment key={i}></Fragment>
			})}
		</>
	)
}

const CurrentQuestion = ({ curQuestion }: CurrentQuestionProps) => {
	if (!curQuestion) return <></>

	return (
		<p>
			{curQuestion.text || ""}
			{curQuestion.postfix && (
				<span className="text-sky-300">{curQuestion.postfix}</span>
			)}
		</p>
	)
}

const Summary = ({ questions, setQuestions, onClose }: SummaryProps) => {
	const [complete, setComplete] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { toast } = useToast()
	const sendButtonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (!complete && sendButtonRef.current) {
			sendButtonRef.current.focus()
		}
	}, [complete])

	const handleReset = () => {
		setQuestions((pv) =>
			pv.map((q) => ({ ...q, value: "", complete: false }))
		)
	}

	const handleSend = async () => {
		try {
			const formData = questions.reduce<Record<string, string>>(
				(acc, val) => ({ ...acc, [val.key]: val.value }),
				{}
			)

			const result = await submitContactForm({
				name: formData["name"],
				email: formData["email"],
				message: formData["message"],
			})

			if (!result.success) {
				throw new Error(result.error)
			}

			setComplete(true)
			PlayEmailSentSound()
			toast({
				title: "Success!",
				description:
					"Message sent successfully! I'll get back to you soon.",
				variant: "default",
				className: "bg-black border-zinc-950 text-white",
			})

			setTimeout(() => {
				onClose()
			}, 2000)
		} catch (err) {
			console.error("Error submitting form:", err)
			setError(
				err instanceof Error ? err.message : "Failed to send message"
			)
			toast({
				title: "Error",
				description:
					err instanceof Error
						? err.message
						: "Failed to send message",
				variant: "destructive",
				className: "bg-red-500 text-white border-red-600",
			})
		}
	}

	let audio = new Audio("/sent.mp3")
	audio.volume = 0.5
	const PlayEmailSentSound = () => {
		audio.play()
	}

	return (
		<>
			<p className="mt-2 font-semibold text-sky-500">
				Beautiful! Here's what we've got:
			</p>
			<div className="bg-black/30 p-4 m-4 rounded-xl">
				{questions.map((q) => {
					return (
						<p key={q.key}>
							<span className="text-blue-300">{q.key}:</span>{" "}
							{q.value}
						</p>
					)
				})}
			</div>
			<p className="mt-2 font-semibold text-sky-500">Look good?</p>
			{complete ? (
				<p className="text-emerald-300 my-4">
					<FiCheckCircle className="inline-block mr-2" />
					<span>Sent! I'll get back to you ASAP 😎</span>
				</p>
			) : (
				<div className="flex gap-2 mt-2">
					<button
						onClick={handleReset}
						className="px-3 py-1 text-base hover:opacity-90 transition-opacity rounded bg-slate-100 text-black">
						Restart
					</button>
					<button
						ref={sendButtonRef}
						onClick={() => {
							handleSend()
							PlayEmailSentSound()
						}}
						className="px-3 py-1 text-base hover:opacity-90 transition-opacity rounded bg-teal-500 text-white focus:ring-2 focus:ring-teal-400 focus:outline-none">
						Send it!
					</button>
				</div>
			)}
			{error && <p className="text-red-500 my-2">{error}</p>}
		</>
	)
}

const CurLine = ({
	text,
	focused,
	setText,
	setFocused,
	inputRef,
	command,
	handleSubmitLine,
	containerRef,
	currentQuestion,
	questions,
	setQuestions,
}: CurrentLineProps & {
	questions: QuestionType[]
	setQuestions: Dispatch<SetStateAction<QuestionType[]>>
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		setError,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			[command]: "",
		},
	})

	const onSubmit = async (data: any) => {
		console.log("Submitting:", { text, command, data })
		const validationResult =
			await currentQuestion.validation.safeParseAsync(text)
		console.log("Validation result:", validationResult)

		if (validationResult.success) {
			const success = handleSubmitLine(text, currentQuestion)
			if (success) {
				setText("")
				clearErrors()
			}
		} else {
			// Display validation error using setError
			const errorMessage =
				validationResult.error.issues[0]?.message || "Invalid input"
			setError(command, {
				type: "validation",
				message: errorMessage,
			})
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && text === "") {
			e.preventDefault()
			// Find previous question
			const currentIndex = questions.findIndex(
				(q) => q.key === currentQuestion.key
			)
			if (currentIndex > 0) {
				const updatedQuestions = [...questions]
				updatedQuestions[currentIndex - 1].complete = false
				updatedQuestions[currentIndex - 1].value = ""
				setQuestions(updatedQuestions)
			}
		}
	}

	return (
		<>
			{errors[command] && (
				<p className="text-red-500 text-sm mb-2">
					⚠️ {errors[command]?.message?.toString()}
				</p>
			)}
			<form
				onSubmit={(e) => {
					e.preventDefault()
					handleSubmit(onSubmit)(e)
				}}>
				<div className="flex items-center">
					<span className="text-green-500">➜</span>
					<span className="text-blue-500 ml-2">{command}</span>
					<input
						{...register(command)}
						ref={(e) => {
							register(command).ref(e)
							inputRef.current = e
						}}
						className="flex-1 ml-2 bg-transparent outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition-delay:9999s] selection:bg-teal-400/50"
						value={text}
						onChange={(e) => setText(e.target.value)}
						onKeyDown={handleKeyDown}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
					/>
				</div>
			</form>
		</>
	)
}

export default TerminalContact

const QUESTIONS: QuestionType[] = [
	{
		key: "email",
		text: "To start, could you give me ",
		postfix: "your email?",
		complete: false,
		validation: z.string().email("Invalid email address"),
		value: "",
	},
	{
		key: "name",
		text: "Awesome! And what's ",
		postfix: "your full name? (First Last)",
		complete: false,
		validation: nameValidation,
		value: "",
	},
	{
		key: "message",
		text: "Perfect, and ",
		postfix: "how can I help you?",
		complete: false,
		validation: z
			.string()
			.min(10, "Message must be at least 10 characters"),
		value: "",
	},
]

interface CurrentLineProps {
	text: string
	focused: boolean
	setText: Dispatch<SetStateAction<string>>
	setFocused: Dispatch<SetStateAction<boolean>>
	inputRef: MutableRefObject<HTMLInputElement | null>
	command: string
	handleSubmitLine: (value: string, currentQuestion: QuestionType) => boolean
	containerRef: MutableRefObject<HTMLDivElement | null>
	currentQuestion: QuestionType
}

type QuestionType = {
	key: string
	text: string
	postfix?: string
	complete: boolean
	validation: z.ZodType
	value: string
}

interface TerminalBodyProps {
	containerRef: MutableRefObject<HTMLDivElement | null>
	inputRef: MutableRefObject<HTMLInputElement | null>
	onClose: () => void
	onMinimize: () => void
}

interface PreviousQuestionProps {
	questions: QuestionType[]
}

interface SummaryProps {
	questions: QuestionType[]
	setQuestions: Dispatch<SetStateAction<QuestionType[]>>
	onClose: () => void
}

interface CurrentQuestionProps {
	curQuestion: QuestionType | undefined
}
