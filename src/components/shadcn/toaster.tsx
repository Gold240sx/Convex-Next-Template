"use client"

import { useToast } from "@/hooks/use-toast"
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/shadcn/toast"

export function Toaster() {
	const { toasts } = useToast()

	return (
		<ToastProvider>
			{toasts.map(function ({
				id,
				title,
				description,
				action,
				code,
				...props
			}) {
				return (
					<Toast key={id} {...props}>
						<div className="flex flex-col gap-2">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>
									{description}
								</ToastDescription>
							)}
							{code && (
								<div>
									<pre className="bg-zinc-200 p-2 rounded-md">
										<span className="text-sky-700 me-1">
											Data:
										</span>
										{/* <code className="text-zinc-600 m-2">{JSON.stringify(code, null, 2)}</code> */}
									</pre>
								</div>
							)}
							{action}
						</div>
						<ToastClose />
					</Toast>
				)
			})}
			<ToastViewport />
		</ToastProvider>
	)
}
