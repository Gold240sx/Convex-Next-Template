import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface Section {
  id: string;
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  items?: MenuItem[];
  disabled?: boolean;
  link?: string;
}

export interface SectionGroup {
  id: string;
  title: string;
  sections: Section[];
  link?: string;
}
