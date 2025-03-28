// components/journal/FunEntryCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Edit, Trash2, Clock, Tag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarBadge } from "./calendar-badge";
import { JournalEntry } from "@/types/journalEntry";
// import { JournalEntry } from "@/app/my-journal/entries/[id]/page";

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

interface JournalEntryCardProps {
  journalEntry: JournalEntry;
}

export function JournalEntryCard({ journalEntry }: JournalEntryCardProps) {
  const { id, title, contentSummary, category, createdAt, readingTime, mood } =
    journalEntry;
  // Generate content summary (first 50 chars)
  // const contentSummary = content.length > 50 ? `${content.substring(0, 50)}...` : content

  return (
    <Card
      className="border-2 border-yellow-100 bg-yellow-50 hover:shadow-md transition-all w-full"
      key={id}
    >
      <div className="flex">
        {/* Calendar date on left */}
        <div className="flex-shrink-0 pl-4 pt-4">
          <CalendarBadge date={createdAt} />
        </div>

        {/* Content on right */}
        <div className="flex-1 p-4">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3 mb-2 justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="font-fugaz text-3xl text-neutral-900">
                  {title}
                </CardTitle>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-2xl cursor-default">
                      {EMOTION_EMOJIS.excited}
                      {/* {EMOTION_EMOJIS[mood] || EMOTION_EMOJIS.neutral} */}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{mood}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div>
                <Link href={`/my-journal/entries/${id}`}>
                  <Button variant="ghost" className="font-alumni gap-2">
                    <ArrowRight className="h-4 w-4" />
                    View Journal Entry
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <article className="prose prose-lg max-w-none font-alumni">
              {contentSummary.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-4 text-neutral-800 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </article>
          </CardContent>

          <CardFooter className="flex justify-between items-center pt-0 pb-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span className="capitalize">{category}</span>
              </div>
            </div>

            <div className="flex gap-1">
              <Link href={`/my-journal/entries/${id}/edit`}>
                <Button variant="outline" className="font-alumni gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button variant="destructive" className="font-alumni gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
