"use client";

import { auth } from '@clerk/nextjs/server'

export async function useAdminCheck() {
   const { has } = await auth()
  
  const isAdmin = has({ role: 'org:admin' })
  return isAdmin
}
