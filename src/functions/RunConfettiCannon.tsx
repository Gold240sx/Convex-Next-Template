"use client"
import React, { useState, useEffect, ReactNode } from "react"
import useWindowDimensions from "@/functions/useWindowDimensions"
import Confetti from "react-confetti"

export const RunConfettiCannon = (children: ReactNode) => {
	const [showConfetti, setShowConfetti] = useState<boolean>(false)
	const { width, height } = useWindowDimensions()

	// turn off confetti
	useEffect(() => {
		setTimeout(() => {
			setShowConfetti(false)
		}, 2000)
		setShowConfetti(true)
	}, [])

	return (
		<>
			<Confetti
				width={width}
				height={height}
				numberOfPieces={showConfetti ? 200 : 0}
				colors={[
					"#000000",
					"#18181B",
					"#404040",
					"#E5E5E5",
					"#FDBA74",
					"#B67E26",
					"#FFBF23",
					"#F6AE22",
				]}
			/>
			{children}
		</>
	)
}
