import React, { FC } from "react";
import { type Metadata } from "next";
import { UserManagement } from "@/components/admin/UserManagement";

export const metadata: Metadata = {
  title: "Admin Dashboard | User Management",
  description: "Clerk User Management Dashboard",
};

const AdminDashboard: FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-8">
       <UserManagement />
    </div>
  );
}

export default AdminDashboard
