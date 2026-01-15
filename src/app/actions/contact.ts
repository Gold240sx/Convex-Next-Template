"use server"

import { fetchMutation } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export async function submitContactForm(formData: {
	name: string
	email: string
	message: string
}) {
	try {
		await fetchMutation(api.myFunctions.submitContactForm, {
			name: formData.name,
			email: formData.email,
			message: formData.message,
		});

		return { success: true };
	} catch (err) {
		console.error("Error submitting form:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to send message. Please try again.",
		};
	}
}
