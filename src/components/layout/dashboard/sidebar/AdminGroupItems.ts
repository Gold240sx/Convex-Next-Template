import { BiTask } from "react-icons/bi";
import { type SectionGroup } from "./sidebarTypes";

import {
  AppWindow,
  BookType,
  Calendar,
  BriefcaseBusiness,
  DatabaseIcon,
  FileText,
  Bell,
  BellDot,
  BookCheck,
  Home,
  ImageUp,
  Info,
  Handshake,
  Store,
  MessageCircle,
  Newspaper,
  NotebookPen,
  NotebookText,
  Presentation,
  ShoppingCart,
  Tally5,
  Users,
  UsersRound,
  Sparkle,
  Sparkles,
  Megaphone,
  CheckCheck,
  Settings,
  FileUser,
  Diff,
  Pickaxe,
  School,
  Backpack,
  Package,
  ScanBarcode,
  LinkIcon,
  CirclePlus,
  WalletCards,
  Telescope,
  Projector,
  MailWarning,
  TicketPercent,
  SquareUserRound,
  GraduationCap,
  ReceiptText,
  SquareKanban,
  ListChecks,
  Calendar1,
  ChartColumnBig,
  LayoutPanelTop,
  Receipt,
  UserCog,
  Users2,
  UserPlus,
  Building2,
  BookOpenCheck,
  Boxes,
  ShieldCheck,
  Gauge,
  BarChart3,
  ClipboardList,
  MessagesSquare,
  UserCheck,
  ScrollText,
  BookOpen,
  GanttChartSquare,
  BookMarked,
  ShoppingBag,
  PackageSearch,
  Truck,
  BadgeCheck,
  UserCog2,
  FileSpreadsheet,
  Target,
  Medal,
  TicketX,
  Palette,
} from "lucide-react";

export const AdminGroups: SectionGroup[] = [
  {
    id: "home",
    title: "Admin Dashboard",
    link: "/admin",
    sections: [
      //settings
      {
        id: "settings",
        title: "Settings",
        icon: Settings,
        iconColor: "text-purple-600 dark:text-purple-400",
        iconBgColor:
          "bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 group-hover/section:bg-purple-200 dark:group-hover/section:bg-purple-800",
        items: [
          {
            title: "General Settings",
            url: "/admin/settings/general",
            icon: UserCog,
          },
          {
            title: "Shipping Settings",
            url: "/admin/settings/shipping",
            icon: Truck,
          },
        ],
      },
      //notifications
      {
        id: "notifications",
        title: "Notifications",
        icon: BellDot,
        iconColor: "text-red-600 dark:text-red-400 ",
        iconBgColor:
          "bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 group-hover/section:bg-red-200 dark:group-hover/section:bg-red-800",
        items: [
          {
            title: "Activity Alerts",
            url: "/admin/notifications",
            icon: Bell,
          },
          {
            title: "User Messages",
            url: "/admin/user-messages",
            icon: MessagesSquare,
          },
          {
            title: "Staff Messages",
            url: "/admin/staff-messages",
            icon: MessageCircle,
          },
        ],
      },
      // people proups
      {
        id: "user-groups",
        title: "User Groups",
        icon: Users,
        iconColor: "text-blue-600 dark:text-blue-400",
        iconBgColor:
          "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 group-hover/section:bg-blue-200 dark:group-hover/section:bg-blue-800",
        items: [
          {
            title: "Users",
            url: "/admin/groups/users",
            icon: Users2,
          },
          {
            title: "Subscribers",
            url: "/admin/groups/subscribers",
            icon: UserCheck,
          },
          {
            title: "Followers",
            url: "/admin/groups/followers",
            icon: UserPlus,
          },
          {
            title: "Customers",
            url: "/admin/groups/customers",
            icon: BadgeCheck,
          },
          {
            title: "Employees",
            url: "/admin/staff/employees",
            icon: UserCog2,
          },
        ],
      },
      // Scheduling & Tasks
      {
        id: "schedule",
        title: "Schedule",
        icon: CheckCheck,
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBgColor:
          "bg-emerald-100 dark:bg-emerald-900 hover:bg-emerald-200 dark:hover:bg-emerald-800 group-hover/section:bg-emerald-200 dark:group-hover/section:bg-emerald-800",
        items: [
          {
            title: "Tasks",
            url: "/admin/tasks",
            icon: ClipboardList,
          },
          {
            title: "Calendar",
            url: "/admin/calendar",
            icon: Calendar1,
          },
          {
            title: "Meetings",
            url: "/admin/meetings",
            icon: GanttChartSquare,
          },
          {
            title: "Appointments",
            url: "/admin/appointments",
            icon: Calendar,
          },
        ],
      },
      // Stats
      {
        id: "stats",
        title: "Stats",
        icon: Gauge,
        iconColor: "text-cyan-600 dark:text-cyan-400",
        iconBgColor:
          "bg-cyan-100 dark:bg-cyan-900 hover:bg-cyan-200 dark:hover:bg-cyan-800 group-hover/section:bg-cyan-200 dark:group-hover/section:bg-cyan-800",
        items: [
          {
            title: "Reports",
            url: "/admin/reports",
            icon: FileSpreadsheet,
          },
          {
            title: "Analytics",
            url: "/admin/analytics",
            icon: BarChart3,
          },
        ],
      },
    ],
  },
  {
    id: "content",
    title: "Content",
    sections: [
      // Media
      {
        id: "media",
        title: "Media",
        icon: ImageUp,
        iconColor: "text-pink-600 dark:text-pink-400",
        iconBgColor:
          "bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800 group-hover/section:bg-pink-200 dark:group-hover/section:bg-pink-800",
        link: "/admin/media",
      },
      // about
      {
        id: "about",
        title: "About",
        icon: Building2,
        iconColor: "text-indigo-600 dark:text-indigo-400",
        iconBgColor:
          "bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 group-hover/section:bg-indigo-200 dark:group-hover/section:bg-indigo-800",
        link: "/admin/pages/about",
      },
      //blog
      {
        id: "blog",
        title: "Blog",
        icon: ScrollText,
        iconColor: "text-amber-600 dark:text-amber-400",
        iconBgColor:
          "bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 group-hover/section:bg-amber-200 dark:group-hover/section:bg-amber-800",
        items: [
          {
            title: "New Blog Post",
            url: "/admin/blog/new",
            icon: CirclePlus,
          },
          {
            title: "Current Posts",
            url: "/admin/blog",
            icon: BookOpen,
          },
          {
            title: "Blog Comment Review",
            url: "/admin/blog/comment-review",
            icon: MessagesSquare,
          },
        ],
      },
      // education
      {
        id: "education",
        title: "Education",
        icon: GraduationCap,
        iconColor: "text-violet-600 dark:text-violet-400",
        iconBgColor:
          "bg-violet-100 dark:bg-violet-900 hover:bg-violet-200 dark:hover:bg-violet-800 group-hover/section:bg-violet-200 dark:group-hover/section:bg-violet-800",
        items: [
          {
            title: "Formal Education",
            url: "/admin/education/school",
            icon: BookMarked,
          },
          {
            title: "Courses",
            url: "/admin/education/certificates",
            icon: BookOpenCheck,
          },
        ],
      },
      // Technologies
      {
        id: "technologies",
        title: " Technologies",
        icon: AppWindow,
        iconColor: "text-sky-600 dark:text-sky-400",
        iconBgColor:
          "bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800 group-hover/section:bg-sky-200 dark:group-hover/section:bg-sky-800",
        link: "/admin/technologies",
      },
      // Custom Forms
      {
        id: "forms",
        title: "Forms",
        icon: FileText,
        iconColor: "text-teal-600 dark:text-teal-400",
        iconBgColor:
          "bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800 group-hover/section:bg-teal-200 dark:group-hover/section:bg-teal-800",
        link: "/admin/forms",
      },
      // Themes
      {
        id: "themes",
        title: "Themes",
        icon: Palette,
        iconColor: "text-orange-600 dark:text-orange-400",
        iconBgColor:
          "bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800 group-hover/section:bg-orange-200 dark:group-hover/section:bg-orange-800",
        link: "/admin/pages/themes",
      },
      // Projects
      {
        id: "projects",
        title: "Projects",
        icon: Target,
        iconColor: "text-rose-600 dark:text-rose-400",
        iconBgColor:
          "bg-rose-100 dark:bg-rose-900 hover:bg-rose-200 dark:hover:bg-rose-800 group-hover/section:bg-rose-200 dark:group-hover/section:bg-rose-800",
        items: [
          {
            title: "All Projects",
            url: "/admin/projects",
            icon: GanttChartSquare,
          },
          {
            title: "New Project",
            url: "/admin/projects/new",
            icon: CirclePlus,
          },
          {
            title: "Project Kanban",
            url: "/admin/projects/project-kanban",
            icon: SquareKanban,
          },
        ],
      },
      // contacts / CRM
      {
        id: "contacts",
        title: "Contacts",
        icon: Users2,
        iconColor: "text-teal-600 dark:text-teal-400",
        iconBgColor:
          "bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800 group-hover/section:bg-teal-200 dark:group-hover/section:bg-teal-800",
        items: [
          {
            title: "Prospects",
            url: "/admin/contacts/prospects",
            icon: UserPlus,
          },
          {
            title: "Vendors",
            url: "/admin/contacts/vendors",
            icon: Handshake,
          },
          {
            title: "Recruits",
            url: "/admin/contacts/recruits",
            icon: Medal,
          },
          {
            title: "Clients",
            url: "/admin/contacts/clients",
            icon: BadgeCheck,
          },
        ],
      },
      // subscriptions
      {
        id: "subscriptions",
        title: "Subscriptions",
        icon: ShieldCheck,
        iconColor: "text-orange-600 dark:text-orange-400",
        iconBgColor:
          "bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800 group-hover/section:bg-orange-200 dark:group-hover/section:bg-orange-800",
        items: [
          {
            title: "New Subscription",
            url: "/admin/subscriptions/new",
            icon: CirclePlus,
          },
          {
            title: "View All Subscriptions",
            url: "/admin/subscriptions/all",
            icon: ScrollText,
          },
        ],
      },
      // reviews
      {
        id: "reviews",
        title: "Reviews",
        icon: Sparkle,
        iconColor: "text-yellow-600 dark:text-yellow-400",
        iconBgColor:
          "bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 group-hover/section:bg-yellow-200 dark:group-hover/section:bg-yellow-800",
        items: [
          {
            title: "Pending Reviews",
            url: "/admin/reviews/pending",
            icon: ClipboardList,
          },
          {
            title: "View All Reviews",
            url: "/admin/reviews",
            icon: ScrollText,
          },
        ],
      },
    ],
  },
  {
    id: "business",
    title: "Business",
    sections: [
      //info
      {
        id: "Info",
        title: "Info & Links",
        icon: Info,
        iconColor: "text-lime-600 dark:text-lime-400",
        iconBgColor:
          "bg-lime-100 dark:bg-lime-900 hover:bg-lime-200 dark:hover:bg-lime-800 group-hover/section:bg-lime-200 dark:group-hover/section:bg-lime-800",
        items: [
          {
            title: "Contact Links",
            url: "/admin/info/links",
            icon: LinkIcon,
          },
          {
            title: "Helpful Links",
            url: "/admin/info/helpful-links",
            icon: BookMarked,
          },
        ],
      },
      //store
      {
        id: "store",
        title: "Store",
        icon: ShoppingBag,
        iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
        iconBgColor:
          "bg-fuchsia-100 dark:bg-fuchsia-900 hover:bg-fuchsia-200 dark:hover:bg-fuchsia-800 group-hover/section:bg-fuchsia-200 dark:group-hover/section:bg-fuchsia-800",
        items: [
          {
            title: "New Product",
            url: "/admin/store/products/new",
            icon: CirclePlus,
          },
          {
            title: "All Products",
            url: "/admin/store/products",
            icon: Boxes,
          },
          {
            title: "Inventory",
            url: "/admin/store/inventory",
            icon: PackageSearch,
          },
          {
            title: "Vendors",
            url: "/admin/store/vendors",
            icon: Handshake,
          },
          {
            title: "Promotions",
            url: "/admin/store/promotions",
            icon: TicketPercent,
          },
        ],
      },
      // orders
      {
        id: "orders",
        title: "Orders",
        icon: ShoppingCart,
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBgColor:
          "bg-emerald-100 dark:bg-emerald-900 hover:bg-emerald-200 dark:hover:bg-emerald-800 group-hover/section:bg-emerald-200 dark:group-hover/section:bg-emerald-800",
        items: [
          {
            title: "New Orders",
            url: "/admin/orders/new",
            icon: Sparkle,
          },
          {
            title: "Orders",
            url: "/admin/orders",
            icon: ScrollText,
          },

          {
            title: "Shipments",
            url: "/admin/orders/shipments",
            icon: ClipboardList,
          },
          {
            title: "Delivered Orders",
            url: "/admin/orders/delivered",
            icon: CheckCheck,
          },
          {
            title: "Cancelled Orders",
            url: "/admin/orders/cancelled",
            icon: FileText,
          },
          {
            title: "Refunded Orders",
            url: "/admin/orders/refunded",
            icon: TicketX,
          },
          {
            title: "Order Inquiries",
            url: "/admin/user-messages/orders",
            icon: MessageCircle,
          },
        ],
      },
      // training
      {
        id: "training",
        title: "Training",
        icon: BookOpenCheck,
        iconColor: "text-blue-600 dark:text-blue-400",
        iconBgColor:
          "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 group-hover/section:bg-blue-200 dark:group-hover/section:bg-blue-800",
        items: [
          {
            title: "View All Training",
            url: "/admin/training",
            icon: BookOpen,
          },
          {
            title: "Create New Training",
            url: "/admin/training/new",
            icon: CirclePlus,
          },
        ],
      },
      // employees
      {
        id: "staff",
        title: "Staff",
        icon: Users2,
        iconColor: "text-purple-600 dark:text-purple-400",
        iconBgColor:
          "bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 group-hover/section:bg-purple-200 dark:group-hover/section:bg-purple-800",
        items: [
          {
            title: "All Staff",
            url: "/admin/staff",
            icon: UsersRound,
          },
          {
            title: "New Staff Member",
            url: "/admin/staff/new",
            icon: UserPlus,
          },
          {
            title: "Jobs",
            url: "/admin/staff/jobs",
            icon: BriefcaseBusiness,
          },
        ],
      },
      // invoices
      {
        id: "invoices",
        title: "Invoices",
        icon: FileSpreadsheet,
        iconColor: "text-cyan-600 dark:text-cyan-400",
        iconBgColor:
          "bg-cyan-100 dark:bg-cyan-900 hover:bg-cyan-200 dark:hover:bg-cyan-800 group-hover/section:bg-cyan-200 dark:group-hover/section:bg-cyan-800",
        items: [
          {
            title: "All Invoices",
            url: "/admin/invoices",
            icon: ScrollText,
          },
          {
            title: "Invoice Creator",
            url: "/admin/invoices/new",
            icon: CirclePlus,
          },
          {
            title: "Invoice Templates",
            url: "/admin/invoices/templates",
            icon: LayoutPanelTop,
          },
        ],
      },
      // Campaigns
      {
        id: "campaigns",
        title: "Campaigns",
        icon: Target,
        iconColor: "text-red-600 dark:text-red-400",
        iconBgColor:
          "bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 group-hover/section:bg-red-200 dark:group-hover/section:bg-red-800",
        items: [
          {
            title: "Marketing",
            url: "/admin/campaigns/Marketing",
            icon: Megaphone,
          },
          {
            title: "Recruiting",
            url: "/admin/campaigns/recruiting",
            icon: Medal,
          },
        ],
      },
    ],
  },
];
