"use client";

import Link from "next/link";
import { Calendar, Inbox, Settings, Plus } from "lucide-react";
// import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "My Entries",
    url: "/my-journal/entries",
    icon: Inbox,
  },
  {
    title: "Insights",
    url: "/my-journal/insights",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/my-journal/settings",
    icon: Settings,
  },
];

export function JournalSidebar() {
  // const pathname = usePathname();
  return (
    <Sidebar className="h-full bg-[#f5f0e6] border-r border-[#e0d5c0] shadow-lg">
      <SidebarContent className="bg-[url('/texture.png')] bg-opacity-10">
        <SidebarGroup>
          <SidebarGroupLabel>My Journal</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <Link
              href="/my-journal/entries/new"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Entry</span>
            </Link>
          </SidebarGroupAction>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
