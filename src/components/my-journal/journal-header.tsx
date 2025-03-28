"use client";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, Calendar as CalendarIcon, LogOut, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
export function JournalHeader() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [month, setMonth] = useState(
    parseInt(searchParams.get("month") || new Date().getMonth().toString())
  );

  const [year, setYear] = useState(
    parseInt(searchParams.get("year") || new Date().getFullYear().toString())
  );
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    try {
      // Call our custom logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Client-side sign out
        await signOut({ redirect: false });
        router.push("/auth/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
    setPending(false);
  };

  const handleMonthYearChange = (
    newMonth: string | number,
    newYear: string | number
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", newMonth.toString());
    params.set("year", newYear.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <header
      className="sticky top-0 z-10 flex 
    h-12 items-center gap-4 px-4 sm:px-6  bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 justify-between"
    >
      <SidebarTrigger className="[existing classes] bg-orange-100 hover:bg-orange-200 -ml-2" />
      {/* Month/Year Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-amber-100 text-amber-900 font-medium pl-3"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-amber-600" />
            {format(new Date(year, month - 1, 1), "MMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white space-y-2">
          {/* Month Selector */}
          <div className="px-3 py-3 flex gap-2">
            <Select
              value={month.toString()}
              onValueChange={(newMonth) => {
                setMonth(parseInt(newMonth));
                handleMonthYearChange(newMonth, year);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {format(new Date(2023, i, 1), "MMMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Selector */}
            <Select
              value={year.toString()}
              onValueChange={(newYear) => {
                setYear(parseInt(newYear));
                handleMonthYearChange(month, newYear);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }).map((_, i) => {
                  const yearOption = new Date().getFullYear() - 5 + i;
                  return (
                    <SelectItem key={yearOption} value={yearOption.toString()}>
                      {yearOption}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center  gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-red-300 text-red-600 font-medium pl-3"
                onClick={handleLogout}
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  </>
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link
          href="/my-journal/entries/new"
          className="
          flex items-center gap-2
          px-4 py-2 rounded-lg
          bg-amber-600 hover:bg-amber-700
          text-white
          shadow-sm hover:shadow-md
          transition-all
        "
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium">New Entry</span>
        </Link>
      </div>
    </header>
  );
}
