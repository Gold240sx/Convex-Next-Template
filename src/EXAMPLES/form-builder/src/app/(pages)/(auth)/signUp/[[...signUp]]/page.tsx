import { SignUp as Register } from "@clerk/nextjs"
import { NextPage } from "next"

const SignUp: NextPage = () => {
	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
			return <Register />
		</div>
	)
}

export default SignUp
