"use client";

import { useAuth } from '@clerk/nextjs'

export function useAdminCheck() {
  const { has, isLoaded } = useAuth()
  
  if (!isLoaded) return false
  
  return has?.({ role: 'org:admin' }) ?? false
}
