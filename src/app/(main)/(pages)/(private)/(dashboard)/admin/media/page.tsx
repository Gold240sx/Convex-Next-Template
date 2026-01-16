import React, { FC } from "react";
import { type Metadata } from "next";
import { UserManagement } from "@/components/admin/UserManagement";
import { DashboardNavbar } from "@/components/layout/navbar/DashboardNavbar";
import { currentUser } from '@clerk/nextjs/server'

export const metadata: Metadata = {
  title: "Admin Dashboard | User Management",
  description: "Clerk User Management Dashboard",
};

const AdminDashboard = async () => {
  const user = await currentUser()
  
  // Serialize the user object for Client Components
  const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null
  
  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="mb-8 text-4xl font-bold">Admin Dashboard</h1>
      </div>
      <h2>Welcome to your admin dashboard!</h2>
    </>
  );
}

export default AdminDashboard
