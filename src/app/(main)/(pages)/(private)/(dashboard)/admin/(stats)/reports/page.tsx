import React, { FC } from "react";
import { type Metadata } from "next";
import { UserManagement } from "@/components/admin/UserManagement";
import { DashboardNavbar } from "@/components/layout/navbar/DashboardNavbar";
import { currentUser } from '@clerk/nextjs/server'

export const metadata: Metadata = {
  title: "Admin Dashboard | Reports",
  description: "Clerk Reports Dashboard",
};

const ReportsDashboard = () => {
  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="mb-8 text-4xl font-bold">Reports</h1>
      </div>
      <h2>Welcome to your reports dashboard!</h2>
    </>
  );
}

export default ReportsDashboard
