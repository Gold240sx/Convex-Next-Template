import React from "react"
import Logo from "@/components/Logo"
import ThemeSwitcher from "@/components/ThemeSwitcher"
import { UserButton } from "@clerk/nextjs"

const navbar = () => {
	return (
		<nav className="flex justify-between border-b items-center border-border h-[60px] px-4 py-2">
			<Logo />
			<div className="flex gap-4 items-center">
				<ThemeSwitcher />
				<UserButton afterSignOutUrl="/signIn" />
			</div>
		</nav>
	)
}

export default navbar
