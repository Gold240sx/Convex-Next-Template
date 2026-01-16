import React, { FC } from "react";
import { type Metadata } from "next";
import { UserManagement } from "@/components/admin/UserManagement";
import { DashboardNavbar } from "@/components/layout/navbar/DashboardNavbar";
import { currentUser } from '@clerk/nextjs/server'

export const metadata: Metadata = {
  title: "Admin Dashboard | Analytics",
  description: "Clerk Analytics Dashboard",
};

const AnalyticsDashboard = () => {
  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="mb-8 text-4xl font-bold">Analytics</h1>
      </div>
      <h2>Welcome to your analytics dashboard!</h2>
    </>
  );
}

export default AnalyticsDashboard
