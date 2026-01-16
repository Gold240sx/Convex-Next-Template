import React, { FC } from "react";
import { type Metadata } from "next";
import { UserManagement } from "@/components/admin/UserManagement";
import { DashboardNavbar } from "@/components/layout/navbar/DashboardNavbar";
import { currentUser } from '@clerk/nextjs/server'

export const metadata: Metadata = {
  title: "General Settings",
  description: "General Settings Dashboard",
};

import { ChatbotSettings } from "@/components/admin/ChatbotSettings";

const GeneralSettings = async () => {
  const user = await currentUser()
  
  // Serialize the user object for Client Components
  const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null
  
  return (
    <div className="max-w-7xl mx-auto space-y-20 p-6 md:p-10 pb-32">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b border-border pb-10">
        <h1 className="text-5xl font-black text-foreground tracking-tight italic uppercase">
          General Settings
        </h1>
        <p className="text-muted-foreground font-medium text-lg max-w-2xl">
          Core configuration for your platform, including user permissions and AI chatbot behavior.
        </p>
      </div>

      {/* Chatbot Settings Section */}
      <section className="space-y-8">
        <ChatbotSettings />
      </section>

      {/* User Management Section */}
      <section className="space-y-10 pt-10 border-t border-border">
        <div className="space-y-2">
            <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Access Control</h2>
            <p className="text-muted-foreground font-medium">Manage user accounts and platform permissions.</p>
        </div>
        <UserManagement />
      </section>
    </div>
  );
}

export default GeneralSettings
