import React, { FC } from "react";
import { type Metadata } from "next";
import { UserManagement } from "@/components/admin/UserManagement";
import { DashboardNavbar } from "@/components/layout/navbar/DashboardNavbar";
import { currentUser } from '@clerk/nextjs/server'

export const metadata: Metadata = {
  title: "Admin Dashboard | Group Followers",
  description: "Clerk Group Followers Dashboard",
};

const GroupFollowers = () => {
  return (
    <UserManagement />
  );
}

export default GroupFollowers
