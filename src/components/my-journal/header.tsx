import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px]">
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold">Today&apos;s Journal</h1>
      </div>
      <Link href="/dashboard/entries/new">
        <Button size="sm" className="h-8 gap-1">
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            New Entry
          </span>
        </Button>
      </Link>
      {/* <UserNav /> */}
    </header>
  );
}
