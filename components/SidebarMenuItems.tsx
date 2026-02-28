"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCogIcon,
  SchoolIcon,
  ClipboardCheckIcon,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Batches",
    url: "/dashboard/batches",
    icon: SchoolIcon,
  },
  {
    title: "Students",
    url: "/dashboard/students",
    icon: UserCogIcon,
  },
  {
    title: "Attendance",
    url: "/dashboard/attendance",
    icon: ClipboardCheckIcon,
  }
];

export function SidebarMenuItems() {
  const { setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton 
            asChild 
            className="flex items-center"
            isActive={pathname === item.url}
          >
            <Link href={item.url} onClick={handleLinkClick}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}