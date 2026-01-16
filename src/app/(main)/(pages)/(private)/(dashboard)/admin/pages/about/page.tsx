import React from "react";
import { type Metadata } from "next";
import { AboutPageEditor } from "@/components/admin/AboutPageEditor";

export const metadata: Metadata = {
  title: "Admin Dashboard | About Page Editor",
  description: "Manage your portfolio about section with rich text.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-7xl">
        <AboutPageEditor />
    </div>
  );
}
