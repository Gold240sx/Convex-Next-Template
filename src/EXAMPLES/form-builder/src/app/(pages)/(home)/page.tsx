// import { UserButton } from "@clerk/nextjs"
import DeployButton from "@/components/DeployButton"
import AuthButton from "@/components/AuthButton"
import Header from "@/components/Header"
import { NextPage } from "next"
import { SignedIn, ClerkProvider } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
// import { AppProps } from "next/app"
import ClerkIsSignedInComponent from "@/components/ClerkIsSignedInComponent"
import { auth, clerkClient } from "@clerk/nextjs"

const Home: NextPage = async () => {
	const { userId } = auth()
	if (!userId) {
		return (
			<section className="h-full flex items-center justify-center">
				<div className="flex flex-col gap-20 max-w-4xl px-3">
					<Link
						href="/signIn"
						className="text-primary hover:text-teal-400">
						Sign In / Register
						<Button asChild>Sign In / Register</Button>
					</Link>
				</div>
			</section>
		)
	}
	// const user = await clerkClient.users.getUser(userId)

	return (
		<section className="h-full flex items-center justify-center">
			<div className="flex flex-col gap-20 max-w-4xl px-3">
				<Link
					href="/dashboard"
					className="text-primary hover:text-teal-400">
					Go to Dashboard
					<Button asChild>Go to Dashboard</Button>
				</Link>
				<Link
					href="/componentTester"
					className="text-primary hover:text-teal-400">
					Go to Component Tester
					<Button asChild>Go to ComponentTester</Button>
				</Link>
			</div>
		</section>
	)
}

export default Home
