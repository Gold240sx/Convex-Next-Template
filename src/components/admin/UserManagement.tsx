"use client"

import { useState, useEffect } from "react"
import { getClerkUsers, banClerkUser, unbanClerkUser, deleteClerkUser } from "@/app/actions/users"
import { Input } from "@/components/shadcn/input"
import { Button } from "@/components/shadcn/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  User as UserIcon, 
  Mail, 
  Calendar, 
  MoreVertical, 
  Ban, 
  Trash2, 
  UserCheck,
  ShieldAlert,
  ChevronRight as ChevronIcon
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const router = useRouter()
  const { toast } = useToast()
  const limit = 5

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const result = await getClerkUsers({
        query,
        limit,
        offset: (page - 1) * limit,
      })
      if (result.success) {
        setUsers(result.users)
        setTotalCount(result.totalCount)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 400)
    return () => clearTimeout(timer)
  }, [query, page])

  const handleBan = async (userId: string) => {
    const result = await banClerkUser(userId)
    if (result.success) {
      toast({ title: "User Banned", description: "The user has been banned successfully." })
      fetchUsers()
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  const handleUnban = async (userId: string) => {
    const result = await unbanClerkUser(userId)
    if (result.success) {
      toast({ title: "User Unbanned", description: "The user has been unbanned successfully." })
      fetchUsers()
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
    
    const result = await deleteClerkUser(userId)
    if (result.success) {
      toast({ title: "User Deleted", description: "The user has been deleted successfully." })
      fetchUsers()
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Active Users</h2>
          <p className="text-zinc-500 text-sm">Manage and view all registered users in your application.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            className="bg-zinc-900/50 border-zinc-800 pl-10 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">User Identity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 hidden md:table-cell">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <AnimatePresence mode="wait">
                {loading ? (
                  Array.from({ length: limit }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-zinc-800" />
                          <div className="space-y-2">
                            <div className="h-4 w-24 rounded bg-zinc-800" />
                            <div className="h-3 w-32 rounded bg-zinc-900" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <div className="h-4 w-40 rounded bg-zinc-800" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-6 w-16 rounded-full bg-zinc-800" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 w-24 rounded bg-zinc-800" />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="ml-auto h-8 w-8 rounded bg-zinc-800" />
                      </td>
                    </tr>
                  ))
                ) : users.length > 0 ? (
                  users.map((user, idx) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => router.push(`/admin/${user.id}`)}
                      className="group hover:bg-white/[0.04] cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-5 font-medium text-white">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-11 w-11 border-2 border-zinc-800 group-hover:border-blue-500/50 transition-colors">
                              <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />
                              <AvatarFallback className="bg-zinc-800 text-zinc-400">
                                <UserIcon className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            {user.lastSignInAt && (
                                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 border-2 border-zinc-950">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                </span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate text-base">
                              {user.firstName || "Anonymous"} {user.lastName || ""}
                            </span>
                            <span className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                              ID: {user.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <Mail className="h-3.5 w-3.5 text-zinc-500" />
                            {user.emailAddresses?.[0]?.emailAddress || "No email"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                          {user.banned ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-500 border border-red-500/20">
                                  <ShieldAlert className="h-3 w-3" />
                                  Banned
                              </span>
                          ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
                                  Active
                              </span>
                          )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Calendar className="h-4 w-4 text-zinc-600" />
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-zinc-500 hover:text-white hover:bg-zinc-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-zinc-800 text-zinc-300">
                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            {user.banned ? (
                              <DropdownMenuItem 
                                onClick={() => handleUnban(user.id)}
                                className="focus:bg-zinc-900 focus:text-emerald-500 cursor-pointer"
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => handleBan(user.id)}
                                className="focus:bg-zinc-900 focus:text-red-500 cursor-pointer"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDelete(user.id)}
                              className="focus:bg-red-500/10 text-red-500 focus:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center">
                          <Search className="h-6 w-6 text-zinc-700" />
                        </div>
                        <p className="text-zinc-500 font-medium">No results found for "{query}"</p>
                        <Button 
                             variant="link" 
                             onClick={() => { setQuery(""); setPage(1); }}
                             className="text-blue-500 hover:text-blue-400 p-0"
                        >
                          Clear search
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800 bg-zinc-900/20 px-6 py-4 gap-4">
          <div className="flex items-center gap-2">
             <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                Page {page} of {Math.max(1, totalPages)}
             </div>
             <p className="text-sm text-zinc-500">
                <span className="text-zinc-300 font-medium">{totalCount}</span> total members
             </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || loading}
              onClick={() => {
                  setPage(page - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-900 transition-all h-9 px-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || loading || totalCount === 0}
              onClick={() => {
                  setPage(page + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-900 transition-all h-9 px-4"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
