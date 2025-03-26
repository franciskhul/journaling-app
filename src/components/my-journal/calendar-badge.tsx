import { format } from "date-fns";

interface CalendarDateProps {
  date: Date;
  className?: string;
}

export function CalendarBadge({ date, className = "" }: CalendarDateProps) {
  return (
    <div
      className={`relative w-16 h-16 flex flex-col items-center justify-center 
      border-2 border-amber-300 bg-white rounded-lg shadow-sm ${className}`}
    >
      {/* Month - Top ribbon */}
      <div className="absolute -top-3 w-full text-center">
        <div
          className="mx-auto px-2 py-0.5 bg-amber-500 text-white text-xs 
          font-bold rounded-md shadow-sm"
        >
          {format(date, "MMM").toUpperCase()}
        </div>
      </div>

      {/* Day number - Center */}
      <div className="text-2xl font-bold text-amber-900">
        {format(date, "d")}
      </div>

      {/* Day name - Bottom */}
      <div className="absolute -bottom-3 text-xs font-medium text-amber-700">
        {format(date, "EEE")}
      </div>
    </div>
  );
}
