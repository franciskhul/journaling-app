"use client";

import Link from "next/link";
import { Lightbulb, Newspaper, Settings, Plus, BookHeart } from "lucide-react";
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
    icon: Newspaper,
  },
  {
    title: "Insights",
    url: "/my-journal/insights",
    icon: Lightbulb,
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
      <div
        className="sidebar-texture absolute inset-0 bg-[url('/paper-texture-fun-prof.webp')] 
              bg-repeat opacity-15 pointer-events-none"
        style={{ width: "inherit", backgroundSize: "cover" }}
      />
      <div className="absolute left-1/2 top-0 h-full w-px bg-amber-800/50 transform -translate-x-1/2" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className="
    text-lg font-medium 
    text-amber-800 
    flex items-center justify-between
    pb-2 mb-2
    border-b border-amber-200
    relative
  "
          >
            <span className="flex items-center">
              <BookHeart />
              <span className="text-lg font-bold text-amber-900">
                My Journal
              </span>
            </span>

            <SidebarGroupAction>
              <Link
                href="/my-journal/entries/new"
                className="
          flex items-center gap-1 p-1.5 rounded-full
          bg-amber-100 hover:bg-amber-200
          text-amber-800 hover:text-amber-900
          transition-colors
          shadow-xs
        "
                title="Add New Entry"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add Entry</span>
              </Link>
            </SidebarGroupAction>
          </SidebarGroupLabel>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all
                    text-amber-900 hover:text-amber-700 
                    hover:bg-amber-50/70
                    group relative overflow-hidden"
                      >
                        <span className="p-1.5 rounded-lg bg-amber-100/30 group-hover:bg-amber-100/70 transition-colors duration-200">
                          <item.icon className="h-5 w-5 text-amber-700" />
                        </span>

                        <span className="relative">
                          {item.title}
                          <span
                            className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 
                          group-hover:w-full transition-all duration-300"
                          />
                        </span>

                        <span
                          className="
            absolute right-4 opacity-0 -translate-x-2
            group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-200
          "
                        >
                          →
                        </span>
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
