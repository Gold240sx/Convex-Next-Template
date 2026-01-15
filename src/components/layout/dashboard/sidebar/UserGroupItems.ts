import {
  Home,
  User,
  FileText,
  Settings,
  MessageSquare,
  Calendar,
  ShoppingCart,
  Package,
  BarChart,
} from "lucide-react";
import type { SectionGroup } from "./sidebarTypes";

export const UserGroups: SectionGroup[] = [
  {
    id: "user-dashboard",
    title: "User Dashboard",
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: Home,
        iconBgColor: "bg-indigo-100 dark:bg-indigo-950",
        iconColor: "text-indigo-600 dark:text-indigo-200",
        items: [
          {
            title: "Home",
            url: "/dashboard",
            icon: Home,
          },
          {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: BarChart,
          },
        ],
      },
      {
        id: "profile",
        title: "Profile",
        icon: User,
        iconBgColor: "bg-indigo-100 dark:bg-indigo-950",
        iconColor: "text-indigo-600 dark:text-indigo-200",
        items: [
          {
            title: "Account",
            url: "/dashboard/account",
            icon: User,
          },
          {
            title: "Wishlist",
            url: "/dashboard/wishlist",
            icon: ShoppingCart,
          },
          {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
          },
        ],
      },
      {
        id: "subscription",
        title: "Subscription",
        icon: Package,
        link: "/dashboard/subscription",
        iconBgColor: "bg-indigo-100 dark:bg-indigo-950",
        iconColor: "text-indigo-600 dark:text-indigo-200",
      },
      {
        id: "shopping",
        title: "Shopping",
        icon: ShoppingCart,
        iconBgColor: "bg-indigo-100 dark:bg-indigo-950",
        iconColor: "text-indigo-600 dark:text-indigo-200",
        items: [
          {
            title: "My Wishlist",
            url: "/dashboard/wishlist",
            icon: ShoppingCart,
          },
          {
            title: "Orders",
            url: "/dashboard/orders",
            icon: Package,
          },
        ],
      },
      {
        id: "content",
        title: "Content",
        icon: FileText,
        iconBgColor: "bg-indigo-100 dark:bg-indigo-950",
        iconColor: "text-indigo-600 dark:text-indigo-200",
        items: [
          {
            title: "Documents",
            url: "/dashboard/documents",
            icon: FileText,
          },
          {
            title: "Messages",
            url: "/dashboard/messages",
            icon: MessageSquare,
          },
          {
            title: "Calendar",
            url: "/dashboard/calendar",
            icon: Calendar,
          },
        ],
      },
    ],
  },
];
