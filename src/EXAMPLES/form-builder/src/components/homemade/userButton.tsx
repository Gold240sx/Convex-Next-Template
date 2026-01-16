import React from "react"
import { GrUserAdmin } from "react-icons/gr"

const userButton = ({ user, userData }: { user: any; userData: any }) => {
	const key = user ? "user-logged-in" : "user-logged-out"
	const userIsAdmin = userData?.role === "admin"

	return (
		<div key={key}>
			{user && (
				<>
					<p
						className={`${
							userIsAdmin ? "pr-8 right-[3rem]" : "pr-3 right-32"
						} absolute top-[96px] z-[11] bg-black rounded-full pl-3 text-zinc-200`}>
						Hello,{" "}
						<span className="text-yellow-400 ml-2">
							{user?.email}!
						</span>
					</p>
					{userIsAdmin && (
						<>
							<p
								className="pr-6 right-[3.5rem]
							absolute top-[74px] z-[10] rounded-2xl rounded-bl-none rounded-r-none bg-zinc-800 border-black border-2 border-b-0 pb-1 pl-5 pt-0 text-zinc-200">
								Admin
							</p>
							<div className="absolute right-[1.75rem] top-[74px] z-[12] bg-zinc-700 border-[3px] border-black   rounded-full aspect-square p-1.5 h-12 w-12 text-bold">
								<GrUserAdmin className="invert  ml-1.5 mt-0.5 h-6 w-6" />
							</div>
						</>
					)}
				</>
			)}
		</div>
	)
}

export default userButton
