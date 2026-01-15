"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/shadcn/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { useState } from "react";
import Link from "next/link";
import { SectionGroup, Section } from "./sidebarTypes";
import { ChevronUp, LogOut } from "lucide-react";
import { AdminGroups } from "./AdminGroupItems";
import { UserGroups } from "./UserGroupItems";
import Image from "next/image";
import websiteLogo from "@/assets/branding/MainLogo.svg";
import defaultAvatar from "@/assets/images/defaults/generic-avatar.png";
import { useSidebar } from "@/components/shadcn/sidebar";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BiPlus } from "react-icons/bi";
import { useUser, useClerk } from '@clerk/nextjs'

// Mock subscription data
const mockSubscription = {
  plan: "Free",
  trialDays: 14,
  remainingDays: 10,
  features: ["100 Credits", "Basic Features", "Community Support"],
  status: "trial" as const, // 'trial' | 'active' | 'expired'
};

const getProgressColor = (status: "trial" | "active" | "expired") => {
  switch (status) {
    case "trial":
      return "from-blue-600 to-sky-500";
    case "active":
      return "from-green-600 to-emerald-500";
    case "expired":
      return "from-red-600 to-rose-500";
    default:
      return "from-blue-600 to-sky-500";
  }
};

const getStatusText = (status: "trial" | "active" | "expired") => {
  switch (status) {
    case "trial":
      return "Trial Period";
    case "active":
      return "Active Subscription";
    case "expired":
      return "Trial Expired";
    default:
      return "Unknown Status";
  }
};

const getInitialExpandedSections = (groups: SectionGroup[]) => {
  return ""; // Start with no section expanded
};

export function AppSidebar({
  includeRemainingTrialFooter = true,
}: {
  includeRemainingTrialFooter?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isAdminRoute = pathname?.startsWith("/admin");
  const role = isAdminRoute ? "admin" : "user";
  const [expandedSectionId, setExpandedSectionId] = useState<string>(() =>
    getInitialExpandedSections(role === "admin" ? AdminGroups : UserGroups),
  );
  const { signOut } = useClerk()
    const { user, isLoaded } = useUser()

  const isCurrentPath = (url: string) => pathname === url;

  const sectionContainsCurrentPath = (section: Section) => {
    if (section.link) {
      return isCurrentPath(section.link);
    }
    return section.items?.some((item) => isCurrentPath(item.url)) ?? false;
  };

  const groupContainsCurrentPath = (group: SectionGroup) => {
    if (group.link) {
      return isCurrentPath(group.link);
    }
    return group.sections.some(sectionContainsCurrentPath);
  };

  const toggleSection = (sectionId: string, hasItems: boolean) => {
    if (!hasItems) return;
    setExpandedSectionId((prev) => (prev === sectionId ? "" : sectionId));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const groupItems = role === "admin" ? AdminGroups : UserGroups;

  useGSAP(
    () => {
      // Reset any existing animations
      gsap.killTweensOf(".sidebar-menu-item");

      if (expandedSectionId) {
        const currentSection = groupItems
          .flatMap((group) => group.sections)
          .find((section) => section.id === expandedSectionId);

        const itemCount = currentSection?.items?.length || 0;
        const heightDuration = 0.2; // Duration for height animation
        const opacityDuration = 0.4; // Duration for fade in
        const staggerTime = 0.1; // Time between each item starting

        gsap.set(".sidebar-menu-item", {
          opacity: 0,
          x: -20,
          height: 0,
          padding: 0,
        });

        // Animate height and position
        gsap.to(".sidebar-menu-item", {
          height: "2.25rem",
          padding: "0.375rem 0.5rem",
          x: 0,
          duration: heightDuration,
          ease: "power2.out",
          stagger: staggerTime,
        });

        // Animate opacity separately
        gsap.to(".sidebar-menu-item", {
          opacity: 1,
          duration: opacityDuration,
          ease: "power1.inOut",
          stagger: staggerTime,
        });
      }
    },
    { dependencies: [expandedSectionId] },
  );

  return (
    <div
      id="app-sidebar"
      className="relative max-h-screen text-lg [&_*]:select-none"
    >
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="transition-transform duration-300 ease-in-out md:translate-x-0"
      >
        <SidebarContent>
          <div className="flex h-full flex-col">
            {/* Logo and Trigger Section */}
            <div
              className="mt-8 flex items-center justify-between px-4 data-[sidebar=collapsed]:justify-center"
              data-sidebar={state}
            >
              <Link
                href="/"
                className="flex items-center gap-2 data-[sidebar=collapsed]:hidden"
                data-sidebar={state}
              >
                <Image
                  src={websiteLogo}
                  alt="Website Logo"
                  className="h-6 w-fit min-w-10 dark:invert"
                  priority
                />
              </Link>
              <SidebarTrigger className="h-10 w-10 p-2 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 [&>svg]:h-5 [&>svg]:w-5" />
            </div>

            {/* Sidebar Items */}
            <div className="scrollbar-hide flex-1 overflow-y-auto pt-8">
              {includeRemainingTrialFooter &&
                state !== "collapsed" &&
                pathname.startsWith("/dashboard") && (
                  <div className="mx-2 px-1 pb-3">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-400/50 bg-blue-600/40 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:bg-blue-700 hover:text-white">
                      <BiPlus className="h-5 w-5" />
                      <span className="text-lg font-semibold">
                        Upgrade to Pro
                      </span>
                    </button>
                  </div>
                )}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <div className="space-y-8">
                      {groupItems.map((group) => (
                        <div key={group.id} className="space-y-6">
                          <SidebarGroupLabel
                            className={cn(
                              "px-2 py-4 text-xl font-bold opacity-50 data-[state=collapsed]:hidden",
                              groupContainsCurrentPath(group) &&
                                "text-blue-600 opacity-100",
                            )}
                          >
                            <Link
                              className={`${group.link ? "hover:text-blue-600" : "cursor-default"}`}
                              href={group.link ?? "#"}
                            >
                              {group.title}
                            </Link>
                          </SidebarGroupLabel>
                          {group.sections.map((section) => (
                            <div key={section.id}>
                              <div
                                onClick={() =>
                                  toggleSection(
                                    section.id,
                                    !!section.items?.length,
                                  )
                                }
                                className={cn(
                                  "mb-2 flex w-full cursor-pointer items-center justify-between",
                                  section.disabled &&
                                    "cursor-not-allowed opacity-50",
                                  state === "collapsed" ? "px-1" : "px-1",
                                  !section.items?.length && "cursor-default",
                                )}
                              >
                                <div className="flex w-full items-center justify-between">
                                  <div className="group/section flex w-full items-center gap-2">
                                    <div
                                      className={cn(
                                        "icon-container flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md",
                                        section.iconBgColor,
                                        !section.iconBgColor &&
                                          "bg-gray-100 dark:bg-gray-800",
                                      )}
                                    >
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <div className="flex items-center justify-center">
                                              <section.icon
                                                className={cn(
                                                  "h-5 w-5",
                                                  section.iconColor ||
                                                    "text-gray-500 dark:text-gray-400",
                                                  sectionContainsCurrentPath(
                                                    section,
                                                  ) && "text-blue-600",
                                                )}
                                              />
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent
                                            side="right"
                                            sideOffset={5}
                                            className={cn(
                                              "rounded-md bg-gray-200 dark:bg-gray-950",
                                              state !== "collapsed" && "hidden",
                                            )}
                                          >
                                            <Link href={section.link ?? "#"}>
                                              {section.title}
                                            </Link>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                    <div
                                      className="flex flex-1 items-center data-[sidebar=collapsed]:hidden"
                                      data-sidebar={state}
                                    >
                                      <Link href={section.link ?? "#"}>
                                        <span
                                          className={cn(
                                            "flex-1 text-left text-lg font-medium text-sidebar-foreground/70 transition-all duration-200 ease-in group-hover/section:pl-1 group-hover/section:text-sky-600 dark:group-hover/section:text-sky-300",
                                            expandedSectionId !== section.id &&
                                              sectionContainsCurrentPath(
                                                section,
                                              ) &&
                                              "text-blue-600",
                                          )}
                                        >
                                          {section.title}
                                        </span>
                                      </Link>
                                    </div>
                                    {section.items &&
                                      section.items.length > 0 && (
                                        <ChevronUp
                                          className={cn(
                                            "h-4 w-4 transform text-gray-400 transition-transform group-hover/section:text-sky-600 dark:group-hover/section:text-sky-300",
                                            expandedSectionId === section.id
                                              ? "rotate-0"
                                              : "rotate-180",
                                          )}
                                        />
                                      )}
                                  </div>
                                </div>
                              </div>
                              {expandedSectionId === section.id &&
                                section.items &&
                                section.items.length > 0 && (
                                  <div
                                    className="ml-4 overflow-hidden data-[sidebar=collapsed]:hidden"
                                    data-sidebar={state}
                                  >
                                    {section.items.map((item, index) => (
                                      <Link
                                        key={item.url}
                                        href={item.url}
                                        className={cn(
                                          "sidebar-menu-item",
                                          "relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-lg font-medium",
                                          state === "collapsed"
                                            ? "justify-center"
                                            : "",
                                          isCurrentPath(item.url)
                                            ? "text-blue-600"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-sky-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-sky-300",
                                        )}
                                      >
                                        {item.icon && (
                                          <item.icon
                                            className={cn(
                                              "h-5 w-5",
                                              isCurrentPath(item.url)
                                                ? "text-blue-600"
                                                : "text-gray-500 group-hover:text-blue-600",
                                            )}
                                          />
                                        )}
                                        <span
                                          className={cn(
                                            "transition-colors duration-200",
                                            state === "collapsed" && "hidden",
                                          )}
                                        >
                                          {item.title}
                                        </span>
                                        {isCurrentPath(item.url) &&
                                          state !== "collapsed" && (
                                            <div className="absolute right-2 h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                                          )}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>

            {/* User Profile */}
            <div
              id="user-profile-footer"
              className="absolute bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-900"
            >
              <hr className="mx-2" />

              {/* Subscription Status - Moved here */}
              {includeRemainingTrialFooter &&
                state !== "collapsed" &&
                pathname.startsWith("/dashboard") && (
                  <div className="mt-4 space-y-2 px-1 pb-3">
                    <p className="pl-2 text-xs text-gray-500 dark:text-gray-400">
                      {mockSubscription.remainingDays} days / of{" "}
                      {mockSubscription.trialDays} days left
                    </p>
                    <div className="mx-2 h-3 w-auto overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r transition-all duration-300 ${getProgressColor(mockSubscription.status)}`}
                        style={{
                          width: `${(mockSubscription.remainingDays / mockSubscription.trialDays) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {getStatusText(mockSubscription.status)}
                      </span>
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        View Plans →
                      </button>
                    </div>
                  </div>
                )}
              <SidebarGroup>
                {!isLoaded ? (
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-8 w-8 animate-pulse-opacity rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex flex-col space-y-2">
                      <div className="h-4 w-24 animate-pulse-opacity rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-3 w-32 animate-pulse-opacity rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                ) : user ? (
                  <div className="flex items-center gap-3 p-1">
                    <Avatar
                      id="sidebar-user-avatar"
                      className="h-8 w-8 overflow-hidden"
                    >
                      <Image
                        src={user?.imageUrl ?? defaultAvatar.src}
                        alt={user?.firstName ?? "User avatar"}
                        width={32}
                        height={32}
                        className="aspect-square h-full w-full object-cover"
                      />
                    </Avatar>
                    <div
                      className="flex flex-col data-[sidebar=collapsed]:hidden"
                      data-sidebar={state}
                    >
                      <span className="text-sm font-medium text-black dark:text-white">
                        {user.firstName || "User"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-2 flex items-center gap-3 p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={defaultAvatar.src}
                        alt="Default avatar"
                      />
                      <AvatarFallback>
                        <AvatarImage
                          src={defaultAvatar.src}
                          alt="Default avatar"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="flex flex-col data-[sidebar=collapsed]:hidden"
                      data-sidebar={state}
                    >
                      <span className="text-sm font-medium text-black dark:text-white">
                        Guest User
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Not signed in
                      </span>
                    </div>
                  </div>
                )}

                {/* Subscription Status - Moved here
                {includeRemainingTrialFooter &&
                  state !== "collapsed" &&
                  pathname.startsWith("/dashboard") && (
                    <div className="mt-4 space-y-2 px-1">
                      <p className="pl-2 text-xs text-gray-500 dark:text-gray-400">
                        {mockSubscription.remainingDays} days / of{" "}
                        {mockSubscription.trialDays} days left
                      </p>
                      <div className="mx-2 h-3 w-auto overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r transition-all duration-300 ${getProgressColor(mockSubscription.status)}`}
                          style={{
                            width: `${(mockSubscription.remainingDays / mockSubscription.trialDays) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {getStatusText(mockSubscription.status)}
                        </span>
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          View Plans →
                        </button>
                      </div>
                    </div>
                  )} */}

                <div className="px-1">
                  {user ? (
                    <SidebarMenuButton
                      onClick={() => void handleSignOut()}
                      className="mb-2 mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-base text-white transition-all duration-300 ease-in-out hover:bg-blue-700 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      <span
                        className="data-[sidebar=collapsed]:hidden"
                        data-sidebar={state}
                      >
                        Sign out
                      </span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => router.push("/sign-in")}
                      className="mb-2 w-full bg-blue-600 text-base text-white hover:bg-blue-700 hover:text-white"
                    >
                      <span
                        className="flex-1 text-center data-[sidebar=collapsed]:hidden"
                        data-sidebar={state}
                      >
                        Sign in
                      </span>
                    </SidebarMenuButton>
                  )}
                </div>
              </SidebarGroup>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
