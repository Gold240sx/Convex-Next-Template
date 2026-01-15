"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const ONE_SECOND = 1000
const WAIT_TIME = ONE_SECOND * 3

const TextCycle = ({
	phrases,
	className,
}: {
	phrases: string[]
	className: string
}) => {
	const [active, setActive] = useState(0)
	const [isVisible, setIsVisible] = useState(false)
	const componentRef = useRef<HTMLDivElement>(null)
	const intervalRef = useRef<NodeJS.Timeout>(null)

	useEffect(() => {
		// Create intersection observer
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting)
			},
			{ threshold: 0.1 } // Trigger when at least 10% of the component is visible
		)

		if (componentRef.current) {
			observer.observe(componentRef.current)
		}

		// Cleanup observer
		return () => {
			observer.disconnect()
		}
	}, [])

	useEffect(() => {
		// Only run the interval when the component is visible
		if (isVisible) {
			intervalRef.current = setInterval(() => {
				setActive((pv) => (pv + 1) % phrases.length)
			}, WAIT_TIME)
		} else {
			// Clear interval when component is not visible
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [isVisible, phrases])

	return (
		<div
			ref={componentRef}
			className={`relative mb-14 mt-2 w-full ${className}`}>
			{phrases.map((phrase: string) => {
				const isActive = phrases[active] === phrase
				return (
					<motion.div
						key={phrase}
						initial={false}
						animate={
							isVisible
								? isActive
									? "active"
									: "inactive"
								: "inactive"
						}
						style={{
							x: "-50%",
						}}
						variants={{
							active: {
								opacity: 1,
								scale: 1,
							},
							inactive: {
								opacity: 0,
								scale: 0,
							},
						}}
						className="absolute left-1/2 top-0 w-full">
						{phrase}
					</motion.div>
				)
			})}
		</div>
	)
}

export default TextCycle
