import React, { FC } from "react";
import { type Metadata } from "next";
import { UserManagement } from "@/components/admin/UserManagement";
import { DashboardNavbar } from "@/components/layout/navbar/DashboardNavbar";
import { currentUser } from '@clerk/nextjs/server'

export const metadata: Metadata = {
  title: "Admin Dashboard | User Management",
  description: "Clerk User Management Dashboard",
};

const AdminDashboard = () => {
  return (
    <UserManagement />
  );
}

export default AdminDashboard
