"use client"
import React from "react"
import { motion } from "framer-motion"

const FuzzyOverlay = () => {
	return (
		<motion.div
			initial={{ transform: "translateX(-10%) translateY(-10%)" }}
			animate={{
				transform: "translateX(10%) translateY(10%)",
			}}
			transition={{
				repeat: Infinity,
				duration: 0.2,
				ease: "linear",
				repeatType: "mirror",
			}}
			style={{
				backgroundImage: 'url("/black-noise.png")',
			}}
			className="z-10 pointer-events-none absolute -inset-[100%] opacity-[4%]"
		/>
	)
}

export default FuzzyOverlay
