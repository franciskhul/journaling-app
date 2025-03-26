import { ReactNode } from "react";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { JournalSidebar } from "@/components/my-journal/journal-sidebar";
import { JournalHeader } from "@/components/my-journal/journal-header";
// import styles from "./my-journal-layout.module.css";

export default async function MyJournalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <JournalSidebar />

      {/* Right-hand content area */}
      <SidebarInset>
        <JournalHeader />

        {/* Main content area with scroll */}
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
      {/* </div> */}
    </SidebarProvider>
  );
}
