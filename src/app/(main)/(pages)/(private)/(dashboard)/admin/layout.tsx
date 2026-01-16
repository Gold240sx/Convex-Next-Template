import { DashboardNavbar } from "@/components/layout/navbar/DashboardNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-2 flex-1">
      <DashboardNavbar />
      <div className="px-2">
        {children}
      </div>
    </div>
  );
}