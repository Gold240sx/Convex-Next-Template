import { Suspense } from "react";
import { AppSidebar } from "@/components/layout/dashboard/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/shadcn/sidebar";
import "@/styles/globals.css";

// Loading component for the sidebar
function SidebarSkeleton() {
  return (
    <div className="h-screen w-64 animate-pulse bg-gray-800">
      {/* Logo skeleton */}
      <div className="p-4">
        <div className="h-6 w-24 rounded bg-gray-700"></div>
      </div>

      {/* Navigation items skeleton */}
      <div className="px-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-gray-700"></div>
          ))}
        </div>
      </div>

      {/* User profile skeleton */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="flex items-center space-x-3 rounded-lg bg-gray-700/50 p-3">
          <div className="h-10 w-10 rounded-full bg-gray-700"></div>
          <div className="flex-1">
            <div className="h-3 w-20 rounded bg-gray-700"></div>
            <div className="mt-2 h-2 w-24 rounded bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative flex max-h-screen min-h-screen w-full flex-col">
        <div
          id="layout-container"
          className="flex h-screen overflow-hidden"
        >
          <Suspense fallback={<SidebarSkeleton />}>
            <AppSidebar />
          </Suspense>
          {/* make pl-0 only if the sidebar is not collapsed */}
          <div className={`flex-1 w-auto px-4 md:pl-0`}>
            <main className="relative z-10 h-auto w-full overflow-auto rounded-4xl h-full mb-8 bg-zinc-50 px-3 mt-4 pb-6 shadow-2xl shadow-gray-400 dark:bg-gray-800 dark:shadow-black/80 md:ml-0">
              <Suspense>{children}</Suspense>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
