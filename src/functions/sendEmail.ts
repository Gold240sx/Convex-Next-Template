"use server"
// theres also an api endpoint for this call in the api folder

export const SendEmailViaAPI = async (
	data: any
): Promise<{ data: any; errors: any[] }> => {
	try {
		const response = await fetch("/api/sendEmail", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phone: data.phone,
				message: data.message,
			}),
		})
		const result = await response.json()
		console.log("result", result)

		return { data: result.data, errors: result.errors }
	} catch (error) {
		console.error("Error sending emails via API:", error)
		return { data: null, errors: [error] }
	}
}
