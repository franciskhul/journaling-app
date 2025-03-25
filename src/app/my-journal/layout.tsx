import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { JournalSidebar } from "@/components/my-journal/journal-sidebar";

export default function MyJournalLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <JournalSidebar />
      <main>
        <SidebarTrigger className="[existing classes] bg-orange-100 hover:bg-orange-200" />
        {children}
      </main>
    </SidebarProvider>
  );
}
