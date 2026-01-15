import { useState, useEffect } from "react"
import { toast } from "sonner"

const RATE_LIMIT = 40
const TIME_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

const getValidCalls = (): number[] => {
	const savedCalls = localStorage.getItem("apiCalls")
	if (!savedCalls) return []

	const now = Date.now()
	const calls = JSON.parse(savedCalls)
	return calls.filter((timestamp: number) => now - timestamp < TIME_WINDOW)
}

export const useRateLimit = () => {
	const [calls, setCalls] = useState<number[]>(() => getValidCalls())

	// Save to localStorage whenever calls change
	useEffect(() => {
		const validCalls = calls.filter(
			(timestamp) => Date.now() - timestamp < TIME_WINDOW
		)
		localStorage.setItem("apiCalls", JSON.stringify(validCalls))
	}, [calls])

	// Cleanup expired calls every minute
	useEffect(() => {
		const interval = setInterval(() => {
			setCalls((prev) =>
				prev.filter((timestamp) => Date.now() - timestamp < TIME_WINDOW)
			)
		}, 60000)

		return () => clearInterval(interval)
	}, [])

	const checkRateLimit = (): boolean => {
		const now = Date.now()
		const validCalls = calls.filter(
			(timestamp) => now - timestamp < TIME_WINDOW
		)

		if (validCalls.length >= RATE_LIMIT) {
			const oldestCall = Math.min(...validCalls)
			const timeToWait = TIME_WINDOW - (now - oldestCall)
			const minutesToWait = Math.ceil(timeToWait / (60 * 1000))

			toast.error("Rate Limit Exceeded", {
				description: `Please wait ${minutesToWait} minutes before making more API calls.`,
			})
			return false
		}

		return true
	}

	const addCall = () => {
		setCalls((prev) => [...prev, Date.now()])
	}

	const validCalls = calls.filter(
		(timestamp) => Date.now() - timestamp < TIME_WINDOW
	)
	return {
		checkRateLimit,
		addCall,
		callsRemaining: Math.max(0, RATE_LIMIT - validCalls.length),
	}
}
