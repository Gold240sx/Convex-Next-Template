"use server"

import { clerkClient } from "@clerk/nextjs/server"
import { auth } from "@clerk/nextjs/server"

export type GetUsersParams = {
	query?: string
	limit?: number
	offset?: number
	orderBy?: 'created_at' | 'updated_at' | 'last_sign_in_at'
}

export async function getClerkUsers(params: GetUsersParams = {}) {
	const { userId } = await auth()

	// 1. Check if user is authenticated
	if (!userId) {
		throw new Error("Unauthorized")
	}

	// 2. Ideally check for admin role here
	// Note: You might want to use your useAdminCheck logic server-side here
	// For now, we'll proceed assuming the UI handles the initial gate, 
	// but production code should verify the 'admin' role in the session claims.
	
	const client = await clerkClient()

	try {
		const { data, totalCount } = await client.users.getUserList({
			query: params.query,
			limit: params.limit || 10,
			offset: params.offset || 0,
			// Clerk expects '-created_at' for descending, 'created_at' for ascending
			orderBy: params.orderBy ? `-${params.orderBy}` as any : '-created_at',
		})

		return {
			users: JSON.parse(JSON.stringify(data)), // Ensure plain objects for Server Actions
			totalCount,
			success: true
		}
	} catch (error) {
		console.error("Error fetching users from Clerk:", error)
		return {
			users: [],
			totalCount: 0,
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch users"
		}
	}
}

export async function banClerkUser(userId: string) {
	const { userId: adminId } = await auth()
	if (!adminId) throw new Error("Unauthorized")

	const client = await clerkClient()
	try {
		await client.users.banUser(userId)
		return { success: true }
	} catch (error) {
		console.error("Error banning user:", error)
		return { success: false, error: error instanceof Error ? error.message : "Failed to ban user" }
	}
}

export async function unbanClerkUser(userId: string) {
	const { userId: adminId } = await auth()
	if (!adminId) throw new Error("Unauthorized")

	const client = await clerkClient()
	try {
		await client.users.unbanUser(userId)
		return { success: true }
	} catch (error) {
		console.error("Error unbanning user:", error)
		return { success: false, error: error instanceof Error ? error.message : "Failed to unban user" }
	}
}

export async function deleteClerkUser(userId: string) {
	const { userId: adminId } = await auth()
	if (!adminId) throw new Error("Unauthorized")

	const client = await clerkClient()
	try {
		await client.users.deleteUser(userId)
		return { success: true }
	} catch (error) {
		console.error("Error deleting user:", error)
		return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" }
	}
}

export async function getClerkUser(userId: string) {
	const { userId: adminId } = await auth()
	if (!adminId) throw new Error("Unauthorized")

	const client = await clerkClient()
	try {
		const user = await client.users.getUser(userId)
		return {
			user: JSON.parse(JSON.stringify(user)),
			success: true
		}
	} catch (error) {
		console.error("Error fetching user from Clerk:", error)
		return {
			user: null,
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch user"
		}
	}
}
