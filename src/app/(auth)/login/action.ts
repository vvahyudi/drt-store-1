"use server"

import { cookies } from "next/headers"

export async function getToken() {
	const cookieStore = await cookies()
	return cookieStore.get("token")
}

export async function updateToken(token: string) {
	const cookieStore = await cookies()
	return cookieStore.set("token", token)
}

export async function deleteToken() {
	const cookieStore = await cookies()
	return cookieStore.delete("token")
}
