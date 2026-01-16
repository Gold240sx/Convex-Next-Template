import { SignIn } from "@clerk/nextjs"
import { NextPage } from "next"

const SignInPage: NextPage = () => {
	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
			<SignIn />
		</div>
	)
}

export default SignInPage
