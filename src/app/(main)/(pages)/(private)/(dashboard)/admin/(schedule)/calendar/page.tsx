import React, { FC } from "react";
import { type Metadata } from "next";
import { UserManagement } from "@/components/admin/UserManagement";
import { DashboardNavbar } from "@/components/layout/navbar/DashboardNavbar";
import { currentUser } from '@clerk/nextjs/server'

export const metadata: Metadata = {
  title: "Admin Dashboard | Task Management",
  description: "Clerk Task Management Dashboard",
};

const TaskDashboard = async () => {
  const user = await currentUser()
  
  // Serialize the user object for Client Components
  const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null
  
  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="mb-8 text-4xl font-bold">Task Management</h1>
      </div>
      <h2>Welcome to your task management dashboard!</h2>
    </>
  );
}

export default TaskDashboard
