"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import FancyDarkModeToggle from "@/components/hoverDev/fancyDarkModeToggle";
import { useRouter, usePathname } from "next/navigation";
import { useAdminCheck } from "@/hooks/use-admin-check";
import defaultAvatar from "@/assets/images/defaults/generic-avatar.png";
import { Search, X, Bell } from "lucide-react";
import { SearchIcon } from "lucide-react";
import HamburgerMenu from "@/components/HamburgerMenu";
import { MobileNavSheet } from "@/components/layout/MobileNavSheet";
import TheeDeeBell from "@/assets/images/defaults/Bell_3D.png";
import ThreeDeeBellNotification from "@/assets/images/defaults/Bell_3D_notification.png";
import {
  ShieldCheck,
  AlertCircle,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import SupabaseAuthBadge from "@/components/layout/navbar/SupabaseAuthBadge";

export function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { state } = useSidebar();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isSidebarOpen = state === "expanded";
  const { user } = useAuth();
  const supabase = createClient();
  const { isAdmin } = useAdminCheck();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example count, replace with real data

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="relative z-50 w-full">
      <div className="flex h-14 w-full justify-between !pl-6">
        <div className="relative mr-4 flex min-w-[96px] items-center justify-center">
          {/* Search Bar */}
          <div className="absolute left-3 flex items-center space-x-2">
            <SearchIcon className="h-4 w-4 text-gray-500 peer-focus:text-gray-700 dark:text-gray-400 dark:peer-focus:text-gray-600" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md bg-gray-200 px-3 py-1 pl-10 text-gray-700 shadow-sm placeholder:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-gray-900 dark:text-sky-300 dark:focus:ring-sky-500 dark:focus-visible:ring-sky-500"
          />
          <Button
            variant="ghost"
            onClick={() => setSearchQuery("")}
            className={`absolute right-0 transition-opacity duration-200 ease-in ${searchQuery ? "opacity-70 hover:opacity-100" : "opacity-0"}`}
          >
            <X className="h-4 w-4 text-gray-500 peer-focus:text-gray-700 dark:text-gray-400 dark:peer-focus:text-gray-600" />
          </Button>
        </div>
        <div className="mr-4 flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center space-x-4">
            <FancyDarkModeToggle />
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8"
                onClick={() => {
                  // Handle notification click
                  console.log("Notifications clicked");
                }}
              >
                {notificationCount === 0 && (
                  <Image
                    src={ThreeDeeBellNotification.src}
                    alt="Bell Notification"
                    width={80}
                    height={80}
                    className="mt-5 h-full w-auto scale-150"
                  />
                )}
                {notificationCount > 0 && (
                  <div className="relative h-8 w-8">
                    <Image
                      src={ThreeDeeBellNotification.src}
                      alt="Bell Notification"
                      width={80}
                      height={80}
                      className="mt-1 h-full w-auto scale-150"
                    />
                    <span className="absolute left-0 top-1.5 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full text-[11px] font-bold text-white">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  </div>
                )}
              </Button>
            </div>
            {user ? (
              <div id="user-avatar-dropdown">
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative mt-0.5 h-12 w-12 overflow-hidden rounded-full"
                    >
                      <Avatar className="h-10 w-10 overflow-hidden">
                        <Image
                          src={user?.avatarUrl ?? defaultAvatar.src}
                          alt={user?.name ?? "User avatar"}
                          width={32}
                          height={32}
                          className="aspect-square h-full w-full object-cover"
                        />
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  {/* <DropdownMenuContent
                    className={`w-56 bg-white dark:bg-zinc-900 ${
                      isSidebarOpen ? "right-0" : "right-0"
                    }`}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <Image
                            src={user?.avatarUrl ?? defaultAvatar.src}
                            alt={user?.name ?? "User avatar"}
                            width={32}
                            height={32}
                            className="h-full w-full rounded-full"
                          />
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold leading-none">
                            {user.name || "User"}
                          </p>
                          <p className="text-xs leading-none text-zinc-400 dark:text-zinc-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer focus:bg-zinc-100 focus:text-zinc-900 data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-900 dark:focus:bg-zinc-800 dark:focus:text-zinc-100 dark:data-[highlighted]:bg-zinc-800 dark:data-[highlighted]:text-zinc-100"
                      >
                        <Link
                          href="/admin"
                          className="my-1 mt-2 h-fit w-full text-[1.12rem]"
                        >
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:bg-zinc-100 focus:text-zinc-900 data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-900 dark:focus:bg-zinc-800 dark:focus:text-zinc-100 dark:data-[highlighted]:bg-zinc-800 dark:data-[highlighted]:text-zinc-100"
                    >
                      <Link
                        href="/dashboard"
                        className={`${isAdmin ? "my-1 mb-2" : "my-2"} text-[1.12rem]`}
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="m-1 mt-2 cursor-pointer items-center justify-center bg-blue-500 text-center text-white hover:bg-blue-600 focus:bg-blue-600 focus:text-white data-[highlighted]:bg-blue-600"
                      onSelect={async () => {
                        setOpen(false);
                        await handleSignOut();
                      }}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent> */}
                  <DropdownMenuContent
                    id="menu-content"
                    className="min-w-[250px] max-w-[600px] overflow-hidden rounded-2xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-900 dark:shadow-black/50 dark:ring-white/10"
                    align="end"
                    sideOffset={8}
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div
                        id="user-avatar-dropdown-header"
                        className="flex h-8 w-auto items-center gap-3 p-2"
                      >
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={user.name || "User"}
                            width={32}
                            height={32}
                            className="aspect-square h-8 w-8 rounded-full object-cover"
                            priority
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                            {user.name?.[0]?.toUpperCase() ?? "U"}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <p className="text-base font-medium leading-none text-gray-900 dark:text-gray-100">
                            {user.name}
                          </p>
                          <p className="mt-2 text-xs leading-none text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-900/5 dark:bg-white/10" />
                    <DropdownMenuGroup className="p-2">
                      {isAdmin && (
                        <DropdownMenuItem
                          className="group cursor-pointer whitespace-nowrap rounded-lg px-3 py-2 text-lg transition-all hover:pl-4 hover:font-semibold hover:focus:bg-gray-100 dark:hover:bg-gray-800/50"
                          onClick={() => router.push("/admin")}
                        >
                          <ShieldCheck className="mr-2 h-5 w-5 text-gray-400 group-hover:text-sky-400" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      {user.status === "suspended" && (
                        <div className="flex items-center gap-1 px-3 py-2 text-xs text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          <span>Account Suspended</span>
                        </div>
                      )}
                      <DropdownMenuItem
                        className="group cursor-pointer rounded-lg px-3 py-2 text-lg transition-all hover:pl-4 hover:font-semibold hover:focus:bg-gray-100 dark:hover:bg-gray-800/50"
                        onClick={() => router.push("/dashboard")}
                      >
                        <LayoutDashboard className="mr-2 h-5 w-5 text-gray-400 group-hover:text-sky-400" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="group cursor-pointer rounded-lg px-3 py-2 text-lg transition-all hover:pl-4 hover:font-semibold hover:focus:bg-gray-100 dark:hover:bg-gray-800/50"
                        onClick={() => router.push("/settings")}
                      >
                        <Settings className="mr-2 h-5 w-5 text-gray-400 group-hover:text-sky-400" />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <div className="-mb-2 mt-4 scale-110 bg-gray-100 pb-3 dark:bg-gray-800">
                      <div className="p-4">
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 !text-white hover:focus:bg-blue-600 hover:focus:text-white dark:bg-blue-600 dark:hover:focus:bg-blue-700"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign out</span>
                        </DropdownMenuItem>
                        <div className="mt-8">
                          <SupabaseAuthBadge />
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="text-sm"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
            )}
            <HamburgerMenu
              navbarOpen={navbarOpen}
              setNavbarOpen={setNavbarOpen}
              newsBannerOpen={false}
              pathname={pathname}
              className="ml-2 mt-2 md:hidden"
            />
          </div>
        </div>
      </div>
      <MobileNavSheet
        open={navbarOpen}
        onOpenChange={setNavbarOpen}
        variant="submenu"
        role={pathname.startsWith("/admin") ? "admin" : "user"}
      />
    </header>
  );
}
