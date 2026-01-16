import React from "react"

const ClerkIsSignedInComponent = ({
	children,
	user,
	userData,
}: {
	children: any
	user: any
	userData: any
}) => {
	const key = user ? "user-logged-in" : "user-logged-out"
	const userIsAdmin = userData?.role === "admin"
	return (
		<div>
			{user && children}
			{!user && "user is not signed in"}
		</div>
	)
}

export default ClerkIsSignedInComponent
