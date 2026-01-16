import React, { FC } from "react";
import { type Metadata } from "next";
import { UserManagement } from "@/components/admin/UserManagement";
import { DashboardNavbar } from "@/components/layout/navbar/DashboardNavbar";
import { currentUser } from '@clerk/nextjs/server'

export const metadata: Metadata = {
  title: "Shipping Settings",
  description: "Shipping Settings Dashboard",
};

const ShippingSettings = () => {
  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="mb-8 text-4xl font-bold">Shipping Settings</h1>
      </div>
      <h2>Shipping Settings</h2>
    </>
  );
}

export default ShippingSettings
