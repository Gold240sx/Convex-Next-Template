import * as React from "react"

interface EmailTemplateProps {
	firstName: string
	email: string
	message: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
	firstName,
	email,
	message,
}) => (
	<div>
		<h1>Welcome, {firstName}!</h1>
		<p>From: {email}</p>
		<p>Message: {message}</p>
	</div>
)

export default EmailTemplate
