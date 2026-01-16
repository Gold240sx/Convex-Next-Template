"use client"
import React from "react"
import { HomeIcon } from "@heroicons/react/20/solid"
// import { UserButton, useUser, useAuth } from "@clerk/nextjs"
import Link from "next/link"

type BreadcrumbsProps = {
	pages: {
		name: string
		href: string
		current: boolean
	}[]
	className?: string
}

const Breadcrumbs = ({ pages, className }: BreadcrumbsProps) => {
	// const { user, isLoaded } = useUser()

	if (pages[0].href.includes("//")){
		// console.log("Breadcrumbs.tsx: pages[0].href: ", pages[0].href)
		pages[0].href = pages[0].href.replace("//", "/")
		pages[0].name = pages[0].name.replace("/", "")
		// console.log("Breadcrumbs.tsx: pages[0].href: ", pages[0].href)

	}

	return (
		<nav
			className={`${className} flex w-full items-start`}
			aria-label="Breadcrumb">
			<ol role="list" className=" flex items-center space-x-4">
				<li>
					<div>
						<Link
							// href={`${user && isLoaded ? "/dashboard" : "/"}`} // This is for a login based breadcrumb system
							href="/"
							className="text-gray-400 hover:text-gray-500">
							<HomeIcon
								className="h-5 w-5 flex-shrink-0"
								aria-hidden="true"
							/>
							<span className="sr-only">Home</span>
						</Link>
					</div>
				</li>
				{pages.map((page, i) => (
					<li key={i}>
						<div className="flex items-center">
							<svg
								className="h-5 w-5 flex-shrink-0 text-gray-300"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-hidden="true">
								<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
							</svg>
							<Link
								href={page.href}
								className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 capitalize"
								aria-current={
									page.current ? "page" : undefined
								}>
								{page.name}
							</Link>
						</div>
					</li>
				))}
			</ol>
		</nav>
	)
}
export default Breadcrumbs
