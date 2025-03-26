"use client";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
export function JournalHeader() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  return (
    <header className="sticky top-0 z-10 flex h-12 items-center gap-4 px-4 sm:px-6  bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 justify-between">
      <SidebarTrigger className="[existing classes] bg-orange-100 hover:bg-orange-200 -ml-2" />
      {/* Month/Year Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-amber-100 text-amber-900 font-medium pl-3"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-amber-600" />
            {format(new Date(year, month, 1), "MMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white space-y-2">
          {/* Month Selector */}
          <div className="px-3 pt-3 flex gap-2">
            <Select
              value={month.toString()}
              onValueChange={(value) => setMonth(parseInt(value))}
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
              onValueChange={(value) => setYear(parseInt(value))}
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

          {/* Calendar - Now shows days but highlights entire month */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={new Date(year, month, 1)}
            components={{
              Day: () => null, // Hide day selection
            }}
            defaultMonth={new Date(year, month, 1)}
            className="border-t pt-0"
          />
        </PopoverContent>
      </Popover>

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
    </header>
  );
}
