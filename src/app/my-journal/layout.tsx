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

        <main
          className="flex-1 overflow-auto relative 
            bg-[#f9f6f0] 
            bg-[url('/cream-paper.png')] bg-opacity-5
            bg-[length:300px_300px]
        "
        >
          <svg
            className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L100,0 L100,100 Q80,60 0,100 Z" fill="#d4a373" />
          </svg>
          <svg
            className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none rotate-180"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L100,0 L100,100 Q80,60 0,100 Z" fill="#d4a373" />
          </svg>
          <div className="p-6 min-h-full">{children}</div>
          {/* <div className="absolute bottom-8 right-8 text-6xl text-amber-200/50 pointer-events-none">
            ✍️
          </div> */}
        </main>
      </SidebarInset>
      {/* </div> */}
    </SidebarProvider>
  );
}
