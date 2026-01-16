// theres also an api endpoint for this call in the api folder

type EmailGroupPropType = {
	label: string
	from: string
	replyTo?: string
	to: string
	templateName: string
	templateProps?: any
	cc?: string[]
	bcc?: string[]
	text: string
	subject?: string
	// not yet supported by resend:
	// attachments?: string[]
	// tags?: string[]
	// scheduled_at?: string
}[]

export const SendAllEmailsViaAPI = async (
	emailGroup: EmailGroupPropType
): Promise<{ data?: any; error?: { status: number; message: string } }> => {
	try {
		const response = await fetch("/api/sendAllEmails", {
			method: "POST",
			body: JSON.stringify(emailGroup),
			headers: {
				"Content-Type": "application/json",
			},
		})
		const result = await response.json()
		// If response is not OK (status code not 200-299), throw an error
		if (!response.ok) {
			throw new Error(
				`Error ${response.status}: ${result.error || result.message || "Unknown error"}`
			)
		}

		return { data: result } // Return data on success
	} catch (error: any) {
		console.error("Error sending emails via API:", error)
		return {
			error: {
				status: error.status || 500,
				message: error.message || "Internal Server Error",
			},
		}
	}
}

// Example usage:
{
	/* 
	const emailsToSend = [
  {
    label: "Client Email",
    emailDestination: "client@example.com",
    emailTemplate: <ClientTemplate {...props} />,
    cc: ["assistant@example.com"],
    emailSubject: "Project Update",
  },
  {
    label: "Internal Email",
    emailDestination: "you@example.com",
    emailTemplate: <InternalTemplate {...props} />,
  }
]

const { success, errors } = await SendAllEmails(emailsToSend)
if (success) {
  console.log("All emails sent successfully!")
} else {
  console.log("Some emails failed to send:", errors)
  // Handle errors as needed
}

*/
}
