// components/journal/FunEntryCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Edit2, Trash2, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarBadge } from "./calendar-badge";

// Emoji mapping for emotions
const EMOTION_EMOJIS: Record<string, string> = {
  happy: "😊",
  excited: "🤩",
  sad: "😢",
  angry: "😠",
  neutral: "😐",
  grateful: "🙏",
  tired: "😴",
};

interface FunEntryCardProps {
  id: string;
  title: string;
  contentSummary: string;
  date: Date;
  emotion: string;
  readingTime: number; // in minutes
}

export function JournalEntryCard({
  id,
  title,
  contentSummary,
  date,
  emotion,
  readingTime,
}: FunEntryCardProps) {
  // Generate content summary (first 50 chars)
  // const contentSummary = content.length > 50 ? `${content.substring(0, 50)}...` : content

  return (
    <Card
      className="border-2 border-yellow-100 bg-yellow-50 hover:shadow-md transition-all"
      key={id}
    >
      <div className="flex">
        {/* Calendar date on left */}
        <div className="flex-shrink-0 pl-4 pt-4">
          <CalendarBadge date={date} />
        </div>

        {/* Content on right */}
        <div className="flex-1 p-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-bold text-amber-900 tracking-tight">
                {title}
              </CardTitle>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-2xl cursor-default">
                    {EMOTION_EMOJIS[emotion] || EMOTION_EMOJIS.neutral}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">{emotion}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <p className="text-base text-amber-800">{contentSummary}</p>
          </CardContent>

          <CardFooter className="flex justify-between items-center pt-0 pb-0">
            <div className="text-xs text-amber-600 flex items-center">
              <Clock className="text-green" />
              <span>{readingTime} min read</span>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 text-amber-600"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 text-amber-600"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
