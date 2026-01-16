"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React, { useEffect } from "react"

const ErrorPage = ({ error }: { error: Error }) => {
	useEffect(() => {
		// console.error(error)
	}, [error])

	return (
		<div className="gap-4 flex flex-col">
			<h2 className="text-center my-auto">Something went wrong...</h2>
			<Link href="/">
				<Button asChild>
					<a>Go back to the homepage</a>
				</Button>
			</Link>
		</div>
	)
}

export default ErrorPage
