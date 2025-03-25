import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { JournalSidebar } from "@/components/my-journal/journal-sidebar";
import { JournalHeader } from "@/components/my-journal/journal-header";

export default function MyJournalLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <JournalSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <JournalHeader />
          <main>
            <SidebarTrigger className="[existing classes] bg-orange-100 hover:bg-orange-200" />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
