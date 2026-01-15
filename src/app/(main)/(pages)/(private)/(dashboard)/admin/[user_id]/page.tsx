import { getClerkUser } from "@/app/actions/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar"
import { Button } from "@/components/shadcn/button"
import { 
    ChevronLeft, 
    Mail, 
    Calendar, 
    User as UserIcon, 
    ShieldAlert, 
    Clock, 
    MapPin, 
    Phone,
    Fingerprint,
    LogIn
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ user_id: string }>
}

export default async function AdminUserPage({ params }: PageProps) {
    const { user_id } = await params
    const result = await getClerkUser(user_id)

    if (!result.success || !result.user) {
        return notFound()
    }

    const { user } = result

    return (
        <div className="max-w-5xl mx-auto py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Navigation */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800" asChild>
                    <Link href="/admin">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Users
                    </Link>
                </Button>
            </div>

            {/* Main Profile Card */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-zinc-900 shadow-2xl">
                                <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />
                                <AvatarFallback className="bg-zinc-800 text-zinc-500 text-3xl">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            {user.banned && (
                                <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg border-2 border-zinc-950">
                                    <ShieldAlert className="h-5 w-5" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-zinc-500 flex items-center gap-2 mt-1">
                                    <Fingerprint className="h-4 w-4" />
                                    {user.id}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {user.banned ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500 border border-red-500/20">
                                        Banned Account
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
                                        Verified Active
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500 border border-blue-500/20">
                                    Next.js User
                                </span>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-col gap-2">
                             <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                                Update Profile
                             </Button>
                             <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 w-full">
                                Send Message
                             </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-500" />
                        Contact Details
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                            <span className="text-zinc-500">Email Address</span>
                            <span className="text-zinc-200">{user.emailAddresses[0]?.emailAddress}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                            <span className="text-zinc-500">Phone Number</span>
                            <span className="text-zinc-200">{user.phoneNumbers[0]?.phoneNumber || "Not provided"}</span>
                        </div>
                    </div>
                </div>

                {/* System Information */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                        Account Activity
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                            <span className="text-zinc-500">Created On</span>
                            <span className="text-zinc-200">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                            <span className="text-zinc-500">Last Sign In</span>
                            <span className="text-zinc-200 font-medium">
                                {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "Never"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* External Metadata */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <LogIn className="h-5 w-5 text-purple-500" />
                        Auth Metadata
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Two-Factor</p>
                            <p className="text-sm text-zinc-200 font-medium">{user.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Passkeys</p>
                            <p className="text-sm text-zinc-200 font-medium underline decoration-blue-500/50">
                                {user.externalAccounts.length} Connected
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Strategy</p>
                            <p className="text-sm text-zinc-200 font-medium">{user.emailAddresses[0]?.verification?.strategy || "Unknown"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}