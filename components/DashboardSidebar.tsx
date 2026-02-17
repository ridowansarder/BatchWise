import { LogOutIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { OrganizationSwitcher, SignOutButton, UserButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarMenuItems } from "./SidebarMenuItems";
import { currentUser } from "@clerk/nextjs/server";

export async function DashboardSidebar() {
  const user = await currentUser();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <OrganizationSwitcher />
            <UserButton />
          </SidebarGroupLabel>
          <Separator className="my-3" />
          <SidebarGroupContent>
            <SidebarMenuItems />
            <SidebarMenu>
              <Separator className="my-3" />
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.imageUrl || undefined}
                    alt={user?.fullName || ""}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.fullName}</span>
                  <span className="truncate text-xs">
                    {user?.emailAddresses[0].emailAddress}
                  </span>
                </div>
              </div>
              <SidebarMenuButton asChild className="mt-3 cursor-pointer">
                <SignOutButton>
                  <div>
                    <LogOutIcon />
                    Sign out
                  </div>
                </SignOutButton>
              </SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
